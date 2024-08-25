import { ExtComplex, SamplePointMapping } from "../model/backend";
import styles from "./sidebar.module.css";

const DIGITS_OF_PRECISION = 3;

interface DisplayProps {
    readonly mapping: SamplePointMapping;
}

export function ControlPointDisplay({ mapping }: DisplayProps) {
    return (
        <div className={styles.pointDisplay}>
            {`${display(mapping.in)} ↦ ${display(mapping.out)}`}
        </div>
    )
}

function display(c: ExtComplex): string {
    if (c === 'inf') {
        return 'Infinity';
    } else {
        return `${c[0].toFixed(DIGITS_OF_PRECISION)} + ${c[1].toFixed(DIGITS_OF_PRECISION)}i`;
    }
}
