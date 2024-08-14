import { useState } from "react";
import * as M from "../model/backend";

interface SetControlPointAction {
    type: 'set-mapping';
    key: M.ControlPointKey;
    in?: M.ExtComplex;
    out?: M.ExtComplex;
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
export function useGlobalState(initial: M.GlobalState): [M.GlobalState, GlobalStateDispatch] {
    const [globalState, setGlobalState] = useState(initial);

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
                    points: newMappingSet
                });

                setGlobalState(newGlobalState);
                break;
            }
        }
    };

    return [globalState, dispatch];
}
