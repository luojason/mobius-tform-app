export function ErrorDisplay() {
    return (
        <p>
            Mobius transformation is nearly singular.
            Mobius transformations define 1-to-1 mappings,
            and do not exist/behave well when two inputs map to the same (or nearly the same) output.
            Move some of the control points farther away from each other to correct this.
        </p>
    );
}
