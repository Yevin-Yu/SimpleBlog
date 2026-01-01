import { Component, ReactNode } from 'react';
import { logger } from '../../utils/logger';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * 错误边界组件
 * 捕获子组件树中的 JavaScript 错误，显示备用 UI
 */
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
            <p className="error-boundary-message">
              抱歉，页面遇到了一些问题
            </p>
            {this.state.error && (
              <details className="error-boundary-details">
                <summary>错误详情</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
            <button
              className="error-boundary-button"
              onClick={this.handleReset}
            >
              重新加载
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
