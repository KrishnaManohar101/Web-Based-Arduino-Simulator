import { type CircuitComponent } from './ui/types';

export const generateCode = (components: CircuitComponent[]) => {
    const leds = components.filter(c => c.type === 'led' && c.pin);
    const buttons = components.filter(c => c.type === 'pushbutton' && c.pin);
    const mpus = components.filter(c => c.type === 'mpu6050');
    const ultrasonics = components.filter(c => c.type === 'hc-sr04');
    const servos = components.filter(c => c.type === 'servo');
    const lcds = components.filter(c => c.type === 'lcd1602');

    if (leds.length === 0 && buttons.length === 0 && mpus.length === 0 && lcds.length === 0 && ultrasonics.length === 0 && servos.length === 0) {
        return `// Arduino Simulator
// =====================
// Add components to generate code
//
// Default Pin Mapping:
// - LED → Digital Pin 10
// - Push Button → Digital Pin 2
// - MPU6050 → SDA (A4), SCL (A5)
// - OLED Display → SDA (A4), SCL (A5)
// - LCD 16x2 (I2C) → SDA (A4), SCL (A5)
// - HC-SR04 → TRIG (D9), ECHO (D10)
// - Servo → PWM (D9)`;
    }

    let code = `// Auto-generated Arduino Code
// ===========================

`;

    // MPU6050 Includes
    if (mpus.length > 0) {
        code += `#include <Wire.h>\n`;
        code += `#include <MPU6050.h>\n\n`;
        code += `MPU6050 mpu;\n\n`;
    }

    // SSD1306 Includes
    const oleds = components.filter(c => c.type === 'ssd1306');
    if (oleds.length > 0) {
        if (!code.includes('#include <Wire.h>')) {
            code += `#include <Wire.h>\n`;
        }
        code += `#include <Adafruit_GFX.h>\n`;
        code += `#include <Adafruit_SSD1306.h>\n\n`;
        code += `#define SCREEN_WIDTH 128\n`;
        code += `#define SCREEN_HEIGHT 64\n`;
        code += `#define OLED_RESET    -1\n`;
        code += `Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);\n\n`;
    }

    // HC-SR04 Ultrasonic Includes
    if (ultrasonics.length > 0) {
        code += `// Ultrasonic Sensor Pins\n`;
        ultrasonics.forEach((us, i) => {
            const trigPin = us.pin || '9';
            const echoPin = String(parseInt(trigPin) + 1);
            const suffix = i > 0 ? i + 1 : '';
            code += `const int trigPin${suffix} = ${trigPin};\n`;
            code += `const int echoPin${suffix} = ${echoPin};\n`;
        });
        code += `long duration;\nint distance;\n\n`;
    }

    // Servo Includes
    if (servos.length > 0) {
        code += `#include <Servo.h>\n`;
        servos.forEach((_s, i) => {
            const suffix = i > 0 ? i + 1 : '';
            code += `Servo myServo${suffix};\n`;
        });
        code += `int servoAngle = 0;\nint servoDir = 1;\n\n`;
    }

    // LCD1602 I2C Includes
    if (lcds.length > 0) {
        if (!code.includes('#include <Wire.h>')) {
            code += `#include <Wire.h>\n`;
        }
        if (!code.includes('#include <LiquidCrystal_I2C.h>')) {
            code += `#include <LiquidCrystal_I2C.h>\n\n`;
        }
        code += `LiquidCrystal_I2C lcd(0x27, 16, 2);  // I2C address 0x27, 16 cols, 2 rows\n\n`;
    }

    // Pin definitions
    code += `// Pin Definitions\n`;
    leds.forEach((led, i) => {
        code += `const int ledPin${i > 0 ? i + 1 : ''} = ${led.pin};  // LED\n`;
    });
    buttons.forEach((btn, i) => {
        code += `const int buttonPin${i > 0 ? i + 1 : ''} = ${btn.pin};  // Push Button\n`;
    });

    // Setup function
    code += `\nvoid setup() {\n`;
    code += `  Serial.begin(9600);\n`;
    if (mpus.length > 0) {
        code += `  Wire.begin();\n`;
        code += `  mpu.initialize();\n`;
        code += `  Serial.println("MPU6050 Initialized");\n`;
    }
    if (oleds.length > 0) {
        if (mpus.length === 0 && lcds.length === 0) code += `  Wire.begin();\n`;
        code += `  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {\n`;
        code += `    Serial.println(F("SSD1306 allocation failed"));\n`;
        code += `    for(;;);\n`;
        code += `  }\n`;
        code += `  display.display();\n`;
        code += `  delay(2000);\n`;
        code += `  display.clearDisplay();\n`;
        code += `  display.setTextSize(1);\n`;
        code += `  display.setTextColor(SSD1306_WHITE);\n`;
        code += `  display.setCursor(0, 0);\n`;
        code += `  display.println("Hello, World!");\n`;
        code += `  display.display();\n`;
    }
    // HC-SR04 setup
    if (ultrasonics.length > 0) {
        ultrasonics.forEach((_, i) => {
            const suffix = i > 0 ? i + 1 : '';
            code += `  pinMode(trigPin${suffix}, OUTPUT);\n`;
            code += `  pinMode(echoPin${suffix}, INPUT);\n`;
        });
    }
    // Servo setup
    if (servos.length > 0) {
        servos.forEach((s, i) => {
            const suffix = i > 0 ? i + 1 : '';
            const pin = s.pin || '9';
            code += `  myServo${suffix}.attach(${pin});\n`;
        });
    }
    if (lcds.length > 0) {
        if (mpus.length === 0 && oleds.length === 0) code += `  Wire.begin();\n`;
        code += `  lcd.init();\n`;
        code += `  lcd.backlight();\n`;
        code += `  lcd.setCursor(0, 0);\n`;
        code += `  lcd.print("Hello World!");\n`;
        code += `  lcd.setCursor(0, 1);\n`;
        code += `  lcd.print("Arduino Sim");\n`;
    }
    leds.forEach((_, i) => {
        code += `  pinMode(ledPin${i > 0 ? i + 1 : ''}, OUTPUT);\n`;
    });
    buttons.forEach((_, i) => {
        code += `  pinMode(buttonPin${i > 0 ? i + 1 : ''}, INPUT);\n`;
    });
    code += `}\n\n`;

    // Loop function
    code += `void loop() {\n`;
    if (mpus.length > 0) {
        code += `  // MPU6050 Read\n`;
        code += `  int16_t ax, ay, az;\n`;
        code += `  int16_t gx, gy, gz;\n`;
        code += `  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);\n`;
        code += `  Serial.print("AX: "); Serial.print(ax);\n`;
        code += `  Serial.print(" AY: "); Serial.print(ay);\n`;
        code += `  Serial.print(" AZ: "); Serial.println(az);\n\n`;

        if (oleds.length > 0) {
            code += `  // Display on OLED\n`;
            code += `  display.clearDisplay();\n`;
            code += `  display.setCursor(0, 0);\n`;
            code += `  display.println("MPU6050 Data");\n`;
            code += `  display.print("AX: "); display.println(ax);\n`;
            code += `  display.print("AY: "); display.println(ay);\n`;
            code += `  display.print("AZ: "); display.println(az);\n`;
            code += `  display.display();\n`;
        }

        if (lcds.length > 0) {
            code += `  // Display MPU data on LCD\n`;
            code += `  lcd.clear();\n`;
            code += `  lcd.setCursor(0, 0);\n`;
            code += `  lcd.print("AX:"); lcd.print(ax);\n`;
            code += `  lcd.setCursor(8, 0);\n`;
            code += `  lcd.print("AY:"); lcd.print(ay);\n`;
            code += `  lcd.setCursor(0, 1);\n`;
            code += `  lcd.print("AZ:"); lcd.print(az);\n`;
        }
        code += `  delay(100);\n\n`;
    }

    // HC-SR04 loop code
    if (ultrasonics.length > 0) {
        code += `  // Ultrasonic Distance Measurement\n`;
        code += `  digitalWrite(trigPin, LOW);\n`;
        code += `  delayMicroseconds(2);\n`;
        code += `  digitalWrite(trigPin, HIGH);\n`;
        code += `  delayMicroseconds(10);\n`;
        code += `  digitalWrite(trigPin, LOW);\n`;
        code += `  duration = pulseIn(echoPin, HIGH);\n`;
        code += `  distance = duration * 0.034 / 2;\n`;
        code += `  Serial.print("Distance: ");\n`;
        code += `  Serial.print(distance);\n`;
        code += `  Serial.println(" cm");\n`;
        if (lcds.length > 0) {
            code += `  lcd.setCursor(0, 1);\n`;
            code += `  lcd.print("Dist: ");\n`;
            code += `  lcd.print(distance);\n`;
            code += `  lcd.print(" cm   ");\n`;
        }
        if (oleds.length > 0) {
            code += `  display.clearDisplay();\n`;
            code += `  display.setCursor(0, 0);\n`;
            code += `  display.println("Ultrasonic");\n`;
            code += `  display.print("Dist: ");\n`;
            code += `  display.print(distance);\n`;
            code += `  display.println(" cm");\n`;
            code += `  display.display();\n`;
        }
        code += `  delay(100);\n`;
    }

    // Servo loop code
    if (servos.length > 0) {
        code += `  // Servo Sweep\n`;
        code += `  myServo.write(servoAngle);\n`;
        code += `  servoAngle += servoDir;\n`;
        code += `  if (servoAngle >= 180 || servoAngle <= 0) servoDir = -servoDir;\n`;
        code += `  Serial.print("Servo Angle: ");\n`;
        code += `  Serial.println(servoAngle);\n`;
        code += `  delay(15);\n`;
    }

    if (buttons.length > 0 && leds.length > 0) {
        code += `  // Read button states\n`;
        buttons.forEach((_, i) => {
            const suffix = i > 0 ? i + 1 : '';
            code += `  int buttonState${suffix} = digitalRead(buttonPin${suffix});\n`;
        });
        code += `\n`;

        // Build condition for any button pressed
        const buttonConditions = buttons.map((_, i) => {
            const suffix = i > 0 ? i + 1 : '';
            return `buttonState${suffix} == HIGH`;
        }).join(' || ');

        code += `  // Control LED based on button(s)\n`;
        code += `  if (${buttonConditions}) {\n`;
        leds.forEach((_, i) => {
            code += `    digitalWrite(ledPin${i > 0 ? i + 1 : ''}, HIGH);\n`;
        });
        code += `  } else {\n`;
        leds.forEach((_, i) => {
            code += `    digitalWrite(ledPin${i > 0 ? i + 1 : ''}, LOW);\n`;
        });
        code += `  }\n`;
    } else if (leds.length > 0) {
        code += `  // Blink LED\n`;
        leds.forEach((_, i) => {
            code += `  digitalWrite(ledPin${i > 0 ? i + 1 : ''}, HIGH);\n`;
        });
        code += `  delay(1000);\n`;
        leds.forEach((_, i) => {
            code += `  digitalWrite(ledPin${i > 0 ? i + 1 : ''}, LOW);\n`;
        });
        code += `  delay(1000);\n`;
    }

    // LCD-only counter demo (when no MPU)
    if (lcds.length > 0 && mpus.length === 0) {
        code += `  // LCD Counter Demo\n`;
        code += `  static unsigned long lastUpdate = 0;\n`;
        code += `  static int counter = 0;\n`;
        code += `  if (millis() - lastUpdate > 1000) {\n`;
        code += `    lastUpdate = millis();\n`;
        code += `    counter++;\n`;
        code += `    lcd.setCursor(0, 1);\n`;
        code += `    lcd.print("Count: ");\n`;
        code += `    lcd.print(counter);\n`;
        code += `    lcd.print("   ");\n`;
        code += `  }\n`;
    }
    code += `}\n`;

    return code;
};
