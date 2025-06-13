import React, { useState, useEffect } from 'react';

// Mascot emotion types
export type MascotEmotion = 
  | 'neutral' 
  | 'happy' 
  | 'excited' 
  | 'concerned' 
  | 'thinking' 
  | 'surprised' 
  | 'sad' 
  | 'angry' 
  | 'sleepy' 
  | 'winking';

// Mascot state types
export type MascotState = 
  | 'idle' 
  | 'speaking' 
  | 'listening' 
  | 'celebrating' 
  | 'warning' 
  | 'helping';

// Position types for mascot placement
export type MascotPosition = 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'top-right' 
  | 'top-left' 
  | 'center' 
  | 'floating';

interface MascotProps {
  emotion?: MascotEmotion;
  state?: MascotState;
  position?: MascotPosition;
  size?: 'small' | 'medium' | 'large';
  message?: string;
  isVisible?: boolean;
  onClick?: () => void;
  onMessageComplete?: () => void;
  className?: string;
}

// Placeholder sprite component - replace with actual sprites when available
const MascotSprite = ({ 
  emotion, 
  state, 
  size 
}: { 
  emotion: MascotEmotion; 
  state: MascotState; 
  size: 'small' | 'medium' | 'large';
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24', 
    large: 'w-32 h-32'
  };

  // Placeholder emoji mapping - replace with actual sprite logic
  const emotionEmojis: Record<MascotEmotion, string> = {
    neutral: '😐',
    happy: '😊',
    excited: '🤩',
    concerned: '😟',
    thinking: '🤔',
    surprised: '😲',
    sad: '😢',
    angry: '😠',
    sleepy: '😴',
    winking: '😉'
  };

  // Animation classes based on state
  const stateAnimations: Record<MascotState, string> = {
    idle: '', // Static - no animation
    speaking: 'animate-pulse',
    listening: 'animate-ping',
    celebrating: 'animate-spin',
    warning: 'animate-pulse',
    helping: 'animate-pulse' // Changed from bounce to pulse for subtlety
  };

  return (
    <div className={`
      ${sizeClasses[size]} 
      ${stateAnimations[state]}
      bg-p5-yellow 
      rounded-full 
      border-4 
      border-p5-red 
      flex 
      items-center 
      justify-center 
      text-2xl
      shadow-p5-pop
      cursor-pointer
      hover:scale-110
      transition-all
      duration-300
    `}>
      {/* TODO: Replace with actual sprite rendering */}
      <span className="text-xl">{emotionEmojis[emotion]}</span>
    </div>
  );
};

// Speech bubble component with Persona 5 styling
const SpeechBubble = ({ 
  message, 
  onComplete 
}: { 
  message: string; 
  onComplete?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!message) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= message.length) {
        setDisplayedText(message.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
        if (onComplete) {
          setTimeout(onComplete, 2000); // Auto-hide after 2 seconds
        }
      }
    }, 50); // Typing speed

    return () => clearInterval(interval);
  }, [message, onComplete]);

  if (!message) return null;

  return (
    <div className="absolute -top-28 left-20 w-72 animate-p5-slide-in z-50">
      {/* Clean Persona 5 style speech bubble */}
      <div className="relative">
        {/* Simple drop shadow */}
        <div className="absolute inset-0 bg-p5-black transform translate-x-1 translate-y-1"></div>
        
        {/* Main bubble with angular corners */}
        <div 
          className="relative bg-p5-white border-4 border-p5-black p-4 font-comic"
          style={{
            clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)'
          }}
        >
          {/* Text content */}
          <p className="text-p5-black font-bold text-sm leading-relaxed">
            {displayedText}
            {!isComplete && <span className="animate-pulse text-p5-red font-bold ml-1">▌</span>}
          </p>
        </div>
        
        {/* Simple angular tail */}
        <div className="absolute -bottom-2 left-8">
          {/* Tail shadow */}
          <div className="absolute w-0 h-0 border-l-6 border-r-6 border-t-8 border-l-transparent border-r-transparent border-t-p5-black transform translate-x-1 translate-y-1"></div>
          {/* Main tail */}
          <div className="w-0 h-0 border-l-6 border-r-6 border-t-8 border-l-transparent border-r-transparent border-t-p5-white relative z-10"></div>
          {/* Tail border */}
          <div className="absolute top-0 left-0 w-0 h-0 border-l-8 border-r-8 border-t-10 border-l-transparent border-r-transparent border-t-p5-black"></div>
        </div>
      </div>
    </div>
  );
};

// Main Mascot component
export const Mascot: React.FC<MascotProps> = ({
  emotion = 'neutral',
  state = 'idle',
  position = 'bottom-right',
  size = 'medium',
  message,
  isVisible = true,
  onClick,
  onMessageComplete,
  className = ''
}) => {
  const [showMessage, setShowMessage] = useState(!!message);

  useEffect(() => {
    setShowMessage(!!message);
  }, [message]);

  const handleMessageComplete = () => {
    setShowMessage(false);
    onMessageComplete?.();
  };

  const positionClasses: Record<MascotPosition, string> = {
    'bottom-right': 'fixed bottom-8 right-8 z-40',
    'bottom-left': 'fixed bottom-8 left-8 z-40',
    'top-right': 'fixed top-20 right-8 z-40',
    'top-left': 'fixed top-20 left-8 z-40',
    'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40',
    'floating': 'absolute z-40'
  };

  if (!isVisible) return null;

  return (
    <div className={`${positionClasses[position]} ${className}`}>
      <div className="relative">
        {/* Speech bubble */}
        {showMessage && message && (
          <SpeechBubble 
            message={message} 
            onComplete={handleMessageComplete}
          />
        )}
        
        {/* Mascot sprite */}
        <div onClick={onClick} className="relative">
          <MascotSprite 
            emotion={emotion} 
            state={state} 
            size={size}
          />
          
          {/* Notification dot for when mascot has something to say */}
          {!showMessage && message && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-p5-red rounded-full border-2 border-p5-white animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
};

// Hook for managing mascot state throughout the app
export const useMascot = () => {
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

  return {
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
};

// Re-export the context hook for convenience
export { useMascotContext } from './MascotContext';

export default Mascot; 