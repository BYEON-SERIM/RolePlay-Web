import { Link } from 'react-router-dom';

import cinnaImg from '../assets/images/cinna.png'; 

const MainMenu = () => {
  return (
    <div className="main-menu" style={{ textAlign: 'center', padding: '20px' }}>
      <img 
        src={cinnaImg} 
        alt="시나모롤" 
        style={{ width: '200px', marginBottom: '20px' }} 
      />
      
      <h1>어떤 놀이를 할까요?</h1>
      
      <div className="button-group" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px',          /* 버튼 사이의 간격 */
        marginTop: '20px'     /* 제목과의 간격 */
      }}>
        <Link to="/store">
          <button style={{ padding: '10px 20px' }}>가게 놀이</button>
        </Link>
        <Link to="/hotel">
          <button style={{ padding: '10px 20px' }}>호텔 놀이</button>
        </Link>
        <Link to="/academy">
          <button style={{ padding: '10px 20px' }}>학원 놀이</button>
        </Link>
      </div>
    </div>
  );
};

export default MainMenu;