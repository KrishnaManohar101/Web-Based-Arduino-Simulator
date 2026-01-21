import { useState, useRef, DragEvent } from 'react';
import '@wokwi/elements';
import './App.css';

type ComponentType = 'arduino-uno' | 'led' | 'pushbutton';

interface CircuitComponent {
  id: string;
  type: ComponentType;
  position: { x: number; y: number };
  pin?: string;
}

const COMPONENT_PALETTE: { type: ComponentType; label: string }[] = [
  { type: 'arduino-uno', label: 'Arduino Uno' },
  { type: 'led', label: 'LED' },
  { type: 'pushbutton', label: 'Push Button' },
];

const Sidebar = () => {
  const handleDragStart = (e: DragEvent, type: ComponentType) => {
    e.dataTransfer.setData('componentType', type);
  };

  return (
    <div className="sidebar">
      <h3>Components</h3>
      {COMPONENT_PALETTE.map((comp) => (
        <div
          key={comp.type}
          className="component-item"
          draggable
          onDragStart={(e) => handleDragStart(e, comp.type)}
        >
          {comp.label}
        </div>
      ))}
    </div>
  );
};

interface CanvasProps {
  components: CircuitComponent[];
  onDrop: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  updatePosition: (id: string, x: number, y: number) => void;
}

const Canvas = ({ components, onDrop, onDragOver }: CanvasProps) => (
  <div
    className="canvas"
    onDrop={onDrop}
    onDragOver={onDragOver}
    style={{ minHeight: '600px', width: '100%' }}
  >
    {components.length === 0 && <div className="placeholder-text">Drag components here</div>}
    {components.map((comp) => (
      <div
        key={comp.id}
        style={{
          position: 'absolute',
          left: comp.position.x,
          top: comp.position.y,
          cursor: 'move',
        }}
      >
        {comp.type === 'arduino-uno' && <wokwi-arduino-uno />}
        {comp.type === 'led' && <wokwi-led color="red" label={comp.pin ? `D${comp.pin}` : ''} />}
        {comp.type === 'pushbutton' && <wokwi-pushbutton color="red" label={comp.pin ? `D${comp.pin}` : ''} />}
      </div>
    ))}
  </div>
);

const CodePanel = ({ code }: { code: string }) => (
  <div className="code-panel">
    <h3>Arduino Code</h3>
    <textarea readOnly className="code-editor" value={code} />
  </div>
);

function App() {
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState('// Auto-generated Arduino Code\nvoid setup() {\n}');
  const [components, setComponents] = useState<CircuitComponent[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType') as ComponentType;
    if (!type) return;

    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const newComponent: CircuitComponent = {
      id: crypto.randomUUID(),
      type,
      position: { x, y }
    };

    setComponents((prev) => [...prev, newComponent]);
  };

  return (
    <div id="root">
      <header className="header">
        <h2>Arduino Simulator</h2>
        <div className="toolbar">
          <button onClick={() => console.log('Start Log')}>Start</button>
          <button onClick={() => console.log('Stop Log')}>Stop</button>
          <button onClick={() => setShowCode(!showCode)}>
            {showCode ? 'Hide Code' : 'Show Code'}
          </button>
        </div>
      </header>
      <div className="layout">
        <Sidebar />
        <Canvas
          components={components}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          updatePosition={() => { }}
        />
        {showCode && <CodePanel code={code} />}
      </div>
    </div>
  );
}

export default App;
