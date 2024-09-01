import { CheckBox } from "../components/CheckBox";
import { GlobalStateDispatch } from "../hooks/useGlobalState";
import { CURVE_FAMILY_NAMES, CurveFamilyKey, GlobalState } from "../model/backend";
import styles from "./sidebar.module.css";

interface CurveFamilyToggleProps {
    readonly globalState: GlobalState;
    readonly dispatch: GlobalStateDispatch;
}

/** Creates list of curve families that can be toggled on and off in the GraphCanvas. */
export function CurveFamilyToggle({ globalState, dispatch }: CurveFamilyToggleProps) {
    const listItems = Object.entries(CURVE_FAMILY_NAMES).map(([key, name]) => {
        const checked = globalState.curves[key as CurveFamilyKey] !== undefined;
        const action = (value: boolean) => dispatch({
            type: 'toggle-curves',
            key: key as CurveFamilyKey,
            value: value
        })
        return (
            <li key={key}>
                <label className={styles.curveToggle}>
                    <CheckBox checked={checked} onChange={action} />
                    {name}
                </label>
            </li>
        );
    });

    return (
        <ul className={styles.curveToggleContainer}>
            {listItems}
        </ul>
    )
}
