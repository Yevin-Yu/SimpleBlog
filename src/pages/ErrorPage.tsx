import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO/SEO';
import { SITE_CONFIG, ROUTES } from '../config';
import './ErrorPage.css';

interface ErrorPageProps {
  statusCode?: number;
  title?: string;
  message?: string;
}

/**
 * 错误页面组件
 */
export function ErrorPage({
  statusCode = 500,
  title = '出错了',
  message = '抱歉，页面遇到了一些问题',
}: ErrorPageProps) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <>
      <SEO
        title={`错误 ${statusCode} - ${SITE_CONFIG.name}`}
        description="页面出现错误"
        url="/error"
      />
      <div className="error-page">
        <div className="error-page-background"></div>
        <div className="error-page-content">
          <div className="error-code">{statusCode}</div>
          <h1 className="error-title">{title}</h1>
          <p className="error-message">{message}</p>
          <button className="error-home-button" onClick={handleGoHome}>
            返回首页
          </button>
        </div>
      </div>
    </>
  );
}
