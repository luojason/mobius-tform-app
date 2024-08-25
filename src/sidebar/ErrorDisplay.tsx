import styles from "./sidebar.module.css";

// TODO: add svg symbol to error display
export function ErrorDisplay() {
    return (
        <div className={styles.error}>
            <strong>Warning. </strong>
            Mobius transformation is nearly singular.
            Mobius transformations are one-to-one mappings,
            and do not exist/behave well when two inputs map to the same (or nearly the same) output.
            Move some of the control points farther away from each other to correct this.
        </div>
    );
}
