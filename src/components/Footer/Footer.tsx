import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-content">
        <p className="site-footer-copyright">
          Copyright © {CURRENT_YEAR} |{' '}
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer-link"
          >
            ICP备案号：陕ICP备2024040821号-1
          </a>
        </p>
      </div>
    </footer>
  );
}

