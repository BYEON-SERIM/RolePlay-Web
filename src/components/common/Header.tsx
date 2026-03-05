import { useLocation, Link } from 'react-router-dom';
import './Header.css';

// 현재 경로에 따라 헤더에 표시할 제목을 결정하는 함수
const getTitle = (pathname: string): string => {
  switch (pathname) {
    case '/store':
      return '가게 놀이';
    case '/hotel':
      return '호텔 놀이';
    case '/academy':
      return '학원 놀이';
    default:
      return '🎀하윤이의 역할놀이🎀';
  }
};

const Header = () => {
  const location = useLocation();
  const title = getTitle(location.pathname);
  const isHome = location.pathname === '/';

  return (
    <header className="app-header">
      {!isHome && (
        <Link to="/" className="header-home-btn" aria-label="홈으로" style={{ textDecoration: 'none', border: 'none', background: 'none' }}>
          🏠
        </Link>
      )}
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
