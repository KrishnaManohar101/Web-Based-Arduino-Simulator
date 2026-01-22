# Task 1 – Web-Based Interface & Component Handling

## ✅ Status: COMPLETE

## Objective
Design a web-based interface that allows users to visually create a simple Arduino experiment.

---

## Implementation Summary

### 1. Component Palette (Left Sidebar)
- Components: Arduino Uno, LED, Push Button
- Drag-and-drop enabled

### 2. Central Canvas (Working Area)
- Drag components from palette to canvas
- Reposition components within canvas
- Auto-wiring between components and Arduino

### 3. Toolbar (Code View Toggle)
- Toggle: "🔧 Circuit Only" ↔ "📝 Show Code"
- Code panel displays alongside circuit

### 4. Auto-Generated Arduino Code
- Pin definitions based on component assignments
- `setup()` with pinMode calls
- `loop()` with button-controlled LED logic

### 5. Start/Stop Simulation Buttons
- "▶ Start" - Begins simulation
- "■ Stop" - Stops simulation

### 6. Wokwi Elements Integration
- `<wokwi-arduino-uno />`
- `<wokwi-led />`
- `<wokwi-pushbutton />`

---

## How to Run
```bash
cd d:\projects\me\arduino-simulator
npm run dev
```
