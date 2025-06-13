import React, { useEffect, useState } from 'react';

interface LogoSplashProps {
  onComplete: () => void;
}

const LogoSplash: React.FC<LogoSplashProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'logo' | 'text' | 'complete'>('logo');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('text'), 1500);
    const timer2 = setTimeout(() => setPhase('complete'), 3000);
    const timer3 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-p5-black via-red-900 to-p5-black flex items-center justify-center z-50 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Diagonal stripes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-p5-red to-transparent transform -skew-x-12 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-transparent via-p5-yellow to-transparent transform skew-x-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 border-2 border-p5-red transform rotate-45 opacity-30 animate-p5-float"></div>
        <div className="absolute bottom-32 right-16 w-20 h-20 border-2 border-p5-yellow transform -rotate-12 opacity-25 animate-p5-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-p5-yellow transform rotate-45 opacity-20 animate-p5-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main Logo Container */}
      <div className="relative z-10 text-center">
        {/* Logo Symbol */}
        <div className={`transition-all duration-1000 ${
          phase === 'logo' ? 'scale-100 opacity-100' : 'scale-110 opacity-90'
        }`}>
          <div className="relative mb-8">
            {/* Outer ring */}
            <div className={`w-32 h-32 mx-auto border-4 border-p5-red rounded-full flex items-center justify-center relative transition-all duration-1500 ${
              phase === 'logo' ? 'animate-spin' : ''
            }`}>
              {/* Inner symbol */}
              <div className="relative">
                {/* Dollar sign with P5 styling */}
                <div className="text-6xl font-extrabold text-p5-yellow relative">
                  <span className="absolute inset-0 text-p5-red transform translate-x-1 translate-y-1">$</span>
                  <span className="relative text-p5-yellow">$</span>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-p5-red transform rotate-45"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-p5-yellow transform rotate-45"></div>
              </div>
              
              {/* Orbiting dots */}
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-p5-yellow rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-p5-pop"></div>
              <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-p5-red rounded-full transform -translate-x-1/2 translate-y-1/2 animate-p5-pop" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute left-0 top-1/2 w-3 h-3 bg-p5-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-p5-pop" style={{ animationDelay: '1s' }}></div>
              <div className="absolute right-0 top-1/2 w-3 h-3 bg-p5-yellow rounded-full transform translate-x-1/2 -translate-y-1/2 animate-p5-pop" style={{ animationDelay: '1.5s' }}></div>
            </div>
          </div>
        </div>

        {/* Text Animation */}
        <div className={`transition-all duration-1000 ${
          phase === 'text' || phase === 'complete' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          <div className="text-4xl md:text-6xl font-extrabold text-p5-white uppercase tracking-wider mb-2">
            <div className="flex flex-col items-center gap-1">
              <div className={`flex items-center transition-all duration-500 ${
                phase === 'text' || phase === 'complete' ? 'transform translate-x-0' : 'transform -translate-x-full'
              }`} style={{ transitionDelay: '0.2s' }}>
                <span className="inline-block animate-p5-slide-in">R</span>
                <span className="inline-block animate-p5-slide-in" style={{ animationDelay: '0.1s' }}>E</span>
                <span className="inline-block animate-p5-slide-in" style={{ animationDelay: '0.2s' }}>B</span>
                <span className="inline-block animate-p5-slide-in" style={{ animationDelay: '0.3s' }}>E</span>
                <span className="inline-block animate-p5-slide-in" style={{ animationDelay: '0.4s' }}>L</span>
              </div>
              <div className={`flex items-center transition-all duration-500 ${
                phase === 'text' || phase === 'complete' ? 'transform translate-x-0' : 'transform translate-x-full'
              }`} style={{ transitionDelay: '0.4s' }}>
                <span className="inline-block animate-p5-slide-in" style={{ animationDelay: '0.5s' }}>B</span>
                <span className="inline-block animate-p5-slide-in" style={{ animationDelay: '0.6s' }}>U</span>
                <span className="inline-block animate-p5-slide-in" style={{ animationDelay: '0.7s' }}>D</span>
                <span className="inline-block animate-p5-slide-in" style={{ animationDelay: '0.8s' }}>G</span>
                <span className="inline-block animate-p5-slide-in" style={{ animationDelay: '0.9s' }}>E</span>
                <span className="inline-block animate-p5-slide-in" style={{ animationDelay: '1.0s' }}>T</span>
              </div>
            </div>
          </div>
          
          {/* Tagline */}
          <div className={`text-p5-yellow text-lg md:text-xl font-bold uppercase tracking-widest transition-all duration-500 ${
            phase === 'complete' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`} style={{ transitionDelay: '0.8s' }}>
            Take Control • Break Free
          </div>
        </div>

        {/* Loading indicator */}
        <div className={`mt-8 transition-all duration-500 ${
          phase === 'complete' ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-p5-red rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-p5-yellow rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-p5-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>

      {/* Fade out overlay */}
      <div className={`absolute inset-0 bg-p5-black transition-opacity duration-500 ${
        phase === 'complete' ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </div>
  );
};

export default LogoSplash; 