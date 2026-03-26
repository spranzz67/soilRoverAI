/*
 * AgroAI Insights — ESP32 + Blynk Cloud Sketch
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Sends sensor data to Blynk Cloud so the AgroAI
 * web UI can pull it via the Blynk HTTP API.
 *
 * Hardware:
 *   - DS18B20 temperature sensor (OneWire)
 *   - Capacitive Soil Moisture Sensor V2.0 (analog)
 *   - ESP32 DevKit
 *
 * Wiring:
 *   DS18B20 DATA → GPIO 4 (with 4.7kΩ pull-up to 3.3V)
 *   Soil Sensor AOUT → GPIO 34 (ADC1_CH6)
 *
 * Blynk Virtual Pins:
 *   V0 → Temperature (°C)
 *   V1 → Soil Moisture (%)   ← add when ready
 *
 * Libraries required (install via Arduino Library Manager):
 *   - OneWire by Jim Studt
 *   - DallasTemperature by Miles Burton
 *   - Blynk by Volodymyr Shymanskyy
 */

#define BLYNK_TEMPLATE_ID   "TMPL3Sc_0pdJD"
#define BLYNK_TEMPLATE_NAME "TempSensor"
#define BLYNK_AUTH_TOKEN     "Rs0C0z7jsZqAI1kLCvHFG4-UIftQssDx"

// Uncomment the line below for verbose Blynk debug output
// #define BLYNK_PRINT Serial

#include <Arduino.h>
#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ── WiFi credentials ────────────────────────────────────────────
const char* ssid  = "YOUR_WIFI_SSID";     // ← Replace
const char* pass  = "YOUR_WIFI_PASSWORD";  // ← Replace

// ── Pin definitions ─────────────────────────────────────────────
#define ONE_WIRE_BUS  4
#define SOIL_SENSOR_PIN 34

// ── Calibration for Capacitive Soil Moisture V2.0 ───────────────
#define DRY_VALUE  3500
#define WET_VALUE  1500

// ── Timing ──────────────────────────────────────────────────────
#define SEND_INTERVAL 2000  // ms between Blynk updates

// ── Sensor objects ──────────────────────────────────────────────
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

BlynkTimer timer;

// ── Send sensor readings to Blynk ───────────────────────────────
void sendSensorData() {
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

  // Send to Blynk virtual pins
  Blynk.virtualWrite(V0, temperatureC);
  // Blynk.virtualWrite(V1, moisturePercent);  // ← Uncomment when you add V1

  // Also print to Serial for debugging
  Serial.print("TEMP:");
  Serial.print(temperatureC, 2);
  Serial.print(",MOISTURE:");
  Serial.println(moisturePercent, 2);
}

void setup() {
  Serial.begin(115200);

  // Configure ADC
  analogReadResolution(12);
  analogSetAttenuation(ADC_ATTEN_DB_11);

  tempSensor.begin();

  // Connect to Blynk Cloud
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);

  // Set up timer to send data every SEND_INTERVAL ms
  timer.setInterval(SEND_INTERVAL, sendSensorData);

  Serial.println("AgroAI Blynk Node Ready");
}

void loop() {
  Blynk.run();
  timer.run();
}
