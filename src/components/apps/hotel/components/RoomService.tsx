import { useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, Room } from '../../../../types';
import { hotelStore } from '../../../../store/hotelStore';

const menuItems: MenuItem[] = [
  { id: 'burger', name: '햄버거', icon: '🍔', price: 500 },
  { id: 'pizza', name: '피자', icon: '🍕', price: 1000 },
  { id: 'pasta', name: '파스타', icon: '🍝', price: 800 },
  { id: 'steak', name: '스테이크', icon: '🥩', price: 1500 },
  { id: 'cake', name: '케이크', icon: '🍰', price: 400 },
  { id: 'juice', name: '주스', icon: '🧃', price: 200 },
  { id: 'icecream', name: '아이스크림', icon: '🍨', price: 300 },
  { id: 'chicken', name: '치킨', icon: '🍗', price: 1200 },
];

const RoomService = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [roomNumber, setRoomNumber] = useState('');
  const [occupiedRooms, setOccupiedRooms] = useState<Room[]>([]);

  // 컴포넌트가 마운트될 때, 로컬 스토리지에서 사용중인 객실 목록을 불러옵니다.
  useEffect(() => {
    const allRooms = hotelStore.getRooms();
    setOccupiedRooms(allRooms.filter(room => room.status === 'occupied'));
  }, []);
  
  // 로컬 스토리지에서 주문 내역 불러오기
  const [orders, setOrders] = useState<Order[]>(() => hotelStore.getOrders());

  // 주문 내역이 변경될 때마다 저장
  useEffect(() => {
    hotelStore.saveOrders(orders);
  }, [orders]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleOrder = () => {
    if (!roomNumber) {
      alert('객실 호수를 입력해주세요!');
      return;
    }
    if (cart.length === 0) {
      alert('메뉴를 선택해주세요!');
      return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: Date.now(),
      roomNumber,
      items: cart,
      totalPrice: total,
      timestamp: Date.now(),
    };

    setOrders([...orders, newOrder]);
    setCart([]);
    setRoomNumber('');
    alert(`🛎️ 따르릉~ ${roomNumber}호 주문이 접수되었습니다!`);
    setActiveTab('orders'); // 주문 내역 탭으로 이동
  };

  const completeDelivery = (orderId: number) => {
    if (window.confirm('배달을 완료하고 주문 내역을 삭제하시겠습니까?')) {
      setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  const styles = {
    overlay: {
      position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    modal: {
      backgroundColor: '#fff', width: '90%', maxWidth: '850px', height: '80vh',
      borderRadius: '20px', display: 'flex', flexDirection: 'column' as const,
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)', overflow: 'hidden'
    },
    header: {
      padding: '15px 20px', backgroundColor: '#ff7675', color: 'white', flexShrink: 0,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexDirection: 'column' as const, gap: '10px'
    },
    headerTop: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { margin: 0, fontSize: '1.2rem', fontWeight: 'bold' as const },
    closeBtn: {
      background: 'transparent', border: 'none', color: 'white', fontSize: '2rem',
      cursor: 'pointer', padding: 0, lineHeight: 1, boxShadow: 'none',
    },
    tabContainer: { display: 'flex', gap: '10px', width: '100%' },
    tabBtn: (isActive: boolean) => ({
      flex: 1, padding: '8px', borderRadius: '20px', border: 'none',
      backgroundColor: isActive ? 'white' : 'rgba(255,255,255,0.3)',
      color: isActive ? '#ff7675' : 'white', fontWeight: 'bold' as const, cursor: 'pointer'
    }),
    body: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'row' as const },
    menuSection: { flex: 1, padding: '20px', overflowY: 'auto' as const, backgroundColor: '#fdfdfd' },
    menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' },
    menuItem: {
      backgroundColor: 'white', borderRadius: '15px', padding: '15px',
      display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer',
      border: '2px solid transparent', transition: 'all 0.2s'
    },
    menuIcon: { fontSize: '3rem', marginBottom: '10px' },
    menuName: { fontWeight: 'bold' as const, fontSize: '1.1rem', color: '#333', marginBottom: '5px' },
    menuPrice: { color: '#e67e22', fontWeight: 'bold' as const },
    
    // 오른쪽 사이드바 (주문 내역)
    sidebar: { width: '320px', padding: '20px', backgroundColor: '#fff', borderLeft: '1px solid #eee', display: 'flex', flexDirection: 'column' as const },
    sidebarTitle: { marginTop: 0, marginBottom: '15px', fontSize: '1.1rem', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' },
    cartList: { flex: 1, overflowY: 'auto' as const, marginBottom: '15px' },
    cartRow: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '10px', marginBottom: '8px'
    },
    qtyBtn: {
        width: '30px', height: '30px', borderRadius: '50%', border: 'none',
        backgroundColor: '#ecf0f1', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
        fontSize: '1.2rem', color: '#2c3e50', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: 0, lineHeight: 1
    },
    cartSummary: { marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #eee' },
    cartTotal: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '1.1rem', fontWeight: 'bold' as const },
    orderBtn: {
      width: '100%', padding: '15px', backgroundColor: '#2ecc71', color: 'white',
      border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' as const,
      cursor: 'pointer', boxShadow: '0 4px 6px rgba(46, 204, 113, 0.2)'
    },
    disabledBtn: { backgroundColor: '#bdc3c7', boxShadow: 'none', cursor: 'not-allowed' },
    roomInput: {
      width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '12px',
      border: '2px solid #eee', fontSize: '1rem', boxSizing: 'border-box' as const,
      outline: 'none'
    },
    ordersContainer: { padding: '20px', overflowY: 'auto' as const, width: '100%' },
    orderCard: {
      backgroundColor: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eee'
    },
    completeBtn: {
      width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white',
      border: 'none', borderRadius: '8px', marginTop: '10px', cursor: 'pointer'
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <h2 style={styles.title}>🍽️ 룸서비스</h2>
            <button style={styles.closeBtn} onClick={onClose}>×</button>
          </div>
          <div style={styles.tabContainer}>
            <button style={styles.tabBtn(activeTab === 'menu')} onClick={() => setActiveTab('menu')}>메뉴판</button>
            <button style={styles.tabBtn(activeTab === 'orders')} onClick={() => setActiveTab('orders')}>주문 내역 ({orders.length})</button>
          </div>
        </div>
        
        <div style={styles.body}>
          {activeTab === 'menu' ? (
            <>
              {/* 왼쪽: 메뉴 리스트 */}
              <div style={styles.menuSection}>
                <div style={styles.menuGrid}>
                  {menuItems.map(item => (
                    <div 
                      key={item.id} 
                      style={styles.menuItem} 
                      onClick={() => addToCart(item)}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ff7675'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                    >
                      <span style={styles.menuIcon}>{item.icon}</span>
                      <span style={styles.menuName}>{item.name}</span>
                      <span style={styles.menuPrice}>{item.price}원</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 오른쪽: 주문 내역 (사이드바) */}
              <div style={styles.sidebar}>
                <h3 style={styles.sidebarTitle}>주문서</h3>
                <select
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  style={styles.roomInput}
                >
                  <option value="">객실을 선택해주세요</option>
                  {occupiedRooms.map(room => (
                    <option key={room.id} value={room.roomNumber}>{room.roomNumber}호 ({room.guestName})</option>
                  ))}
                </select>
                
                <div style={styles.cartList}>
                  {cart.length === 0 ? (
                    <p style={{textAlign: 'center', color: '#aaa', marginTop: '20px'}}>메뉴를 선택해주세요</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} style={styles.cartRow}>
                        <div style={{display:'flex', flexDirection:'column'}}>
                          <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{item.icon} {item.name}</span>
                          <span style={{fontSize: '0.9rem', color: '#888'}}>{item.price}원</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                          <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}>-</button>
                          <span style={{fontWeight: 'bold', minWidth: '20px', textAlign: 'center', fontSize: '0.9rem'}}>{item.quantity}</span>
                          <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={styles.cartSummary}>
                  <div style={styles.cartTotal}>
                    <span>합계</span>
                    <span style={{color: '#e67e22'}}>{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}원</span>
                  </div>
                  <button 
                    style={{...styles.orderBtn, ...(cart.length === 0 ? styles.disabledBtn : {})}} 
                    onClick={handleOrder}
                    disabled={cart.length === 0}
                  >
                    주문하기
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{...styles.ordersContainer, display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {orders.length === 0 ? <p style={{textAlign: 'center', color: '#999'}}>접수된 주문이 없습니다.</p> : null}
              {orders.map(order => (
                <div key={order.id} style={styles.orderCard}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
                    <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>🚪 {order.roomNumber}호</span>
                    <span style={{color: '#888', fontSize: '0.9rem'}}>{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    {order.items.map((item, idx) => (
                      <li key={idx} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                        <span>{item.icon} {item.name} x{item.quantity}</span>
                        <span>{item.price * item.quantity}원</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{textAlign: 'right', marginTop: '10px', fontWeight: 'bold', color: '#e67e22'}}>
                    총 {order.totalPrice}원
                  </div>
                  <button style={styles.completeBtn} onClick={() => completeDelivery(order.id)}>🛵 배달 완료 (삭제)</button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RoomService;
