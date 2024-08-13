import { MobiusGraph } from "./display/MobiusGraph";
import { ControlPointDisplay } from "./sidebar/ControlPointDisplay";
import { useGlobalState } from "./hooks/useGlobalState";

export function App() {
    const [globalState, dispatch] = useGlobalState({
        points: {
            val1: { in: [0, 0], out: [0, 0] },
            val2: { in: [5, 0], out: [5, 0] },
            val3: { in: [0, 5], out: [0, 5] },
        },
        // TODO: compute gridlines on first load
        curves: [],
        exists: true
    });

    return (
        <>
            <MobiusGraph globalState={globalState} dispatch={dispatch} />
            <ControlPointDisplay mapping={globalState.points.val1} />
            <ControlPointDisplay mapping={globalState.points.val2} />
            <ControlPointDisplay mapping={globalState.points.val3} />
        </>
    )
}