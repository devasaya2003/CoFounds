"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-10 border border-red-300 rounded bg-red-50 text-red-700">
          <h2 className="text-lg font-bold mb-2">Error Rendering Component</h2>
          <p className="mb-4">Something went wrong. Check the console for details.</p>
          <pre className="bg-white p-4 rounded overflow-auto max-h-40 text-sm">
            {this.state.error?.toString() || "Unknown error"}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}