import { useRef, useState } from "react";
import * as C from "../model/coord";
import styles from "./graph.module.css";
import { ExtComplex } from "../model/backend";

interface MovablePointProps {
    readonly value: ExtComplex;
    readonly onChange: (c: C.Complex) => void;
    readonly container: C.Extent2d;
}

/**
 * Displays a control point for the Mobius transformation which can be moved.
 * 
 * NOTE: for the transform to be computed correctly,
 * the parent element for this component should have 0 padding and 0 border.
 */
export function MovablePoint({ value, onChange, container }: MovablePointProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [clicked, setClicked] = useState(false);

    // render the position of the point via CSS transform
    let style: React.CSSProperties;
    if (value === 'inf') {
        // do not render the point at infinity
        style = {
            display: 'none'
        };
    } else {
        // else value is finite
        const position = C.transformPhysical(value, container);
        if (inBounds(position, container)) {
            style = {
                transform: `translate(${position.x}px, ${position.y}px)`
            };
        } else {
            // if position lies outside the parent element's bounds, do not display it either
            style = {
                display: 'none'
            };
        }
    }

    return (
        <div
            ref={ref}
            className={styles.controlPoint}
            style={style}
            onPointerMove={e => {
                if (clicked) {
                    let p = getPosition(e, ref.current!.parentElement!);
                    p = C.constrainCoord(p, container);
                    const c = C.transformComplex(p, container);
                    onChange(c);
                }
            }}
            onPointerDown={e => {
                e.preventDefault(); // prevents elements from being highlighted when dragging
                ref.current!.setPointerCapture(e.pointerId);
                setClicked(true);
            }}
            onPointerUp={() => setClicked(false)}
            onPointerCancel={() => setClicked(false)}
        />
    );
}

/** Convert client coordinates to positional coordinates. */
function getPosition(e: React.PointerEvent<Element>, parent: Element): C.Position2d {
    const rect = parent.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    }
}

/** Checks if a positional coordinate lies within some extent */
function inBounds(p: C.Position2d, extent: C.Extent2d): boolean {
    return p.x >= 0 && p.x <= extent.width && p.y >= 0 && p.y <= extent.height;
}
