import { useState, useEffect } from 'react';
import { academyStore, Student } from '../../../../store/academyStore';

const Attendance = () => {
  const [students, setStudents] = useState<Student[]>(academyStore.getStudents());
  const [newStudentName, setNewStudentName] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setStudents(academyStore.getStudents());
    window.addEventListener('academy-students-updated', handleUpdate);
    return () => window.removeEventListener('academy-students-updated', handleUpdate);
  }, []);

  const handleStatusChange = (id: number, status: 'present' | 'left') => {
    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    
    const updated = students.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status,
          arrivalTime: status === 'present' ? now : s.arrivalTime,
          departureTime: status === 'left' ? now : s.departureTime
        };
      }
      return s;
    });
    academyStore.saveStudents(updated);
  };

  const handleAllPresent = () => {
    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    const updated = students.map(s => ({ 
      ...s, 
      status: 'present' as const, 
      arrivalTime: s.arrivalTime || now 
    }));
    academyStore.saveStudents(updated);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      academyStore.addStudent(newStudentName);
      setNewStudentName('');
    }
  };

  const handleDeleteStudent = (id: number) => {
    if (window.confirm('정말 이 학생을 삭제할까요?')) {
      academyStore.deleteStudent(id);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f3e5f5', // 연한 보라색 배경
      borderRadius: '15px',
      height: '100%',
      boxSizing: 'border-box' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      position: 'relative' as const,
      overflow: 'hidden'
    },
    header: {
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
    list: {
      flex: 1,
      overflowY: 'auto' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '10px',
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      padding: '10px 15px',
      borderRadius: '8px',
      gap: '10px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    },
    name: {
      fontSize: '1.2rem',
      fontWeight: 'bold' as const,
      width: '80px',
      color: '#333'
    },
    time: {
      fontSize: '0.9rem',
      color: '#666',
      flex: 1,
      textAlign: 'center' as const
    },
    btnGroup: {
      display: 'flex',
      gap: '5px'
    },
    btn: {
      padding: '8px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold' as const,
      fontSize: '0.9rem'
    },
    presentBtn: { backgroundColor: '#2ecc71', color: 'white' },
    leftBtn: { backgroundColor: '#e74c3c', color: 'white' },
    disabledBtn: { backgroundColor: '#95a5a6', color: '#ecf0f1', cursor: 'not-allowed' },
    deleteBtn: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#f39c12',
      cursor: 'pointer',
      fontSize: '1.2rem',
      padding: '0 5px',
    },
    addForm: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
    },
    addInput: {
      flex: 1,
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      backgroundColor: 'white',
      color: '#333',
      fontSize: '1rem',
    },
    addBtn: {
      padding: '10px 15px',
      backgroundColor: '#1abc9c',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
    },
    allPresentBtn: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#f1c40f',
      color: '#2c3e50',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1.2rem',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      width: '100%'
    },
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
      <div style={styles.header}>
        📋 출석부
      </div>
      
      <div style={styles.list}>
        {students.map(student => (
          <div key={student.id} style={styles.row}>
            <span style={styles.name}>{student.name}</span>
            <span style={styles.time}>
              {student.status === 'present' && `등원: ${student.arrivalTime}`}
              {student.status === 'left' && `하원: ${student.departureTime}`}
              {student.status === 'absent' && '-'}
            </span>
            <div style={styles.btnGroup}>
              <button 
                style={{...styles.btn, ...(student.status === 'present' ? styles.disabledBtn : styles.presentBtn)}} 
                onClick={() => handleStatusChange(student.id, 'present')}
                disabled={student.status === 'present'}
              >
                등원
              </button>
              <button 
                style={{...styles.btn, ...(student.status === 'left' ? styles.disabledBtn : styles.leftBtn)}} 
                onClick={() => handleStatusChange(student.id, 'left')}
                disabled={student.status === 'left'}
              >
                하원
              </button>
            </div>
            <button style={styles.deleteBtn} onClick={() => handleDeleteStudent(student.id)}>
              🗑️
            </button>
          </div>
        ))}
      </div>

      <form style={styles.addForm} onSubmit={handleAddStudent}>
        <input
          type="text"
          style={styles.addInput}
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          placeholder="새 학생 이름"
        />
        <button type="submit" style={styles.addBtn}>추가</button>
      </form>

      <button style={styles.allPresentBtn} onClick={handleAllPresent}>
        🎉 모두 출석!
      </button>

      {showConfetti && (
        <div style={styles.confetti}>
          🎊 짝짝짝! 🎊
        </div>
      )}
    </div>
  );
};

export default Attendance;
