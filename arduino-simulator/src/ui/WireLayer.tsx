import React from 'react';
import { type CircuitComponent, ARDUINO_PIN_OFFSETS, MPU6050_PIN_OFFSETS, SSD1306_PIN_OFFSETS, LED_PIN_OFFSETS, BUTTON_PIN_OFFSETS, LCD1602_PIN_OFFSETS, HCSR04_PIN_OFFSETS, SERVO_PIN_OFFSETS, PIR_PIN_OFFSETS, TILT_PIN_OFFSETS, HEARTBEAT_PIN_OFFSETS, FLAME_PIN_OFFSETS, NTC_PIN_OFFSETS, POT_PIN_OFFSETS, SLIDEPOT_PIN_OFFSETS, PHOTO_PIN_OFFSETS, GAS_PIN_OFFSETS, BUZZER_PIN_OFFSETS, RGBLED_PIN_OFFSETS, NEOPIXEL_PIN_OFFSETS, DHT22_PIN_OFFSETS, IR_PIN_OFFSETS, KY040_PIN_OFFSETS, JOYSTICK_PIN_OFFSETS, DS1307_PIN_OFFSETS } from './types';

interface WireLayerProps {
    components: CircuitComponent[];
    arduinoPosition: { x: number; y: number } | null;
}

