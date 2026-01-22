/// <reference types="vite/client" />

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'wokwi-arduino-uno': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'wokwi-led': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { color?: string; label?: string; value?: boolean }, HTMLElement>;
            'wokwi-pushbutton': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { color?: string; label?: string }, HTMLElement>;
            'wokwi-resistor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { value?: string }, HTMLElement>;
        }
    }
}
