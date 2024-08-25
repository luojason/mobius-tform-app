import { GlobalState } from "../model/backend";
import { ControlPointDisplay } from "./ControlPointDisplay";
import { ErrorDisplay } from "./ErrorDisplay";
import styles from "./sidebar.module.css";

interface SidebarProps {
    readonly globalState: GlobalState;
}

export function Sidebar({ globalState }: SidebarProps) {
    return (
        <div className={styles.sidebar}>
            <h2>Control Point Mappings</h2>
            <ControlPointDisplay mapping={globalState.points.val1} />
            <ControlPointDisplay mapping={globalState.points.val2} />
            <ControlPointDisplay mapping={globalState.points.val3} />
            {(globalState.exists) ? null : <ErrorDisplay />}
        </div>
    )
}
