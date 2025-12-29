import './LoadingLines.css';

interface LoadingLinesProps {
  count?: number;
  className?: string;
}

const DEFAULT_COUNT = 5;

export function LoadingLines({ count = DEFAULT_COUNT, className = '' }: LoadingLinesProps) {
  return (
    <div className={`blog-tree-loading-lines ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="loading-line" />
      ))}
    </div>
  );
}

