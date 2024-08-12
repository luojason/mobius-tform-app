import { useState } from "react";
import { Curve, ExtComplex, GenerateMobiusTransformationResponse } from "../model/geometry";
import { invoke } from "@tauri-apps/api/tauri";

/**
 * This type contains everything related to the Mobius transformation being rendered,
 * and is the main global state returned from the custom hook in this file.
 */
export interface GlobalState {
    points: MappingSet;
    curves: Curve[];
    exists: boolean;
}

/** A sample input/output pair for a data point mapped under a Mobius transformation. */
interface SamplePointMapping {
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

interface SetControlPointAction {
    type: 'set-mapping';
    key: ControlPointKey;
    in?: ExtComplex;
    out?: ExtComplex;
}

/**
 * Defines the schema for the valid actions that can be passed into the dispatch function returned by `useGlobalState`.
 * 
 * Each action must specify a unique 'type' label that identifies it.
 */
export type GlobalStateDispatchAction = SetControlPointAction;

export type GlobalStateDispatch = (a: GlobalStateDispatchAction) => void;

/**
 * A hook that providers all the state needed to represent a Mobius transformation and its derivative data,
 * as well as a dispatch function to modify this state.
 * 
 * The dispatch function makes a backend API call and can not be used in pure code.
 */
export function useGlobalState(initial: GlobalState): [GlobalState, GlobalStateDispatch] {
    const [globalState, setGlobalState] = useState(initial);

    // format is similar to reducer pattern. We don't use reducer since non-pure operations are needed.
    // this dispatch function can only be invoked outside of rendering (e.g. in event handlers)
    const dispatch = async (action: GlobalStateDispatchAction) => {
        switch (action.type) {
            case 'set-mapping': {
                const oldMapping = globalState.points[action.key];
                const newMapping: SamplePointMapping = {
                    in: action.in || oldMapping.in,
                    out: action.out || oldMapping.out,
                };
                const newMappingSet = {
                    ...globalState.points,
                    [action.key]: newMapping
                };

                try {
                    // make call to backend
                    const response = await invoke('generate_mobius_transformation', {
                        inputs: [
                            newMappingSet.val1.in,
                            newMappingSet.val2.in,
                            newMappingSet.val3.in,
                        ],
                        outputs: [
                            newMappingSet.val1.out,
                            newMappingSet.val2.out,
                            newMappingSet.val3.out,
                        ]
                    }) as GenerateMobiusTransformationResponse;
                    setGlobalState({
                        points: newMappingSet,
                        curves: response.curves,
                        exists: true,
                    });
                } catch (err) {
                    // error is thrown when no valid Mobius transformation exists for the inputs
                    // TODO: display the error scenario to the user
                    setGlobalState({
                        points: newMappingSet,
                        curves: [],
                        exists: false,
                    })
                }
                break;
            }
        }
    };

    return [globalState, dispatch];
}
