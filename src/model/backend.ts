/**
 * This module controls the integration with the backend.
 * 
 * It contains definitions of types that map to data models in the backend,
 * as well as wrapper over the primary api used to interact with the backend.
 * 
 * The JSON representation of many of these types should be able to
 * deserialize successfully into some corresponding type in the backend
 * (refer to `src-tauri/src/model.rs`).
 * 
 * These types are also used to draw shapes to the screen.
 */

import { Complex } from "./coord";
import { invoke } from "@tauri-apps/api/tauri";

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

/** Defines the keys for valid curve families recognized by the backend, as well as their display names. */
export const CURVE_FAMILY_NAMES = {
    xy: 'Cartesian gridlines',
    polar: 'Polar gridlines',
    apollo: 'Apollonian circles'
} as const;
export type CurveFamilyKey = keyof typeof CURVE_FAMILY_NAMES;

/** Contains a set of curve families transformed under the current Mobius transformation being rendered. */
export type CurveSet = Partial<Record<CurveFamilyKey, Curve[]>>;

/** A sample input/output pair for a data point mapped under a Mobius transformation. */
export interface SamplePointMapping {
    in: ExtComplex;
    out: ExtComplex;
}

/**
 * This type serves as the index for MappingSet.
 * It is used to limit the number of control points and uniquely identify them.
 * 
 * Future scope: if mapping set is relaxed to allow more than 3 point mappings,
 * this type is no longer needed and we can just use a string/UUID as the index.
 */
export type ControlPointKey = 'val1' | 'val2' | 'val3';

/**
 * A set of sample input/output pairs used as control points to compute the corresponding Mobius transformation.
 * A Mobius transformation is uniquely determined by three sample point mappings.
 * 
 * Future scope may include adding other point mappings which do not serve as control points,
 * for additional visualization.
 */
export type MappingSet = {
    [index in ControlPointKey]: SamplePointMapping;
}

/**
 * This type contains everything related to the Mobius transformation being rendered,
 * and is the main global state returned from the custom hook in this file.
 */
export interface GlobalState {
    /** The set of sample mapping points based on which the Mobius transformation is determined. */
    points: MappingSet;

    /**
     * The set of curve transformed under the given Mobius tform to be rendered.
     * This also determines which curve families are currently enabled.
     * The order of curve families in this object is not guaranteed.
     */
    curves: CurveSet;

    /** Whether or not a valid Mobius transformation exists for the provided `MappingSet`. Used as an error flag. */
    exists: boolean;
}

/** The response schema for the backend API `generate_mobius_transformation`. */
interface GenerateMobiusTransformationResponse {
    curves: CurveSet;
}

/** The request schema for `generateMobiusTransformation`. */
export interface GenerateMobiusTransformationProps {
    /** The set of sample mapping points based on which the Mobius transformation is determined. */
    points: MappingSet;

    /** The list of curve families to be rendered. These determine what is included in the `curves` property. */
    usedCurves: CurveFamilyKey[];
}

/**
 * Calls the backend to generate the Mobius transformation conforming to the props passed in,
 * and computes the action of the transformation on the provided curves.
 * The promise returned by this function should never reject.
 * @param props All the data requested by the backend.
 * @returns The GlobalState needed to render the Mobius transformation.
 */
export async function generateMobiusTransformation({ points, usedCurves }: GenerateMobiusTransformationProps): Promise<GlobalState> {
    try {
        // make call to backend
        const response = await invoke('generate_mobius_transformation', {
            inputs: [
                points.val1.in,
                points.val2.in,
                points.val3.in,
            ],
            outputs: [
                points.val1.out,
                points.val2.out,
                points.val3.out,
            ],
            curves: usedCurves,
        }) as GenerateMobiusTransformationResponse;
        return {
            points: points,
            curves: response.curves,
            exists: true,
        };
    } catch (err) {
        // error is thrown when no valid Mobius transformation exists for the inputs.
        // in this scenario, set the exists flag to indicate this failure, and do not return any curves to render
        return {
            points: points,
            curves: {},
            exists: false,
        };
    }
}
