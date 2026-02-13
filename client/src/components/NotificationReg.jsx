import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/notification.css';

const Notification = ({ message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const notificationRef = useRef(null);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    
    setIsClosing(true);
    
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  }, [isClosing, onClose]);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(handleClose, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!isVisible) return null;

  return (
    <div 
      ref={notificationRef}
      className={`notification ${isClosing ? 'fade-out' : ''}`} 
      onClick={handleClose}
      role="alert"
      aria-live="assertive"
    >
      <div className="notification-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Notification;