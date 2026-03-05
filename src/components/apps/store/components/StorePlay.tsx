import ProductList from './ProductList';

const StorePlay = () => {
  return (
    <div style={{ padding: '1rem', height: '100%', boxSizing: 'border-box', position: 'relative' }}>
      {/* 가게 놀이의 기본 화면으로 물건 리스트(재고 관리)를 보여줍니다 */}
      <ProductList />
    </div>
  );
};

export default StorePlay;