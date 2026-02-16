import { useState, useEffect, useRef, type DragEvent } from 'react';
import '@wokwi/elements';
import './App.css';

type ComponentType = 'arduino-uno' | 'led' | 'pushbutton' | 'mpu6050' | 'ssd1306' |
  'arduino-mega' | 'arduino-nano' | 'esp32-devkit-v1' | 'pi-pico' | 'franzininho' | 'nano-rp2040-connect' |
  'dht22' | 'hc-sr04' | 'potentiometer' | 'slide-potentiometer' | 'slide-switch' | 'dip-switch-8' | 'membrane-keypad' | 'ky-040' |
  'photoresistor-sensor' | 'pir-motion-sensor' | 'gas-sensor' | 'ntc-temperature-sensor' | 'heart-beat-sensor' | 'tilt-switch' |
  'ir-receiver' | 'ir-remote' | 'analog-joystick' | 'rotary-dialer' |
  '7segment' | 'lcd1602' | 'lcd2004' | 'neopixel' | 'neopixel-matrix' | 'servo' | 'buzzer' | 'led-ring' | 'led-bar-graph' |
  'stepper-motor' | 'biaxial-stepper' | 'ili9341' |
  'resistor' | 'capacitor' | 'relay-module' | 'logic-analyzer';

interface CircuitComponent {
  id: string;
  type: ComponentType;
  position: { x: number; y: number };
  pin?: string;
}

const COMPONENT_PALETTE: { type: ComponentType; label: string; icon: string }[] = [
  { type: 'arduino-uno', label: 'Arduino Uno', icon: '🔷' },
  { type: 'led', label: 'LED', icon: '💡' },
  { type: 'pushbutton', label: 'Push Button', icon: '🔘' },
  { type: 'mpu6050', label: 'MPU6050', icon: '📟' },
  { type: 'ssd1306', label: 'OLED Display', icon: '📺' },
  // Microcontrollers
  { type: 'arduino-mega', label: 'Arduino Mega', icon: '🟦' },
  { type: 'arduino-nano', label: 'Arduino Nano', icon: '🔹' },
  { type: 'esp32-devkit-v1', label: 'ESP32', icon: '📶' },
  { type: 'pi-pico', label: 'Pi Pico', icon: '🍓' },
  { type: 'franzininho', label: 'Franzininho', icon: '🐝' },
  { type: 'nano-rp2040-connect', label: 'RP2040 Connect', icon: '📡' },
  // Sensors & Input
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
  // Outputs
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
  // Helpers
  { type: 'resistor', label: 'Resistor', icon: '⚡' },
  { type: 'capacitor', label: 'Capacitor', icon: '🔋' },
  { type: 'relay-module', label: 'Relay', icon: '🔌' },
  { type: 'logic-analyzer', label: 'Logic Analyzer', icon: '📈' },
];

// Arduino Uno pin positions (relative offsets from the Arduino component top-left)
// Digital pins are along the top edge of the Arduino
// D2-D7 are on the right, D8-D13 are on the left
const ARDUINO_PIN_OFFSETS: Record<string, { x: number; y: number }> = {
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
  // GND pins on the Arduino - these are in the POWER section at the bottom of the board
  'GND1': { x: 175, y: 195 },  // First GND pin in power header
  'GND2': { x: 185, y: 195 },  // Second GND pin in power header
  // Power pins (also at bottom)
  '5V': { x: 165, y: 195 },
  '3.3V': { x: 155, y: 195 },
  // Analog pins (I2C) - Adjusted left by 12px to align with pins
  'A4': { x: 251, y: 195 }, // SDA
  'A5': { x: 261, y: 195 }, // SCL
};

// MPU6050 pin offsets
// MPU6050 pin offsets
const MPU6050_PIN_OFFSETS = {
  // Adjusted for actual pin layout from mpu6050-element.js pinInfo (y: 5.78)
  // Offsets include +4px padding from .canvas-component
  VCC: { x: 78.4, y: 9.78 },   // VCC (74.4 + 4)
  GND: { x: 68.8, y: 9.78 },   // GND (64.8 + 4)
  SCL: { x: 59.2, y: 9.78 },   // SCL (55.2 + 4)
  SDA: { x: 49.6, y: 9.78 },   // SDA (45.6 + 4)
};

// SSD1306 OLED pin offsets (Based on 8-pin layout from Wokwi source)
// Pins: DATA (SDA), CLK (SCL), DC, RST, CS, 3V3, VIN, GND
// Offsets derived from ssd1306-element.js pinInfo + 4px padding from .canvas-component
const SSD1306_PIN_OFFSETS = {
  SDA: { x: 40.5, y: 16.5 },   // DATA (36.5 + 4)
  SCL: { x: 49.5, y: 16.5 },   // CLK (45.5 + 4)
  DC: { x: 58.5, y: 16.5 },
  RST: { x: 68.5, y: 16.5 },
  CS: { x: 78.5, y: 16.5 },
  VCC: { x: 97.5, y: 16.5 },   // VIN (93.5 + 4) - Using VIN for 5V connection
  GND: { x: 107.5, y: 16 },    // GND (103.5 + 4, y: 12 + 4)
};

