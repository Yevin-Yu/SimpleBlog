import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { BlogTree } from './pages/BlogTree';
import { BASE_PATH } from './config';

/**
 * 应用根组件
 */
export function App() {
  return (
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
      </Routes>
    </BrowserRouter>
  );
}
