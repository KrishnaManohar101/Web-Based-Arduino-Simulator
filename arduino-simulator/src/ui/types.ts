import { type DragEvent } from 'react';

export type ComponentType = 'arduino-uno' | 'led' | 'pushbutton' | 'mpu6050' | 'ssd1306' |
    'arduino-mega' | 'arduino-nano' | 'esp32-devkit-v1' | 'pi-pico' | 'franzininho' | 'nano-rp2040-connect' |
    'dht22' | 'hc-sr04' | 'potentiometer' | 'slide-potentiometer' | 'slide-switch' | 'dip-switch-8' | 'membrane-keypad' | 'ky-040' |
    'photoresistor-sensor' | 'pir-motion-sensor' | 'gas-sensor' | 'ntc-temperature-sensor' | 'heart-beat-sensor' | 'tilt-switch' |
    'ir-receiver' | 'ir-remote' | 'analog-joystick' | 'rotary-dialer' |
    '7segment' | 'lcd1602' | 'lcd2004' | 'neopixel' | 'neopixel-matrix' | 'servo' | 'buzzer' | 'led-ring' | 'led-bar-graph' |
    'stepper-motor' | 'biaxial-stepper' | 'ili9341' |
    'resistor' | 'capacitor' | 'relay-module' | 'logic-analyzer';

export interface CircuitComponent {
    id: string;
    type: ComponentType;
    position: { x: number; y: number };
    pin?: string;
}

export const COMPONENT_PALETTE: { type: ComponentType; label: string; icon: string }[] = [
    { type: 'arduino-uno', label: 'Arduino Uno', icon: '🔷' },
    { type: 'led', label: 'LED', icon: '💡' },
    { type: 'pushbutton', label: 'Push Button', icon: '🔘' },
    { type: 'mpu6050', label: 'MPU6050', icon: '📟' },
    { type: 'ssd1306', label: 'OLED Display', icon: '📺' },
    { type: 'arduino-mega', label: 'Arduino Mega', icon: '🟦' },
    { type: 'arduino-nano', label: 'Arduino Nano', icon: '🔹' },
    { type: 'esp32-devkit-v1', label: 'ESP32', icon: '📶' },
    { type: 'pi-pico', label: 'Pi Pico', icon: '🍓' },
    { type: 'franzininho', label: 'Franzininho', icon: '🐝' },
    { type: 'nano-rp2040-connect', label: 'RP2040 Connect', icon: '📡' },
    { type: 'dht22', label: 'DHT22', icon: '🌡️' },
    { type: 'hc-sr04', label: 'Ultrasonic', icon: '🦇' },
    { type: 'potentiometer', label: 'Potentiometer', icon: '🎛️' },
    { type: 'slide-potentiometer', label: 'Slide Pot', icon: '📏' },
    { type: 'slide-switch', label: 'Slide Switch', icon: '🔛' },
    { type: 'dip-switch-8', label: 'DIP Switch 8', icon: '🎹' },
    { type: 'membrane-keypad', label: 'Keypad', icon: '🔢' },
    { type: 'ky-040', label: 'Rotary Encoder', icon: '🔄' },
    { type: 'photoresistor-sensor', label: 'Photoresistor', icon: '☀️' },
    { type: 'pir-motion-sensor', label: 'Motion Sensor', icon: '🏃' },
    { type: 'gas-sensor', label: 'Gas Sensor', icon: '⛽' },
    { type: 'ntc-temperature-sensor', label: 'NTC Temp', icon: '🌡️' },
    { type: 'heart-beat-sensor', label: 'Heart Beat', icon: '❤️' },
    { type: 'tilt-switch', label: 'Tilt Switch', icon: '📐' },
    { type: 'ir-receiver', label: 'IR Receiver', icon: '📡' },
    { type: 'ir-remote', label: 'IR Remote', icon: '📱' },
    { type: 'analog-joystick', label: 'Joystick', icon: '🕹️' },
    { type: 'rotary-dialer', label: 'Rotary Dialer', icon: '☎️' },
    { type: '7segment', label: '7-Segment', icon: '8️⃣' },
    { type: 'lcd1602', label: 'LCD 16x2', icon: '📟' },
    { type: 'lcd2004', label: 'LCD 20x4', icon: '📟' },
    { type: 'neopixel', label: 'NeoPixel', icon: '🌈' },
    { type: 'neopixel-matrix', label: 'NeoPixel Matrix', icon: '▦' },
    { type: 'servo', label: 'Servo', icon: '🦾' },
    { type: 'buzzer', label: 'Buzzer', icon: '🔊' },
    { type: 'led-ring', label: 'LED Ring', icon: '⭕' },
    { type: 'led-bar-graph', label: 'Bar Graph', icon: '📊' },
    { type: 'stepper-motor', label: 'Stepper', icon: '⚙️' },
    { type: 'biaxial-stepper', label: 'Biaxial Stepper', icon: '⚙️' },
    { type: 'ili9341', label: 'TFT Display', icon: '🖥️' },
    { type: 'resistor', label: 'Resistor', icon: '⚡' },
    { type: 'capacitor', label: 'Capacitor', icon: '🔋' },
    { type: 'relay-module', label: 'Relay', icon: '🔌' },
    { type: 'logic-analyzer', label: 'Logic Analyzer', icon: '📈' },
];

