import { Component, h, State } from '@stencil/core';
import { Theme, THEME_EVENT_NAME } from './types';

const DEFAULT: Theme = 'system-default';
const LIGHT: Theme = 'force-light';
const DARK: Theme = 'force-dark';
const CHECKBOX_LIGHT = false;
const CHECKBOX_DARK = true;
const LOCALSTORAGE_KEY = 'kompendium-theme';

/**
 * @private
 */
@Component({
    tag: 'kompendium-darkmode-switch',
    styleUrl: 'darkmode-switch.scss',
    shadow: true,
})
export class DarkmodeSwitch {
    @State()
    private theme: Theme = 'system-default';

    @State()
    private systemSettingIsDark: boolean;

    private checkbox: HTMLInputElement;
    private colorSchemeMediaQuery: MediaQueryList;

    constructor() {
        const colorSchemeMediaQueryFallback = {
            addEventListener: () => {},
            matches: false,
        } as unknown as MediaQueryList;

        this.colorSchemeMediaQuery =
            (window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)')) ||
            colorSchemeMediaQueryFallback;
    }

    public connectedCallback() {
        this.colorSchemeMediaQuery.addEventListener(
            'change',
            this.handleSystemThemeChange
        );
    }

    public disconnectedCallback() {
        this.colorSchemeMediaQuery.removeEventListener(
            'change',
            this.handleSystemThemeChange
        );
    }

    public componentWillLoad(): void {
        this.systemSettingIsDark = this.colorSchemeMediaQuery.matches;

        this.setTheme(
            (localStorage.getItem(LOCALSTORAGE_KEY) || DEFAULT) as Theme
        );
    }

    public render(): HTMLElement {
        const props = {
            checked:
                this.theme === DARK ||
                (this.theme === DEFAULT && this.systemSettingIsDark),
        };

        return (
            <div class="mode-toggle">
                <input
                    type="checkbox"
                    onChange={this.handleThemeChange}
                    ref={this.getSelectRef}
                    {...props}
                />
                <div class="mode-visualization">
                    <div class="circle"></div>
                    <div class="ray one"></div>
                    <div class="ray two"></div>
                    <div class="ray three"></div>
                    <div class="ray four"></div>
                </div>
            </div>
        );
    }

    private getSelectRef = (element: HTMLInputElement) => {
        this.checkbox = element;
    };

    private handleSystemThemeChange = (e: MediaQueryListEvent) => {
        this.systemSettingIsDark = !!e.matches;
        if (this.theme === DEFAULT) {
            this.checkbox.checked = !this.checkbox.checked;
        }
    };

    private handleThemeChange = () => {
        const checkboxValue = !!this.checkbox.checked;

        let newTheme: Theme = DEFAULT;

        if (this.systemSettingIsDark) {
            if (checkboxValue === CHECKBOX_LIGHT) {
                newTheme = LIGHT;
            }
        } else {
            if (checkboxValue === CHECKBOX_DARK) {
                newTheme = DARK;
            }
        }

        this.setTheme(newTheme);
        document.dispatchEvent(
            new CustomEvent<Theme>(THEME_EVENT_NAME, { detail: newTheme })
        );
    };

    private setTheme = (value: Theme) => {
        this.theme = value;
        document.querySelector('html').dataset.theme = value;
        localStorage.setItem(LOCALSTORAGE_KEY, value);
    };
}
