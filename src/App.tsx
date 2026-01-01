import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { BlogTree } from './pages/BlogTree';
import { ErrorPage } from './pages/ErrorPage';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { BASE_PATH } from './config';

/**
 * 应用根组件
 */
export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter
        basename={BASE_PATH}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogTree />} />
          <Route path="/blog/:id" element={<BlogTree />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage statusCode={404} title="页面未找到" message="抱歉，您访问的页面不存在" />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
