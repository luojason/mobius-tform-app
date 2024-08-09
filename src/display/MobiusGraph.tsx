import { useRef } from "react";
import styles from "./graph.module.css";
import { Complex, Extent2d } from "../model/coord";
import { useElementExtent } from "../hooks/useElementExtent";
import { GraphCanvas } from "./GraphCanvas";
import { MovablePoint } from "./MovablePoint";

// TODO: this needs a proper value based off initial window width/height
// unless we can confirm that useElementExtent updates immediately on first load
const INITIAL_EXTENT: Extent2d = {
    width: 100,
    height: 100,
};

type ValuePair = [Complex, (c: Complex) => void];

interface MobiusGraphProps {
    readonly value1: ValuePair;
    readonly value2: ValuePair;
    readonly value3: ValuePair;
}

/**
 * Renders a visualization of the current Mobius transformation.
 */
export function MobiusGraph({ value1, value2, value3 }: MobiusGraphProps) {
    const ref = useRef<HTMLDivElement>(null);
    const extent = useElementExtent(ref, INITIAL_EXTENT);

    return (
        <div ref={ref} className={styles.graphContainer}>
            <GraphCanvas extent={extent} />
            <MovablePoint value={value1[0]} setValue={value1[1]} containingExtent={extent} />
            <MovablePoint value={value2[0]} setValue={value2[1]} containingExtent={extent} />
            <MovablePoint value={value3[0]} setValue={value3[1]} containingExtent={extent} />
        </div>
    );
}
