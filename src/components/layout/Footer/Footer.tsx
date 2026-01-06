import './Footer.css';

const ICP_BEIAN = '陕ICP备2024040821号-1';
const BEIAN_URL = 'https://beian.miit.gov.cn/';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-content">
        <p className="site-footer-copyright">
          Copyright © {currentYear} |{' '}
          <a
            href={BEIAN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer-link"
          >
            ICP备案号：{ICP_BEIAN}
          </a>
        </p>
      </div>
    </footer>
  );
}
