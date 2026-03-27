include <ESP32Servo.h>

// --- Pins ---
#define SERVO_PIN         12
#define SOIL_ANALOG_PIN   34
#define SOIL_DIGITAL_PIN  35

// --- Servo Positions ---
#define POS_UP            0      // Sensor out of soil (resting)
#define POS_DOWN          90     // Sensor inserted into soil (adjust this!)
#define SWEEP_DELAY       15     // ms between each degree (controls speed)

// --- Soil Calibration ---
#define DRY_VALUE         3500
#define WET_VALUE         1500

Servo myServo;

// --- Smooth sweep function ---
void sweepTo(int targetAngle) {
  int current = myServo.read();
  if (current < targetAngle) {
    for (int i = current; i <= targetAngle; i++) {
      myServo.write(i);
      delay(SWEEP_DELAY);
    }
  } else {
    for (int i = current; i >= targetAngle; i--) {
      myServo.write(i);
      delay(SWEEP_DELAY);
    }
  }
}

// --- Read soil moisture ---
void readSoil() {
  int raw = analogRead(SOIL_ANALOG_PIN);
  int moisture = map(raw, DRY_VALUE, WET_VALUE, 0, 100);
  moisture = constrain(moisture, 0, 100);
  int digital = digitalRead(SOIL_DIGITAL_PIN);

  Serial.println("====== Soil Reading ======");
  Serial.print("Moisture : ");
  Serial.print(moisture);
  Serial.println("%");
  Serial.print("Status   : ");
  if (moisture < 30)       Serial.println("DRY - Needs water!");
  else if (moisture < 70)  Serial.println("MOIST - OK");
  else                     Serial.println("WET");
  Serial.print("Digital  : ");
  Serial.println(digital == LOW ? "WET" : "DRY");
  Serial.println("==========================");
}

// --- Full probe cycle ---
void probeSoil() {
  Serial.println(">> Inserting sensor into soil...");
  sweepTo(POS_DOWN);

  Serial.println(">> Sensor in soil, reading...");
  delay(1000); // Let sensor settle before reading

  readSoil();

  Serial.println(">> Retracting sensor...");
  sweepTo(POS_UP);
  Serial.println(">> Done. Sensor retracted.");
}

void setup() {
  Serial.begin(115200);
  pinMode(SOIL_DIGITAL_PIN, INPUT);

  ESP32PWM::allocateTimer(0);
  myServo.setPeriodHertz(50);
  myServo.attach(SERVO_PIN, 500, 2100); // MG90S
  myServo.write(POS_UP); // Start retracted

  Serial.println("Ready! Commands:");
  Serial.println("  'probe'  → Insert sensor, read soil, retract");
  Serial.println("  'down'   → Insert sensor only");
  Serial.println("  'up'     → Retract sensor only");
  Serial.println("  'read'   → Read soil without moving");
  Serial.println("  0-180    → Manual angle control");
}

void loop() {
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();

    if (input == "probe") {
      probeSoil();                     // Full auto: in → read → out
    }
    else if (input == "down") {
      Serial.println(">> Inserting sensor...");
      sweepTo(POS_DOWN);
    }
    else if (input == "up") {
      Serial.println(">> Retracting sensor...");
      sweepTo(POS_UP);
    }
    else if (input == "read") {
      readSoil();                      // Read wherever sensor currently is
    }
    else {
      int angle = input.toInt();
      if (angle >= 0 && angle <= 180) {
        sweepTo(angle);
        Serial.print(">> Moved to ");
        Serial.print(angle);
        Serial.println("°");
      } else {
        Serial.println("!! Unknown command");
      }
    }
  }
}


