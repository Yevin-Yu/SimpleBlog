import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config';
import { BlogSearchModal } from '../BlogSearchModal/BlogSearchModal';
import { BlogListDrawer } from '../BlogListDrawer/BlogListDrawer';
import './FloatingActionButton.css';

interface FloatingActionButtonProps {
  onBlogClick?: (id: string) => void;
  selectedBlogId?: string;
  onTocClick?: () => void;
}

export function FloatingActionButton({
  onBlogClick,
  selectedBlogId,
  onTocClick,
}: FloatingActionButtonProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isListDrawerOpen, setIsListDrawerOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigateToHome = () => {
    navigate(ROUTES.HOME);
    setIsOpen(false);
  };

  const handleOpenSearch = () => {
    setIsSearchModalOpen(true);
  };

  const handleOpenListDrawer = () => {
    setIsListDrawerOpen(true);
  };

  return (
    <div className="fab-container">
      <div className={`fab-menu ${isOpen ? 'fab-menu-open' : ''}`}>
        <button
          className="fab-action-button fab-action-1"
          aria-label="首页"
          onClick={handleNavigateToHome}
        >
          <svg width="16" height="16" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M192 413.952V896h640V413.952L512 147.328zM139.52 374.4l352-293.312a32 32 0 0 1 40.96 0l352 293.312A32 32 0 0 1 896 398.976V928a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V398.976a32 32 0 0 1 11.52-24.576"
            ></path>
          </svg>
        </button>
        <button
          className="fab-action-button fab-action-2"
          aria-label="列表"
          onClick={handleOpenListDrawer}
        >
          <svg width="16" height="16" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M192 128v768h640V128zm-32-64h704a32 32 0 0 1 32 32v832a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32"
            ></path>
            <path
              fill="currentColor"
              d="M672 128h64v768h-64zM96 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32"
            ></path>
          </svg>
        </button>
        <button
          className="fab-action-button fab-action-3"
          aria-label="搜索"
          onClick={handleOpenSearch}
        >
          <svg width="16" height="16" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704"
            ></path>
          </svg>
        </button>
        <button className="fab-action-button fab-action-4" aria-label="目录" onClick={onTocClick}>
          <svg width="16" height="16" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M192 128v768h640V128zm-32-64h704a32 32 0 0 1 32 32v832a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32m160 448h384v64H320zm0-192h192v64H320zm0 384h384v64H320z"
            ></path>
          </svg>
        </button>
      </div>
      <button
        className="fab-main-button"
        onClick={toggleMenu}
        aria-label={isOpen ? '关闭菜单' : '打开菜单'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg width="16" height="16" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M614.4 512l307.2-307.2c29.257143-29.257143 29.257143-73.142857 0-102.4s-73.142857-29.257143-102.4 0L512 409.6 204.8 95.085714c-29.257143-21.942857-80.457143-21.942857-109.714286 0s-29.257143 73.142857 0 102.4L409.6 512l-307.2 307.2c-29.257143 29.257143-29.257143 73.142857 0 102.4s73.142857 29.257143 102.4 0L512 614.4l307.2 307.2c29.257143 29.257143 73.142857 29.257143 102.4 0s29.257143-73.142857 0-102.4L614.4 512z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M468 556V832H192V556h276z m364 0V832H556V556H832zM468 192v276H192V192h276z m364 0v276H556V192H832z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
      <BlogSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onBlogClick={(id) => {
          onBlogClick?.(id);
        }}
      />
      <BlogListDrawer
        isOpen={isListDrawerOpen}
        onClose={() => setIsListDrawerOpen(false)}
        onBlogClick={(id) => {
          onBlogClick?.(id);
        }}
        selectedBlogId={selectedBlogId}
      />
    </div>
  );
}
