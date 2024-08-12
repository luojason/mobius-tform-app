import { ExtComplex } from "../model/geometry";

interface DisplayProps {
    readonly value: ExtComplex;
}

export function ControlPointDisplay({ value }: DisplayProps) {
    // special handling for point at infinity case
    if (value === 'inf') {
        return <div>inf</div>;
    }

    return (
        <div>
            {"↦"}
            <input value={value[0]} readOnly={true} />
            {" + "}
            <input value={value[1]} readOnly={true} />
            j
        </div>
    )
}
