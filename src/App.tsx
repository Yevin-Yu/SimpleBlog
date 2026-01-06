import { BrowserRouter } from 'react-router-dom';
import { RouterConfig } from './router';
import { BASE_PATH } from './config';

export function App() {
  return (
    <BrowserRouter
      basename={BASE_PATH}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <RouterConfig />
    </BrowserRouter>
  );
}
