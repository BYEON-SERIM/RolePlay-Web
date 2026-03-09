import React from 'react';

// 피아노 소리 파일 import
import c4 from '../../../assets/sounds/piano/c4.mp3';
import d4 from '../../../assets/sounds/piano/d4.mp3';
import e4 from '../../../assets/sounds/piano/e4.mp3';
import f4 from '../../../assets/sounds/piano/f4.mp3';
import g4 from '../../../assets/sounds/piano/g4.mp3';
import a4 from '../../../assets/sounds/piano/a4.mp3';
import b4 from '../../../assets/sounds/piano/b4.mp3';
// import b4 from '../../../assets/sounds/b4.mp3'; // '시' 음계 파일. c4~a4까지 있다고 하셔서 b4.mp3가 없을 수 있어요.

// 각 건반 컴포넌트
const PianoKey = ({ note, isBlack = false, playNote }: { note: string, isBlack?: boolean, playNote: (note: string) => void }) => {
  const keyStyle = {
    // 흰 건반과 검은 건반 스타일
    width: isBlack ? '40px' : '60px',
    height: isBlack ? '120px' : '200px',
    backgroundColor: isBlack ? 'black' : 'white',
    border: '1px solid #333',
    color: isBlack ? 'white' : 'black',
    position: isBlack ? 'absolute' as const : 'relative' as const,
    // 검은 건반 위치 조정을 위한 추가 스타일
    // ...
  };

  return <button style={keyStyle} onClick={() => playNote(note)}>{note}</button>;
};

const PracticeRoom = () => {
  const whiteKeys = ['도', '레', '미', '파', '솔', '라', '시'];
  const blackKeys = ['도#', '레#', '파#', '솔#', '라#'];

  // 음계와 사운드 파일 매핑
  const noteToSound: { [key: string]: string } = {
    '도': c4,
    '레': d4,
    '미': e4,
    '파': f4,
    '솔': g4,
    '라': a4,
    '시': b4,
  };

  const handlePlayNote = (note: string) => {
    const soundFile = noteToSound[note];
    if (soundFile) {
      new Audio(soundFile).play();
    }
  };

  const styles = {
    container: {
      padding: '20px',
      textAlign: 'center' as const,
    },
    piano: {
      display: 'flex',
      justifyContent: 'center',
      position: 'relative' as const,
      marginTop: '50px',
    }
  };

  return (
    <div style={styles.container}>
      <h2>🎹 연습실</h2>
      <p>자유롭게 피아노를 연주해보세요!</p>
      <div style={styles.piano}>
        {/* 흰 건반 렌더링 */}
        {whiteKeys.map((note) => (
          <PianoKey key={note} note={note} playNote={handlePlayNote} />
        ))}
        {/* 검은 건반 렌더링 (위치 조정 필요) */}
        {/* {blackKeys.map((note) => <PianoKey key={note} note={note} isBlack playNote={handlePlayNote} />)} */}
      </div>
    </div>
  );
};

export default PracticeRoom;