import React, { useState } from 'react';
import yesSound from '../../../../assets/sounds/Yes.mp3';
import noSound from '../../../../assets/sounds/No.mp3';

// 체르니 100 수준에 맞는 문제로 변경
const MUSIC_QUIZZES = [
  { question: '이 기호의 이름은 무엇일까요? 𝄞', options: ['높은음자리표', '낮은음자리표', '올림표', '내림표'], answer: '높은음자리표' },
  { question: '4분음표(♩)는 몇 박자일까요?', options: ['1박', '2박', '3박', '4박'], answer: '1박' },
  { question: '2분음표(♪)는 몇 박자일까요?', options: ['반 박', '1박', '2박', '4박'], answer: '2박' },
  { question: '온음표는 몇 박자일까요?', options: ['1박', '2박', '3박', '4박'], answer: '4박' },
  { question: '음의 높낮이를 반음 올리는 기호는?', options: ['♭ (플랫)', '♮ (제자리표)', '♯ (샵)', '♪ (8분음표)'], answer: '♯ (샵)' },
  { question: '4분쉼표는 몇 박 동안 쉴까요?', options: ['반 박', '1박', '2박', '4박'], answer: '1박' },
];

const TheoryLesson = () => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (option: string) => {
    if (isCorrect !== null) return; // 이미 답을 선택했으면 무시

    const currentQuiz = MUSIC_QUIZZES[currentQuizIndex];
    if (option === currentQuiz.answer) {
      new Audio(yesSound).play();
      setIsCorrect(true);
      setMessage('정답입니다! ⭕');
      setScore(prev => prev + 1);
    } else {
      new Audio(noSound).play();
      setIsCorrect(false);
      setMessage(`땡! 정답은 ${currentQuiz.answer}입니다. ❌`);
    }

    setTimeout(() => {
      const nextQuestion = currentQuizIndex + 1;
      if (nextQuestion < MUSIC_QUIZZES.length) {
        setCurrentQuizIndex(nextQuestion);
        setIsCorrect(null);
        setMessage('');
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuizIndex(0);
    setScore(0);
    setShowScore(false);
    setIsCorrect(null);
    setMessage('');
  };

  const styles = {
    container: {
      padding: '20px',
      textAlign: 'center' as const,
      backgroundColor: '#FFF3E0', // 연한 주황색 배경
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '10px',
    },
    question: {
      fontSize: '1.5rem',
      marginBottom: '30px',
      fontWeight: 'bold',
      wordBreak: 'keep-all' as const,
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
      width: '100%',
      maxWidth: '400px',
    },
    button: {
      padding: '15px',
      fontSize: '1.2rem',
      borderRadius: '10px',
      border: '2px solid #FFB74D',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontWeight: 'bold',
      color: '#333',
    },
    message: {
      marginTop: '20px',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      height: '30px',
      color: isCorrect === true ? '#2ecc71' : '#e74c3c',
    },
    scoreTitle: {
      fontSize: '2rem',
      marginBottom: '20px',
    },
    scoreText: {
      fontSize: '1.5rem',
      marginBottom: '30px',
    }
  };

  return (
    <div style={styles.container}>
      {showScore ? (
        <div>
          <h2 style={styles.scoreTitle}>퀴즈 끝! 🎵</h2>
          <p style={styles.scoreText}>점수: {score} / {MUSIC_QUIZZES.length}</p>
          <button onClick={restartQuiz} style={{...styles.button, backgroundColor: '#FFB74D', color: 'white'}}>다시 풀기</button>
        </div>
      ) : (
        <>
          <h2>📝 음악 이론 퀴즈 ({currentQuizIndex + 1}/{MUSIC_QUIZZES.length})</h2>
          <div style={styles.question}>{MUSIC_QUIZZES[currentQuizIndex].question}</div>
          <div style={styles.optionsGrid}>
            {MUSIC_QUIZZES[currentQuizIndex].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                style={styles.button}
              >
                {option}
              </button>
            ))}
          </div>
          <div style={styles.message}>{message}</div>
        </>
      )}
    </div>
  );
};

export default TheoryLesson;