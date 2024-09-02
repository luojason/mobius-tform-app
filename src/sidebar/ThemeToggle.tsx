import { useContext } from "react";
import { DEFAULT_THEME, ThemeContext, ThemeSetterContext } from "../theme/schema";

/**
 * Toggle switch for the theme.
 * Unchecked refers to the default theme, checked gives the alternate theme.
 */
export function ThemeToggle() {
    const theme = useContext(ThemeContext);
    const dispatch = useContext(ThemeSetterContext);

    const checked = theme.id === DEFAULT_THEME ? false : true;
    function onChange(v: boolean) {
        if (v) {
            dispatch({
                type: 'set-theme',
                theme: 'light'
            });
        } else {
            dispatch({
                type: 'set-theme',
                theme: 'dark'
            })
        }
    }

    return (
        <div>
            <label>
                <input type='checkbox' checked={checked} onChange={e => onChange(e.target.checked)} />
                {"Light/dark mode"}
            </label>
        </div>
    );
}