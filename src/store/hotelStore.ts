import { Room, Reservation, Order } from '../types';

const STORAGE_KEYS = {
  ROOMS: 'hotel-rooms-state',
  RESERVATIONS: 'hotel-reservations',
  ORDERS: 'hotel-room-service-orders',
};

// Helper to create a fresh checklist
export const createDefaultChecklist = () => [
  { id: 1, text: '침대 정리하기', checked: false },
  { id: 2, text: '수건 교체하기', checked: false },
  { id: 3, text: '어메니티 채우기', checked: false },
  { id: 4, text: '청소기 돌리기', checked: false },
  { id: 5, text: '창문 열어 환기하기', checked: false },
];

const initialRooms: Room[] = [
  { id: 1, roomNumber: '101', status: 'occupied', cleaningStatus: 'dirty', guestName: '김망고', checklist: createDefaultChecklist() },
  { id: 2, roomNumber: '102', status: 'vacant', cleaningStatus: 'cleaned', checklist: createDefaultChecklist() },
  { id: 3, roomNumber: '103', status: 'vacant', cleaningStatus: 'cleaned', checklist: createDefaultChecklist() },
  { id: 4, roomNumber: '201', status: 'vacant', cleaningStatus: 'cleaned', checklist: createDefaultChecklist() },
  { id: 5, roomNumber: '202', status: 'vacant', cleaningStatus: 'cleaned', checklist: createDefaultChecklist() },
  { id: 6, roomNumber: '203', status: 'vacant', cleaningStatus: 'cleaned', checklist: createDefaultChecklist() },
];

export const hotelStore = {
  getRooms: (): Room[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
    return saved ? JSON.parse(saved) : initialRooms;
  },
  saveRooms: (rooms: Room[]) => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    // 다른 컴포넌트들에게 변경 사항 알림
    window.dispatchEvent(new Event('hotel-rooms-updated'));
  },
  getReservations: (): Reservation[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return saved ? JSON.parse(saved) : [];
  },
  saveReservations: (reservations: Reservation[]) => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  },
  getOrders: (): Order[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : [];
  },
  saveOrders: (orders: Order[]) => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }
};