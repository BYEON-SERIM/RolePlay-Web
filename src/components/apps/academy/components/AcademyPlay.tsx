// c:\DEV_SRC\PP\MangoYoon\src\components\apps\academy\components\AcademyPlay.tsx
import { useState } from 'react';
import Attendance from './Attendance';
import Classroom from './Classroom';
import BottomNav from '../../../common/BottomNav';
import Progress from './Progress';

type AcademyView = 'classroom' | 'attendance' | 'progress';

const AcademyPlay = () => {
  const [activeView, setActiveView] = useState<AcademyView>('classroom');

  const renderView = () => {
    switch (activeView) {
      case 'classroom':
        return <Classroom />;
      case 'attendance':
        return <Attendance />;
      case 'progress':
        return <Progress />;
      default:
        return <Classroom />;
    }
  };

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#FFF0F5',
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
      <BottomNav activeMode="academy" activeItem={activeView} onMenuClick={setActiveView} />
    </div>
  );
};

export default AcademyPlay;
