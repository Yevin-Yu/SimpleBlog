import { useNavigate } from 'react-router-dom';
import { SEO } from '../features/blog/components/SEO/SEO';
import { ROUTES } from '../config';
import { generateErrorSEOData } from '../features/blog/utils/seo.utils';
import { useSiteUrl } from '../features/blog/hooks/useSiteUrl';
import './ErrorPage.css';

interface ErrorPageProps {
  statusCode?: number;
  title?: string;
  message?: string;
}

export function ErrorPage({
  statusCode = 500,
  title = '出错了',
  message = '抱歉，页面遇到了一些问题',
}: ErrorPageProps) {
  const navigate = useNavigate();
  const siteUrl = useSiteUrl();
  const seoData = generateErrorSEOData(statusCode, siteUrl);

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={seoData.url}
        type={seoData.type}
        noindex={seoData.noindex}
        breadcrumbs={seoData.breadcrumbs}
        structuredData={seoData.structuredData}
      />
      <div className="error-page">
        <div className="error-page-background" />
        <div className="error-page-content">
          <div className="error-code">{statusCode}</div>
          <h1 className="error-title">{title}</h1>
          <p className="error-message">{message}</p>
          <button className="error-home-button" onClick={() => navigate(ROUTES.HOME)}>
            返回首页
          </button>
        </div>
      </div>
    </>
  );
}
