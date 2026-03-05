import { useState, useEffect } from 'react';
import { academyStore } from '../../../../store/academyStore';

const MATH_QUIZZES = [
  { question: '1 + 1 = ?', options: ['1', '2', '3', '4'], answer: '2' },
  { question: '2 + 3 = ?', options: ['4', '5', '6', '7'], answer: '5' },
  { question: '5 - 2 = ?', options: ['2', '3', '4', '5'], answer: '3' },
  { question: '10 - 5 = ?', options: ['5', '6', '4', '3'], answer: '5' },
  { question: '3 + 3 = ?', options: ['5', '6', '7', '8'], answer: '6' },
  { question: '7 + 2 = ?', options: ['8', '9', '10', '11'], answer: '9' },
  { question: '4 + 4 = ?', options: ['6', '7', '8', '9'], answer: '8' },
  { question: '9 - 3 = ?', options: ['5', '6', '7', '8'], answer: '6' },
  { question: '6 + 4 = ?', options: ['8', '9', '10', '11'], answer: '10' },
  { question: '8 - 4 = ?', options: ['2', '3', '4', '5'], answer: '4' },
  { question: '5 + 5 = ?', options: ['9', '10', '11', '12'], answer: '10' },
  { question: '7 - 2 = ?', options: ['4', '5', '6', '3'], answer: '5' },
  { question: '2 + 2 = ?', options: ['3', '4', '5', '6'], answer: '4' },
  { question: '6 - 3 = ?', options: ['2', '3', '4', '5'], answer: '3' },
];

const ENGLISH_QUIZZES = [
  { question: '사과는 영어로?', options: ['Apple', 'Banana', 'Cat', 'Dog'], answer: 'Apple' },
  { question: '고양이는 영어로?', options: ['Pig', 'Cow', 'Cat', 'Bird'], answer: 'Cat' },
  { question: '빨간색은 영어로?', options: ['Blue', 'Green', 'Yellow', 'Red'], answer: 'Red' },
  { question: '책은 영어로?', options: ['Pencil', 'Book', 'Desk', 'Chair'], answer: 'Book' },
  { question: '감사는 영어로?', options: ['Hello', 'Sorry', 'Thank you', 'Bye'], answer: 'Thank you' },
  { question: '학교는 영어로?', options: ['School', 'Home', 'Park', 'Zoo'], answer: 'School' },
  { question: '친구는 영어로?', options: ['Teacher', 'Friend', 'Mom', 'Dad'], answer: 'Friend' },
  { question: '행복한은 영어로?', options: ['Sad', 'Angry', 'Happy', 'Tired'], answer: 'Happy' },
  { question: '개는 영어로?', options: ['Cat', 'Dog', 'Bird', 'Fish'], answer: 'Dog' },
  { question: '파란색은 영어로?', options: ['Red', 'Blue', 'Green', 'Black'], answer: 'Blue' },
  { question: '엄마는 영어로?', options: ['Dad', 'Sister', 'Mom', 'Brother'], answer: 'Mom' },
  { question: '아빠는 영어로?', options: ['Mom', 'Grandma', 'Dad', 'Aunt'], answer: 'Dad' },
  { question: '안녕은 영어로?', options: ['Hello', 'Thanks', 'Sorry', 'Yes'], answer: 'Hello' },
  { question: '연필은 영어로?', options: ['Book', 'Pencil', 'Eraser', 'Pen'], answer: 'Pencil' },
];

