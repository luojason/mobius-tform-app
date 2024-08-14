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
    points: MappingSet;
    curves: Curve[];
    exists: boolean;
}

/** The response schema for the backend API `generate_mobius_transformation`. */
interface GenerateMobiusTransformationResponse {
    curves: Curve[];
}

interface GenerateMobiusTransformationProps {
    points: MappingSet;
}

/**
 * Calls the backend to generate the Mobius transformation conforming to the props passed in,
 * and computes the action of the transformation on the provided curves.
 * @param props All the data requested by the backend.
 * @returns The GlobalState needed to render the Mobius transformation.
 */
export async function generateMobiusTransformation({ points }: GenerateMobiusTransformationProps): Promise<GlobalState> {
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
            ]
        }) as GenerateMobiusTransformationResponse;
        return {
            points: points,
            curves: response.curves,
            exists: true,
        };
    } catch (err) {
        // error is thrown when no valid Mobius transformation exists for the inputs
        // TODO: display the error scenario to the user
        return {
            points: points,
            curves: [],
            exists: false,
        };
    }
}
