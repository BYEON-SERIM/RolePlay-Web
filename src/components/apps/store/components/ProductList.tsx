import { useState, useEffect } from 'react';
import type { Product } from '../../../../types';
import { storeStore } from '../../../../store/storeStore';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>(() => storeStore.getProducts());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductIcon, setNewProductIcon] = useState('🎁');

  // 계산기 등 다른 곳에서 재고가 변경되었을 때 화면을 업데이트
  useEffect(() => {
    const handleStorageUpdate = () => {
      setProducts(storeStore.getProducts());
    };

    window.addEventListener('store-products-updated', handleStorageUpdate);
    return () => window.removeEventListener('store-products-updated', handleStorageUpdate);
  }, []);

  const handleAddProduct = () => {
    if (!newProductName || !newProductPrice) {
      alert('상품 이름과 가격을 입력해주세요!');
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: newProductName,
      icon: newProductIcon || '🎁',
      price: parseInt(newProductPrice, 10),
      stock: 10 // 기본 재고
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    storeStore.saveProducts(updatedProducts);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductIcon('🎁');
    setShowAddForm(false);
  };

  const handleStockChange = (productId: number, delta: number) => {
    const updatedProducts = products.map(p =>
      p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
    );
    setProducts(updatedProducts);
    storeStore.saveProducts(updatedProducts);
  };

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#faeceb', // 연한 핑크 (호텔 놀이와 통일)
      borderRadius: '8px',
      height: '100%',
      boxSizing: 'border-box' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      position: 'relative' as const,
    },
    header: {
      marginTop: -20,
      marginLeft: -20,
      marginRight: -20,
      marginBottom: '20px',
      padding: '15px 20px',
      backgroundColor: '#ff7675', // 체리색
      color: 'white',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      textAlign: 'center' as const,
      fontSize: '1.3rem',
      fontWeight: 'bold' as const,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative' as const,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '20px',
      overflowY: 'auto' as const,
      padding: '10px',
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '20px',
      textAlign: 'center' as const,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
    },
    productIcon: {
      fontSize: '3.5rem',
      marginBottom: '15px',
    },
    productInfo: {
      marginBottom: '15px',
    },
    productName: {
      fontWeight: 'bold' as const,
      fontSize: '1.2rem',
      marginBottom: '5px',
    },
    productPrice: {
      color: '#e67e22',
      fontWeight: 'bold' as const,
      fontSize: '1.1rem',
    },
    stockControl: {
      borderTop: '1px solid #f0f0f0',
      paddingTop: '15px',
    },
    stockLabel: {
      fontSize: '0.9rem',
      color: '#888',
      marginBottom: '10px',
      display: 'block',
    },
    stockButtons: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
    },
    stockValue: {
      fontWeight: 'bold' as const,
      fontSize: '1.2rem',
      minWidth: '30px',
    },
    qtyBtn: {
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: '#ecf0f1',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.5rem',
      color: '#2c3e50',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: 0,
      lineHeight: 1,
    },
    addBtn: {
      position: 'absolute' as const,
      right: '20px',
      backgroundColor: 'white',
      color: '#ff7675',
      border: 'none',
      borderRadius: '20px',
      padding: '5px 15px',
      fontSize: '0.9rem',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    addForm: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '12px',
      marginBottom: '20px',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      flexWrap: 'wrap' as const
    },
    input: {
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #eee',
      flex: 1,
      minWidth: '100px',
      fontSize: '1rem'
    },
    iconInput: {
      width: '50px',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #eee',
      textAlign: 'center' as const,
      fontSize: '1.2rem'
    },
    confirmBtn: {
      padding: '10px 20px',
      backgroundColor: '#ff7675',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold' as const,
      whiteSpace: 'nowrap' as const
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>🛒 물건 관리</span>
        <button style={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '닫기' : '+ 물건 추가'}
        </button>
      </div>
      
      {showAddForm && (
        <div style={styles.addForm}>
          <input style={styles.iconInput} value={newProductIcon} onChange={(e) => setNewProductIcon(e.target.value)} placeholder="이모지" />
          <input style={styles.input} value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder="상품 이름" />
          <input style={styles.input} type="number" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} placeholder="가격" />
          <button style={styles.confirmBtn} onClick={handleAddProduct}>추가</button>
        </div>
      )}

      <div style={styles.grid}>
        {products.map(product => (
          <div key={product.id} style={styles.productCard}>
            <div>
              <div style={styles.productIcon}>{product.icon}</div>
              <div style={styles.productInfo}>
                <div style={styles.productName}>{product.name}</div>
                <div style={styles.productPrice}>{product.price}원</div>
              </div>
            </div>
            <div style={styles.stockControl}>
              <span style={styles.stockLabel}>재고</span>
              <div style={styles.stockButtons}>
                <button style={styles.qtyBtn} onClick={() => handleStockChange(product.id, -1)}>-</button>
                <span style={styles.stockValue}>{product.stock}</span>
                <button style={styles.qtyBtn} onClick={() => handleStockChange(product.id, 1)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;