const Classroom = () => {
  const [subject, setSubject] = useState<'math' | 'english' | null>(null);
  const [quizzes, setQuizzes] = useState<typeof MATH_QUIZZES>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setMessage('⏰ 시간 종료!');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSubjectSelect = (selectedSubject: 'math' | 'english') => {
    setSubject(selectedSubject);
  };

  const startQuiz = (count: number) => {
    const allQuizzes = subject === 'math' ? MATH_QUIZZES : ENGLISH_QUIZZES;
    const shuffled = [...allQuizzes].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    setQuizzes(selected);
    setIsActive(true);
    setTimeLeft(count * 15); // 문제당 15초
    setMessage('');
    setIsCorrect(null);
    setCurrentQuizIndex(0);
    setScore(0);
  };

  const handleBack = () => {
    setSubject(null);
    setIsActive(false);
    setMessage('');
  };

  const handleAnswer = (option: string) => {
    if (!isActive || isCorrect === true) return;

    const currentQuiz = quizzes[currentQuizIndex];
    if (option === currentQuiz.answer) {
      setIsCorrect(true);
      setMessage('정답입니다! ⭕');
      academyStore.addSticker();
      setScore(prev => prev + 10);
      
      setTimeout(() => {
        if (currentQuizIndex < quizzes.length - 1) {
          setCurrentQuizIndex(prev => prev + 1);
          setIsCorrect(null);
          setMessage('');
        } else {
          setIsActive(false);
          const finalScore = score + 10;
          const maxScore = quizzes.length * 10;
          if (finalScore === maxScore) {
            setMessage(`🎉 와우! ${finalScore}점 만점이에요! 참 잘했어요! 🏆`);
          } else {
            setMessage(`모든 문제를 풀었습니다! 💯 총점: ${finalScore}점`);
          }
        }
      }, 1000);
    } else {
      setIsCorrect(false);
      setMessage('땡! 다시 생각해보세요 ❌');
    }
  };

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f3e5f5', // 연한 보라색 배경
      borderRadius: '15px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      boxSizing: 'border-box' as const,
      position: 'relative' as const,
      overflow: 'hidden',
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
    timer: {
      position: 'absolute' as const,
      top: '60px',
      right: '10px',
      fontSize: '1.2rem',
      fontWeight: 'bold' as const,
      color: timeLeft < 10 ? '#e74c3c' : '#555'
    },
    score: {
      position: 'absolute' as const,
      top: '10px',
      left: '10px',
      fontSize: '1.2rem',
      fontWeight: 'bold' as const,
      color: '#f1c40f'
    },
    progress: {
      position: 'absolute' as const,
      top: '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '1.2rem',
      fontWeight: 'bold' as const,
      color: '#555'
    },
    content: {
      flex: 1,
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    },
    question: {
      fontSize: '2rem',
      marginBottom: '40px',
      textAlign: 'center' as const,
      fontFamily: '"Gaegu", cursive',
      color: '#333'
    },
    options: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
      width: '100%'
    },
    optionBtn: {
      padding: '20px',
      fontSize: '1.2rem',
      backgroundColor: 'white',
      color: '#333',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      boxShadow: '0 4px 0 #bdc3c7',
      fontFamily: '"Gaegu", cursive',
      fontWeight: 'bold' as const
    },
    subjectSelection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
      width: '100%',
      maxWidth: '300px'
    },
    subjectBtn: {
      padding: '20px',
      fontSize: '1.4rem',
      backgroundColor: '#f1c40f',
      color: '#2c3e50',
      border: 'none',
      borderRadius: '15px',
      cursor: 'pointer',
      fontWeight: 'bold' as const,
      boxShadow: '0 5px 0 #f39c12',
      fontFamily: '"Gaegu", cursive'
    },
    backBtn: {
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontFamily: '"Gaegu", cursive'
    },
    message: {
      marginTop: '20px',
      fontSize: '1.5rem',
      fontWeight: 'bold' as const,
      color: isCorrect === true ? '#2ecc71' : isCorrect === false ? '#e74c3c' : '#333',
      height: '30px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>👨‍🏫 수업/퀴즈</div>
      {isActive && (
        <>
          <div style={styles.score}>🏆 {score}점</div>
          <div style={styles.progress}>📝 {currentQuizIndex + 1} / {quizzes.length}</div>
          <div style={styles.timer}>⏱️ {timeLeft}초</div>
        </>
      )}
      
      <div style={styles.content}>
        {!subject ? (
          <div style={styles.subjectSelection}>
            <button style={styles.subjectBtn} onClick={() => handleSubjectSelect('math')}>🧮 수학 문제 풀기</button>
            <button style={{...styles.subjectBtn, backgroundColor: '#3498db', boxShadow: '0 5px 0 #2980b9', color: 'white'}} onClick={() => handleSubjectSelect('english')}>🔤 영어 문제 풀기</button>
          </div>
        ) : !isActive ? (
          <div style={styles.subjectSelection}>
            <h2 style={{marginBottom: '20px', fontFamily: '"Gaegu", cursive', fontSize: '1.5rem'}}>몇 문제를 풀까요?</h2>
            <button style={styles.subjectBtn} onClick={() => startQuiz(5)}>5문제</button>
            <button style={styles.subjectBtn} onClick={() => startQuiz(10)}>10문제</button>
            <button style={styles.subjectBtn} onClick={() => startQuiz((subject === 'math' ? MATH_QUIZZES : ENGLISH_QUIZZES).length)}>전체 풀기</button>
            <button style={styles.backBtn} onClick={handleBack}>↩ 뒤로가기</button>
          </div>
        ) : (
          <>
            <div style={styles.question}>
              Q{currentQuizIndex + 1}. {quizzes[currentQuizIndex].question}
            </div>
            <div style={styles.options}>
              {quizzes[currentQuizIndex].options.map((opt, idx) => (
                <button 
                  key={idx} 
                  style={styles.optionBtn}
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button style={styles.backBtn} onClick={handleBack}>
              ↩ 다른 과목 고르기
            </button>
          </>
        )}
        <div style={styles.message}>{message}</div>
      </div>
    </div>
  );
};

export default Classroom;
