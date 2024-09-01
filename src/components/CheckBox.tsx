import styles from "./components.module.css";

interface CurveFamilyToggleProps {
    readonly checked: boolean;
    readonly onChange: (v: boolean) => void;
}

/** Styled checkbox input adapted from https://moderncss.dev/pure-css-custom-checkbox-style/. */
export function CheckBox({ checked, onChange }: CurveFamilyToggleProps) {
    return (
        <input className={styles.checkbox} type='checkbox' checked={checked} onChange={e => onChange(e.target.checked)} />
    );
}
