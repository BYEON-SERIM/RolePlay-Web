import { useState } from 'react';
import PracticeRoom from './PracticeRoom';
// 아직 만들지 않은 컴포넌트는 주석 처리합니다.
import TheoryLesson from './TheoryLesson';
import RecitalHall from './RecitalHall';
// @ts-ignore
import BottomNav from '../../../common/BottomNav';
 
// TODO: 이론 수업, 연주회 기능이 추가되면 타입을 확장해야 합니다.
type PianoView = 'practice' | 'theory' | 'recital';

const PianoAcademyPlay = () => {
  const [activeView, setActiveView] = useState<PianoView>('practice');

  const renderView = () => {
    switch (activeView) {
      case 'practice':
        return <PracticeRoom />;
      case 'theory':
        return <TheoryLesson />;
      case 'recital':
        return <RecitalHall />;
      default:
        return <PracticeRoom />;
    }
  };

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#E3F2FD', // 피아노 학원은 하늘색 테마
    },
    content: {
      flex: 1,
      overflow: 'hidden',
      padding: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>{renderView()}</div>
      <BottomNav activeMode="piano-academy" activeItem={activeView} onMenuClick={(view: any) => setActiveView(view as PianoView)} />
    </div>
  );
};

export default PianoAcademyPlay;