import { GlobalStateDispatch } from "../hooks/useGlobalState";
import { CURVE_FAMILY_NAMES, CurveFamilyKey, GlobalState } from "../model/backend";

interface CurveFamilyToggleProps {
    readonly globalState: GlobalState;
    readonly dispatch: GlobalStateDispatch;
}

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
                <label>
                    <input type='checkbox' checked={checked} onChange={e => action(e.target.checked)}/>
                    {name}
                </label>
            </li>
        );
    });

    return (
        <ul>
            {listItems}
        </ul>
    )
}
