import { StrictMode, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './App';
import { PageLoader } from './components/PageLoader/PageLoader';
import './index.css';

function Root() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (isAppReady) {
      document.getElementById('root')?.classList.add('app-ready');

      const initialLoader = document.getElementById('initial-loader');
      if (initialLoader) {
        initialLoader.classList.add('fade-out');
        setTimeout(() => {
          initialLoader.remove();
        }, 500);
      }
    }
  }, [isAppReady]);

  return (
    <>
      {!isAppReady && <PageLoader onReady={() => setIsAppReady(true)} />}
      <App />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Root />
    </HelmetProvider>
  </StrictMode>
);
