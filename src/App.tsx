import { useState } from "react";
import { MobiusGraph } from "./display/MobiusGraph";
import { ControlPointDisplay } from "./sidebar/ControlPointDisplay";
import { Complex } from "./coord";

export function App() {
    const value1 = useState<Complex>({ real: 0, imag: 0 });
    const value2 = useState<Complex>({ real: 0, imag: 0 });
    const value3 = useState<Complex>({ real: 0, imag: 0 });

    const values = {
        value1: value1,
        value2: value2,
        value3: value3,
    }

    return (
        <>
            <MobiusGraph {...values} />
            <ControlPointDisplay value={value1[0]} />
            <ControlPointDisplay value={value2[0]} />
            <ControlPointDisplay value={value3[0]} />
        </>
    )
}