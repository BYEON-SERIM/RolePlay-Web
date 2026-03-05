import { useState, useEffect } from 'react';
import { Room } from '../../../../types';
import { hotelStore, createDefaultChecklist } from '../../../../store/hotelStore';

const RoomChecklist = () => {
  // 로컬 스토리지에서 객실 상태 불러오기
  const [rooms, setRooms] = useState<Room[]>(() => hotelStore.getRooms());

  // 객실 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    hotelStore.saveRooms(rooms);
  }, [rooms]);

  // 다른 컴포넌트(예약 장부)에서 데이터가 변경되었을 때 감지하여 업데이트
  useEffect(() => {
    const handleStorageUpdate = () => {
      setRooms(hotelStore.getRooms());
    };

    window.addEventListener('hotel-rooms-updated', handleStorageUpdate);
    return () => window.removeEventListener('hotel-rooms-updated', handleStorageUpdate);
  }, []);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalType, setModalType] = useState<'manage' | 'checkin' | null>(null);
  const [guestNameInput, setGuestNameInput] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  // 상태별로 객실 필터링
  const occupiedRooms = rooms.filter(room => room.status === 'occupied');
  const vacantRooms = rooms.filter(room => room.status === 'vacant');

  // 모달에 최신 room 정보를 전달하기 위해 현재 rooms 상태에서 선택된 room을 찾습니다.
  const currentSelectedRoom = rooms.find(r => r.id === selectedRoom?.id);

  // 객실 클릭 핸들러
  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    if (room.status === 'occupied') {
      setModalType('manage');
      setGuestNameInput(room.guestName || '');
      setIsEditingName(false);
    } else if (room.status === 'vacant') {
      setModalType('checkin');
      setGuestNameInput('');
    }
  };

  // 체크리스트 토글
  const handleChecklistToggle = (checklistItemId: number) => {
    if (!selectedRoom) return;

    setRooms(currentRooms => currentRooms.map(room => {
      if (room.id === selectedRoom.id) {
        const updatedChecklist = room.checklist.map(item =>
          item.id === checklistItemId ? { ...item, checked: !item.checked } : item
        );
        return { ...room, checklist: updatedChecklist };
      }
      return room;
    }));
  };

  // 체크인 처리
  const handleCheckIn = () => {
    if (selectedRoom && guestNameInput.trim()) {
      setRooms(currentRooms => currentRooms.map(r =>
        r.id === selectedRoom.id ? { ...r, status: 'occupied', guestName: guestNameInput, cleaningStatus: 'dirty', checklist: createDefaultChecklist() } : r
      ));
      closeModal();
    }
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setModalType(null);
    setIsEditingName(false);
  };

  // 체크아웃 처리
  const handleCheckOut = () => {
    if (selectedRoom) {
      setRooms(currentRooms => currentRooms.map(r =>
        r.id === selectedRoom.id
          ? { ...r, status: 'vacant', guestName: undefined, cleaningStatus: 'dirty', checklist: createDefaultChecklist() }
          : r
      ));
      closeModal();
    }
  };

  // 손님 이름 수정 처리
  const handleUpdateGuestName = () => {
    if (selectedRoom && guestNameInput.trim()) {
      setRooms(currentRooms => currentRooms.map(r => r.id === selectedRoom.id ? { ...r, guestName: guestNameInput } : r));
      setIsEditingName(false);
    }
  };

  // 스타일 객체
  const styles = {
    container: { 
      padding: '20px', backgroundColor: '#faeceb', borderRadius: '8px', height: '100%', boxSizing: 'border-box' as const,
      display: 'flex', flexDirection: 'column' as const, position: 'relative' as const 
    },
    header: {
      marginTop: -20,
      marginLeft: -20,
      marginRight: -20,
      marginBottom: '20px',
      padding: '15px 20px',
      backgroundColor: '#ff7675',
      color: 'white',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      textAlign: 'center' as const,
      fontSize: '1.3rem',
      fontWeight: 'bold' as const,
    },
    content: { display: 'flex', flex: 1, gap: '20px', overflow: 'hidden' }, // 좌우 배치를 위한 Flex 설정
    column: { 
      flex: 1, display: 'flex', flexDirection: 'column' as const, 
      backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '8px', padding: '10px' 
    },
    columnTitle: { fontSize: '1.1rem', color: '#555', marginBottom: '10px', textAlign: 'center' as const },
    roomList: { 
      listStyle: 'none', padding: 0, margin: 0, overflowY: 'auto' as const,
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', alignContent: 'start' 
    },
    roomItem: {
      padding: '15px',
      borderRadius: '8px',
      color: '#fff',
      textAlign: 'center' as const,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      cursor: 'pointer',
    },
    occupied: { backgroundColor: '#e74c3c' },
    vacant: { backgroundColor: '#2ecc71' },
    roomNumber: { fontWeight: 'bold', fontSize: '1.2rem', display: 'block' },
    guestName: { fontSize: '0.9rem', marginTop: '5px', display: 'block' },
    // 모달 스타일
    modalOverlay: {
      position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, borderRadius: '8px'
    },
    modal: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' as const },
    input: { width: '100%', padding: '10px', margin: '15px 0', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' as const },
    button: { width: '100%', padding: '12px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' },
    closeButton: { backgroundColor: '#95a5a6' },
    checkoutButton: { backgroundColor: '#e74c3c' },
    modalSection: { marginBottom: '20px' },
    modalActions: { marginTop: 'auto', display: 'flex', flexDirection: 'column' as const, gap: '10px' }
  };

  return (
    <div className="room-status" style={styles.container}>
      <h2 style={styles.header}>🏨 객실 현황</h2>

      <div style={styles.content}>
        {/* 왼쪽: 손님 있는 방 */}
        <div style={styles.column}>
          <h3 style={styles.columnTitle}>손님 있음 ({occupiedRooms.length})</h3>
          <ul style={styles.roomList}>
            {occupiedRooms.map(room => (
              <li key={room.id} style={{...styles.roomItem, ...styles.occupied}} onClick={() => handleRoomClick(room)}>
                <span style={styles.roomNumber}>{room.roomNumber}호</span>
                <span style={styles.guestName}>{room.guestName}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 오른쪽: 빈 방 */}
        <div style={styles.column}>
          <h3 style={styles.columnTitle}>빈 객실 ({vacantRooms.length})</h3>
          <ul style={styles.roomList}>
            {vacantRooms.map(room => (
              <li key={room.id} style={{...styles.roomItem, ...styles.vacant}} onClick={() => handleRoomClick(room)}>
                <span style={styles.roomNumber}>{room.roomNumber}호</span>
                <span style={styles.guestName}>입실 가능</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 모달 창 */}
      {modalType && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            {modalType === 'manage' && currentSelectedRoom && (
              <>
                <div style={{...styles.modalSection, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  {isEditingName ? (
                     <input type="text" value={guestNameInput} onChange={e => setGuestNameInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleUpdateGuestName()} style={{...styles.input, margin: 0, flex: 1}} autoFocus />
                  ) : (
                    <h3 style={{marginTop: 0, marginBottom: 0}}>👤 {currentSelectedRoom.guestName} ({currentSelectedRoom.roomNumber}호)</h3>
                  )}
                  <button onClick={() => isEditingName ? handleUpdateGuestName() : setIsEditingName(true)} style={{padding: '8px 12px', width: 'auto', marginLeft: '10px', fontSize: '0.9rem'}}>
                    {isEditingName ? '저장' : '수정'}
                  </button>
                </div>

                <div style={styles.modalSection}>
                  <h4 style={{marginTop: 0, marginBottom: '10px'}}>🧹 청소 체크리스트</h4>
                  <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    {currentSelectedRoom.checklist.map(item => (
                      <li key={item.id} style={{marginBottom: '10px', display: 'flex', alignItems: 'center'}}>
                        <input type="checkbox" id={`modal-check-${item.id}`} checked={item.checked} onChange={() => handleChecklistToggle(item.id)} style={{width: '20px', height: '20px', marginRight: '10px', cursor: 'pointer'}} />
                        <label htmlFor={`modal-check-${item.id}`} style={{textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? '#aaa' : '#333', cursor: 'pointer'}}>{item.text}</label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={styles.modalActions}>
                  <button style={{...styles.button, ...styles.checkoutButton}} onClick={handleCheckOut}>퇴실 (체크아웃)</button>
                  <button style={{...styles.button, ...styles.closeButton}} onClick={closeModal}>닫기</button>
                </div>
              </>
            )}

            {modalType === 'checkin' && (
              <>
                <h3 style={{marginTop: 0}}>🔑 {selectedRoom?.roomNumber}호 체크인</h3>
                <p>손님 이름을 입력해주세요:</p>
                <input
                  type="text"
                  value={guestNameInput}
                  onChange={e => setGuestNameInput(e.target.value)}
                  style={styles.input}
                  placeholder="손님 이름"
                  onKeyDown={e => e.key === 'Enter' && handleCheckIn()}
                  autoFocus
                />
                <div style={styles.modalActions}>
                  <button style={{...styles.button, backgroundColor: '#2ecc71'}} onClick={handleCheckIn}>체크인</button>
                  <button style={{...styles.button, ...styles.closeButton}} onClick={closeModal}>취소</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomChecklist;