import React, { useState, useEffect } from 'react';

interface SpriteConfig {
  id: number;
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
  createdAt: number;
}

const SpriteBackground: React.FC = () => {
  const [sprites, setSprites] = useState<FloatingSprite[]>([]);

  const spriteConfigs: SpriteConfig[] = [
    {
        name: 'star',
        path: '/sprites/StarAsset1-RY.png',
        width: 50,
        height: 50,
        animationType: 'float',
        id: 1
    },
    {
        name: 'star',
        path: '/sprites/StarAsset3-Y.png',
        width: 50,
        height: 50,
        animationType: 'float',
        id: 2
    },
    {
        name: 'star',
        path: '/sprites/StarAsset4-G.png',
        width: 50,
        height: 50,
        animationType: 'float',
        id: 3
    },
    {
        name: 'star',
        path: '/sprites/StarAsset2-R.png',
        width: 50,
        height: 50,
        animationType: 'float',
        id: 4
    },
    {
        name: 'note',
        path: '/sprites/NoteAsset1-Y.png',
        width: 50,
        height: 50,
        animationType: 'float',
        id: 5
    },
    {
        name: 'note',
        path: '/sprites/NoteAsset1-R.png',
        width: 50,
        height: 50,
        animationType: 'float',
        id: 6
    },
    {
        name: 'note',
        path: '/sprites/NoteAsset1-G.png',
        width: 50,
        height: 50,
        animationType: 'float',
        id: 7
    },
    {
      name: 'note',
      path: '/sprites/DiamondAsset1-Y.png',
      width: 50,
      height: 50,
      animationType: 'float',
      id: 8
  },
  {
      name: 'note',
      path: '/sprites/DiamondAsset1-R.png',
      width: 50,
      height: 50,
      animationType: 'float',
      id: 9
  },
  {
      name: 'note',
      path: '/sprites/DiamondAsset1-G.png',
      width: 50,
      height: 50,
      animationType: 'float',
      id: 10
  },
  ];

  useEffect(() => {
    let spriteId = 0;
    
    const createSingleSprite = () => {
      const randomSprite = spriteConfigs[Math.floor(Math.random() * spriteConfigs.length)];
      const size = Math.random() * 120 + 40; 
      const yPosition = Math.random() * 100; 
      const opacity = Math.random() * 0.4 + 0.5; 
      const duration = Math.random() * 8 + 15; 
      
      const newSprite = {
        id: spriteId++,
        sprite: randomSprite,
        x: -100, 
        y: yPosition,
        size,
        opacity,
        duration,
        delay: 0,
        animationType: randomSprite.animationType || 'float',
        createdAt: Date.now()
      };
      
      setSprites(prevSprites => [...prevSprites, newSprite]);
    };

    // Create first sprite immediately
    createSingleSprite();

    // Create a new sprite every 8 seconds
    const spriteInterval = setInterval(() => {
      createSingleSprite();
      createSingleSprite();
      createSingleSprite();
    }, 1000);

    const cleanupInterval = setInterval(() => {
      setSprites(prevSprites => {
        const currentTime = Date.now();
        return prevSprites.filter(sprite => {
          const age = (currentTime - sprite.createdAt) / 1000;
          return age < sprite.duration + 3;
        });
      });
    }, 10000);

    return () => {
      clearInterval(spriteInterval);
      clearInterval(cleanupInterval);
    };
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
            animation: `floatLeftCarousel ${sprite.duration}s linear forwards`
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