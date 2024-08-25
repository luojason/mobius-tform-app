import { GlobalStateDispatch } from "../hooks/useGlobalState";
import { GlobalState } from "../model/backend";
import { ControlPointDisplay } from "./ControlPointDisplay";
import { CurveFamilyToggle } from "./CurveFamilyToggle";
import { ErrorDisplay } from "./ErrorDisplay";
import styles from "./sidebar.module.css";

interface SidebarProps {
    readonly globalState: GlobalState;
    readonly dispatch: GlobalStateDispatch;
}

export function Sidebar({ globalState, dispatch }: SidebarProps) {
    return (
        <div className={styles.sidebar}>
            <h2>Curve Families</h2>
            <CurveFamilyToggle globalState={globalState} dispatch={dispatch} />
            <h2>Control Point Mappings</h2>
            <ControlPointDisplay mapping={globalState.points.val1} />
            <ControlPointDisplay mapping={globalState.points.val2} />
            <ControlPointDisplay mapping={globalState.points.val3} />
            {(globalState.exists) ? null : <ErrorDisplay />}
        </div>
    )
}
