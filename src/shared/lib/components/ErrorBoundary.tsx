'use client';

import { Component, ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
  FallbackComponent?: React.ComponentType<{ error: Error }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnChange?: unknown[];
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.groupCollapsed('🔴 [ERROR] Error caught in ErrorBoundary');
    console.error('💥 Error:', error.message);
    console.error('🔍 Stack trace:', error.stack);
    console.groupEnd();

    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    console.error('🪲 componentDidCatch:', { error, errorInfo });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnChange } = this.props;

    if (
      this.state.error &&
      resetOnChange &&
      JSON.stringify(prevProps.resetOnChange) !== JSON.stringify(this.props.resetOnChange)
    ) {
      console.log('🔁 [RESET] Resetting ErrorBoundary due to resetOnChange change');
      this.setState({ error: null });
    }
  }

  handleReset = () => {
    console.log('🔄 [RESET] User clicked "Try again" button');
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { children, fallback, FallbackComponent } = this.props;

    if (error) {
      // First try to use FallbackComponent if provided
      if (FallbackComponent) {
        return <ErrorFallback error={error} />;
      }

      // Then try to use fallback prop if provided
      if (fallback) {
        const fallbackUI = typeof fallback === 'function' ? fallback(error) : fallback;
        if (fallbackUI) {
          return fallbackUI;
        }
      }

      // Default fallback UI
      return (
        <div
          className="rounded-radius-md border border-danger bg-red/5 p-space-lg text-red animate-fadeIn"
          role="alert"
        >
          <div className="flex items-center gap-2 font-medium">
            <span className="text-xl">⚠️</span>
            <h3 className="text-font-size-base">Something went wrong</h3>
          </div>

          <div className="mt-space-md text-font-size-muted">
            <p className="font-mono">{error.message}</p>
            <button
              onClick={this.handleReset}
              className="mt-space-md rounded-radius-sm bg-red/10 px-space-md py-space-sm font-medium transition-colors hover:bg-red/20 focus-visible:outline-ring"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;