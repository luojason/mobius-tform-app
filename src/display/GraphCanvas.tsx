import { useEffect, useRef } from "react";
import { Extent2d, PIXELS_PER_UNIT } from "../model/coord";
import styles from "./graph.module.css";
import { Curve, drawCurve } from "../model/geometry";

interface GraphCanvasProps {
    readonly extent: Extent2d;
    readonly curves: Curve[];
}

/**
 * Displays a 2d grid and draws the Mobius transformation contour lines via the Canvas API.
 */
export function GraphCanvas({ extent, curves }: GraphCanvasProps) {
    const ref = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const ctxt = ref.current;
        if (!ctxt) {
            console.error('failed to retrieve Canvas 2d context');
            return;
        }

        const handle = window.requestAnimationFrame(() => {
            // update width/height it it has changed.
            // set attributes outside of react to synchronize with requestAnimationFrame
            // and prevent flickering when resizing.
            if (ctxt.canvas.width !== extent.width || ctxt.canvas.height !== extent.height) {
                ctxt.canvas.width = extent.width;
                ctxt.canvas.height = extent.height;
                ctxt.setTransform(1, 0, 0, -1, extent.width / 2, extent.height / 2);
            }

            ctxt.clearRect(-ctxt.canvas.width / 2, -ctxt.canvas.height / 2, ctxt.canvas.width, ctxt.canvas.height);

            ctxt.strokeStyle = 'black';
            drawGridlines(ctxt);

            ctxt.strokeStyle = 'blue';
            for (const curve of curves) {
                drawCurve(ctxt, curve, extent);
            }
        });

        return () => {
            window.cancelAnimationFrame(handle);
        };
    }, [extent, curves]);

    function getContextFromRef(element: HTMLCanvasElement | null) {
        if (element === null) {
            ref.current = null;
        } else {
            ref.current = element.getContext('2d');
        }
    }

    return (
        <canvas ref={getContextFromRef} className={styles.canvas}>
            Canvas not supported.
        </canvas>
    );
}

function drawGridlines(ctxt: CanvasRenderingContext2D) {
    // will be working in the range [-a/2, a/2] instead of [0, a]
    const width = ctxt.canvas.width / 2;
    const height = ctxt.canvas.height / 2;

    // draw the X/Y-axis slightly thicker
    ctxt.lineWidth = 2.5;
    ctxt.beginPath();
    ctxt.moveTo(-width, 0);
    ctxt.lineTo(width, 0);
    ctxt.stroke();
    ctxt.beginPath();
    ctxt.moveTo(0, -height);
    ctxt.lineTo(0, height);
    ctxt.stroke();
    ctxt.lineWidth = 1;

    // draw gridlines in the X-axis direction
    for (let y = PIXELS_PER_UNIT; y < height; y += PIXELS_PER_UNIT) {
        // draw both lines above and below the X-axis
        ctxt.beginPath();
        ctxt.moveTo(-width, y);
        ctxt.lineTo(width, y);
        ctxt.stroke();

        ctxt.beginPath();
        ctxt.moveTo(-width, -y);
        ctxt.lineTo(width, -y);
        ctxt.stroke();
    }

    // draw gridlines in the Y-axis direction
    for (let x = PIXELS_PER_UNIT; x < width; x += PIXELS_PER_UNIT) {
        // draw both lines above and below the Y-axis
        ctxt.beginPath();
        ctxt.moveTo(x, -height);
        ctxt.lineTo(x, height);
        ctxt.stroke();

        ctxt.beginPath();
        ctxt.moveTo(-x, -height);
        ctxt.lineTo(-x, height);
        ctxt.stroke();
    }
}
