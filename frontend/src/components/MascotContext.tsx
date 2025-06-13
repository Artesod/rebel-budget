import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MascotEmotion, MascotState } from './Mascot';

interface MascotContextType {
  emotion: MascotEmotion;
  state: MascotState;
  message: string;
  isVisible: boolean;
  showMessage: (text: string, newEmotion?: MascotEmotion, newState?: MascotState) => void;
  hideMessage: () => void;
  changeEmotion: (newEmotion: MascotEmotion) => void;
  changeState: (newState: MascotState) => void;
  hide: () => void;
  show: () => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export const MascotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [emotion, setEmotion] = useState<MascotEmotion>('neutral');
  const [state, setState] = useState<MascotState>('idle');
  const [message, setMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);

  const showMessage = (text: string, newEmotion?: MascotEmotion, newState?: MascotState) => {
    setMessage(text);
    if (newEmotion) setEmotion(newEmotion);
    if (newState) setState(newState);
  };

  const hideMessage = () => {
    setMessage('');
  };

  const changeEmotion = (newEmotion: MascotEmotion) => {
    setEmotion(newEmotion);
  };

  const changeState = (newState: MascotState) => {
    setState(newState);
  };

  const hide = () => setIsVisible(false);
  const show = () => setIsVisible(true);

  const value = {
    emotion,
    state,
    message,
    isVisible,
    showMessage,
    hideMessage,
    changeEmotion,
    changeState,
    hide,
    show
  };

  return (
    <MascotContext.Provider value={value}>
      {children}
    </MascotContext.Provider>
  );
};

export const useMascotContext = () => {
  const context = useContext(MascotContext);
  if (context === undefined) {
    throw new Error('useMascotContext must be used within a MascotProvider');
  }
  return context;
};

export default MascotProvider; 