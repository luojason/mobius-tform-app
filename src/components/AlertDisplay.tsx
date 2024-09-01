import styles from "./components.module.css";

/** A block container which displays alerts with a warning symbol in the top-left. */
export function AlertDisplay({ children }: React.PropsWithChildren) {
    return (
        <div className={styles.alert}>
            <svg className={styles.alertSymbol}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
            >
                <circle cx={50} cy={50} r={40} />
                <line x1={50} y1={25} x2={50} y2={60} />
                <line x1={50} y1={75} x2={50} y2={75} />
            </svg>
            {children}
        </div>
    );
}
