import { useRef } from "react";
import styles from "./graph.module.css";
import { Complex, Extent2d } from "../model/coord";
import { useElementExtent } from "../hooks/useElementExtent";
import { GraphCanvas } from "./GraphCanvas";
import { MovablePoint } from "./MovablePoint";
import { ControlPointKey, ExtComplex, GlobalState } from "../model/backend";
import { GlobalStateDispatch } from "../hooks/useGlobalState";

// TODO: this needs a proper value based off initial window width/height
// unless we can confirm that useElementExtent updates immediately on first load
const INITIAL_EXTENT: Extent2d = {
    width: 100,
    height: 100,
};

export type ValuePair = [Complex, (c: Complex) => void];

interface MobiusGraphProps {
    readonly globalState: GlobalState;
    readonly dispatch: GlobalStateDispatch;
}

/**
 * Renders a visualization of the current Mobius transformation.
 */
export function MobiusGraph({ globalState, dispatch }: MobiusGraphProps) {
    const ref = useRef<HTMLDivElement>(null);
    const extent = useElementExtent(ref, INITIAL_EXTENT);

    const points = Object.entries(globalState.points).map(([key, value]) => {
        const action = (c: ExtComplex) => dispatch({
            type: 'set-mapping',
            key: key as ControlPointKey,
            out: c,
        });
        return <MovablePoint
            key={key}
            value={value.out}
            onChange={action}
            container={extent}
        />;
    });

    return (
        <div ref={ref} className={styles.graphContainer}>
            <GraphCanvas extent={extent} curves={globalState.curves} />
            {points}
        </div>
    );
}
