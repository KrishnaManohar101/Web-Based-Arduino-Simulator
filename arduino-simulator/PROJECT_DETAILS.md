# 🏗️ Detailed Project Overview: Arduino Simulator

This document provides an in-depth explanation of the **Arduino Simulator** project, including its architecture, key components, and how the simulation logic works under the hood.

## 📁 Project Structure

```
arduino-simulator/
├── src/
│   ├── App.tsx          # Main application logic
│   ├── App.css          # Global styling (layout, colors)
│   ├── main.tsx         # Entry point (React rendering)
│   ├── types.d.ts       # Type definitions for Wokwi elements
│   └── vite-env.d.ts    # Vite environment types
├── index.html           # Main HTML template
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🧩 Core Architecture

The application is built as a Single Page Application (SPA) using **React 19** and **TypeScript**. It follows a component-based architecture where the `App` component serves as the central orchestrator, managing the state of the circuit and the simulation loop.

### key Components

1.  **Sidebar (`src/App.tsx`)**:
    -   Displays available components (`Arduino Uno`, `LED`, `Pushbutton`).
    -   Handles drag initiation (`onDragStart`) to allow users to place components on the canvas.

2.  **Canvas (`src/App.tsx`)**:
    -   Use `onDrop` and `onDragOver` to handle component placement.
    -   Manages component selection and movement.
    -   Renders the `WireLayer` (SVG overlay) to visualize connections.
    -   Contains the simulation controls (Start/Stop).

3.  **WireLayer (`src/App.tsx`)**:
    -   An SVG layer rendered *above* the canvas but *below* interactive components.
    -   Mathematically calculates Bezier curves (`path` elements) to connect component pins to the Arduino's digital pins.
    -   Updates in real-time as components are moved.

4.  **PropertiesPanel (`src/App.tsx`)**:
    -   Allows users to configure selected components (e.g., change the pin assignment of an LED).
    -   Provides options to delete components.

5.  **CodePanel (`src/App.tsx`)**:
    -   Displays the auto-generated Arduino C++ code based on the current circuit configuration.

## ⚙️ Simulation Logic

The simulation is event-driven but uses a **tick-based** loop for continuous updates when running.

### State Management (`App.tsx`)

-   **`components`**: Array of `CircuitComponent` objects. Each object stores:
    -   `id`: unique ID.
    -   `type`: 'arduino-uno', 'led', or 'pushbutton'.
    -   `position`: {x, y} coordinates on the canvas.
    -   `pin`: The digital pin (D2-D13) connected to the component.
-   **`pinValues`**: A dictionary mapping pin numbers (e.g., "12") to boolean states (`true` = HIGH/5V, `false` = LOW/0V). This drives the LED states.
-   **`buttonStates`**: Tracks which pushbuttons are currently being pressed by the user.

### The Simulation Loop

When the simulation is running (`isRunning === true`), a `useEffect` hook starts an interval timer (every 50ms):

1.  **Read Inputs**: Checks the state of all pushbuttons. If a button is pressed, its corresponding pin in `pinValues` is set to `true`.
2.  **Process Logic**:
    -   If a button is controlling an LED (simple logic implemented in `App.tsx`), the button's state is propagated to the LED's pin.
    -   Currently, the logic is hardcoded to: *"If button on Pin X is pressed, turn on LED on Pin Y"* (or variations depending on component count).
3.  **Update Outputs**: The new `pinValues` are written to state, causing React to re-render the LEDs with their new status (on/off).

## 📝 Code Generation

The `generateCode` function in `App.tsx` dynamically builds Arduino C++ code strings based on the `components` state.

-   **Setup Phase**:
    -   Iterates through components to define `const int pin...` variables.
    -   Generates `pinMode(..., OUTPUT)` for LEDs and `pinMode(..., INPUT)` for buttons in `void setup()`.
-   **Loop Phase**:
    -   Generates `digitalRead(...)` calls for buttons.
    -   Creates `if/else` logic to control LEDs based on button states.
    -   If only LEDs exist (no buttons), it generates a simple "Blink" sketch.

## 🎨 Styling & UI

-   **CSS Variables**: Used for consistent color theming (e.g., `--primary-color`, `--bg-color`).
-   **Grid Layout**: The main layout uses CSS Grid to position the Sidebar, Canvas, and Properties Panel.
-   **SVG Graphics**: Wires use SVG paths with markers (circles) at endpoints to simulate soldering points/connectors.
-   **Wokwi Elements**: Custom web components (`<wokwi-arduino-uno>`, `<wokwi-led>`, etc.) provide the realistic look of hardware parts.

## 🚀 Future Improvements

Potential areas for expansion:
-   **Advanced Logic**: Allow users to write custom JS/C++ code that actually executes in a browser-based AVR emulator (like `avr8js`).
-   **More Components**: Add resistors, potentioemeters, sensors (DHT11, etc.), and LCD screens.
-   **Breadboard View**: Add a breadboard component for more realistic wiring.
