import { MobiusGraph } from "./display/MobiusGraph";
import { ControlPointDisplay } from "./sidebar/ControlPointDisplay";
import { useGlobalState } from "./hooks/useGlobalState";
import { GlobalState } from "./model/backend";

interface AppProps {
    initial: GlobalState;
}

export function App({ initial }: AppProps) {
    const [globalState, dispatch] = useGlobalState(initial);

    return (
        <>
            <MobiusGraph globalState={globalState} dispatch={dispatch} />
            <ControlPointDisplay mapping={globalState.points.val1} />
            <ControlPointDisplay mapping={globalState.points.val2} />
            <ControlPointDisplay mapping={globalState.points.val3} />
        </>
    )
}
