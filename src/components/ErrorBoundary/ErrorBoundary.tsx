import { Component, ReactNode } from 'react';
import { logger } from '../../utils/logger';
import { BASE_PATH, ROUTES } from '../../config';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    logger.error('Error Boundary 捕获到错误:', error);
    logger.error('组件堆栈:', errorInfo.componentStack);

    window.location.href = `${BASE_PATH}${ROUTES.ERROR}`;
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1 className="error-boundary-title">出错了</h1>
            <p className="error-boundary-message">正在跳转到错误页面...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
