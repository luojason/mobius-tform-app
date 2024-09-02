import { useContext, useEffect, useRef } from "react";
import { Extent2d, PIXELS_PER_UNIT } from "../model/coord";
import styles from "./graph.module.css";
import { Curve, CurveSet } from "../model/backend";
import { ThemeContext } from "../theme/schema";

interface GraphCanvasProps {
    readonly extent: Extent2d;
    readonly curves: CurveSet;
}

/**
 * Displays a 2d grid and draws the Mobius transformation contour lines via the Canvas API.
 */
export function GraphCanvas({ extent, curves }: GraphCanvasProps) {
    const ref = useRef<CanvasRenderingContext2D | null>(null);
    const theme = useContext(ThemeContext);

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

            ctxt.strokeStyle = theme.background3;
            drawGridlines(ctxt);

            ctxt.strokeStyle = theme.foreground2;
            for (const curveList of Object.values(curves)) {
                for (const curve of curveList) {
                    drawCurve(ctxt, curve, extent);
                }
            }
        });

        return () => {
            window.cancelAnimationFrame(handle);
        };
    }, [extent, curves, theme]);

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

/** Draw a curve onto a 2D Canvas. */
function drawCurve(ctxt: CanvasRenderingContext2D, curve: Curve, extent: Extent2d) {
    // units are multiplied by PIXELS_PER_UNIT to convert to the screen coordinate's spacing
    switch (curve.type) {
        case 'circle': {
            ctxt.beginPath();
            ctxt.arc(
                curve.center[0] * PIXELS_PER_UNIT,
                curve.center[1] * PIXELS_PER_UNIT,
                curve.radius * PIXELS_PER_UNIT,
                0, 2 * Math.PI);
            ctxt.stroke();
            break;
        }
        case 'line': {
            // use extent to determine how far to extend the line
            const t = Math.max(extent.width, extent.height) / Math.hypot(curve.slope[0], curve.slope[1]);
            const x = curve.point[0] * PIXELS_PER_UNIT;
            const y = curve.point[1] * PIXELS_PER_UNIT;
            ctxt.beginPath();
            ctxt.moveTo(x - t * curve.slope[0], y - t * curve.slope[1]);
            ctxt.lineTo(x + t * curve.slope[0], y + t * curve.slope[1]);
            ctxt.stroke();
            break;
        }
    }
}
