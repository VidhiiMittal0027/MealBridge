import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MealBridge Caught UI Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "40px 20px",
            maxWidth: 600,
            margin: "40px auto",
            textAlign: "center",
            background: "#FFFFFF",
            borderRadius: 18,
            border: "1px solid #E2E8F0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <h2 style={{ color: "#071A2F", fontSize: 20, fontWeight: 900, margin: "0 0 8px" }}>
            Something went wrong
          </h2>
          <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.5, margin: "0 0 20px" }}>
            {this.state.error?.message || "An unexpected error occurred while rendering this page."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              background: "#12846E",
              color: "#FFFFFF",
              border: 0,
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
