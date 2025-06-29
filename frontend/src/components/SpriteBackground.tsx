import React, { useState, useEffect } from 'react';

interface SpriteConfig {
  name: string;
  path: string;
  width: number;
  height: number;
  animationType?: 'float' | 'rotate' | 'pulse' | 'bounce';
}

interface FloatingSprite {
  id: number;
  sprite: SpriteConfig;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  animationType: string;
}

const SpriteBackground: React.FC = () => {
  const [sprites, setSprites] = useState<FloatingSprite[]>([]);

  const spriteConfigs: SpriteConfig[] = [
    {
        name: 'star',
        path: '/sprites/StarAsset1-RY.png',
        width: 50,
        height: 50,
        animationType: 'float'
    },
    {
        name: 'star',
        path: '/sprites/StarAsset3-Y.png',
        width: 50,
        height: 50,
        animationType: 'float'
    },
    {
        name: 'star',
        path: '/sprites/StarAsset4-G.png',
        width: 50,
        height: 50,
        animationType: 'float'
    },
    {
        name: 'star',
        path: '/sprites/StarAsset2-R.png',
        width: 50,
        height: 50,
        animationType: 'float'
    },
    {
        name: 'note',
        path: '/sprites/NoteAsset1-Y.png',
        width: 50,
        height: 50,
        animationType: 'float'
    },
    {
        name: 'note',
        path: '/sprites/NoteAsset1-R.png',
        width: 50,
        height: 50,
        animationType: 'float'
    },
    {
        name: 'note',
        path: '/sprites/NoteAsset1-G.png',
        width: 50,
        height: 50,
        animationType: 'float'
    },
  ];

  useEffect(() => {
    const generateSprites = () => {
      const newSprites: FloatingSprite[] = [];
      
      // Generate 15-20 random sprites
      const spriteCount = Math.floor(Math.random() * 6) + 15;
      
      for (let i = 0; i < spriteCount; i++) {
        const randomSprite = spriteConfigs[Math.floor(Math.random() * spriteConfigs.length)];
        const size = Math.random() * 200 + 20; 
        const yPosition = Math.random() * 100; 
        const delay = Math.random() * 10; 
        const opacity = Math.random() * 0.6 + 0.3; 
        const duration = Math.random() * 15 + 10; 
        
        newSprites.push({
          id: i,
          sprite: randomSprite,
          x: -100, 
          y: yPosition,
          size,
          opacity,
          duration,
          delay,
          animationType: randomSprite.animationType || 'float'
        });
      }
      
      setSprites(newSprites);
    };

    generateSprites();
  }, []);

  const getAnimationClass = (animationType: string) => {
    switch (animationType) {
      case 'rotate':
        return 'animate-spin';
      case 'pulse':
        return 'animate-pulse';
      case 'bounce':
        return 'animate-bounce';
      case 'float':
      default:
        return 'animate-float'; // Gentle up-down floating motion
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sprites.map((sprite) => (
        <div
          key={sprite.id}
          className="absolute pointer-events-none"
          style={{
            top: `${sprite.y}%`,
            right: '-100px', // Start off-screen to the right
            opacity: sprite.opacity,
            animationDelay: `${sprite.delay}s`,
            animation: `floatLeftCarousel ${sprite.duration}s linear infinite`
          }}
        >
          <img
            src={sprite.sprite.path}
            alt={sprite.sprite.name}
            width={sprite.size}
            height={sprite.size}
            className={`${getAnimationClass(sprite.animationType)} select-none`}
            style={{
              imageRendering: 'pixelated', // For pixel art sprites
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
            }}
            onError={(e) => {
              // Fallback to a colored div if sprite image fails to load
              const target = e.target as HTMLImageElement;
              const fallbackDiv = document.createElement('div');
              fallbackDiv.style.width = `${sprite.size}px`;
              fallbackDiv.style.height = `${sprite.size}px`;
              fallbackDiv.style.borderRadius = '50%';
              fallbackDiv.style.backgroundColor = ['#e60012', '#ffe600', '#ff6b6b', '#4ecdc4', '#45b7d1'][Math.floor(Math.random() * 5)];
              fallbackDiv.style.border = '2px solid #111';
              fallbackDiv.className = getAnimationClass(sprite.animationType);
              target.parentElement?.replaceChild(fallbackDiv, target);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default SpriteBackground; 