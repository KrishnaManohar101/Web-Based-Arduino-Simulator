import { useState, useEffect, useRef, type DragEvent } from 'react';
import '@wokwi/elements';
import './App.css';

type ComponentType = 'arduino-uno' | 'led' | 'pushbutton';

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
  const handleDragStart = (e: DragEvent, type: ComponentType) => {
    e.dataTransfer.setData('source', 'sidebar');
    e.dataTransfer.setData('componentType', type);
  };

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
      default:
        return null;
    }
  };

  return (
    <div className="sidebar">
      <h3>COMPONENTS</h3>
      <div className="component-list">
        {COMPONENT_PALETTE.map((comp) => (
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
      case 'arduino-uno': return 'Arduino Uno';
      case 'led': return 'LED';
      case 'pushbutton': return 'Push Button';
      default: return type;
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
    .filter(c => c.type !== 'arduino-uno' && c.pin)
    .forEach(comp => {
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

  if (leds.length === 0 && buttons.length === 0) {
    return `// Arduino Simulator
// =====================
// Add components to generate code
//
// Default Pin Mapping:
// - LED → Digital Pin 10
// - Push Button → Digital Pin 2`;
  }

  let code = `// Auto-generated Arduino Code
// ===========================

`;

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
  leds.forEach((_, i) => {
    code += `  pinMode(ledPin${i > 0 ? i + 1 : ''}, OUTPUT);\n`;
  });
  buttons.forEach((_, i) => {
    code += `  pinMode(buttonPin${i > 0 ? i + 1 : ''}, INPUT);\n`;
  });
  code += `}\n\n`;

  // Loop function
  code += `void loop() {\n`;
  if (buttons.length > 0 && leds.length > 0) {
    code += `  // Read button state\n`;
    code += `  int buttonState = digitalRead(buttonPin);\n\n`;
    code += `  // Control LED based on button\n`;
    code += `  if (buttonState == HIGH) {\n`;
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

function App() {
  const [showCode, setShowCode] = useState(true);
  const [components, setComponents] = useState<CircuitComponent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Simulation State
  const [pinValues, setPinValues] = useState<Record<string, boolean>>({});
  const [buttonStates, setButtonStates] = useState<Record<string, boolean>>({});

  const code = generateCode(components);

  useEffect(() => {
    if (!isRunning) {
      setPinValues({});
      return;
    }

    const interval = setInterval(() => {
      const newPinValues: Record<string, boolean> = {};

      const buttons = components.filter(c => c.type === 'pushbutton' && c.pin);
      const leds = components.filter(c => c.type === 'led' && c.pin);

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
