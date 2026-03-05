import { useState, useEffect } from 'react';
import { Room, Reservation, ReceiptData } from '../../../../types';
import { hotelStore, createDefaultChecklist } from '../../../../store/hotelStore';

const ReservationBook = ({ onClose }: { onClose: () => void }) => {
  // 예약 목록 상태
  const [reservations, setReservations] = useState<Reservation[]>(() => hotelStore.getReservations());

  // 빈 객실 목록 상태
  const [vacantRooms, setVacantRooms] = useState<Room[]>([]);
  // 새 예약 손님 이름 입력 상태
  const [newGuestName, setNewGuestName] = useState('');
  // 각 예약에 대해 선택된 객실 상태
  const [selectedRoomForReservation, setSelectedRoomForReservation] = useState<{ [key: number]: string }>({});
  // 영수증 데이터 상태
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  // 알림 및 확인 모달 상태
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(null);

  // 예약 목록이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    hotelStore.saveReservations(reservations);
  }, [reservations]);

  // 컴포넌트가 열릴 때 빈 객실 목록을 불러옴
  useEffect(() => {
    const allRooms = hotelStore.getRooms();
    setVacantRooms(allRooms.filter(room => room.status === 'vacant'));
  }, []);

  // 예약 추가 핸들러
  const handleAddReservation = () => {
    if (newGuestName.trim() === '') {
      setAlertMessage('예약자 이름을 입력해주세요.');
      return;
    }
    const newReservation: Reservation = {
      id: Date.now(),
      guestName: newGuestName.trim(),
    };
    setReservations([...reservations, newReservation]);
    setNewGuestName('');
  };

  // 예약 삭제 핸들러
  const handleDeleteReservation = (id: number) => {
    setReservationToCancel(id);
  };

  const confirmCancelReservation = () => {
    if (reservationToCancel !== null) {
      setReservations(reservations.filter(res => res.id !== reservationToCancel));
      setReservationToCancel(null);
    }
  };
  
  // 체크인 핸들러
  const handleCheckIn = (reservation: Reservation) => {
    const roomId = selectedRoomForReservation[reservation.id];
    if (!roomId) {
      setAlertMessage('체크인할 객실을 선택해주세요.');
      return;
    }

    let allRooms = hotelStore.getRooms();

    // 객실 상태 업데이트
    allRooms = allRooms.map(room => {
      if (room.roomNumber === roomId) {
        return { ...room, status: 'occupied', guestName: reservation.guestName, cleaningStatus: 'dirty', checklist: createDefaultChecklist() };
      }
      return room;
    });

    // 업데이트된 객실 상태를 다시 저장
    hotelStore.saveRooms(allRooms);

    // 예약 목록에서 해당 예약 제거
    setReservations(reservations.filter(res => res.id !== reservation.id));

    // 영수증 데이터 설정 (알림 대신 영수증 표시)
    setReceiptData({
      guestName: reservation.guestName,
      roomNumber: roomId,
      checkInTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const styles = {
    overlay: {
      position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    modal: {
      backgroundColor: '#fff', width: '90%', maxWidth: '500px', height: '80vh',
      borderRadius: '20px', display: 'flex', flexDirection: 'column' as const,
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)', overflow: 'hidden',
      position: 'relative' as const
    },
    header: {
      padding: '20px', backgroundColor: '#ff7675', color: 'white',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    title: { margin: 0, fontSize: '1.3rem', fontWeight: 'bold' as const },
    closeBtn: {
      background: 'none', border: 'none', color: 'white', fontSize: '2rem',
      cursor: 'pointer', padding: 0, lineHeight: 1,  boxShadow: 'none',
    },
    content: {
      padding: '20px', flex: 1, overflowY: 'auto' as const, display: 'flex', flexDirection: 'column' as const
    },
    addForm: {
      display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center'
    },
    input: {
      flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem'
    },
    button: {
      padding: '12px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#ff7675', 
      color: 'white', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '14px'
    },
    list: {
      listStyle: 'none', padding: 0, margin: 0, flex: 1
    },
    listItem: {
      backgroundColor: 'white', padding: '15px', borderRadius: '12px',
      marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column' as const, gap: '10px'
    },
    guestName: {
      fontWeight: 'bold' as const, fontSize: '1.2rem'
    },
    checkInArea: {
      display: 'flex', gap: '10px', alignItems: 'center'
    },
    select: {
      flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem'
    },
    checkInBtn: {
      padding: '10px 15px', borderRadius: '12px', border: 'none', backgroundColor: '#2ecc71',
      color: 'white', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '13px',
      boxShadow: '0 4px 6px rgba(46, 204, 113, 0.2)'
    },
    cancelBtn: {
      padding: '10px 15px', borderRadius: '12px', border: 'none', backgroundColor: '#ff7675',
      color: 'white', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '13px',
      boxShadow: '0 4px 6px rgba(255, 118, 117, 0.2)'
    },
    // 영수증 스타일
    receiptOverlay: {
      position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 20,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      backdropFilter: 'blur(2px)'
    },
    receipt: {
      backgroundColor: '#fff', padding: '30px', width: '280px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      fontFamily: '"Courier New", Courier, monospace', // 영수증 느낌 폰트
      textAlign: 'center' as const,
      borderTop: '10px solid #333',
      borderBottom: '10px solid #333',
    },
    receiptHeader: {
      borderBottom: '2px dashed #333', paddingBottom: '15px', marginBottom: '20px',
      fontSize: '1.5rem', fontWeight: 'bold' as const, letterSpacing: '2px'
    },
    receiptRow: {
      display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '1.1rem', color: '#333', fontWeight: 'bold' as const
    },
    receiptFooter: {
      borderTop: '2px dashed #333', paddingTop: '20px', marginTop: '20px',
      fontSize: '0.9rem', color: '#666', lineHeight: 1.5
    },
    receiptBtn: {
      marginTop: '25px', width: '100%', padding: '12px', backgroundColor: '#333', color: '#fff', border: 'none', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' as const
    },
    // 커스텀 알림/확인 창 스타일
    dialogBox: {
      backgroundColor: '#fff', padding: '25px', width: '280px', borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)', textAlign: 'center' as const,
      display: 'flex', flexDirection: 'column' as const, gap: '20px'
    },
    dialogMessage: {
      fontSize: '1.1rem', color: '#333', fontWeight: 'bold' as const, lineHeight: '1.4'
    },
    dialogButtons: { display: 'flex', gap: '10px' },
    dialogBtn: {
      flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '1rem'
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>📅 예약 장부</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.content}>
          <div style={styles.addForm}>
            <input
              style={styles.input}
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              placeholder="예약 손님 이름"
              onKeyDown={(e) => e.key === 'Enter' && handleAddReservation()}
            />
            <button style={styles.button} onClick={handleAddReservation}>예약 추가</button>
          </div>

          <ul style={styles.list}>
            {reservations.length === 0 && <p style={{textAlign: 'center', color: '#888'}}>대기중인 예약이 없습니다.</p>}
            {reservations.map(res => (
              <li key={res.id} style={styles.listItem}>
                <span style={styles.guestName}>👤 {res.guestName}</span>
                <div style={styles.checkInArea}>
                  <select
                    style={styles.select}
                    value={selectedRoomForReservation[res.id] || ''}
                    onChange={(e) => setSelectedRoomForReservation({ ...selectedRoomForReservation, [res.id]: e.target.value })}
                  >
                    <option value="">객실 선택</option>
                    {vacantRooms.map(room => (
                      <option key={room.id} value={room.roomNumber}>{room.roomNumber}호</option>
                    ))}
                  </select>
                  <button style={styles.checkInBtn} onClick={() => handleCheckIn(res)}>체크인</button>
                  <button style={styles.cancelBtn} onClick={() => handleDeleteReservation(res.id)}>예약 취소</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 영수증 팝업 */}
        {receiptData && (
          <div style={styles.receiptOverlay}>
            <div style={styles.receipt}>
              <div style={styles.receiptHeader}>RECEIPT</div>
              <div style={styles.receiptRow}>
                <span>GUEST</span>
                <span>{receiptData.guestName}</span>
              </div>
              <div style={styles.receiptRow}>
                <span>ROOM</span>
                <span>{receiptData.roomNumber}</span>
              </div>
              <div style={styles.receiptRow}>
                <span>TIME</span>
                <span>{receiptData.checkInTime}</span>
              </div>
              <div style={styles.receiptFooter}>
                망고 호텔을 이용해주셔서<br/>감사합니다! 🏨
              </div>
              <button style={styles.receiptBtn} onClick={onClose}>확인</button>
            </div>
          </div>
        )}

        {/* 알림 모달 */}
        {alertMessage && (
          <div style={styles.receiptOverlay} onClick={() => setAlertMessage(null)}>
            <div style={styles.dialogBox} onClick={e => e.stopPropagation()}>
              <div style={styles.dialogMessage}>{alertMessage}</div>
              <button style={{...styles.dialogBtn, backgroundColor: '#2ecc71', color: 'white'}} onClick={() => setAlertMessage(null)}>확인</button>
            </div>
          </div>
        )}

        {/* 예약 취소 확인 모달 */}
        {reservationToCancel !== null && (
          <div style={styles.receiptOverlay} onClick={() => setReservationToCancel(null)}>
            <div style={styles.dialogBox} onClick={e => e.stopPropagation()}>
              <div style={styles.dialogMessage}>이 예약을 취소하시겠습니까?</div>
              <div style={styles.dialogButtons}>
                <button style={{...styles.dialogBtn, backgroundColor: '#ff7675', color: 'white'}} onClick={confirmCancelReservation}>네, 취소합니다</button>
                <button style={{...styles.dialogBtn, backgroundColor: '#e0e0e0', color: '#333'}} onClick={() => setReservationToCancel(null)}>아니오</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationBook;