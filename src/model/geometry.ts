/**
 * This module contains definitions of types that map to data models in the backend.
 * The JSON representaion of each of these types should be able to
 * deserialize successfully into some corresponding type in the backend
 * (refer to `src-tauri/src/model.rs`).
 * 
 * These types are also used to draw things to the screen.
 */

import { Complex, Extent2d, PIXELS_PER_UNIT } from "./coord";

/** An number in the extended complex plane, which includes the point at infinity. */
export type ExtComplex = Complex | 'inf';

interface Circle {
    type: 'circle';
    center: Complex;
    radius: number;
}

interface Line {
    type: 'line';
    point: Complex;
    slope: Complex;
}

/** A curve which is either a circle or a line. Can be drawn onto a canvas. */
export type Curve = Circle | Line;

/** The response schema for the backend API `generate_mobius_transformation`. */
export interface GenerateMobiusTransformationResponse {
    curves: Curve[];
}

/** Draw a curve onto a 2D Canvas. */
export function drawCurve(ctxt: CanvasRenderingContext2D, curve: Curve, extent: Extent2d) {
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
            console.log('line encountered');
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