const WireLayer: React.FC<WireLayerProps> = ({
    components,
    arduinoPosition,
}) => {
    if (!arduinoPosition) return null;

    const wires: Array<{
        id: string;
        path: string;
        color: string;
        label: string;
        labelPos: { x: number; y: number };
    }> = [];

    const addWire = (compId: string, pinName: string, fromX: number, fromY: number, toX: number, toY: number, color: string, label: string) => {
        wires.push({
            id: `${compId}-${pinName}`,
            path: `M ${fromX} ${fromY} C ${fromX} ${(fromY + toY) / 2}, ${toX} ${(fromY + toY) / 2}, ${toX} ${toY}`,
            color, label,
            labelPos: { x: (fromX + toX) / 2, y: (fromY + toY) / 2 }
        });
    };

    const addVccWire = (comp: CircuitComponent, pinOff: { x: number, y: number }, compId: string) => {
        const cx = comp.position.x + pinOff.x, cy = comp.position.y + pinOff.y;
        const a = ARDUINO_PIN_OFFSETS['5V'];
        addWire(compId, 'vcc', arduinoPosition.x + a.x, arduinoPosition.y + a.y, cx, cy, '#ff4444', '5V');
    };

    const addGndWire = (comp: CircuitComponent, pinOff: { x: number, y: number }, compId: string) => {
        const cx = comp.position.x + pinOff.x, cy = comp.position.y + pinOff.y;
        const a = ARDUINO_PIN_OFFSETS['GND1'];
        addWire(compId, 'gnd', arduinoPosition.x + a.x, arduinoPosition.y + a.y, cx, cy, '#333333', 'GND');
    };

    const addSignalWire = (comp: CircuitComponent, pinOff: { x: number, y: number }, compId: string, pin: string, color: string, label: string) => {
        const pOff = ARDUINO_PIN_OFFSETS[pin];
        if (!pOff) return;
        const cx = comp.position.x + pinOff.x, cy = comp.position.y + pinOff.y;
        addWire(compId, label.toLowerCase(), arduinoPosition.x + pOff.x, arduinoPosition.y + pOff.y, cx, cy, color, label);
    };

    const WIRED_TYPES = ['mpu6050', 'ssd1306', 'lcd1602', 'hc-sr04', 'servo',
        'pir-motion-sensor', 'tilt-switch', 'heart-beat-sensor', 'flame-sensor', 'ntc-temperature-sensor',
        'potentiometer', 'slide-potentiometer', 'photoresistor-sensor', 'gas-sensor',
        'buzzer', 'rgb-led', 'neopixel', 'dht22', 'ir-receiver', 'ky-040', 'analog-joystick', 'ds1307'];

    components
        .filter(c => c.type !== 'arduino-uno' && (c.pin || WIRED_TYPES.includes(c.type)))
        .forEach(comp => {
            // Logic for each component type (identical to App.tsx logic)
            if (comp.type === 'pir-motion-sensor') {
                addVccWire(comp, PIR_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, PIR_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, PIR_PIN_OFFSETS.OUT, comp.id, comp.pin || '7', '#4ecdc4', `OUT(D${comp.pin || '7'})`);
                return;
            }
            // ... (truncating for brevity, but I should include all derived from my previous read of App.tsx)
            // I'll include the ones from my previous view_file of App.tsx
            if (comp.type === 'tilt-switch') {
                addVccWire(comp, TILT_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, TILT_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, TILT_PIN_OFFSETS.OUT, comp.id, comp.pin || '4', '#4ecdc4', `OUT(D${comp.pin || '4'})`);
                return;
            }
            if (comp.type === 'heart-beat-sensor') {
                addVccWire(comp, HEARTBEAT_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, HEARTBEAT_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, HEARTBEAT_PIN_OFFSETS.OUT, comp.id, comp.pin || '3', '#ff6b6b', `OUT(D${comp.pin || '3'})`);
                return;
            }
            if (comp.type === 'flame-sensor') {
                addVccWire(comp, FLAME_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, FLAME_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, FLAME_PIN_OFFSETS.AOUT, comp.id, comp.pin || 'A1', '#FF9800', `AO(${comp.pin || 'A1'})`);
                return;
            }
            if (comp.type === 'ntc-temperature-sensor') {
                addVccWire(comp, NTC_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, NTC_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, NTC_PIN_OFFSETS.OUT, comp.id, comp.pin || 'A2', '#FF9800', `OUT(${comp.pin || 'A2'})`);
                return;
            }
            if (comp.type === 'potentiometer') {
                addVccWire(comp, POT_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, POT_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, POT_PIN_OFFSETS.SIG, comp.id, comp.pin || 'A0', '#FF9800', `SIG(${comp.pin || 'A0'})`);
                return;
            }
            if (comp.type === 'slide-potentiometer') {
                addVccWire(comp, SLIDEPOT_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, SLIDEPOT_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, SLIDEPOT_PIN_OFFSETS.SIG, comp.id, comp.pin || 'A1', '#FF9800', `SIG(${comp.pin || 'A1'})`);
                return;
            }
            if (comp.type === 'photoresistor-sensor') {
                addVccWire(comp, PHOTO_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, PHOTO_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, PHOTO_PIN_OFFSETS.AO, comp.id, comp.pin || 'A3', '#FF9800', `AO(${comp.pin || 'A3'})`);
                return;
            }
            if (comp.type === 'gas-sensor') {
                addVccWire(comp, GAS_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, GAS_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, GAS_PIN_OFFSETS.AOUT, comp.id, comp.pin || 'A0', '#FF9800', `AO(${comp.pin || 'A0'})`);
                return;
            }
            if (comp.type === 'buzzer') {
                const bPin = comp.pin || '8';
                const pOff = ARDUINO_PIN_OFFSETS[bPin];
                if (pOff) {
                    addWire(comp.id, 'sig', arduinoPosition.x + pOff.x, arduinoPosition.y + pOff.y,
                        comp.position.x + BUZZER_PIN_OFFSETS.P1.x, comp.position.y + BUZZER_PIN_OFFSETS.P1.y,
                        '#9b59b6', `D${bPin}`);
                }
                const gOff = ARDUINO_PIN_OFFSETS['GND1'];
                addWire(comp.id, 'gnd', arduinoPosition.x + gOff.x, arduinoPosition.y + gOff.y,
                    comp.position.x + BUZZER_PIN_OFFSETS.P2.x, comp.position.y + BUZZER_PIN_OFFSETS.P2.y,
                    '#333333', 'GND');
                return;
            }
            if (comp.type === 'rgb-led') {
                addGndWire(comp, RGBLED_PIN_OFFSETS.COM, comp.id);
                addSignalWire(comp, RGBLED_PIN_OFFSETS.R, comp.id, comp.pin || '3', '#ff4444', `R(D${comp.pin || '3'})`);
                addSignalWire(comp, RGBLED_PIN_OFFSETS.G, comp.id, '5', '#22c55e', 'G(D5)');
                addSignalWire(comp, RGBLED_PIN_OFFSETS.B, comp.id, '6', '#3b82f6', 'B(D6)');
                return;
            }
            if (comp.type === 'neopixel') {
                addVccWire(comp, NEOPIXEL_PIN_OFFSETS.VDD, comp.id);
                addGndWire(comp, NEOPIXEL_PIN_OFFSETS.VSS, comp.id);
                addSignalWire(comp, NEOPIXEL_PIN_OFFSETS.DIN, comp.id, comp.pin || '5', '#9b59b6', `DIN(D${comp.pin || '5'})`);
                return;
            }
            if (comp.type === 'dht22') {
                addVccWire(comp, DHT22_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, DHT22_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, DHT22_PIN_OFFSETS.SDA, comp.id, comp.pin || '2', '#4ecdc4', `DATA(D${comp.pin || '2'})`);
                return;
            }
            if (comp.type === 'ir-receiver') {
                addVccWire(comp, IR_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, IR_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, IR_PIN_OFFSETS.DAT, comp.id, comp.pin || '11', '#9b59b6', `DAT(D${comp.pin || '11'})`);
                return;
            }
            if (comp.type === 'ky-040') {
                addVccWire(comp, KY040_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, KY040_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, KY040_PIN_OFFSETS.CLK, comp.id, comp.pin || '2', '#2196F3', `CLK(D${comp.pin || '2'})`);
                addSignalWire(comp, KY040_PIN_OFFSETS.DT, comp.id, '3', '#FF9800', 'DT(D3)');
                addSignalWire(comp, KY040_PIN_OFFSETS.SW, comp.id, '4', '#4ecdc4', 'SW(D4)');
                return;
            }
            if (comp.type === 'analog-joystick') {
                addVccWire(comp, JOYSTICK_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, JOYSTICK_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, JOYSTICK_PIN_OFFSETS.VERT, comp.id, 'A0', '#FF9800', 'VERT(A0)');
                addSignalWire(comp, JOYSTICK_PIN_OFFSETS.HORZ, comp.id, 'A1', '#2196F3', 'HORZ(A1)');
                addSignalWire(comp, JOYSTICK_PIN_OFFSETS.SEL, comp.id, comp.pin || '4', '#4ecdc4', `SEL(D${comp.pin || '4'})`);
                return;
            }
            if (comp.type === 'ds1307') {
                addGndWire(comp, DS1307_PIN_OFFSETS.GND, comp.id);
                addVccWire(comp, DS1307_PIN_OFFSETS.V5, comp.id);
                addSignalWire(comp, DS1307_PIN_OFFSETS.SDA, comp.id, 'A4', '#2196F3', 'SDA(A4)');
                addSignalWire(comp, DS1307_PIN_OFFSETS.SCL, comp.id, 'A5', '#FF9800', 'SCL(A5)');
                return;
            }
            if (comp.type === 'servo') {
                addVccWire(comp, SERVO_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, SERVO_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, SERVO_PIN_OFFSETS.PWM, comp.id, comp.pin || '9', '#FF9800', `PWM(D${comp.pin || '9'})`);
                return;
            }
            if (comp.type === 'hc-sr04') {
                addVccWire(comp, HCSR04_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, HCSR04_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, HCSR04_PIN_OFFSETS.TRIG, comp.id, comp.pin || '9', '#2196F3', `TRIG(D${comp.pin || '9'})`);
                const echoPin = comp.pin ? String(parseInt(comp.pin) + 1) : '10';
                addSignalWire(comp, HCSR04_PIN_OFFSETS.ECHO, comp.id, echoPin, '#FF9800', `ECHO(D${echoPin})`);
                return;
            }
            if (comp.type === 'lcd1602') {
                addVccWire(comp, LCD1602_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, LCD1602_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, LCD1602_PIN_OFFSETS.SDA, comp.id, 'A4', '#4CAF50', 'SDA(A4)');
                addSignalWire(comp, LCD1602_PIN_OFFSETS.SCL, comp.id, 'A5', '#FFeb3b', 'SCL(A5)');
                return;
            }
            if (comp.type === 'ssd1306') {
                addVccWire(comp, SSD1306_PIN_OFFSETS.VCC, comp.id);
                addGndWire(comp, SSD1306_PIN_OFFSETS.GND, comp.id);
                addSignalWire(comp, SSD1306_PIN_OFFSETS.SDA, comp.id, 'A4', '#4CAF50', 'SDA(A4)');
                addSignalWire(comp, SSD1306_PIN_OFFSETS.SCL, comp.id, 'A5', '#FFeb3b', 'SCL(A5)');
                return;
            }

            // Default LED/Button wiring
            if (comp.pin) {
                const pOff = ARDUINO_PIN_OFFSETS[comp.pin];
                if (!pOff) return;

                if (comp.type === 'led') {
                    addSignalWire(comp, LED_PIN_OFFSETS.anode, comp.id, comp.pin, '#ff6b6b', `D${comp.pin}`);
                    addGndWire(comp, LED_PIN_OFFSETS.cathode, comp.id);
                } else if (comp.type === 'pushbutton') {
                    addSignalWire(comp, BUTTON_PIN_OFFSETS.signal1, comp.id, comp.pin, '#4ecdc4', `D${comp.pin}`);
                    addGndWire(comp, BUTTON_PIN_OFFSETS.gnd1, comp.id);
                }
            }
        });

    return (
        <svg className="wire-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
                <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4">
                    <circle cx="5" cy="5" r="4" fill="currentColor" />
                </marker>
            </defs>
            {wires.map(wire => (
                <g key={wire.id}>
                    <path
                        d={wire.path}
                        fill="none"
                        stroke={wire.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        markerEnd="url(#dot)"
                        markerStart="url(#dot)"
                        className="wire"
                    />
                    <text
                        x={wire.labelPos.x}
                        y={wire.labelPos.y - 10}
                        textAnchor="middle"
                        fill={wire.color}
                        fontSize="10"
                        fontWeight="600"
                        style={{ filter: 'drop-shadow(0 0 2px white)' }}
                    >
                        {wire.label}
                    </text>
                </g>
            ))}
        </svg>
    );
};

export default WireLayer;
