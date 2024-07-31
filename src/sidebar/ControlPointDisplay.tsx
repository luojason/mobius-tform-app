import * as C from "../coord";

interface DisplayProps {
    readonly value: C.Complex;
}

export function ControlPointDisplay({ value }: DisplayProps) {
    return (
        <div>
            <input value={value.real} readOnly={true} />
            {" + "}
            <input value={value.imag} readOnly={true} />
            j
        </div>
    )
}
