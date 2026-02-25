import React from 'react';
import { type ComponentType } from './types';

export const renderGenericComponent = (type: ComponentType) => {
    switch (type) {
        // Microcontrollers
        case 'arduino-mega': return <wokwi-arduino-mega />;
        case 'arduino-nano': return <wokwi-arduino-nano />;
        case 'esp32-devkit-v1': return <wokwi-esp32-devkit-v1 />;
        case 'pi-pico': return <wokwi-pi-pico />;
        case 'franzininho': return <wokwi-franzininho />;
        case 'nano-rp2040-connect': return <wokwi-nano-rp2040-connect />;
        // Sensors & Input
        case 'dht22': return <wokwi-dht22 />;
        case 'hc-sr04': return <wokwi-hc-sr04 />;
        case 'potentiometer': return <wokwi-potentiometer />;
        case 'slide-potentiometer': return <wokwi-slide-potentiometer />;
        case 'slide-switch': return <wokwi-slide-switch />;
        case 'dip-switch-8': return <wokwi-dip-switch-8 />;
        case 'membrane-keypad': return <wokwi-membrane-keypad />;
        case 'ky-040': return <wokwi-ky-040 />;
        case 'photoresistor-sensor': return <wokwi-photoresistor-sensor />;
        case 'pir-motion-sensor': return <wokwi-pir-motion-sensor />;
        case 'gas-sensor': return <wokwi-gas-sensor />;
        case 'ntc-temperature-sensor': return <wokwi-ntc-temperature-sensor />;
        case 'heart-beat-sensor': return <wokwi-heart-beat-sensor />;
        case 'tilt-switch': return <wokwi-tilt-switch />;
        case 'ir-receiver': return <wokwi-ir-receiver />;
        case 'ir-remote': return <wokwi-ir-remote />;
        case 'analog-joystick': return <wokwi-analog-joystick />;
        case 'rotary-dialer': return <wokwi-rotary-dialer />;
        // Outputs
        case '7segment': return <wokwi-7segment />;
        case 'lcd1602': return <wokwi-lcd1602 />;
        case 'lcd2004': return <wokwi-lcd2004 />;
        case 'neopixel': return <wokwi-neopixel />;
        case 'neopixel-matrix': return <wokwi-neopixel-matrix />;
        case 'servo': return <wokwi-servo />;
        case 'buzzer': return <wokwi-buzzer />;
        case 'led-ring': return <wokwi-neopixel-ring />;
        case 'led-bar-graph': return <wokwi-led-bar-graph />;
        case 'stepper-motor': return <wokwi-stepper-motor />;
        case 'biaxial-stepper': return <wokwi-biaxial-stepper />;
        case 'ili9341': return <wokwi-ili9341 />;
        // Helpers
        case 'resistor': return <wokwi-resistor />;
        case 'capacitor': return <wokwi-capacitor />;
        case 'relay-module': return <wokwi-ks2e-m-dc5 />;
        case 'logic-analyzer': return <wokwi-logic-analyzer />;
        default: return null;
    }
};
