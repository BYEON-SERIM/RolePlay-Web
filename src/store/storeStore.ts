import { Product } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'store-products-state',
};

const initialProducts: Product[] = [
  { id: 1, name: '사과', icon: '🍎', price: 100, stock: 10 },
  { id: 2, name: '바나나', icon: '🍌', price: 50, stock: 20 },
  { id: 3, name: '초콜릿', icon: '🍫', price: 200, stock: 15 },
  { id: 4, name: '과자', icon: '🍪', price: 150, stock: 30 },
  { id: 5, name: '우유', icon: '🥛', price: 120, stock: 10 },
  { id: 6, name: '장난감 자동차', icon: '🚗', price: 500, stock: 5 },
  { id: 7, name: '인형', icon: '🧸', price: 800, stock: 8 },
  { id: 8, name: '공', icon: '⚽', price: 300, stock: 12 },
];


export const storeStore = {
  getProducts: (): Product[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      return JSON.parse(saved);
    }
    // 초기 데이터 저장
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    return initialProducts;
  },
  saveProducts: (products: Product[]) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    // 다른 컴포넌트들에게 변경 사항 알림
    window.dispatchEvent(new Event('store-products-updated'));
  },
};