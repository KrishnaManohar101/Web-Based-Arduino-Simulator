/// <reference types="vite/client" />

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'wokwi-arduino-uno': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-led': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { color?: string; label?: string; value?: boolean }, HTMLElement>;
            'wokwi-pushbutton': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { color?: string; label?: string }, HTMLElement>;
            'wokwi-resistor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { value?: string }, HTMLElement>;
            'wokwi-mpu6050': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-ssd1306': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

            // Microcontrollers
            'wokwi-arduino-mega': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-arduino-nano': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-esp32-devkit-v1': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-pi-pico': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-franzininho': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-nano-rp2040-connect': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

            // Sensors & Inputs
            'wokwi-dht22': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-hc-sr04': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-potentiometer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-slide-potentiometer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-slide-switch': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-dip-switch-8': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-membrane-keypad': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-ky-040': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-photoresistor-sensor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-pir-motion-sensor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-gas-sensor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-ntc-temperature-sensor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-heart-beat-sensor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-tilt-switch': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-ir-receiver': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-ir-remote': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-analog-joystick': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-rotary-dialer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

            // Outputs
            'wokwi-7segment': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-lcd1602': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-lcd2004': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-neopixel': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-neopixel-matrix': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-servo': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-buzzer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-neopixel-ring': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-led-bar-graph': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-stepper-motor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-biaxial-stepper': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-ili9341': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

            // Helpers
            'wokwi-capacitor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { value?: string }, HTMLElement>;
            'wokwi-ks2e-m-dc5': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-logic-analyzer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}