// Component-specific pin offsets (relative to component's top-left position)
// LED: has anode (longer leg, +) and cathode (shorter leg, -)
const LED_PIN_OFFSETS = {
  anode: { x: 15, y: 55 },     // Positive leg (connects to digital pin)
  cathode: { x: 25, y: 55 },   // Negative leg (connects to GND)
};

// Push Button: has 4 pins, we use one pair for signal and one for GND
const BUTTON_PIN_OFFSETS = {
  signal1: { x: 8, y: 40 },    // Top-left pin (to digital pin)
  signal2: { x: 32, y: 40 },   // Top-right pin
  gnd1: { x: 8, y: 8 },       // Bottom-left pin (to GND)
  gnd2: { x: 32, y: 8 },      // Bottom-right pin
};

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleDragStart = (e: DragEvent, type: ComponentType) => {
    e.dataTransfer.setData('source', 'sidebar');
    e.dataTransfer.setData('componentType', type);
  };

  const filteredComponents = COMPONENT_PALETTE.filter(comp =>
    comp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderComponentPreview = (type: ComponentType) => {
    switch (type) {
      case 'arduino-uno':
        // @ts-ignore
        return <wokwi-arduino-uno style={{ transform: 'scale(0.15)', transformOrigin: 'top left' }} />;
      case 'led':
        // @ts-ignore
        return <wokwi-led color="red" />;
      case 'pushbutton':
        // @ts-ignore
        return <wokwi-pushbutton color="red" />;
      case 'mpu6050':
        // @ts-ignore
        return <wokwi-mpu6050 style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }} />;
      case 'ssd1306':
        // @ts-ignore
        return <wokwi-ssd1306 style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }} />;
      default:
        // @ts-ignore
        return <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}>{renderGenericComponent(type)}</div>;
    }
  };

  return (
    <div className="sidebar">
      <h3>COMPONENTS</h3>
      <div className="search-container">
        <input
          type="text"
          className="component-search"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="component-list">
        {filteredComponents.map((comp) => (
          <div
            key={comp.type}
            className={`component-item ${comp.type === 'arduino-uno' ? 'arduino-preview' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, comp.type)}
          >
            <div className="component-preview">
              {renderComponentPreview(comp.type)}
            </div>
            <span className="component-label">{comp.label}</span>
          </div>
        ))}
        {filteredComponents.length === 0 && (
          <div className="no-start-results">No components found</div>
        )}
      </div>
      <div className="sidebar-info">
        <p>Drag components to the canvas to build your circuit</p>
      </div>
    </div>
  );
};


const PropertiesPanel = ({
  component,
  usedPins,
  onPinChange,
  onDelete
}: {
  component: CircuitComponent;
  usedPins: string[];
  onPinChange: (newPin: string) => void;
  onDelete: () => void;
}) => {
  const availablePins = [];
  for (let i = 2; i <= 13; i++) {
    const p = i.toString();
    if (!usedPins.includes(p) || p === component.pin) {
      availablePins.push(p);
    }
  }

  const getComponentDisplayName = (type: ComponentType) => {
    switch (type) {
      case 'arduino-uno':
        // @ts-ignore
        return <wokwi-arduino-uno style={{ transform: 'scale(0.15)', transformOrigin: 'top left' }} />;
      case 'led':
        // @ts-ignore
        return <wokwi-led color="red" />;
      case 'pushbutton':
        // @ts-ignore
        return <wokwi-pushbutton color="red" />;
      case 'mpu6050':
        // @ts-ignore
        return <wokwi-mpu6050 style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }} />;
      case 'ssd1306':
        // @ts-ignore
        return <wokwi-ssd1306 style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }} />;
      default:
        // @ts-ignore
        return <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}>{renderGenericComponent(type)}</div>;
    }
  };

  return (
    <div className="sidebar properties">
      <h3>Properties</h3>
      <div className="prop-section">
        <div className="prop-row">
          <label>Component:</label>
          <span className="prop-value">{getComponentDisplayName(component.type)}</span>
        </div>
        {component.pin && (
          <div className="prop-row">
            <label>Pin:</label>
            <select
              value={component.pin}
              onChange={(e) => onPinChange(e.target.value)}
              className="pin-select"
            >
              {availablePins.map(p => (
                <option key={p} value={p}>D{p}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <button onClick={onDelete} className="delete-btn">
        Delete Component
      </button>
    </div>
  );
};

// Wire component that draws SVG lines between component pins and Arduino pins
const WireLayer = ({
  components,
  arduinoPosition,
}: {
  components: CircuitComponent[];
  arduinoPosition: { x: number; y: number } | null;
}) => {
  if (!arduinoPosition) return null;

  const wires: Array<{
    id: string;
    path: string;
    color: string;
    label: string;
    labelPos: { x: number; y: number };
  }> = [];

  components
  components
    .filter(c => c.type !== 'arduino-uno' && (c.pin || c.type === 'mpu6050' || c.type === 'ssd1306'))
    .forEach(comp => {
      if (comp.type === 'ssd1306') {
        // SSD1306 Wiring
        // VCC -> 5V
        const vccX = comp.position.x + SSD1306_PIN_OFFSETS.VCC.x;
        const vccY = comp.position.y + SSD1306_PIN_OFFSETS.VCC.y;
        const arduino5V = ARDUINO_PIN_OFFSETS['5V'];
        const a5vX = arduinoPosition.x + arduino5V.x;
        const a5vY = arduinoPosition.y + arduino5V.y;

        wires.push({
          id: `${comp.id}-vcc`,
          path: `M ${a5vX} ${a5vY} C ${a5vX} ${(a5vY + vccY) / 2}, ${vccX} ${(a5vY + vccY) / 2}, ${vccX} ${vccY}`,
          color: '#ff4444',
          label: '5V',
          labelPos: { x: (a5vX + vccX) / 2, y: (a5vY + vccY) / 2 }
        });

        // GND -> GND
        const gndOffset = ARDUINO_PIN_OFFSETS['GND1'];
        const arduinoGndX = arduinoPosition.x + gndOffset.x;
        const arduinoGndY = arduinoPosition.y + gndOffset.y;
        const gndX = comp.position.x + SSD1306_PIN_OFFSETS.GND.x;
        const gndY = comp.position.y + SSD1306_PIN_OFFSETS.GND.y;

        wires.push({
          id: `${comp.id}-gnd`,
          path: `M ${arduinoGndX} ${arduinoGndY} C ${arduinoGndX} ${(arduinoGndY + gndY) / 2}, ${gndX} ${(arduinoGndY + gndY) / 2}, ${gndX} ${gndY}`,
          color: '#333333',
          label: 'GND',
          labelPos: { x: (arduinoGndX + gndX) / 2, y: (arduinoGndY + gndY) / 2 }
        });

        // SCL -> A5
        const sclX = comp.position.x + SSD1306_PIN_OFFSETS.SCL.x;
        const sclY = comp.position.y + SSD1306_PIN_OFFSETS.SCL.y;
        const arduinoSCL = ARDUINO_PIN_OFFSETS['A5'];
        const asclX = arduinoPosition.x + arduinoSCL.x;
        const asclY = arduinoPosition.y + arduinoSCL.y;

        wires.push({
          id: `${comp.id}-scl`,
          path: `M ${asclX} ${asclY} C ${asclX} ${(asclY + sclY) / 2}, ${sclX} ${(asclY + sclY) / 2}, ${sclX} ${sclY}`,
          color: '#FFeb3b', // Yellow
          label: 'SCL',
          labelPos: { x: (asclX + sclX) / 2, y: (asclY + sclY) / 2 }
        });

        // SDA -> A4
        const sdaX = comp.position.x + SSD1306_PIN_OFFSETS.SDA.x;
        const sdaY = comp.position.y + SSD1306_PIN_OFFSETS.SDA.y;
        const arduinoSDA = ARDUINO_PIN_OFFSETS['A4'];
        const asdaX = arduinoPosition.x + arduinoSDA.x;
        const asdaY = arduinoPosition.y + arduinoSDA.y;

        wires.push({
          id: `${comp.id}-sda`,
          path: `M ${asdaX} ${asdaY} C ${asdaX} ${(asdaY + sdaY) / 2}, ${sdaX} ${(asdaY + sdaY) / 2}, ${sdaX} ${sdaY}`,
          color: '#4CAF50', // Green
          label: 'SDA',
          labelPos: { x: (asdaX + sdaX) / 2, y: (asdaY + sdaY) / 2 }
        });
        return;
      }

      if (comp.type === 'mpu6050') {
        // MPU6050 Wiring
        // VCC -> 5V
        const vccX = comp.position.x + MPU6050_PIN_OFFSETS.VCC.x;
        const vccY = comp.position.y + MPU6050_PIN_OFFSETS.VCC.y;
        const arduino5V = ARDUINO_PIN_OFFSETS['5V'];
        const a5vX = arduinoPosition.x + arduino5V.x;
        const a5vY = arduinoPosition.y + arduino5V.y;

        wires.push({
          id: `${comp.id}-vcc`,
          path: `M ${a5vX} ${a5vY} C ${a5vX} ${(a5vY + vccY) / 2}, ${vccX} ${(a5vY + vccY) / 2}, ${vccX} ${vccY}`,
          color: '#ff4444',
          label: '5V',
          labelPos: { x: (a5vX + vccX) / 2, y: (a5vY + vccY) / 2 }
        });

        // GND -> GND
        const gndOffset = ARDUINO_PIN_OFFSETS['GND1'];
        const arduinoGndX = arduinoPosition.x + gndOffset.x;
        const arduinoGndY = arduinoPosition.y + gndOffset.y;
        const gndX = comp.position.x + MPU6050_PIN_OFFSETS.GND.x;
        const gndY = comp.position.y + MPU6050_PIN_OFFSETS.GND.y;

        wires.push({
          id: `${comp.id}-gnd`,
          path: `M ${arduinoGndX} ${arduinoGndY} C ${arduinoGndX} ${(arduinoGndY + gndY) / 2}, ${gndX} ${(arduinoGndY + gndY) / 2}, ${gndX} ${gndY}`,
          color: '#333333',
          label: 'GND',
          labelPos: { x: (arduinoGndX + gndX) / 2, y: (arduinoGndY + gndY) / 2 }
        });

        // SCL -> A5
        const sclX = comp.position.x + MPU6050_PIN_OFFSETS.SCL.x;
        const sclY = comp.position.y + MPU6050_PIN_OFFSETS.SCL.y;
        const arduinoSCL = ARDUINO_PIN_OFFSETS['A5'];
        const asclX = arduinoPosition.x + arduinoSCL.x;
        const asclY = arduinoPosition.y + arduinoSCL.y;

        wires.push({
          id: `${comp.id}-scl`,
          path: `M ${asclX} ${asclY} C ${asclX} ${(asclY + sclY) / 2}, ${sclX} ${(asclY + sclY) / 2}, ${sclX} ${sclY}`,
          color: '#FFeb3b', // Yellow
          label: 'SCL',
          labelPos: { x: (asclX + sclX) / 2, y: (asclY + sclY) / 2 }
        });

        // SDA -> A4
        const sdaX = comp.position.x + MPU6050_PIN_OFFSETS.SDA.x;
        const sdaY = comp.position.y + MPU6050_PIN_OFFSETS.SDA.y;
        const arduinoSDA = ARDUINO_PIN_OFFSETS['A4'];
        const asdaX = arduinoPosition.x + arduinoSDA.x;
        const asdaY = arduinoPosition.y + arduinoSDA.y;

        wires.push({
          id: `${comp.id}-sda`,
          path: `M ${asdaX} ${asdaY} C ${asdaX} ${(asdaY + sdaY) / 2}, ${sdaX} ${(asdaY + sdaY) / 2}, ${sdaX} ${sdaY}`,
          color: '#4CAF50', // Green
          label: 'SDA',
          labelPos: { x: (asdaX + sdaX) / 2, y: (asdaY + sdaY) / 2 }
        });
        return;
      }

      const pinOffset = ARDUINO_PIN_OFFSETS[comp.pin!];
      if (!pinOffset) return;

      // Arduino digital pin position
      const arduinoPinX = arduinoPosition.x + pinOffset.x;
      const arduinoPinY = arduinoPosition.y + pinOffset.y;

      // Arduino GND position
      const gndOffset = ARDUINO_PIN_OFFSETS['GND1'];
      const arduinoGndX = arduinoPosition.x + gndOffset.x;
      const arduinoGndY = arduinoPosition.y + gndOffset.y;

      if (comp.type === 'led') {
        // LED Anode (positive) to Digital Pin
        const anodeX = comp.position.x + LED_PIN_OFFSETS.anode.x;
        const anodeY = comp.position.y + LED_PIN_OFFSETS.anode.y;

        // LED Cathode (negative) to GND
        const cathodeX = comp.position.x + LED_PIN_OFFSETS.cathode.x;
        const cathodeY = comp.position.y + LED_PIN_OFFSETS.cathode.y;

        // Signal wire (Arduino Pin -> LED Anode)
        const signalMidY = (arduinoPinY + anodeY) / 2;
        wires.push({
          id: `${comp.id}-signal`,
          path: `M ${arduinoPinX} ${arduinoPinY} C ${arduinoPinX} ${signalMidY}, ${anodeX} ${signalMidY}, ${anodeX} ${anodeY}`,
          color: '#ff6b6b',
          label: `D${comp.pin}`,
          labelPos: { x: (arduinoPinX + anodeX) / 2, y: signalMidY - 10 }
        });

        // GND wire (Arduino GND -> LED Cathode)
        const gndMidY = (arduinoGndY + cathodeY) / 2;
        wires.push({
          id: `${comp.id}-gnd`,
          path: `M ${arduinoGndX} ${arduinoGndY} C ${arduinoGndX} ${gndMidY}, ${cathodeX} ${gndMidY}, ${cathodeX} ${cathodeY}`,
          color: '#333333',
          label: 'GND',
          labelPos: { x: (arduinoGndX + cathodeX) / 2, y: gndMidY - 10 }
        });
      } else if (comp.type === 'pushbutton') {
        // ... (existing button wiring logic) ...
        // Button signal pin to Digital Pin
        const signalX = comp.position.x + BUTTON_PIN_OFFSETS.signal1.x;
        const signalY = comp.position.y + BUTTON_PIN_OFFSETS.signal1.y;

        // Button GND pin to Arduino GND
        const gndX = comp.position.x + BUTTON_PIN_OFFSETS.gnd1.x;
        const gndY = comp.position.y + BUTTON_PIN_OFFSETS.gnd1.y;

        // Signal wire
        const signalMidY = (arduinoPinY + signalY) / 2;
        wires.push({
          id: `${comp.id}-signal`,
          path: `M ${arduinoPinX} ${arduinoPinY} C ${arduinoPinX} ${signalMidY}, ${signalX} ${signalMidY}, ${signalX} ${signalY}`,
          color: '#4ecdc4',
          label: `D${comp.pin}`,
          labelPos: { x: (arduinoPinX + signalX) / 2, y: signalMidY - 10 }
        });

        // GND wire
        const gndMidY = (arduinoGndY + gndY) / 2;
        wires.push({
          id: `${comp.id}-gnd`,
          path: `M ${arduinoGndX} ${arduinoGndY} C ${arduinoGndX} ${gndMidY}, ${gndX} ${gndMidY}, ${gndX} ${gndY}`,
          color: '#333333',
          label: 'GND',
          labelPos: { x: (arduinoGndX + gndX) / 2, y: gndMidY - 10 }
        });
      }
    });

  return (
    <svg className="wire-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <defs>
        <marker id="wire-end-signal" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
          <circle cx="5" cy="5" r="4" fill="#4CAF50" stroke="#fff" strokeWidth="1" />
        </marker>
        <marker id="wire-end-gnd" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
          <circle cx="5" cy="5" r="4" fill="#333" stroke="#666" strokeWidth="1" />
        </marker>
      </defs>
      {wires.map(wire => (
        <g key={wire.id}>
          <path
            d={wire.path}
            className="wire"
            fill="none"
            stroke={wire.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            markerStart={wire.color === '#333333' ? 'url(#wire-end-gnd)' : 'url(#wire-end-signal)'}
            markerEnd={wire.color === '#333333' ? 'url(#wire-end-gnd)' : 'url(#wire-end-signal)'}
          />
          <text
            x={wire.labelPos.x}
            y={wire.labelPos.y}
            className="wire-label"
            fill={wire.color === '#333333' ? '#666' : wire.color}
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            {wire.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

interface CanvasProps {
  components: CircuitComponent[];
  onDrop: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onSimulationToggle: (running: boolean) => void;
  isRunning: boolean;
  onSelect: (id: string | null) => void;
  selectedId: string | null;
  pinValues: Record<string, boolean>;
  onButtonPress: (id: string, pressed: boolean) => void;
  onPositionUpdate: (id: string, x: number, y: number) => void;
}

const renderGenericComponent = (type: ComponentType) => {
  switch (type) {
    // Microcontrollers
    case 'arduino-mega': return <wokwi-arduino-mega />;
    case 'arduino-nano': return <wokwi-arduino-nano />;
    case 'esp32-devkit-v1': return <wokwi-esp32-devkit-v1 />;
    case 'pi-pico': return <wokwi-pi-pico />;
    case 'franzininho': return <wokwi-franzininho />;
    case 'nano-rp2040-connect': return <wokwi-nano-rp2040-connect />;
    // Sensors & Input
    case 'dht22': return <wokwi-dht22 />;
    case 'hc-sr04': return <wokwi-hc-sr04 />;
    case 'potentiometer': return <wokwi-potentiometer />;
    case 'slide-potentiometer': return <wokwi-slide-potentiometer />;
    case 'slide-switch': return <wokwi-slide-switch />;
    case 'dip-switch-8': return <wokwi-dip-switch-8 />;
    case 'membrane-keypad': return <wokwi-membrane-keypad />;
    case 'ky-040': return <wokwi-ky-040 />;
    case 'photoresistor-sensor': return <wokwi-photoresistor-sensor />;
    case 'pir-motion-sensor': return <wokwi-pir-motion-sensor />;
    case 'gas-sensor': return <wokwi-gas-sensor />;
    case 'ntc-temperature-sensor': return <wokwi-ntc-temperature-sensor />;
    case 'heart-beat-sensor': return <wokwi-heart-beat-sensor />;
    case 'tilt-switch': return <wokwi-tilt-switch />;
    case 'ir-receiver': return <wokwi-ir-receiver />;
    case 'ir-remote': return <wokwi-ir-remote />;
    case 'analog-joystick': return <wokwi-analog-joystick />;
    case 'rotary-dialer': return <wokwi-rotary-dialer />;
    // Outputs
    case '7segment': return <wokwi-7segment />;
    case 'lcd1602': return <wokwi-lcd1602 />;
    case 'lcd2004': return <wokwi-lcd2004 />;
    case 'neopixel': return <wokwi-neopixel />;
    case 'neopixel-matrix': return <wokwi-neopixel-matrix />;
    case 'servo': return <wokwi-servo />;
    case 'buzzer': return <wokwi-buzzer />;
    case 'led-ring': return <wokwi-neopixel-ring />;
    case 'led-bar-graph': return <wokwi-led-bar-graph />;
    case 'stepper-motor': return <wokwi-stepper-motor />;
    case 'biaxial-stepper': return <wokwi-biaxial-stepper />;
    case 'ili9341': return <wokwi-ili9341 />;
    // Helpers
    case 'resistor': return <wokwi-resistor />;
    case 'capacitor': return <wokwi-capacitor />;
    case 'relay-module': return <wokwi-ks2e-m-dc5 />;
    case 'logic-analyzer': return <wokwi-logic-analyzer />;
    default: return null;
  }
};

const Canvas = ({
  components,
  onDrop,
  onDragOver,
  onSimulationToggle,
  isRunning,
  onSelect,
  selectedId,
  pinValues,
  onButtonPress,
  onPositionUpdate
}: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // ZOOM DISABLED - Uncomment to enable
  // const [zoom, setZoom] = useState(1);
  const zoom = 1; // Fixed zoom level

  // const handleZoom = (delta: number) => {
  //   setZoom(prev => Math.min(2, Math.max(0.25, prev + delta)));
  // };

  // const handleWheel = (e: React.WheelEvent) => {
  //   if (e.ctrlKey) {
  //     e.preventDefault();
  //     const delta = e.deltaY > 0 ? -0.1 : 0.1;
  //     handleZoom(delta);
  //   }
  // };

  const handleDragStart = (e: DragEvent, id: string) => {
    e.dataTransfer.setData('source', 'canvas');
    e.dataTransfer.setData('componentId', id);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    onSelect(id);
  };

  const handleLocalDrop = (e: DragEvent) => {
    e.preventDefault();
    const source = e.dataTransfer.getData('source');

    if (source === 'canvas' && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const id = e.dataTransfer.getData('componentId');
      const x = (e.clientX - canvasRect.left - dragOffset.x) / zoom;
      const y = (e.clientY - canvasRect.top - dragOffset.y) / zoom;
      onPositionUpdate(id, Math.max(0, x), Math.max(0, y));
    } else {
      onDrop(e);
    }
  };

  const arduinoComponent = components.find(c => c.type === 'arduino-uno');
  const arduinoPosition = arduinoComponent?.position || null;

  return (
    <div
      ref={canvasRef}
      className="canvas"
      onDrop={handleLocalDrop}
      onDragOver={onDragOver}
      // onWheel={handleWheel} // ZOOM DISABLED
      onClick={(e) => {
        if (e.target === e.currentTarget) onSelect(null);
      }}
    >
      <div className="canvas-controls">
        <button
          onClick={() => onSimulationToggle(true)}
          disabled={isRunning}
          className={`sim-btn start-btn ${isRunning ? 'disabled' : ''}`}
        >
          ▶ Start
        </button>
        <button
          onClick={() => onSimulationToggle(false)}
          disabled={!isRunning}
          className={`sim-btn stop-btn ${!isRunning ? 'disabled' : ''}`}
        >
          ■ Stop
        </button>
        {isRunning && <span className="sim-status">Simulation Running</span>}
      </div>

      {/* ZOOM DISABLED - Uncomment to enable
      <div className="zoom-controls">
        <button onClick={() => handleZoom(-0.1)} className="zoom-btn">−</button>
        <span className="zoom-level">{Math.round(zoom * 100)}%</span>
        <button onClick={() => handleZoom(0.1)} className="zoom-btn">+</button>
        <button onClick={() => setZoom(1)} className="zoom-btn reset">Reset</button>
      </div>
      */}

      <div
        className="canvas-content"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
        }}
      >
        <WireLayer components={components} arduinoPosition={arduinoPosition} />

        {components.length === 0 && (
          <div className="placeholder-text">
            <span className="placeholder-icon">📦</span>
            <span>Drag components here to build your circuit</span>
          </div>
        )}

        {components.map((comp) => (
          <div
            key={comp.id}
            draggable
            onDragStart={(e) => handleDragStart(e, comp.id)}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(comp.id);
            }}
            className={`canvas-component ${selectedId === comp.id ? 'selected' : ''}`}
            style={{
              position: 'absolute',
              left: comp.position.x,
              top: comp.position.y,
            }}
          >
            {/* @ts-ignore */}
            {comp.type === 'arduino-uno' && <wokwi-arduino-uno />}
            {comp.type === 'led' && (
              <div className="led-wrapper">
                {/* @ts-ignore */}
                <wokwi-led
                  color="red"
                  label={comp.pin ? `D${comp.pin}` : ''}
                  value={comp.pin && pinValues[comp.pin] ? true : false}
                />
                {comp.pin && pinValues[comp.pin] && <div className="led-glow" />}
              </div>
            )}
            {comp.type === 'pushbutton' && (
              <div
                className={`button-wrapper ${isRunning ? 'interactive' : ''}`}
                onMouseDown={() => isRunning && onButtonPress(comp.id, true)}
                onMouseUp={() => isRunning && onButtonPress(comp.id, false)}
                onMouseLeave={() => isRunning && onButtonPress(comp.id, false)}
              >
                {/* @ts-ignore */}
                <wokwi-pushbutton color="red" label={comp.pin ? `D${comp.pin}` : ''} />
                {isRunning && <div className="button-hint">Click & Hold</div>}
              </div>
            )}
            {comp.type === 'mpu6050' && (
              // @ts-ignore
              <wokwi-mpu6050 />
            )}
            {comp.type === 'ssd1306' && (
              // @ts-ignore
              <wokwi-ssd1306 />
            )}

            {/* Generic rendering for other components */}
            {/* @ts-ignore */}
            {renderGenericComponent(comp.type)}
          </div>
        ))}
      </div>
    </div>
  );
};



const CodePanel = ({ code }: { code: string }) => (
  <div className="code-panel">
    <div className="code-header">
      <h3>Arduino Code</h3>
      <span className="auto-badge">Auto-Generated</span>
    </div>
    <pre className="code-editor">{code}</pre>
  </div>
);

const generateCode = (components: CircuitComponent[]) => {
  const leds = components.filter(c => c.type === 'led' && c.pin);
  const buttons = components.filter(c => c.type === 'pushbutton' && c.pin);
  const mpus = components.filter(c => c.type === 'mpu6050');

  if (leds.length === 0 && buttons.length === 0 && mpus.length === 0) {
    return `// Arduino Simulator
// =====================
// Add components to generate code
//
// Default Pin Mapping:
// - LED → Digital Pin 10
// - Push Button → Digital Pin 2
// - MPU6050 → SDA (A4), SCL (A5)
// - OLED Display → SDA (A4), SCL (A5)`;
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
    if (mpus.length === 0) code += `  Wire.begin();\n`;
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
    code += `  delay(100);\n\n`;
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
  code += `}\n`;

  return code;
};

const SerialMonitor = ({ output, onClose }: { output: string[], onClose: () => void }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  return (
    <div className="serial-monitor">
      <div className="serial-header">
        <h3>Serial Monitor</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      <div className="serial-content">
        {output.map((line, i) => (
          <div key={i} className="serial-line">{line}</div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

function App() {
  const [showCode, setShowCode] = useState(true);
  const [showSerial, setShowSerial] = useState(false);
  const [components, setComponents] = useState<CircuitComponent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Simulation State
  const [pinValues, setPinValues] = useState<Record<string, boolean>>({});
  const [buttonStates, setButtonStates] = useState<Record<string, boolean>>({});
  const [serialOutput, setSerialOutput] = useState<string[]>([]);

  const code = generateCode(components);

  useEffect(() => {
    if (!isRunning) {
      setPinValues({});
      return;
    }

    // Clear serial on start
    setSerialOutput([]);

    // Helper to draw text on OLED
    const drawOledText = (text: string[]) => {
      const oled = document.querySelector('wokwi-ssd1306') as any;
      if (!oled) return;

      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 128, 64);
      ctx.fillStyle = 'white';
      ctx.font = '10px monospace';

      text.forEach((line, i) => {
        ctx.fillText(line, 0, 10 + (i * 12));
      });

      if (oled.imageData) {
        const imageData = ctx.getImageData(0, 0, 128, 64);
        oled.imageData.data.set(imageData.data);
        oled.redraw();
      }
    };

    let time = 0;
    const interval = setInterval(() => {
      time += 0.1;
      const newPinValues: Record<string, boolean> = {};

      const buttons = components.filter(c => c.type === 'pushbutton' && c.pin);
      const leds = components.filter(c => c.type === 'led' && c.pin);
      const mpus = components.filter(c => c.type === 'mpu6050');
      const oleds = components.filter(c => c.type === 'ssd1306');

      // MPU6050 Simulation
      if (mpus.length > 0) {
        // Simulate accelerometer values with sine waves
        const ax = Math.round(Math.sin(time) * 16000);
        const ay = Math.round(Math.cos(time * 0.5) * 16000);
        const az = Math.round(Math.sin(time * 0.2) * 16000);

        // Update Serial Monitor (throttle to avoid flooding)
        if (Math.floor(time * 10) % 5 === 0) {
          setSerialOutput(prev => {
            const newLine = `MPU6050: AX=${ax} AY=${ay} AZ=${az}`;
            const newLog = [...prev, newLine];
            if (newLog.length > 50) return newLog.slice(newLog.length - 50);
            return newLog;
          });
        }

        if (oleds.length > 0) {
          drawOledText([
            'MPU6050 Data',
            `AX: ${ax}`,
            `AY: ${ay}`,
            `AZ: ${az}`
          ]);
        }
      } else if (oleds.length > 0) {
        // Default OLED text if no MPU
        drawOledText(['Hello, World!', 'Arduino Simulator']);
      }

      buttons.forEach(btn => {
        if (btn.pin) {
          const pressed = buttonStates[btn.id] || false;
          if (pressed) newPinValues[btn.pin] = true;
        }
      });

      if (buttons.length > 0 && leds.length > 0) {
        const btnPin = buttons[0].pin;
        if (btnPin) {
          const signal = newPinValues[btnPin] || false;
          leds.forEach(led => {
            if (led.pin) newPinValues[led.pin] = signal;
          });
        }
      } else if (leds.length > 0) {
        // Blink LED if no buttons
        const blink = Math.floor(time * 5) % 2 === 0;
        leds.forEach(led => {
          if (led.pin) newPinValues[led.pin] = blink;
        });
      }

      setPinValues(newPinValues);

    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, components, buttonStates]);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const findAvailablePin = (used: string[]) => {
    for (let i = 2; i <= 13; i++) {
      const pin = i.toString();
      if (!used.includes(pin)) return pin;
    }
    return undefined;
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const source = e.dataTransfer.getData('source');
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    if (source === 'sidebar') {
      const type = e.dataTransfer.getData('componentType') as ComponentType;
      if (!type) return;

      // Prevent adding multiple Arduinos
      if (type === 'arduino-uno' && components.some(c => c.type === 'arduino-uno')) {
        return;
      }

      const usedPins = components.map(c => c.pin).filter(Boolean) as string[];
      let assignedPin: string | undefined;

      if (type === 'led') {
        if (!usedPins.includes('10')) assignedPin = '10';
        else assignedPin = findAvailablePin(usedPins);
      } else if (type === 'pushbutton') {
        if (!usedPins.includes('2')) assignedPin = '2';
        else assignedPin = findAvailablePin(usedPins);
      }

      const newComponent: CircuitComponent = {
        id: crypto.randomUUID(),
        type,
        position: { x, y },
        pin: assignedPin
      };

      setComponents((prev) => [...prev, newComponent]);
      setSelectedId(newComponent.id);
    }
  };

  const handlePositionUpdate = (id: string, x: number, y: number) => {
    setComponents((prev) => prev.map(c => c.id === id ? { ...c, position: { x, y } } : c));
  };

  const handlePinChange = (newPin: string) => {
    if (!selectedId) return;
    setComponents(prev => prev.map(c => c.id === selectedId ? { ...c, pin: newPin } : c));
  };

  const handleDelete = () => {
    if (!selectedId) return;
    setComponents(prev => prev.filter(c => c.id !== selectedId));
    setSelectedId(null);
  };

  const handleButtonPress = (id: string, pressed: boolean) => {
    setButtonStates(prev => ({ ...prev, [id]: pressed }));
  };

  const selectedComponent = components.find(c => c.id === selectedId);

  return (
    <div id="app-root">
      <header className="header">
        <div className="header-left">
          <span className="logo">⚡</span>
          <h2>Arduino Simulator</h2>
        </div>
        <div className="toolbar">
          <button
            onClick={() => setShowSerial(!showSerial)}
            className={`toolbar-btn ${showSerial ? 'active' : ''}`}
          >
            📟 Serial Monitor
          </button>
          <button
            onClick={() => setShowCode(!showCode)}
            className={`toolbar-btn ${showCode ? 'active' : ''}`}
          >
            {showCode ? '🔧 Circuit Only' : '📝 Show Code'}
          </button>
        </div>
      </header>
      <div className="layout">
        <Sidebar />
        <div className="main-area">
          <Canvas
            components={components}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onSimulationToggle={setIsRunning}
            isRunning={isRunning}
            onSelect={setSelectedId}
            selectedId={selectedId}
            pinValues={pinValues}
            onButtonPress={handleButtonPress}
            onPositionUpdate={handlePositionUpdate}
          />
          {showSerial && <SerialMonitor output={serialOutput} onClose={() => setShowSerial(false)} />}
          {showCode && <CodePanel code={code} />}
        </div>
        {selectedComponent && selectedComponent.type !== 'arduino-uno' && (
          <PropertiesPanel
            component={selectedComponent}
            usedPins={components.map(c => c.pin).filter(Boolean) as string[]}
            onPinChange={handlePinChange}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default App;
