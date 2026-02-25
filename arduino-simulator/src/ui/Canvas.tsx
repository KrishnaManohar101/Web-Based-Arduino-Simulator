import React, { type DragEvent } from 'react';
import { type CircuitComponent, type ComponentType } from './types';
import { renderGenericComponent } from './ComponentRenderer';

export interface CanvasProps {
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
    children?: React.ReactNode; // For WireLayer
}

const Canvas: React.FC<CanvasProps> = ({
    components,
    onDrop,
    onDragOver,
    onSimulationToggle,
    isRunning,
    onSelect,
    selectedId,
    pinValues,
    onButtonPress,
    onPositionUpdate,
    children
}) => {
    const handleDragStart = (e: DragEvent, id: string) => {
        e.dataTransfer.setData('source', 'canvas');
        e.dataTransfer.setData('componentId', id);
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        e.dataTransfer.setData('offsetX', (e.clientX - rect.left).toString());
        e.dataTransfer.setData('offsetY', (e.clientY - rect.top).toString());
    };

    const handleLocalDrop = (e: DragEvent) => {
        if (e.dataTransfer.getData('source') === 'canvas') {
            e.preventDefault();
            const id = e.dataTransfer.getData('componentId');
            const offsetX = parseFloat(e.dataTransfer.getData('offsetX'));
            const offsetY = parseFloat(e.dataTransfer.getData('offsetY'));
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = e.clientX - rect.left - offsetX;
            const y = e.clientY - rect.top - offsetY;
            onPositionUpdate(id, x, y);
        }
    };

    return (
        <div
            className="canvas"
            onDrop={(e) => {
                if (e.dataTransfer.getData('source') === 'canvas') {
                    handleLocalDrop(e);
                } else {
                    onDrop(e);
                }
            }}
            onDragOver={onDragOver}
            onClick={() => onSelect(null)}
        >
            <div className="canvas-controls">
                <button
                    className={`sim-btn ${isRunning ? 'stop-btn' : 'start-btn'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSimulationToggle(!isRunning);
                    }}
                >
                    {isRunning ? 'Stop Simulation' : 'Start Simulation'}
                </button>
                {isRunning && <div className="sim-status">Simulation Running...</div>}
            </div>

            <div className="canvas-content">
                {children}
                {components.map((comp) => (
                    <div
                        key={comp.id}
                        className={`canvas-component ${selectedId === comp.id ? 'selected' : ''}`}
                        style={{
                            position: 'absolute',
                            left: comp.position.x,
                            top: comp.position.y,
                            zIndex: comp.type === 'arduino-uno' ? 1 : 10,
                        }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, comp.id)}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(comp.id);
                        }}
                    >
                        {comp.type === 'arduino-uno' ? (
                            // @ts-ignore
                            <wokwi-arduino-uno />
                        ) : comp.type === 'led' ? (
                            <div className="led-wrapper">
                                {/* @ts-ignore */}
                                <wokwi-led color="red" value={pinValues[comp.pin || '']} label={comp.pin ? `D${comp.pin}` : ''} />
                                {pinValues[comp.pin || ''] && <div className="led-glow" />}
                            </div>
                        ) : comp.type === 'pushbutton' ? (
                            <div
                                className="button-wrapper interactive"
                                onMouseDown={() => onButtonPress(comp.id, true)}
                                onMouseUp={() => onButtonPress(comp.id, false)}
                                onMouseLeave={() => onButtonPress(comp.id, false)}
                            >
                                {/* @ts-ignore */}
                                <wokwi-pushbutton color="red" label={comp.pin ? `D${comp.pin}` : ''} />
                                <div className="button-hint">Click & Hold</div>
                            </div>
                        ) : (
                            renderGenericComponent(comp.type)
                        )}
                    </div>
                ))}

                {components.length === 0 && (
                    <div className="placeholder-text">
                        <span className="placeholder-icon">🔌</span>
                        <span>Canvas is empty. Drag components here!</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Canvas;
