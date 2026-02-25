# ⚡ Arduino Simulator: Interactive Web-Based Circuit Prototyping

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-purple.svg)](https://vitejs.dev/)
[![Wokwi](https://img.shields.io/badge/Hardware-Wokwi%20Elements-orange.svg)](https://github.com/wokwi/wokwi-elements)

A powerful, high-fidelity **Arduino Simulator** built for the modern web. Design, wire, and simulate Arduino circuits in real-time with an intuitive drag-and-drop interface and automatic code generation.

---

## 🌟 Key Features

### 🔌 Interactive Simulation Engine
Watch your circuits come to life instantly. The event-driven simulation engine handles real-time inputs (pushbuttons, sensors) and updates outputs (LEDs, displays) with sub-50ms latency.

### 📝 Automatic C++ Code Generation
As you build your circuit, the simulator dynamically generates production-ready Arduino C++ code. It intelligently handles:
- **Pin Definitions**: Automatic `const int` mappings.
- **Library Integration**: Includes `<Wire.h>`, `<MPU6050.h>`, `<LiquidCrystal_I2C.h>`, and more as needed.
- **Logic Scaffolding**: Generates `setup()` and `loop()` functions with pre-written logic for sensors and actuators.

### 🧵 Smart "Spider" Wiring System
No more messy connections. Our custom SVG-based wiring system:
- **Dynamic Bezier Curves**: Smooth, realistic wires that follow components as you move them.
- **Color-Coded Tracks**: Auto-identifies Signal (Green/Red) vs. GND (Black) vs. I2C (Yellow).
- **Pin Detection**: Automatically identifies the correct solder points on the Arduino and components.

### 📟 Integrated Serial Monitor
Debug like a pro. The built-in Serial Monitor captures `Serial.print()` outputs from your simulated code, allowing you to monitor sensor data and logic flow in real-time.

### 🔍 Advanced Search & Palette
Quickly find what you need in our extensive library with a real-time reactive search filter.

---

---

## 🏗️ Inside the Engine: Technical Deep Dives

### 1. The Simulation Loop & State Reactivity
The simulation doesn't just "run"; it pulses. When you click **Start**, the orchestrator (`App.tsx`) initiates a high-frequency heartbeat:

- **The Tick**: A `setInterval` fires every **50ms**, driving the digital logic.
- **Input Sampling**: During each tick, the simulator polls the `buttonStates`. If a virtual button is pressed, its corresponding digital pin in the global `pinValues` state is flipped to `HIGH`.
- **Logic Propagation**: The state change triggers a React re-render. Components like `wokwi-led` are "reactive"—they listen to the `pinValues` object and update their visual state (on/off) instantly.
- **Ref Synchronization**: To ensure 60FPS performance, we use `useRef` to track component positions during dragging, only committing to the main `components` state on "Drop".

### 2. Smart "Spider" Wiring (Bezier Math)
Wiring in our simulator isn't just a straight line; it's a calculated cubic Bezier curve.
- **Pin Offsets**: Each component has a coordinate map (e.g., `LED_PIN_OFFSETS`). We calculate the exact global $(x, y)$ coordinate of a pin by adding the component's canvas position to its internal pin offset.
- **Path Calculation**: The `WireLayer` uses an SVG `<path>` with a "C" (Cubic Bezier) command. The control points are dynamically calculated as the midpoint $(y)$ between the Arduino and the component, creating that organic "drifting wire" look.
- **Dynamic Recalculation**: Every time a component moves, the `WireLayer` recalculates all paths in real-time to maintain the connection.

### 3. Modular Code Generation
The `codeGenerator.ts` engine acts as a "Circuit-to-C++" compiler:
- **Component Scanning**: It first filters the `components` array for specific types (LEDs, Buttons, MPU6050, etc.).
- **Dependency Resolution**: If an I2C device like the MPU6050 is detected, it automatically prefixes the code with `#include <Wire.h>` and `#include <MPU6050.h>`.
- **Setup/Loop Templates**: The engine uses a template-based approach to build the `setup()` and `loop()` functions, injecting `pinMode()` calls and logic blocks (like a blink sequence or sensor reading loop) based on the active hardware.

### 4. Hardware Virtualization via Wokwi
We leverage `@wokwi/elements` to provide high-fidelity rendering. These are standard Web Components that encapsulate complex SVG graphics and internal state (like the intensity of an LED or the angle of a Servo). Our React layer acts as a wrapper, passing property updates (like `value` or `color`) down to these components.

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript
- **Bundler**: Vite
- **Graphics**: SVG Path Math (for wiring), CSS3 Grid/Flexbox
- **Hardware Rendering**: `@wokwi/elements` (The industry standard for web-based hardware UI)
- **State Management**: React Hooks (Ref-synced for low-latency simulation)

---

## 📦 Extensive Component Library

The simulator supports **40+** unique hardware components, categorized for easy access:

### 🧠 Microcontrollers
- **Arduino Uno** (Standard)
- **Arduino Mega** & **Nano**
- **ESP32 DevKit V1**
- **Raspberry Pi Pico** & **RP2040 Connect**
- **Franzininho**

### 🌡️ Sensors & Input
- **I2C/SPI**: MPU6050 (6-Axis IMU), SSD1306 (OLED)
- **Environment**: DHT22 (Temp/Humid), NTC Temperature, Gas Sensor
- **Distance**: HC-SR04 Ultrasonic
- **Interaction**: Analog Joystick, Rotary Encoder (KY-040), Membrane Keypad, Push Buttons, DIP Switches, Slide Switches
- **Vision/Light**: PIR Motion Sensor, Photoresistor, IR Receiver/Remote, Tilt Switch, Flame Sensor

### 💡 Outputs & Actuators
- **Displays**: LCD 16x2 / 20x4 (I2C), 7-Segment Display, ILI9341 TFT
- **Light**: Standard LEDs, RGB LEDs, NeoPixel (Single/Ring/Matrix), LED Bar Graph
- **Sound**: Active/Passive Buzzer
- **Movement**: Servo Motors, Stepper Motors, Biaxial Steppers

### ⚡ Power & Logic
- Resistors & Capacitors
- Relay Modules
- Logic Analyzer (for signal debugging)

---

## 🚀 Getting Started

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/KrishnaManohar101/Web-Based-Arduino-Simulator
    cd arduino-simulator
    npm install
    ```

2.  **Launch Dev Environment**:
    ```bash
    npm run dev
    ```

3.  **Build Your Circuit**:
    - Drag an **Arduino Uno** onto the canvas.
    - Add an **LED** or **Sensor**.
    - Click any component to **assign pins** (D2-D13).
    - Hit **▶ Start** to run the logic!

---

## 📂 Project Structure

```bash
src/
├── ui/                 # React UI Components
│   ├── Canvas.tsx      # Core simulation workspace
│   ├── Sidebar.tsx     # Component search & palette
│   ├── WireLayer.tsx   # SVG Wiring engine
│   └── types.ts        # Hardware definitions
├── codeGenerator.ts    # Logic for dynamic C++ generation
├── App.tsx             # State orchestrator
└── index.css           # Global design tokens & themes
```

---

## 🗺️ Roadmap
- [ ] **Custom Code Editor**: Write and compile your own sketches in the browser.
- [ ] **Breadboard Support**: Add 400/800 point breadboards for realistic prototyping.
- [ ] **Multi-Component Logic**: Advanced interaction between multiple I2C devices.
- [ ] **Save/Load**: Export your circuit as a JSON file.

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for new components or features.

## 📄 License
MIT License - Copyright (c) 2026 Krishna Manohar
