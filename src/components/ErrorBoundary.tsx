import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render-time crashes anywhere below it and shows a recoverable
 * fallback instead of a blank white screen. Logs the error for observability.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App crashed:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-ink text-fg px-8 text-center">
        <p className="text-4xl">😵‍💫</p>
        <div>
          <p className="font-bold text-lg">Something went wrong</p>
          <p className="text-sm text-muted mt-1">
            The app hit an unexpected error. Reloading usually fixes it.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-brand text-white font-semibold px-6 py-3 rounded-2xl"
        >
          Reload
        </button>
      </div>
    );
  }
}
