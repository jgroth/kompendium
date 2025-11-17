/**
 * Simulates Stencil auto-generated types that should be EXCLUDED
 * These would normally be in components.d.ts
 */

// Component prop interface - should be excluded (Components namespace)
export interface LimelButton {
    text: string;
    disabled?: boolean;
}

// HTML element interface - should be excluded (HTML*Element pattern)
export interface HTMLLimelButtonElement extends HTMLElement {
    text: string;
    disabled?: boolean;
}

// CustomEvent wrapper - should be excluded (*CustomEvent pattern)
export interface LimelButtonChangeCustomEvent extends CustomEvent<string> {
    detail: string;
}

// Regular interface that SHOULD be included
export interface ButtonConfig {
    variant: 'primary' | 'secondary';
    size: 'small' | 'large';
}
