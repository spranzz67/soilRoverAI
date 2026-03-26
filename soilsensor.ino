/*
 * AgroAI Insights — ESP32 Sensor Sketch
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Hardware:
 *   - DS18B20 temperature sensor (OneWire)
 *   - Capacitive Soil Moisture Sensor V2.0 (analog)
 *   - ESP32 DevKit
 *
 * Wiring:
 *   DS18B20 DATA → GPIO 4 (with 4.7kΩ pull-up to 3.3V)
 *   Soil Sensor AOUT → GPIO 34 (ADC1_CH6)
 *
 * Libraries required (install via Arduino Library Manager):
 *   - OneWire by Jim Studt
 *   - DallasTemperature by Miles Burton
 *
 * Serial output format (one line per reading):
 *   TEMP:25.30,MOISTURE:47.50
 */
#include <Arduino.h>
#include <DallasTemperature.h>
#include <OneWire.h>

// ── Pin definitions ─────────────────────────────────────────────
#define ONE_WIRE_BUS 4     // DS18B20 data pin
#define SOIL_SENSOR_PIN 34 // Capacitive soil moisture analog pin

// ── Calibration for Capacitive Soil Moisture V2.0 ───────────────
// Measure these for YOUR sensor:
//   DRY_VALUE  = ADC reading when sensor is completely dry (in air)
//   WET_VALUE  = ADC reading when sensor is fully submerged in water
// Typical ranges for ESP32 12-bit ADC (0–4095):
#define DRY_VALUE 3500
#define WET_VALUE 1500

// ── Reading interval (ms) ──────────────────────────────────────
#define READ_INTERVAL 2000

// ── Sensor objects ─────────────────────────────────────────────
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

unsigned long lastRead = 0;

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    ;
  } // Wait for serial on ESP32

  tempSensor.begin();

  // Configure ADC
  analogReadResolution(12);       // 12-bit (0–4095)
  analogSetAttenuation(ADC_ATTEN_DB_11); // Full 0–3.3V range

  Serial.println("AgroAI Sensor Node Ready");
  Serial.println("Format: TEMP:<celsius>,MOISTURE:<percent>");
  Serial.println("────────────────────────────────────");
}

void loop() {
  unsigned long now = millis();
  if (now - lastRead < READ_INTERVAL)
    return;
  lastRead = now;

  // ── Read DS18B20 temperature ───────────────────────────────
  tempSensor.requestTemperatures();
  float temperatureC = tempSensor.getTempCByIndex(0);

  // Check for read errors
  if (temperatureC == DEVICE_DISCONNECTED_C) {
    Serial.println("ERROR:DS18B20_DISCONNECTED");
    return;
  }

  // ── Read soil moisture (analog) ────────────────────────────
  int rawMoisture = analogRead(SOIL_SENSOR_PIN);

  // Map raw ADC to percentage (inverted: lower ADC = wetter)
  float moisturePercent = (float)(rawMoisture - DRY_VALUE) / (WET_VALUE - DRY_VALUE) * 100.0;
  moisturePercent = constrain(moisturePercent, 0.0, 100.0);

  // ── Print in expected format ───────────────────────────────
  Serial.print("TEMP:");
  Serial.print(temperatureC, 2);
  Serial.print(",MOISTURE:");
  Serial.println(moisturePercent, 2);
}
