import { useRef } from "react";
import styles from "./graph.module.css";
import { Extent2d } from "../model/coord";
import { useElementExtent } from "../hooks/useElementExtent";
import { GraphCanvas } from "./GraphCanvas";
import { MovablePoint } from "./MovablePoint";
import { ControlPointKey, ExtComplex, GlobalState } from "../model/backend";
import { GlobalStateDispatch } from "../hooks/useGlobalState";

// Initial value based on 1100x720 window size.
// The extent will auto-update after loading, but setting the right initial size will prevent
// the brief flicker of incorrect canvas scaling before the correct dimensions are updated.
const INITIAL_EXTENT: Extent2d = {
    width: 760,
    height: 644,
};

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
