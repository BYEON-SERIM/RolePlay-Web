import React, { useState } from 'react';

// 피아노 소리 파일 import
import c4 from '../../../../assets/sounds/piano/c4.mp3';
import d4 from '../../../../assets/sounds/piano/d4.mp3';
import e4 from '../../../../assets/sounds/piano/e4.mp3';
import f4 from '../../../../assets/sounds/piano/f4.mp3';
import g4 from '../../../../assets/sounds/piano/g4.mp3';
import a4 from '../../../../assets/sounds/piano/a4.mp3';
import b4 from '../../../../assets/sounds/piano/b4.mp3';
import c5 from '../../../../assets/sounds/piano/c5.mp3';

import cs4 from '../../../../assets/sounds/piano/cs4.mp3';
import ds4 from '../../../../assets/sounds/piano/ds4.mp3';
import fs4 from '../../../../assets/sounds/piano/fs4.mp3';
import gs4 from '../../../../assets/sounds/piano/gs4.mp3';
import as4 from '../../../../assets/sounds/piano/as4.mp3';

// 각 건반 컴포넌트
const PianoKey = ({ note, type, left, playNote }: { note: string, type: 'white' | 'black', left?: number, playNote: (note: string) => void }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
    playNote(note);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  const baseStyle: React.CSSProperties = {
    position: type === 'black' ? 'absolute' : 'relative',
    left: type === 'black' ? `${left}px` : undefined,
    cursor: 'pointer',
    userSelect: 'none',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
    transition: 'all 0.05s ease', // 빠른 반응 속도
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: '10px',
    fontWeight: 'bold',
    zIndex: type === 'black' ? 10 : 1,
  };

  const whiteStyle: React.CSSProperties = {
    ...baseStyle,
    width: '80px', // 너비 증가
    height: '300px', // 높이 증가
    backgroundColor: isPressed ? '#f5f5f5' : 'white',
    border: '1px solid #999',
    boxShadow: isPressed 
      ? 'inset 0 2px 5px rgba(0,0,0,0.2)' 
      : '0 5px 5px rgba(0,0,0,0.1), inset 0 -5px 10px rgba(0,0,0,0.05)',
    transform: isPressed ? 'translateY(2px) rotateX(-2deg)' : 'none', // 살짝 눌리는 느낌
    transformOrigin: 'top',
    color: '#333',
  };

  const blackStyle: React.CSSProperties = {
    ...baseStyle,
    width: '48px', // 너비 증가
    height: '180px', // 높이 증가
    backgroundColor: isPressed ? '#333' : '#111',
    border: '1px solid #000',
    boxShadow: isPressed
      ? 'inset 0 2px 5px rgba(255,255,255,0.1)'
      : '2px 4px 5px rgba(0,0,0,0.4), inset 0 -5px 10px rgba(255,255,255,0.1)',
    transform: isPressed ? 'translateY(2px) rotateX(-2deg)' : 'none',
    transformOrigin: 'top',
    color: 'white',
    fontSize: '0.8rem',
  };

  return (
    <div
      style={type === 'white' ? whiteStyle : blackStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={(e) => { e.preventDefault(); handleMouseDown(); }}
      onTouchEnd={(e) => { e.preventDefault(); handleMouseUp(); }}
    >
      {note}
    </div>
  );
};

const PracticeRoom = ({ isEmbedded = false }: { isEmbedded?: boolean }) => {
  const [volume, setVolume] = useState(0.5);
  const whiteKeys = ['도', '레', '미', '파', '솔', '라', '시', '도↑'];
  // 검은 건반 위치 정보 (index는 흰 건반 사이 위치를 의미)
  // 건반 크기가 커져서 위치 재조정
  const blackKeys = [
    { note: '도#', position: 56 },   // 80 - (48/2) = 56
    { note: '레#', position: 136 },  // 80*2 - (48/2) = 136
    { note: '파#', position: 296 },  // 80*4 - (48/2) = 296
    { note: '솔#', position: 376 },  // 80*5 - (48/2) = 376
    { note: '라#', position: 456 },  // 80*6 - (48/2) = 456
  ];

  // 음계와 사운드 파일 매핑
  const noteToSound: { [key: string]: string } = {
    '도': c4,
    '레': d4,
    '미': e4,
    '파': f4,
    '솔': g4,
    '라': a4,
    '시': b4,
    '도↑': c5,
    '도#': cs4,
    '레#': ds4,
    '파#': fs4,
    '솔#': gs4,
    '라#': as4,
  };

  const handlePlayNote = (note: string) => {
    const soundFile = noteToSound[note];
    if (soundFile) {
      const audio = new Audio(soundFile);
      audio.volume = volume;
      audio.play();
    }
  };

  const styles = {
    container: {
      padding: '20px',
      textAlign: 'center' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },
    controls: {
      margin: '20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      backgroundColor: 'white',
      padding: '10px 25px',
      borderRadius: '30px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    piano: {
      display: 'flex',
      justifyContent: 'center',
      position: 'relative' as const,
      marginTop: '50px',
      backgroundColor: '#2c3e50', // 피아노 본체 색상
      padding: '20px 20px 0 20px',
      borderRadius: '10px',
      boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
    }
  };

  return (
    <div style={styles.container}>
      {!isEmbedded && (
        <>
          <h2>🎹 연습실</h2>
          <p>자유롭게 피아노를 연주해보세요!</p>
          
          <div style={styles.controls}>
            <span style={{ fontSize: '1.5rem' }}>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ width: '150px', cursor: 'pointer' }}
            />
          </div>
        </>
      )}

      <div style={styles.piano}>
        {/* 흰 건반 렌더링 */}
        {whiteKeys.map((note) => (
          <PianoKey key={note} note={note} type="white" playNote={handlePlayNote} />
        ))}
        {/* 검은 건반 렌더링 (위치 조정 필요) */}
        {blackKeys.map((item) => (
          <PianoKey 
            key={item.note} 
            note={item.note} 
            type="black" 
            left={item.position} 
            playNote={handlePlayNote} 
          />
        ))}
      </div>
    </div>
  );
};

export default PracticeRoom;