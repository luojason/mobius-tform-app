import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { generateMobiusTransformation, GenerateMobiusTransformationProps } from "./model/backend";

/** Initial configuration of the control points. */
const INITIAL_MAPPING: GenerateMobiusTransformationProps = {
    points: {
        val1: { in: [0, 0], out: [0, 0] },
        val2: { in: [5, 0], out: [5, 0] },
        val3: { in: [0, 5], out: [0, 5] },
    },
};

// first call backend to generate the initial set of curves to display, prior to rendering
generateMobiusTransformation(INITIAL_MAPPING).then(initialState =>
    createRoot(document.getElementById("root") as HTMLElement).render(
        <StrictMode>
            <App initial={initialState} />
        </StrictMode>
    )
);
