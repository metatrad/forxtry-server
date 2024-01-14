import { createContext, useContext, useState, useEffect } from 'react';

const CountdownContext = createContext();

export const CountdownProvider = ({ children }) => {
  const [countdown, setCountdown] = useState(0);

  // Load countdown from localStorage on component mount
  useEffect(() => {
    const storedCountdown = localStorage.getItem('countdown');
    if (storedCountdown) {
      setCountdown(parseInt(storedCountdown, 10));
    }
  }, []);

  // Save countdown to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('countdown', countdown.toString());
  }, [countdown]);

  const resetCountdown = () => {
    setCountdown(0);
  };

  return (
    <CountdownContext.Provider value={{ countdown, setCountdown, resetCountdown }}>
      {children}
    </CountdownContext.Provider>
  );
};

export const useCountdown = () => {
  const context = useContext(CountdownContext);
  if (!context) {
    throw new Error('useCountdown must be used within a CountdownProvider');
  }
  return context;
};
