import './LoadingLines.css';

interface LoadingLinesProps {
  count?: number;
  className?: string;
}

/** 默认加载线条数量 */
const DEFAULT_COUNT = 6;

export function LoadingLines({ count = DEFAULT_COUNT, className = '' }: LoadingLinesProps) {
  return (
    <div className={`blog-tree-loading-lines ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="loading-line" />
      ))}
    </div>
  );
}

