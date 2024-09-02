import { MobiusGraph } from "./display/MobiusGraph";
import { useGlobalState } from "./hooks/useGlobalState";
import { GlobalState } from "./model/backend";
import { Sidebar } from "./sidebar/Sidebar";
import styles from "./app.module.css";
import { Theme } from "./theme/schema";
import { ThemeProvider } from "./theme/ThemeProvider";

interface AppProps {
    readonly initial: GlobalState;
    readonly initialTheme: Theme;
}

export function App({ initial, initialTheme }: AppProps) {
    const [globalState, dispatch] = useGlobalState(initial);

    return (
        <ThemeProvider initial={initialTheme}>
            <div className={styles.app}>
                <MobiusGraph globalState={globalState} dispatch={dispatch} />
                <Sidebar globalState={globalState} dispatch={dispatch} />
            </div>
        </ThemeProvider>
    )
}
