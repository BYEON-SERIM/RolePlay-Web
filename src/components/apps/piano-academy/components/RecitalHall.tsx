import React, { useState } from 'react';
import clapSound from '../../../../assets/sounds/Clap.mp3';
import PracticeRoom from './PracticeRoom';

const RecitalHall = () => {
  const [isClapping, setIsClapping] = useState(false);

  const handleClap = () => {
    const audio = new Audio(clapSound);
    audio.play().catch(() => {
      console.log('박수 소리 파일(Clap.mp3)을 assets/sounds 폴더에 넣어주세요!');
    });
    setIsClapping(true);
    setTimeout(() => setIsClapping(false), 2000);
  };

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: '#222',
      position: 'relative' as const,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stage: {
      width: '80%',
      height: '60%',
      backgroundColor: '#d35400',
      borderTop: '10px solid #a04000',
      position: 'relative' as const,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
    },
    curtainLeft: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '15%',
      height: '100%',
      backgroundColor: '#c0392b',
      zIndex: 2,
      borderRadius: '0 0 50px 0',
      boxShadow: '5px 0 15px rgba(0,0,0,0.5)',
    },
    curtainRight: {
      position: 'absolute' as const,
      top: 0,
      right: 0,
      width: '15%',
      height: '100%',
      backgroundColor: '#c0392b',
      zIndex: 2,
      borderRadius: '0 0 0 50px',
      boxShadow: '-5px 0 15px rgba(0,0,0,0.5)',
    },
    curtainTop: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '80px',
      backgroundColor: '#a93226',
      zIndex: 3,
      borderRadius: '0 0 50% 50% / 0 0 30px 30px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
    },
    spotlight: {
      position: 'absolute' as const,
      top: '-20%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '300px',
      height: '100%',
      background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
      pointerEvents: 'none' as const,
      zIndex: 4,
    },
    button: {
      marginTop: '30px',
      padding: '15px 40px',
      fontSize: '1.5rem',
      backgroundColor: '#f1c40f',
      color: '#333',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      fontWeight: 'bold',
      boxShadow: '0 5px 15px rgba(241, 196, 15, 0.4)',
      zIndex: 10,
      transition: 'transform 0.1s',
      transform: isClapping ? 'scale(0.95)' : 'scale(1)',
    },
    clapEffect: {
      position: 'absolute' as const,
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '3rem',
      color: 'white',
      fontWeight: 'bold',
      textShadow: '0 0 10px #f1c40f',
      zIndex: 20,
      animation: 'pop 0.5s ease-out',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.curtainTop}></div>
      <div style={styles.curtainLeft}></div>
      <div style={styles.curtainRight}></div>
      <div style={styles.spotlight}></div>
      
      <div style={styles.stage}>
        <PracticeRoom isEmbedded={true} />
      </div>

      <button style={styles.button} onClick={handleClap}>
        👏 박수 치기
      </button>

      {isClapping && (
        <div style={styles.clapEffect}>
          와아아!!! 👏👏👏
        </div>
      )}
    </div>
  );
};

export default RecitalHall;