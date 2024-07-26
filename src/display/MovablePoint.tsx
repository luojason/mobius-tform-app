import { useRef, useState } from "react";
import * as C from "../coord";
import styles from "./graph.module.css";

interface MovablePointProps {
    readonly value: C.Complex;
    readonly setValue: (c: C.Complex) => void;
    readonly containingExtent: C.Extent2d;
}

/**
 * Displays a control point for the Mobius transformation which can be moved.
 */
export function MovablePoint({ value, setValue, containingExtent }: MovablePointProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [clicked, setClicked] = useState(false);

    const position = C.transformPhysical(value, containingExtent);

    return (
        <div
            ref={ref}
            className={styles.controlPoint}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
            onPointerMove={e => {
                if (clicked) {
                    let p = getPosition(e, ref.current!.parentElement!);
                    p = C.constrainCoord(p, containingExtent);
                    const c = C.transformComplex(p, containingExtent);

                    setValue(c);
                }
            }}
            onPointerDown={e => {
                e.preventDefault();
                ref.current!.setPointerCapture(e.pointerId);
                setClicked(true);
            }}
            onPointerUp={() => {
                setClicked(false);
            }}
            onPointerCancel={() => {
                setClicked(false);
            }}
        />
    )
}

// TODO: use content box somehow, OR ensure padding/border of containing div is 0
function getPosition(e: React.PointerEvent<Element>, parent: Element): C.Position2d {
    const rect = parent.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    }
}
