import React, { useState, type DragEvent } from 'react';
import { type ComponentType, COMPONENT_PALETTE } from './types';
import { renderGenericComponent } from './ComponentRenderer';

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

export default Sidebar;
