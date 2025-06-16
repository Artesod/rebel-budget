import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  type?: 'danger' | 'warning' | 'info';
}

// Modern SVG Icons Component
const Icon = ({ name, className = "w-6 h-6" }: { name: string, className?: string }) => {
  const icons = {
    warning: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    danger: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    info: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    check: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    x: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  };

  return icons[name as keyof typeof icons] || <Icon name="info" className={className} />;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isLoading = false,
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          bgColor: 'bg-p5-red',
          borderColor: 'border-p5-white',
          textColor: 'text-p5-white',
          iconColor: 'text-p5-white',
          confirmBg: 'bg-p5-red hover:bg-red-600',
          confirmBorder: 'border-p5-white hover:border-p5-yellow',
          icon: 'danger'
        };
      case 'warning':
        return {
          bgColor: 'bg-p5-yellow',
          borderColor: 'border-p5-black',
          textColor: 'text-p5-black',
          iconColor: 'text-p5-black',
          confirmBg: 'bg-p5-yellow hover:bg-yellow-400',
          confirmBorder: 'border-p5-black hover:border-p5-red',
          icon: 'warning'
        };
      case 'info':
        return {
          bgColor: 'bg-p5-black',
          borderColor: 'border-p5-yellow',
          textColor: 'text-p5-white',
          iconColor: 'text-p5-yellow',
          confirmBg: 'bg-p5-black hover:bg-p5-gray',
          confirmBorder: 'border-p5-yellow hover:border-p5-white',
          icon: 'info'
        };
      default:
        return {
          bgColor: 'bg-p5-red',
          borderColor: 'border-p5-white',
          textColor: 'text-p5-white',
          iconColor: 'text-p5-white',
          confirmBg: 'bg-p5-red hover:bg-red-600',
          confirmBorder: 'border-p5-white hover:border-p5-yellow',
          icon: 'danger'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-comic">
      {/* Backdrop with animated elements */}
      <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm animate-p5-fade-in">
        {/* Floating animated shapes */}
        <div className="absolute top-20 left-20 w-16 h-16 border-4 border-p5-red transform rotate-45 opacity-20 animate-float"></div>
        <div className="absolute bottom-32 right-32 w-20 h-20 border-4 border-p5-yellow transform -rotate-12 opacity-15 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-p5-red transform rotate-45 opacity-10 animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-14 h-14 border-4 border-p5-yellow transform rotate-12 opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Speech Bubble Container */}
        <div className={`${typeStyles.bgColor} ${typeStyles.borderColor} border-comic border-4 rounded-comic shadow-p5-pop p-8 animate-p5-slide-in relative`}>
          {/* SVG Speech Bubble Tail */}
          <svg 
            className="absolute left-8 -bottom-4" 
            width="40" 
            height="20" 
            viewBox="0 0 40 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon 
              points="0,0 40,0 20,20" 
              fill={type === 'danger' ? '#e60012' : type === 'warning' ? '#ffe600' : '#111'} 
              stroke={type === 'danger' ? '#fff' : type === 'warning' ? '#111' : '#ffe600'} 
              strokeWidth="3"
            />
          </svg>

          {/* Header */}
          <div className="flex items-center mb-6">
            <div className={`w-16 h-16 ${type === 'danger' ? 'bg-p5-white' : type === 'warning' ? 'bg-p5-black' : 'bg-p5-red'} border-comic border-4 ${type === 'danger' ? 'border-p5-red' : type === 'warning' ? 'border-p5-red' : 'border-p5-white'} rounded-full flex items-center justify-center shadow-p5-pop animate-p5-pop mr-4`}>
              <Icon name={typeStyles.icon} className={`w-8 h-8 ${type === 'danger' ? 'text-p5-red' : type === 'warning' ? 'text-p5-red' : 'text-p5-yellow'}`} />
            </div>
            <div>
              <h3 className={`text-2xl font-extrabold ${typeStyles.textColor} uppercase tracking-widest drop-shadow`}>
                {title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-6 h-1 ${type === 'danger' ? 'bg-p5-white' : type === 'warning' ? 'bg-p5-black' : 'bg-p5-yellow'} transform -skew-x-12`}></div>
                <div className={`w-3 h-3 ${type === 'danger' ? 'bg-p5-white' : type === 'warning' ? 'bg-p5-black' : 'bg-p5-yellow'} transform rotate-45 border ${type === 'danger' ? 'border-p5-red' : type === 'warning' ? 'border-p5-red' : 'border-p5-white'}`}></div>
                <div className={`w-6 h-1 ${type === 'danger' ? 'bg-p5-white' : type === 'warning' ? 'bg-p5-black' : 'bg-p5-yellow'} transform skew-x-12`}></div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <p className={`${typeStyles.textColor} text-lg font-bold leading-relaxed`}>
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 ${typeStyles.confirmBg} ${typeStyles.confirmBorder} ${typeStyles.textColor} px-6 py-4 rounded-comic border-comic border-4 focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center font-extrabold uppercase tracking-wider text-lg shadow-p5-pop hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin mr-3"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Icon name="check" className="w-6 h-6 mr-3" />
                  {confirmText}
                </>
              )}
            </button>

            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-p5-gray text-p5-white px-6 py-4 rounded-comic border-comic border-4 border-p5-red hover:bg-p5-black hover:border-p5-yellow focus:outline-none focus:ring-4 focus:ring-p5-red focus:ring-opacity-50 flex items-center justify-center font-extrabold uppercase tracking-wider text-lg shadow-p5-pop hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Icon name="x" className="w-6 h-6 mr-3" />
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 