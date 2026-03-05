import React, { useState } from 'react';
import './Calculator.css';

const Calculator = ({ onClose }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstValue, setFirstValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForSecondValue) {
      setDisplayValue(String(digit));
      setWaitingForSecondValue(false);
    } else {
      setDisplayValue(displayValue === '0' ? String(digit) : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearDisplay = () => {
    setDisplayValue('0');
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(false);
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(displayValue);

    if (firstValue === null) {
      setFirstValue(inputValue);
    } else if (operator) {
      const result = calculate(firstValue, inputValue, operator);
      setDisplayValue(String(result));
      setFirstValue(result);
    }

    setWaitingForSecondValue(true);
    setOperator(nextOperator);
  };

  const calculate = (first, second, op) => {
    if (op === '+') return first + second;
    if (op === '-') return first - second;
    if (op === '*') return first * second;
    if (op === '/') return first / second;
    return second;
  };

  return (
    <div className="calculator-overlay" onClick={onClose}>
      <div className="calculator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="calculator-header">
          <span>🧮 계산기</span>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <div className="calculator-display">{displayValue}</div>
        <div className="calculator-keys">
          <button className="key-clear" onClick={clearDisplay}>C</button>
          <button className="key-operator" onClick={() => performOperation('/')}>÷</button>
          <button className="key-operator" onClick={() => performOperation('*')}>×</button>
          <button className="key-operator" onClick={() => performOperation('-')}>-</button>

          <button onClick={() => inputDigit(7)}>7</button>
          <button onClick={() => inputDigit(8)}>8</button>
          <button onClick={() => inputDigit(9)}>9</button>
          <button className="key-operator key-plus" onClick={() => performOperation('+')}>+</button>

          <button onClick={() => inputDigit(4)}>4</button>
          <button onClick={() => inputDigit(5)}>5</button>
          <button onClick={() => inputDigit(6)}>6</button>

          <button onClick={() => inputDigit(1)}>1</button>
          <button onClick={() => inputDigit(2)}>2</button>
          <button onClick={() => inputDigit(3)}>3</button>
          <button className="key-equal" onClick={() => performOperation('=')}>=</button>

          <button className="key-zero" onClick={() => inputDigit(0)}>0</button>
          <button onClick={inputDecimal}>.</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;