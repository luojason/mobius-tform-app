import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MobiusGraph } from "./display/MobiusGraph";

createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
        <MobiusGraph />
    </StrictMode>
);
