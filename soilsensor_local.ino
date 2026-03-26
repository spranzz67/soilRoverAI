/*
 * AgroAI Insights — ESP32 Local AP + WebSocket Mode
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Creates its own Wi-Fi hotspot and runs a WebSocket
 * server so the web UI can connect directly — NO
 * internet required.
 *
 * Hardware:
 *   - DS18B20 temperature sensor (OneWire)
 *   - Capacitive Soil Moisture Sensor V2.0 (analog)
 *   - ESP32 DevKit
 *
 * Wiring:
 *   DS18B20 DATA → GPIO 4  (with 4.7kΩ pull-up to 3.3V)
 *   Soil Sensor AOUT → GPIO 34  (ADC1_CH6)
 *
 * Connect your phone/laptop to the "AgroAI-Sensor" Wi-Fi,
 * then open the web UI pointed at ws://192.168.4.1:81
 *
 * Libraries required:
 *   - OneWire by Jim Studt
 *   - DallasTemperature by Miles Burton
 *   - WebSockets by Markus Sattler (install "WebSockets" from Library Manager)
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ── Access Point credentials ────────────────────────────────────
const char* AP_SSID = "AgroAI-Sensor";
const char* AP_PASS = "agro1234";   // min 8 chars; set "" for open network

// ── Optional: also try connecting to a known Wi-Fi first ────────
// Set to true to attempt Station mode before falling back to AP
#define TRY_STATION_FIRST  false
const char* STA_SSID = "YOUR_WIFI_SSID";
const char* STA_PASS = "YOUR_WIFI_PASSWORD";
#define STA_TIMEOUT_MS 8000

// ── Pin definitions ─────────────────────────────────────────────
#define ONE_WIRE_BUS    4
#define SOIL_SENSOR_PIN 34

// ── Calibration ─────────────────────────────────────────────────
#define DRY_VALUE  3500
#define WET_VALUE  1500

// ── Timing ──────────────────────────────────────────────────────
#define SEND_INTERVAL 2000  // ms between sensor broadcasts

// ── Objects ─────────────────────────────────────────────────────
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);
WebSocketsServer webSocket(81);

unsigned long lastSendTime = 0;
bool stationConnected = false;

// ── WebSocket event handler ─────────────────────────────────────
void webSocketEvent(uint8_t num, WStype_t type, uint8_t* payload, size_t length) {
    switch (type) {
        case WStype_CONNECTED:
            Serial.printf("[WS] Client #%u connected\n", num);
            // Send immediate status
            webSocket.sendTXT(num, "{\"type\":\"status\",\"connected\":true,\"source\":\"local\"}");
            break;
        case WStype_DISCONNECTED:
            Serial.printf("[WS] Client #%u disconnected\n", num);
            break;
        default:
            break;
    }
}

// ── Setup ───────────────────────────────────────────────────────
void setup() {
    Serial.begin(115200);
    delay(100);

    // Configure ADC
    analogReadResolution(12);
    analogSetAttenuation(ADC_ATTEN_DB_11);

    tempSensor.begin();

    // ── Network setup ───────────────────────────────────────────
#if TRY_STATION_FIRST
    Serial.printf("Trying to connect to %s...\n", STA_SSID);
    WiFi.mode(WIFI_STA);
    WiFi.begin(STA_SSID, STA_PASS);

    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < STA_TIMEOUT_MS) {
        delay(250);
        Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED) {
        stationConnected = true;
        Serial.printf("\nConnected to %s — IP: %s\n", STA_SSID, WiFi.localIP().toString().c_str());
    } else {
        Serial.println("\nStation connect failed, starting AP mode");
        WiFi.disconnect();
    }
#endif

    if (!stationConnected) {
        WiFi.mode(WIFI_AP);
        WiFi.softAP(AP_SSID, AP_PASS);
        Serial.printf("AP started: %s\n", AP_SSID);
        Serial.printf("AP IP: %s\n", WiFi.softAPIP().toString().c_str());
    }

    // Start WebSocket server on port 81
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);

    Serial.println("AgroAI Local Sensor Node Ready");
    Serial.printf("WebSocket: ws://%s:81\n",
        stationConnected ? WiFi.localIP().toString().c_str()
                         : WiFi.softAPIP().toString().c_str());
}

// ── Loop ────────────────────────────────────────────────────────
void loop() {
    webSocket.loop();

    if (millis() - lastSendTime >= SEND_INTERVAL) {
        lastSendTime = millis();

        // Read temperature
        tempSensor.requestTemperatures();
        float temperatureC = tempSensor.getTempCByIndex(0);

        if (temperatureC == DEVICE_DISCONNECTED_C) {
            Serial.println("ERROR: DS18B20 disconnected");
            return;
        }

        // Read soil moisture
        int rawMoisture = analogRead(SOIL_SENSOR_PIN);
        float moisturePercent = (float)(rawMoisture - DRY_VALUE) / (WET_VALUE - DRY_VALUE) * 100.0;
        moisturePercent = constrain(moisturePercent, 0.0, 100.0);

        // Build JSON
        char json[128];
        snprintf(json, sizeof(json),
            "{\"type\":\"sensor_data\",\"temperature\":%.2f,\"moisture\":%.2f,\"timestamp\":%lu}",
            temperatureC, moisturePercent, millis());

        // Broadcast to all connected WebSocket clients
        webSocket.broadcastTXT(json);

        // Serial debug
        Serial.printf("TEMP:%.2f,MOISTURE:%.2f\n", temperatureC, moisturePercent);
    }
}
