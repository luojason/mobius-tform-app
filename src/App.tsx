import { MobiusGraph } from "./display/MobiusGraph";
import { useGlobalState } from "./hooks/useGlobalState";
import { GlobalState } from "./model/backend";
import { Sidebar } from "./sidebar/Sidebar";
import styles from "./app.module.css";

interface AppProps {
    readonly initial: GlobalState;
}

export function App({ initial }: AppProps) {
    const [globalState, dispatch] = useGlobalState(initial);

    return (
        <div className={styles.app}>
            <MobiusGraph globalState={globalState} dispatch={dispatch} />
            <Sidebar globalState={globalState} />
        </div>
    )
}
