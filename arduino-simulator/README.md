# ⚡ Arduino Simulator

A web-based interactive Arduino Simulator built with React and TypeScript. This tool allows users to build virtual circuits using an Arduino Uno, LEDs, and Pushbuttons, and automatically generates the corresponding Arduino C++ code.

## 🚀 Features

- **Drag & Drop Interface**: Easily place components from the sidebar onto the canvas.
- **Interactive Components**:
  - **Arduino Uno**: The brain of your circuit.
  - **LEDs**: Visual output components that light up during simulation.
  - **Pushbuttons**: Interactive input components.
- **Smart Wiring**: Wires are automatically drawn between components and the Arduino based on pin assignments.
- **Real-time Simulation**:
  - Start/Stop the simulation to see your circuit come to life.
  - Click push buttons to trigger logic.
  - Watch LEDs react to your simulated code's logic.
- **Auto-Generated Code**: The simulator updates the Arduino C++ code in real-time as you add or modify components.
- **Properties Panel**: Click on any component to configure its pin connections or delete it.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [@wokwi/elements](https://github.com/wokwi/wokwi-elements) (for realistic part rendering)
- **Styling**: Custom CSS3 with Grid/Flexbox layouts.

## 📦 Installation

1.  **Clone the repository** (or download source):
    ```bash
    git clone <your-repo-url>
    cd arduino-simulator
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    Navigate to `http://localhost:5173` (or the URL shown in your terminal).

## 🎮 How to Use

1.  **Add Components**: Drag an **Arduino Uno**, **LED**, or **Pushbutton** from the left sidebar to the main canvas.
2.  **Configure Pins**: Click on a component (LED or Button) to select it. In the right-hand panel, choose which Digital Pin (D2-D13) it connects to.
3.  **Check Connections**: Notice the colored wires automatically appearing to connect your component to the Arduino.
4.  **View Code**: The "Arduino Code" panel at the bottom (or toggled via toolbar) shows the generated code for your current setup.
5.  **Run Simulation**:
    - Click **▶ Start** in the top-left of the canvas.
    - Interact with buttons (click and hold) to test inputs.
    - Watch LEDs respond according to the generated logic.
