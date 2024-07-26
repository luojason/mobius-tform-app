import { useRef, useState } from "react";
import styles from "./graph.module.css";
import { Complex, Extent2d } from "../coord";
import { useElementExtent } from "../hooks/useElementExtent";
import { GraphCanvas } from "./GraphCanvas";
import { MovablePoint } from "./MovablePoint";

// TODO: this needs a proper value based off initial window width/height
// unless we can confirm that useElementExtent updates immediately on first load
const INITIAL_EXTENT: Extent2d = {
    width: 100,
    height: 100,
};

/**
 * Renders a visualization of the current Mobius transformation.
 */
export function MobiusGraph() {
    const ref = useRef<HTMLDivElement>(null);
    const extent = useElementExtent(ref, INITIAL_EXTENT);
    const [value, setValue] = useState<Complex>({ real: 0, imag: 0 });

    return (
        <div ref={ref} className={styles.graphContainer}>
            <GraphCanvas extent={extent} />
            <MovablePoint value={value} setValue={setValue} containingExtent={extent} />
        </div>
    );
}
