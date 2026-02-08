import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: unknown;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown) {
    // Keep this minimal; it helps us see crashes without blank-screening the whole app.
    console.error("UI crashed inside ErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-6">
            <h2 className="text-lg font-semibold">This section failed to load</h2>
            <p className="text-sm text-muted-foreground mt-1">
              The rest of the app is still available. Please switch tabs.
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
