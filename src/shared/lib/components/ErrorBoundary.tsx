'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

/* ===== Icons ===== */
/**
 * Collection of visual icons used for console logging
 * Each icon corresponds to a specific type of log message
 */
const icon = {
    error: "❌",
    log: "🧾",
    boundary: "🧱",
    reset: "♻️",
    info: "📌",
    group: "🗂️",
    alert: "⚠️",
    neutral: "🔘"
} as const; // 'as const' for type safety on icon keys

/* ===== Types ===== */
/**
 * Props interface for ErrorBoundary component
 * @property {ReactNode} children - Child components to be wrapped
 * @property {ReactNode | ((err: Error) => ReactNode)} [fallback] - Custom fallback UI or function
 * @property {(err: Error, info: ErrorInfo) => void} [onError] - Error handler callback
 * @property {() => void} [onReset] - Reset handler callback
 * @property {unknown} [resetOnChange] - Dependency to trigger reset when changed
 */
interface IErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode | ((err: Error) => ReactNode);
    onError?: (err: Error, info: ErrorInfo) => void;
    onReset?: () => void;
    resetOnChange?: unknown;
}

/**
 * State interface for ErrorBoundary component
 * @property {Error | null} err - Captured error or null if no error
 */
interface IErrorBoundaryState {
    err: Error | null;
}

/* ====== Error Boundary Class ===== */
/**
 * ErrorBoundary component that catches JavaScript errors in its child component tree
 * and logs those errors with detailed information to the console.
 */
export class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps) {
        super(props);
        this.state = { err: null };
        console.log(`${icon.info} ErrorBoundary initialized`);
    }

    /**
     * Static lifecycle method that updates state when an error is caught
     * @param {Error} err - The error that was thrown
     * @returns {IErrorBoundaryState} Updated state with the error
     */
    static getDerivedStateFromError(err: Error): IErrorBoundaryState {
        console.groupCollapsed(`${icon.group} ${icon.boundary} Error Boundary Triggered`);
        console.error(`${icon.error} Error caught in boundary:`, err);
        console.log(`${icon.log} Error name:`, err.name);
        console.log(`${icon.log} Error message:`, err.message);
        console.log(`${icon.log} Stacktrace:\n`, err.stack);
        console.groupEnd();

        return { err };
    }

    /**
     * Lifecycle method called after an error has been caught
     * @param {Error} err - The error that was thrown
     * @param {ErrorInfo} info - Information about which component threw the error
     */
    componentDidCatch(err: Error, info: ErrorInfo): void {
        console.groupCollapsed(`${icon.group} ${icon.boundary} componentDidCatch Details`);
        console.error(`${icon.error} Error:`, err);
        console.log(`${icon.info} Component Stack:\n`, info.componentStack);
        console.log(`${icon.log} Error occurred at:`, new Date().toISOString());
        console.groupEnd();

        // Call optional error handler if provided
        if (this.props.onError) {
            console.log(`${icon.info} Calling onError handler...`);
            this.props.onError(err, info);
        }

        // Call optional reset handler if provided
        if (this.props.onReset) {
            console.log(`${icon.reset} Calling onReset handler...`);
            this.props.onReset();
        }
    }

    /**
     * Lifecycle method called after component updates
     * @param {IErrorBoundaryProps} prevProps - Previous props before update
     */
    componentDidUpdate(prevProps: IErrorBoundaryProps): void {
        if (this.props.resetOnChange !== prevProps.resetOnChange) {
            console.groupCollapsed(`${icon.group} ${icon.reset} Error boundary reset triggered`);
            console.log(`${icon.info} Previous resetOnChange:`, prevProps.resetOnChange);
            console.log(`${icon.info} New resetOnChange:`, this.props.resetOnChange);
            console.log(`${icon.log} Resetting error state...`);
            console.groupEnd();

            this.setState({ err: null });
        }
    }

    /**
     * Render method that displays either children or fallback UI
     * @returns {ReactNode} The rendered component
     */
    render(): ReactNode {
        const { err } = this.state;
        const { children, fallback } = this.props;

        if (err) {
            console.groupCollapsed(`${icon.group} ${icon.alert} Rendering fallback UI`);
            console.log(`${icon.info} Error exists in state, showing fallback`);

            // Custom fallback as function
            if (typeof fallback === 'function') {
                console.log(`${icon.log} Using function fallback`);
                console.groupEnd();
                return fallback(err);
            }

            // Fallback as JSX
            if (fallback) {
                console.log(`${icon.log} Using JSX fallback`);
                console.groupEnd();
                return fallback;
            }

            console.log(`${icon.log} Using default fallback UI`);
            console.groupEnd();

            // Default fallback UI
            return (
                <div className="flex flex-col items-center justify-center text-center text-red-500 p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                    <div className="text-4xl mb-2">{icon.alert}</div>
                    <h2 className="font-bold text-lg">Something went wrong.</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Please refresh the page or contact support.
                    </p>
                    <details className="mt-2 text-xs text-left">
                        <summary className="cursor-pointer">Error details</summary>
                        <pre className="mt-1 p-2 bg-white dark:bg-gray-800 rounded overflow-auto">
                            {err.toString()}
                        </pre>
                    </details>
                </div>
            );
        }

        console.log(`${icon.neutral} No errors, rendering children`);
        return children;
    }
}