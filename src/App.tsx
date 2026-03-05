import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

// 레이아웃과 페이지 컴포넌트들을 가져옵니다.
import MainLayout from './components/layout/MainLayout.tsx';
import MainMenu from './pages/MainMenu';
import StorePlay from './components/apps/store/components/StorePlay.tsx';
import HotelPlay from './components/apps/hotel/components/HotelPlay.tsx';
import AcademyPlay from './components/apps/academy/components/AcademyPlay.tsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* MainLayout을 사용하는 라우트 그룹 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<MainMenu />} />
          <Route path="/store" element={<StorePlay />} />
          <Route path="/hotel" element={<HotelPlay />} />
          <Route path="/academy" element={<AcademyPlay />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
