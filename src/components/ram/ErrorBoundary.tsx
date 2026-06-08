import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("App ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex items-center justify-center bg-background px-ram-xl">
            <div className="max-w-md w-full rounded-ram-xl border border-border bg-card p-ram-3xl text-center shadow-ram-sm">
              <h1 className="text-text-lg font-extrabold text-foreground mb-ram-md">
                Something went wrong.
              </h1>
              <p className="text-text-sm text-gray-600 mb-ram-xl">
                Reload the page to continue.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-ram-md bg-brand-500 px-ram-xl py-ram-md text-text-sm font-extrabold text-primary-foreground hover:bg-brand-600 transition-colors"
              >
                Reload
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
