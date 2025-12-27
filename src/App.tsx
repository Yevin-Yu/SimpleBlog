import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogTree from './pages/BlogTree';
import { ROUTES } from './constants/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.BLOG} element={<BlogTree />} />
        <Route path={`${ROUTES.BLOG}/:id`} element={<BlogTree />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
