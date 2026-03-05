export interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}

export type CleaningStatus = 'cleaned' | 'cleaning' | 'dirty';

export interface Room {
  id: number;
  roomNumber: string;
  status: 'vacant' | 'occupied';
  cleaningStatus: CleaningStatus;
  guestName?: string;
  checklist: ChecklistItem[];
}

export interface Reservation {
  id: number;
  guestName: string;
}

export interface ReceiptData {
  guestName: string;
  roomNumber: string;
  checkInTime: string;
}

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  price: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: number;
  roomNumber: string;
  items: CartItem[];
  totalPrice: number;
  timestamp: number;
}

export interface Product {
  id: number;
  name: string;
  icon: string;
  price: number;
  stock: number;
}