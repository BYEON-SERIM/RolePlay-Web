import { useState, useEffect } from 'react';
import type { Product } from '../../../../types';
import { storeStore } from '../../../../store/storeStore';

interface CartItem extends Product {
  quantity: number;
}

const Payment = ({ onClose }: { onClose: () => void }) => {
  const [products, setProducts] = useState<Product[]>(() => storeStore.getProducts());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentStep, setPaymentStep] = useState<'cart' | 'inputAmount' | 'showChange'>('cart');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [change, setChange] = useState(0);

  // 다른 곳(물건 관리)에서 재고가 변경되면 계산기에도 반영
  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(storeStore.getProducts());
    };
    window.addEventListener('store-products-updated', handleProductsUpdate);
    return () => window.removeEventListener('store-products-updated', handleProductsUpdate);
  }, []);

  const addToCart = (product: Product) => {
    const productInStock = products.find(p => p.id === product.id);
    if (!productInStock || productInStock.stock <= 0) {
      alert('재고가 없습니다!');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= productInStock.stock) {
          alert('재고보다 많이 담을 수 없어요!');
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prevCart => {
      const itemToUpdate = prevCart.find(item => item.id === productId);
      if (!itemToUpdate) return prevCart;

      const newQuantity = itemToUpdate.quantity + delta;
      
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== productId);
      }

      const product = products.find(p => p.id === productId);
      if (product && newQuantity > product.stock) {
        alert('재고보다 많이 담을 수 없어요!');
        return prevCart;
      }

      return prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePaymentClick = () => {
    if (cart.length === 0) {
      alert('물건을 선택해주세요!');
      return;
    }
    setPaymentStep('inputAmount');
    setReceivedAmount(''); // 입력 필드 초기화
  };

  const processFinalPayment = () => {
    const received = parseInt(receivedAmount, 10) || 0;
    if (received < totalPrice) {
      alert('받은 금액이 부족해요!');
      return;
    }

    const calculatedChange = received - totalPrice;
    setChange(calculatedChange);

    // 재고 업데이트
    const currentProducts = storeStore.getProducts();
    const updatedProducts = currentProducts.map(p => {
      const cartItem = cart.find(item => item.id === p.id);
      return cartItem ? { ...p, stock: Math.max(0, p.stock - cartItem.quantity) } : p;
    });
    storeStore.saveProducts(updatedProducts);

    setPaymentStep('showChange');
  };

  const styles = {
    overlay: {
      position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0,
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
    },
    title: { margin: 0, fontSize: '1.3rem', fontWeight: 'bold' as const },
    closeBtn: {
      background: 'transparent', border: 'none', color: 'white', fontSize: '2rem',
      cursor: 'pointer', padding: 0, lineHeight: 1, boxShadow: 'none',
    },
    body: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'row' as const },
    menuSection: { flex: 1, padding: '20px', overflowY: 'auto' as const, backgroundColor: '#fafffa' },
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
    
    sidebar: { width: '320px', padding: '20px', backgroundColor: '#fff', borderLeft: '1px solid #eee', display: 'flex', flexDirection: 'column' as const },
    sidebarTitle: { marginTop: 0, marginBottom: '15px', fontSize: '1.2rem', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' },
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
    cartTotal: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '1.2rem', fontWeight: 'bold' as const },
    orderBtn: {
      width: '100%', padding: '15px', backgroundColor: '#2ecc71', color: 'white',
      border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' as const,
      cursor: 'pointer', boxShadow: '0 4px 6px rgba(46, 204, 113, 0.2)'
    },
    disabledBtn: { backgroundColor: '#bdc3c7', boxShadow: 'none', cursor: 'not-allowed' },
    // 결제 입력 스타일
    paymentInputSection: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '15px',
      height: '100%',
      justifyContent: 'center'
    },
    paymentInfoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '1.2rem',
      fontWeight: 'bold' as const,
      padding: '10px 0',
    },
    paymentInput: {
      width: '100%',
      padding: '15px',
      fontSize: '1.2rem',
      textAlign: 'right' as const,
      borderRadius: '10px',
      border: '2px solid #ff7675',
      boxSizing: 'border-box' as const,
    },
    changeDisplay: {
      padding: '20px', display: 'flex', flexDirection: 'column' as const,
      gap: '15px', height: '100%', justifyContent: 'center', textAlign: 'center' as const
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>🛒 계산하기</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <div style={styles.body}>
          <div style={styles.menuSection}>
            <div style={styles.menuGrid}>
              {products.map(item => (
                <div 
                  key={item.id} 
                  style={{...styles.menuItem, opacity: item.stock > 0 ? 1 : 0.5, cursor: item.stock > 0 ? 'pointer' : 'not-allowed'}} 
                  onClick={() => item.stock > 0 && addToCart(item)}
                  onMouseEnter={(e) => { if (item.stock > 0) e.currentTarget.style.borderColor = '#ff7675'; }}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <span style={styles.menuIcon}>{item.icon}</span>
                  <span style={styles.menuName}>{item.name}</span>
                  <span style={styles.menuPrice}>{item.price}원</span>
                  <span style={{fontSize: '0.8rem', color: '#888'}}>재고: {item.stock}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.sidebar}>
            {paymentStep === 'cart' && (
              <>
                <h3 style={styles.sidebarTitle}>계산할 물건</h3>
                <div style={styles.cartList}>
                  {cart.length === 0 ? (
                    <p style={{textAlign: 'center', color: '#aaa', marginTop: '20px'}}>물건을 선택해주세요</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} style={styles.cartRow}>
                        <div style={{display:'flex', flexDirection:'column', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
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
                    <span style={{color: '#e67e22'}}>{totalPrice.toLocaleString()}원</span>
                  </div>
                  <button style={{...styles.orderBtn, ...(cart.length === 0 ? styles.disabledBtn : {})}} onClick={handlePaymentClick} disabled={cart.length === 0}>
                    결제하기
                  </button>
                </div>
              </>
            )}

            {paymentStep === 'inputAmount' && (
              <div style={styles.paymentInputSection}>
                <h3 style={styles.sidebarTitle}>결제 진행</h3>
                <div style={styles.paymentInfoRow}>
                  <span>총 금액:</span>
                  <span style={{color: '#e67e22'}}>{totalPrice.toLocaleString()}원</span>
                </div>
                <input type="number" style={styles.paymentInput} value={receivedAmount} onChange={(e) => setReceivedAmount(e.target.value)} placeholder="받은 금액 입력" autoFocus onKeyDown={(e) => e.key === 'Enter' && processFinalPayment()} />
                <button style={styles.orderBtn} onClick={processFinalPayment}>금액 확인</button>
                <button style={{...styles.orderBtn, backgroundColor: '#95a5a6', boxShadow: 'none'}} onClick={() => setPaymentStep('cart')}>뒤로가기</button>
              </div>
            )}

            {paymentStep === 'showChange' && (
              <div style={styles.changeDisplay}>
                <h3 style={styles.sidebarTitle}>계산 완료! 🎶</h3>
                <div style={styles.paymentInfoRow}><span>받은 금액:</span> <span>{(parseInt(receivedAmount, 10) || 0).toLocaleString()}원</span></div>
                <div style={styles.paymentInfoRow}><span>거스름돈:</span> <span style={{color: '#e67e22'}}>{change.toLocaleString()}원</span></div>
                <p style={{fontSize: '1rem', color: '#555', marginTop: '20px'}}>결제가 완료되었습니다! 삑~</p>
                <button style={styles.orderBtn} onClick={onClose}>확인</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
