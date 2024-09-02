import styles from "./components.module.css";

interface SlideToggleProps {
    readonly checked: boolean;
    readonly onChange: (v: boolean) => void;
}

/** Checkbox input styled to appear as a slider. */
export function SlideToggle({ checked, onChange }: SlideToggleProps) {
    return (
        <input className={styles.slideToggle} type='checkbox' checked={checked} onChange={e => onChange(e.target.checked)} />
    );
}