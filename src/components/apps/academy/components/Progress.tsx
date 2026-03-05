import { useState, useEffect } from 'react';
import { academyStore } from '../../../../store/academyStore';

const Progress = () => {
  const [stickers, setStickers] = useState(academyStore.getStickers());
  const [praiseMessage, setPraiseMessage] = useState(academyStore.getPraiseMessage());
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      const newStickers = academyStore.getStickers();
      setStickers(newStickers);
      if (newStickers === 20) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    };
    window.addEventListener('academy-stickers-updated', handleUpdate);

    const handlePraiseUpdate = () => setPraiseMessage(academyStore.getPraiseMessage());
    window.addEventListener('academy-praise-updated', handlePraiseUpdate);

    return () => {
      window.removeEventListener('academy-stickers-updated', handleUpdate);
      window.removeEventListener('academy-praise-updated', handlePraiseUpdate);
    };
  }, []);

  // 포도송이 (스티커 판) 생성
  const totalSlots = 20;
  const slots = Array.from({ length: totalSlots }, (_, i) => i < stickers);

  const handlePraiseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setPraiseMessage(newMessage);
    academyStore.savePraiseMessage(newMessage);
  };

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f3e5f5', // 연한 보라색 배경
      borderRadius: '15px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
      boxSizing: 'border-box' as const,
      overflow: 'hidden'
    },
    title: {
      marginTop: -20,
      marginLeft: -20,
      marginRight: -20,
      marginBottom: '20px',
      padding: '15px 20px',
      backgroundColor: '#FF7675', // 헤더 색상
      color: 'white',
      borderTopLeftRadius: '15px',
      borderTopRightRadius: '15px',
      textAlign: 'center' as const,
      fontSize: '1.3rem',
      fontWeight: 'bold' as const,
      flexShrink: 0,
    },
    mainContent: {
      display: 'flex',
      flex: 1,
      gap: '20px',
      overflow: 'hidden',
      marginTop: '20px',
    },
    leftPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflowY: 'auto' as const,
      paddingRight: '10px',
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflowY: 'auto' as const,
      paddingLeft: '10px',
      borderLeft: '2px dashed #e1bee7'
    },
    stickerBoard: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '10px',
      padding: '15px',
    },
    addButton: {
      backgroundColor: '#00b894',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '20px',
      fontSize: '1.2rem',
      cursor: 'pointer',
      marginBottom: '20px',
      fontFamily: 'Gaegu, cursive',
    },
    stickerSlot: (filled: boolean) => ({
      width: '100%',
      aspectRatio: '1/1',
      borderRadius: '50%',
      border: '2px dashed #ddd',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.5rem',
      backgroundColor: 'transparent',
      cursor: filled ? 'pointer' : 'default'
    }),
    praiseSection: {
      backgroundColor: '#fff',
      padding: '15px',
      borderRadius: '10px',
      borderLeft: '5px solid #fdcb6e',
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    praiseTextarea: {
      flex: 1,
      width: '100%',
      marginTop: '10px',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '1.1rem',
      fontFamily: 'Gaegu, cursive',
      resize: 'none' as const,
      boxSizing: 'border-box' as const,
      backgroundColor: '#fffaf0'
    },
    certificate: {
      border: '5px double #f1c40f',
      padding: '20px',
      textAlign: 'center' as const,
      backgroundColor: '#fff',
      marginTop: '20px'
    },
    certTitle: { fontSize: '1.5rem', color: '#f39c12', marginBottom: '10px' },
    certText: { fontSize: '1rem', lineHeight: '1.6' },
    confetti: {
      position: 'absolute' as const,
      top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '5rem',
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 100,
      animation: 'pop 0.5s ease-out'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📒 칭찬 스티커북</h2>

      <div style={styles.mainContent}>
        <div style={styles.leftPanel}>
          <div style={{ textAlign: 'center' }}>
            <button style={styles.addButton} onClick={() => academyStore.addSticker()}>
              🍇 스티커 받기
            </button>
          </div>
          <div style={styles.stickerBoard}>
            {slots.map((filled, idx) => (
              <div 
                key={idx} 
                style={styles.stickerSlot(filled)}
                onClick={() => filled && academyStore.removeSticker()}
              >
                {filled ? '🍇' : (idx + 1)}
              </div>
            ))}
          </div>
          {stickers == 20 && (
            <div style={styles.certificate}>
              <div style={styles.certTitle}>🏆 상 장 🏆</div>
              <div style={styles.certText}>
                위 학생은 학원 놀이에서<br/>
                열심히 공부하고 퀴즈를 잘 풀어<br/>
                이 상장을 수여합니다.<br/>
                <br/>
                <strong>망고 학원장</strong>
              </div>
            </div>
          )}
        </div>
        <div style={styles.rightPanel}>
          <div style={styles.praiseSection}>
            <strong>📢 선생님 말씀:</strong>
            <textarea
              style={styles.praiseTextarea}
              value={praiseMessage}
              onChange={handlePraiseChange}
              placeholder="칭찬 내용을 입력해주세요."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
