import React, { useState, useEffect, useCallback } from 'react';
import './Timer.css';

const Timer = ({ 
  initialSeconds = 300,
  onResend
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleResend = useCallback(() => {
    if (!isActive && onResend) {
      setSeconds(initialSeconds);
      setIsActive(true);
      onResend();
    }
  }, [isActive, initialSeconds, onResend]);

  useEffect(() => {
    let interval = null;
    
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  return (
    <div className="timer-container">
      {isActive ? (
        <div className="timer-display">
          <span className="timer-text">Отправить повторно:</span>
          <span className="timer-time">{formatTime(seconds)}</span>
        </div>
      ) : (
        <button 
          type="button" 
          className="timer-resend-btn"
          onClick={handleResend}
        >
          Отправить
        </button>
      )}
    </div>
  );
};

export default Timer;