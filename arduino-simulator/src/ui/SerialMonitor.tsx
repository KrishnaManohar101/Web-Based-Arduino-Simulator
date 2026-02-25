import React from 'react';

interface SerialMonitorProps {
    output: string[];
    onClose: () => void;
}

const SerialMonitor: React.FC<SerialMonitorProps> = ({ output, onClose }) => {
    return (
        <div className="serial-monitor">
            <div className="serial-header">
                <h3>Serial Monitor</h3>
                <button onClick={onClose} className="close-btn">×</button>
            </div>
            <div className="serial-content">
                {output.map((line, i) => (
                    <div key={i} className="serial-line">
                        {line}
                    </div>
                ))}
                {output.length === 0 && <div className="serial-line" style={{ opacity: 0.5 }}>Waiting for data...</div>}
            </div>
        </div>
    );
};

export default SerialMonitor;
