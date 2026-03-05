import React from 'react';
import './BottomNav.css';

const BottomNav = ({ activeMode, activeItem, onMenuClick }) => {
  if (!activeMode) return null;

  const menus = {
    store: [
      { id: 'payment', icon: '🛒', label: '계산하기' },
      { id: 'calculator', icon: '🧮', label: '계산기' },
    ],
    hotel: [
      { id: 'room-check', icon: '🛏️', label: '객실 현황' },
      { id: 'reservations', icon: '📅', label: '예약 장부' },
      { id: 'room-service', icon: '🍽️', label: '룸서비스' },
    ],
    academy: [
      { id: 'classroom', icon: '👨‍🏫', label: '수업/퀴즈' },
      { id: 'attendance', icon: '📋', label: '출석부' },
      { id: 'progress', icon: '📒', label: '칭찬 스티커' },
    ],
  };

  const currentMenus = menus[activeMode] || [];

  if (currentMenus.length === 0) return null;

  return (
    <div className="bottom-nav">
      {currentMenus.map((menu) => (
        <button
          key={menu.id}
          className={`nav-item ${activeItem === menu.id ? 'active' : ''}`}
          onClick={() => onMenuClick && onMenuClick(menu.id)}
        >
          <span className="nav-icon">{menu.icon}</span>
          <span className="nav-label">{menu.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;