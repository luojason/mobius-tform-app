import { GlobalStateDispatch } from "../hooks/useGlobalState";
import { GlobalState } from "../model/backend";
import { ControlPointDisplay } from "./ControlPointDisplay";
import { CurveFamilyToggle } from "./CurveFamilyToggle";
import { AlertDisplay } from "../components/AlertDisplay";
import styles from "./sidebar.module.css";

interface SidebarProps {
    readonly globalState: GlobalState;
    readonly dispatch: GlobalStateDispatch;
}

/** The sidebar contains most of the non-GraphCanvas UI controls. */
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

/** Custom error message when Mobius transformation does not exist. */
function ErrorDisplay() {
    return (
        <AlertDisplay>
            <strong>Warning. </strong>
            Transformation matrix is nearly singular.
            Mobius transformations are one-to-one mappings,
            and do not exist/behave well when two inputs map to the same (or nearly the same) output.
            Move some of the control points farther away from each other to correct this.
        </AlertDisplay>
    )
}
