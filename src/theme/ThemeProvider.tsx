import { useEffect, useReducer } from "react";
import * as T from "./schema";


interface ThemeProviderProps {
    readonly initial: T.Theme;
}

export function ThemeProvider({ initial, children }: React.PropsWithChildren<ThemeProviderProps>) {
    const [theme, themeDispatch] = useReducer(themeReducer, initial);

    // Keep CSS variables in sync with react theme
    useEffect(() => {
        T.syncCSSWithTheme(theme);
    }, [theme]);

    return (
        <T.ThemeContext.Provider value={theme}>
            <T.ThemeSetterContext.Provider value={themeDispatch}>
                {children}
            </T.ThemeSetterContext.Provider>
        </T.ThemeContext.Provider>
    );
}

function themeReducer(theme: T.Theme, action: T.ThemeDispatchAction): T.Theme {
    switch (action.type) {
        case 'set-theme': {
            const newTheme = T.lookupTheme(action.theme);
            if (newTheme === null) {
                // theme could not be found in lookup table, keep current theme
                console.error(`theme '${action.theme}' not found in list of defined themes`);
                return theme;
            } else {
                return newTheme;
            }
        }
    }
}
