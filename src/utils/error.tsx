'use client'

import { Component, ReactNode } from 'react'

// 💡 Types for props and state
interface ErrorBoundaryProps {
  children: ReactNode // What we're trying to render
  fallback?: ReactNode | ((error: Error) => ReactNode) // UI or function to show if something breaks
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void // Optional error handler
  resetOnChange?: unknown[] // Reset error state when these values change
}

interface ErrorBoundaryState {
  error: Error | null // Store the error here if there's one
}

/**
 * 🔥 Custom ErrorBoundary component
 * Catches errors in child components and shows a fallback UI.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  /**
   * 🛠️ If a child throws an error, update state to show fallback
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  /**
   * 📦 Side effects like logging go here
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo)
    console.error('Caught an error:', error, errorInfo)
  }

  /**
   * 🔁 Auto-reset error if resetOnChange deps change
   */
  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnChange } = this.props

    if (
      this.state.error &&
      resetOnChange &&
      JSON.stringify(prevProps.resetOnChange) !== JSON.stringify(resetOnChange)
    ) {
      this.setState({ error: null })
    }
  }

  /**
   * 🔄 Manually reset error state
   */
  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    const { children, fallback } = this.props

    // ❌ If there's an error, show fallback
    if (error) {
      if (typeof fallback === 'function') {
        return fallback(error) // Fallback is a function? call it with error
      }
      if (fallback) {
        return fallback // Fallback is JSX? just render it
      }

      // 🧱 Default fallback UI (no custom fallback provided)
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-lg">⚠️</span>
            <span>Something went wrong</span>
          </div>
          <div className="mt-2 text-sm">
            <p className="font-mono text-xs text-red-600">{error.message}</p>
            <button
              onClick={this.handleReset}
              className="mt-3 rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    // ✅ All good, render normal content
    return children
  }
}

export default ErrorBoundary