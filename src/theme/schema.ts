/**
 * This module defines the schema used to represent the theme of the UI.
 * It defines what properties are available in the theme object.
 * These properties are also accessible via CSS variables per the mapping defined in 
 */

import { createContext } from "react";
import darkTheme from "./themes/dark.json";
import lightTheme from "./themes/light.json";

export const DEFAULT_THEME = 'dark';

/** Defines the mapping between theme properties and CSS variable names. */
export const THEME_CSS_VAR_MAPPING = {
    /* primary background color */
    background: '--background',
    /* secondary background color (e.g. for nested elements) */
    background2: '--background-2',
    /* tertiary background color (e.g. for nested elements) */
    background3: '--background-3',
    /* primary foreground color (e.g. for text) */
    foreground: '--foreground',
    /* secondary foreground color */
    foreground2: '--foreground-2',
    /* alternative background color for elements requiring attention (e.g. errors) */
    alertBackground: '--alert-background',
    /* alternative text/foreground color for elements requiring attention (e.g. errors) */
    alertColor: '--alert-color',
} as const;

/** Defines the properties available on a Theme. */
export type ThemeKey = keyof typeof THEME_CSS_VAR_MAPPING;

/** A Theme contains various properties that can be used to style a component's appearance. */
type ThemeProps = Record<ThemeKey, string>;

export interface Theme {
    readonly id: string;
    readonly props: ThemeProps;
}

/** Assigns names to the available themes */
const THEME_TABLE: Record<string, ThemeProps> = {
    dark: darkTheme,
    light: lightTheme,
} as const;

/**
 * Looks up a theme by id.
 * @param id The unique identifier for the theme.
 * @returns The theme if it exists, otherwise null.
 */
export function lookupTheme(id: string): Theme | null {
    const themeProps = THEME_TABLE[id];
    if (!themeProps) {
        // theme could not be found
        return null;
    }
    return {
        id: id,
        props: themeProps,
    };
}

/** Interface for setting the theme. */
export interface ThemeDispatchAction {
    type: 'set-theme';
    theme: string;
}

/** Context to be consumed by downstream components providing the Theme. */
// Initial value provided here is dummy value to make typescript compile, actual initial value is set in ThemeProvider.
export const ThemeContext = createContext<Theme>({
    id: 'dummyTheme',
    props: darkTheme,
});

/** Context to be consumed by downstream components providing the ability to set the Theme. */
// Dummy initial value provided as with ThemeContext.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ThemeSetterContext = createContext<React.Dispatch<ThemeDispatchAction>>((_) => { });

/**
 * Sets all theme-related CSS variables to match the provided theme.
 * @param theme Contains the values to synchronize the CSS variables with.
 */
export function syncCSSWithTheme(theme: Theme) {
    const root = document.querySelector(':root') as HTMLElement;
    if (!root) {
        console.error('could not locate :root element when updating CSS theme variables');
        return;
    }

    for (const [key, cssVar] of Object.entries(THEME_CSS_VAR_MAPPING)) {
        root.style.setProperty(cssVar, theme.props[key as ThemeKey]);
    }
}
