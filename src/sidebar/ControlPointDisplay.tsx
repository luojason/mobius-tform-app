import * as C from "../model/coord";

interface DisplayProps {
    readonly value: C.Complex;
}

export function ControlPointDisplay({ value }: DisplayProps) {
    return (
        <div>
            <input value={value[0]} readOnly={true} />
            {" + "}
            <input value={value[1]} readOnly={true} />
            j
        </div>
    )
}
