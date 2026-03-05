import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../common/Header';
import BottomNav from '../common/BottomNav';

// Hotel popups
import ReservationBook from '../apps/hotel/components/ReservationBook';
import RoomService from '../apps/hotel/components/RoomService';

// Store popups
import Calculator from '../apps/store/components/Calculator';
import Payment from '../apps/store/components/Payment';

const MainLayout = () => {
  const location = useLocation();
  const [activeMode, setActiveMode] = useState<'store' | 'hotel' | null>(null);

  // Hotel popup states
  const [showReservationBook, setShowReservationBook] = useState(false);
  const [showRoomService, setShowRoomService] = useState(false);

  // Store popup states
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    // Close all popups on route change
    setShowReservationBook(false);
    setShowRoomService(false);
    setShowCalculator(false);
    setShowPayment(false);

    if (location.pathname.startsWith('/hotel')) {
      setActiveMode('hotel');
    } else if (location.pathname.startsWith('/store')) {
      setActiveMode('store');
    } else {
      setActiveMode(null);
    }
  }, [location.pathname]);

  const handleMenuClick = (menuId: string) => {
    if (activeMode === 'hotel') {
      if (menuId === 'reservations') setShowReservationBook(true);
      if (menuId === 'room-service') setShowRoomService(true);
    }
    if (activeMode === 'store') {
      if (menuId === 'calculator') setShowCalculator(true);
      if (menuId === 'payment') setShowPayment(true);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#f8f9fa'
    },
    content: {
      flex: 1,
      overflowY: 'auto' as const,
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const
    },
    bottomNavWrapper: {
      flexShrink: 0,
      zIndex: 100
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      <main style={styles.content}>
        <Outlet />
      </main>
      <div style={styles.bottomNavWrapper}>
        <BottomNav activeMode={activeMode} onMenuClick={handleMenuClick} />
      </div>

      {showReservationBook && <ReservationBook onClose={() => setShowReservationBook(false)} />}
      {showRoomService && <RoomService onClose={() => setShowRoomService(false)} />}
      {showCalculator && <Calculator onClose={() => setShowCalculator(false)} />}
      {showPayment && <Payment onClose={() => setShowPayment(false)} />}
    </div>
  );
};

export default MainLayout;