export const ARDUINO_PIN_OFFSETS: Record<string, { x: number; y: number }> = {
    '2': { x: 243, y: 12 },
    '3': { x: 233, y: 12 },
    '4': { x: 223, y: 12 },
    '5': { x: 213, y: 12 },
    '6': { x: 203, y: 12 },
    '7': { x: 193, y: 12 },
    '8': { x: 178, y: 12 },
    '9': { x: 168, y: 12 },
    '10': { x: 158, y: 12 },
    '11': { x: 148, y: 12 },
    '12': { x: 138, y: 12 },
    '13': { x: 128, y: 12 },
    'GND1': { x: 175, y: 195 },
    'GND2': { x: 185, y: 195 },
    '5V': { x: 165, y: 195 },
    '3.3V': { x: 155, y: 195 },
    'A4': { x: 251, y: 195 },
    'A5': { x: 261, y: 195 },
};

export const MPU6050_PIN_OFFSETS = {
    VCC: { x: 78.4, y: 9.78 },
    GND: { x: 68.8, y: 9.78 },
    SCL: { x: 59.2, y: 9.78 },
    SDA: { x: 49.6, y: 9.78 },
};

export const SSD1306_PIN_OFFSETS = {
    SDA: { x: 40.5, y: 16.5 },
    SCL: { x: 49.5, y: 16.5 },
    DC: { x: 58.5, y: 16.5 },
    RST: { x: 68.5, y: 16.5 },
    CS: { x: 78.5, y: 16.5 },
    VCC: { x: 97.5, y: 16.5 },
    GND: { x: 107.5, y: 16 },
};

export const LED_PIN_OFFSETS = {
    anode: { x: 15, y: 55 },
    cathode: { x: 25, y: 55 },
};

export const BUTTON_PIN_OFFSETS = {
    signal1: { x: 8, y: 40 },
    signal2: { x: 32, y: 40 },
    gnd1: { x: 8, y: 8 },
    gnd2: { x: 32, y: 8 },
};

export const LCD1602_PIN_OFFSETS = {
    GND: { x: 8, y: 36 },
    VCC: { x: 8, y: 45.5 },
    SDA: { x: 8, y: 55 },
    SCL: { x: 8, y: 64.5 },
};

export const HCSR04_PIN_OFFSETS = {
    VCC: { x: 75.3, y: 98.5 },
    TRIG: { x: 85.3, y: 98.5 },
    ECHO: { x: 95.3, y: 98.5 },
    GND: { x: 105.3, y: 98.5 },
};

