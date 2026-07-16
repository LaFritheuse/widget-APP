import React, { createContext, useContext, useState, useRef } from 'react';
import { Toast } from '../widgets/Toast';

const ToastCtx = createContext(() => {});

/* Toast global, équivalent de #toast + showToast() dans le HTML : un seul
   overlay partagé par tous les widgets, déclenché via useToast(). */
export const ToastProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const timer = useRef(null);

  const showToast = (msg) => {
    clearTimeout(timer.current);
    setMessage(msg);
    setVisible(true);
    timer.current = setTimeout(() => setVisible(false), 1300);
  };

  return (
    <ToastCtx.Provider value={showToast}>
      {children}
      <Toast visible={visible} message={message} />
    </ToastCtx.Provider>
  );
};

export const useToast = () => useContext(ToastCtx);
