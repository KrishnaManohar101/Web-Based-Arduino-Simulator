import React from 'react';
import { type CircuitComponent, type ComponentType } from './types';
import { renderGenericComponent } from './ComponentRenderer';

interface PropertiesPanelProps {
    component: CircuitComponent;
    usedPins: string[];
    onPinChange: (newPin: string) => void;
    onDelete: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    component,
    usedPins,
    onPinChange,
    onDelete
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

export default PropertiesPanel;