export const SERVO_PIN_OFFSETS = {
    GND: { x: 4, y: 54 },
    VCC: { x: 4, y: 63.5 },
    PWM: { x: 4, y: 73 },
};

export const PIR_PIN_OFFSETS = {
    VCC: { x: 40.2, y: 96 }, OUT: { x: 49.9, y: 96 }, GND: { x: 59.6, y: 96 },
};

export const TILT_PIN_OFFSETS = {
    GND: { x: 92, y: 22 }, VCC: { x: 92, y: 31.8 }, OUT: { x: 92, y: 41.5 },
};

export const HEARTBEAT_PIN_OFFSETS = {
    GND: { x: 91, y: 21.8 }, VCC: { x: 91, y: 31.5 }, OUT: { x: 91, y: 41.5 },
};

export const FLAME_PIN_OFFSETS = {
    VCC: { x: 203, y: 18.6 }, GND: { x: 203, y: 28.3 }, DOUT: { x: 203, y: 38 }, AOUT: { x: 203, y: 47.7 },
};

export const NTC_PIN_OFFSETS = {
    GND: { x: 139, y: 30.2 }, VCC: { x: 139, y: 39.8 }, OUT: { x: 139, y: 49.5 },
};

export const POT_PIN_OFFSETS = {
    GND: { x: 33, y: 72.5 }, SIG: { x: 43, y: 72.5 }, VCC: { x: 53, y: 72.5 },
};

export const PHOTO_PIN_OFFSETS = {
    VCC: { x: 176, y: 20 }, GND: { x: 176, y: 30 }, DO: { x: 176, y: 39.8 }, AO: { x: 176, y: 49.5 },
};

export const GAS_PIN_OFFSETS = {
    AOUT: { x: 141, y: 20.5 }, DOUT: { x: 141, y: 30.4 }, GND: { x: 141, y: 40.5 }, VCC: { x: 141, y: 50.2 },
};

export const BUZZER_PIN_OFFSETS = {
    P1: { x: 31, y: 88 }, P2: { x: 41, y: 88 },
};

export const RGBLED_PIN_OFFSETS = {
    R: { x: 12.5, y: 48 }, COM: { x: 22, y: 58 }, G: { x: 30.4, y: 48 }, B: { x: 39.7, y: 48 },
};

export const NEOPIXEL_PIN_OFFSETS = {
    VDD: { x: 5, y: 7.5 }, DOUT: { x: 5, y: 18 }, VSS: { x: 25, y: 18 }, DIN: { x: 25, y: 7.5 },
};

export const DHT22_PIN_OFFSETS = {
    VCC: { x: 19, y: 118.9 }, SDA: { x: 28.5, y: 118.9 }, GND: { x: 47.8, y: 118.9 },
};

export const IR_PIN_OFFSETS = {
    GND: { x: 25, y: 91.75 }, VCC: { x: 34.6, y: 91.75 }, DAT: { x: 44.2, y: 91.75 },
};

export const KY040_PIN_OFFSETS = {
    CLK: { x: 120, y: 11.9 }, DT: { x: 120, y: 21.4 }, SW: { x: 120, y: 31 },
    VCC: { x: 120, y: 40.3 }, GND: { x: 120, y: 49.5 },
};

export const JOYSTICK_PIN_OFFSETS = {
    VCC: { x: 37, y: 119.8 }, VERT: { x: 46.6, y: 119.8 }, HORZ: { x: 56.2, y: 119.8 },
    SEL: { x: 65.8, y: 119.8 }, GND: { x: 75.4, y: 119.8 },
};

export const DS1307_PIN_OFFSETS = {
    GND: { x: 13.5, y: 19 }, V5: { x: 13.5, y: 29 }, SDA: { x: 13.5, y: 38.5 }, SCL: { x: 13.5, y: 48 },
};

export const SLIDEPOT_PIN_OFFSETS = {
    GND: { x: 33, y: 72.5 }, SIG: { x: 43, y: 72.5 }, VCC: { x: 53, y: 72.5 },
};
