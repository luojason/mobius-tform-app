import { useRef, useState } from "react";
import * as M from "../model/backend";

interface SetControlPointAction {
    type: 'set-mapping';
    key: M.ControlPointKey;
    in?: M.ExtComplex;
    out?: M.ExtComplex;
}

interface ToggleCurveFamilyAction {
    type: 'toggle-curves';
    key: M.CurveFamilyKey;
    value: boolean;
}

/**
 * Defines the schema for the valid actions that can be passed into the dispatch function returned by `useGlobalState`.
 * 
 * Each action must specify a unique 'type' label that identifies it.
 */
export type GlobalStateDispatchAction = SetControlPointAction | ToggleCurveFamilyAction;

export type GlobalStateDispatch = (a: GlobalStateDispatchAction) => void;

/**
 * A hook that providers all the state needed to represent a Mobius transformation and its derivative data,
 * as well as a dispatch function to modify this state.
 * 
 * The dispatch function makes a backend API call and can not be used in pure code.
 */
export function useGlobalState(initial: M.GlobalState): [M.GlobalState, GlobalStateDispatch] {
    const [globalState, setGlobalState] = useState(initial);
    // hidden de-normalized state caching the list of used curves to make backend API call more convenient
    const usedCurves = useRef(getUsedCurves(initial.curves));

    // format is similar to reducer pattern. We don't use reducer since non-pure operations are needed.
    // this dispatch function can only be invoked outside of rendering (e.g. in event handlers)
    const dispatch = async (action: GlobalStateDispatchAction) => {
        switch (action.type) {
            case 'set-mapping': {
                const oldMapping = globalState.points[action.key];
                const newMapping: M.SamplePointMapping = {
                    in: action.in || oldMapping.in,
                    out: action.out || oldMapping.out,
                };
                const newMappingSet: M.MappingSet = {
                    ...globalState.points,
                    [action.key]: newMapping
                };

                const newGlobalState = await M.generateMobiusTransformation({
                    points: newMappingSet,
                    usedCurves: usedCurves.current
                });

                setGlobalState(newGlobalState);
                break;
            }
            case "toggle-curves": {
                const currentlyUsed = globalState.curves[action.key] !== undefined;
                if (action.value === currentlyUsed) {
                    // no change needed
                    return;
                }

                let newGlobalState;
                if (action.value) {
                    // toggle on
                    const response = await M.generateMobiusTransformation({
                        points: globalState.points,
                        usedCurves: [action.key]
                    });

                    const newCurves = {
                        ...globalState.curves,
                        ...response.curves
                    }
                    newGlobalState = {
                        points: globalState.points,
                        curves: newCurves,
                        exists: response.exists,
                    };
                } else {
                    // toggle off
                    const newCurves = { ...globalState.curves };
                    delete newCurves[action.key];
                    newGlobalState = {
                        ...globalState,
                        curves: newCurves
                    };
                }

                setGlobalState(newGlobalState);
                // update reference to keep it in sync with globalState
                usedCurves.current = getUsedCurves(newGlobalState.curves);
                break;
            }
        }
    };

    return [globalState, dispatch];
}

function getUsedCurves(curves: M.CurveSet): M.CurveFamilyKey[] {
    return (Object.keys(M.CURVE_FAMILY_NAMES) as M.CurveFamilyKey[])
        .filter(key => curves[key] !== undefined);
}
