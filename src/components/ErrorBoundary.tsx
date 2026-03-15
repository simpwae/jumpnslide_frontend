import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😔</div>
            <h1 className="font-heading font-bold text-2xl text-brand-navy mb-3">
              Something went wrong
            </h1>
            <p className="text-gray-500 mb-6">
              We're sorry for the inconvenience. Please refresh the page or contact us on WhatsApp.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-blue transition-colors"
              >
                Refresh Page
              </button>
              
              <a
                href="https://wa.me/971506477052"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}