import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="full-screen flex items-center justify-center">
            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--gold)",
                opacity: 0.6,
                fontSize: "0.9rem",
              }}
            >
              ✦
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
