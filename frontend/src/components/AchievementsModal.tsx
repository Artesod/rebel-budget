import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { mockAchievements, Achievement } from '../data/mockData';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const achievements = mockAchievements;
  
  const categories = [
    { key: 'all', emoji: '🎯', label: 'All' },
    { key: 'savings', emoji: '💰', label: 'Savings' },
    { key: 'budget', emoji: '📊', label: 'Budget' },
    { key: 'invest', emoji: '📈', label: 'Invest' },
    { key: 'spending', emoji: '💳', label: 'Spending' },
    { key: 'goals', emoji: '🎯', label: 'Goals' },
    { key: 'streaks', emoji: '🔥', label: 'Streaks' },
    { key: 'milestones', emoji: '🏆', label: 'Milestones' },
    { key: 'special', emoji: '⭐', label: 'Special' }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter((achievement: Achievement) => achievement.category === selectedCategory);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4">
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-p5-white">
          <h2 className="text-xl lg:text-2xl font-extrabold text-p5-white uppercase tracking-widest">
            🏆 Achievements
          </h2>
          <button
            onClick={onClose}
            className="text-p5-white hover:text-p5-red transition-colors duration-200 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b border-p5-white">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-3 py-1.5 text-sm font-bold uppercase rounded-comic border-2 transition-all duration-200 ${
                  selectedCategory === category.key
                    ? 'bg-p5-red text-p5-white border-p5-white'
                    : 'bg-p5-black text-p5-yellow border-p5-red hover:bg-p5-red hover:text-p5-white'
                }`}
              >
                <span className="mr-1">{category.emoji}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="p-4 border-b border-p5-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-p5-black bg-opacity-50 border-2 border-p5-red rounded-comic p-3 text-center">
              <div className="text-p5-yellow font-bold text-sm">UNLOCKED</div>
              <div className="text-p5-white font-extrabold text-xl">
                {achievements.filter((a: Achievement) => a.unlocked).length} / {achievements.length}
              </div>
            </div>
            <div className="bg-p5-black bg-opacity-50 border-2 border-p5-yellow rounded-comic p-3 text-center">
              <div className="text-p5-red font-bold text-sm">COMPLETION</div>
              <div className="text-p5-white font-extrabold text-xl">
                {Math.round((achievements.filter((a: Achievement) => a.unlocked).length / achievements.length) * 100)}%
              </div>
            </div>
            <div className="bg-p5-black bg-opacity-50 border-2 border-p5-blue rounded-comic p-3 text-center">
              <div className="text-p5-yellow font-bold text-sm">UNLOCKED</div>
              <div className="text-p5-white font-extrabold text-xl">
                {achievements.filter((a: Achievement) => a.unlocked).length}
              </div>
            </div>
            <div className="bg-p5-black bg-opacity-50 border-2 border-p5-green rounded-comic p-3 text-center">
              <div className="text-p5-red font-bold text-sm">CATEGORY</div>
              <div className="text-p5-white font-extrabold text-xl">
                {selectedCategory === 'all' ? 'ALL' : selectedCategory.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {filteredAchievements.map((achievement: Achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-comic border-comic border-2 transition-all duration-300 hover:scale-102 ${
                  achievement.unlocked
                    ? achievement.rarity === 'legendary'
                      ? 'bg-gradient-to-r from-purple-900 to-pink-900 border-purple-400 shadow-purple-500/25'
                      : achievement.rarity === 'epic'
                      ? 'bg-gradient-to-r from-purple-800 to-blue-800 border-purple-300 shadow-purple-400/25'
                      : achievement.rarity === 'rare'
                      ? 'bg-gradient-to-r from-blue-800 to-indigo-800 border-blue-300 shadow-blue-400/25'
                      : 'bg-gradient-to-r from-green-800 to-teal-800 border-green-300 shadow-green-400/25'
                    : 'bg-p5-gray bg-opacity-30 border-p5-gray'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      achievement.unlocked ? 'bg-p5-yellow' : 'bg-p5-gray'
                    }`}>
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>
                    <div>
                      <h3 className={`font-extrabold uppercase text-lg ${
                        achievement.unlocked ? 'text-p5-white' : 'text-p5-gray'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${
                        achievement.unlocked ? 'text-p5-white' : 'text-p5-gray'
                      }`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && achievement.unlockedDate && (
                        <p className="text-xs text-p5-green font-bold mt-1">
                          Unlocked: {achievement.unlockedDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className={`px-3 py-1 rounded-comic border-2 text-xs font-bold uppercase ${
                      achievement.rarity === 'legendary' ? 'bg-purple-600 border-purple-300 text-white' :
                      achievement.rarity === 'epic' ? 'bg-purple-500 border-purple-300 text-white' :
                      achievement.rarity === 'rare' ? 'bg-blue-500 border-blue-300 text-white' :
                      'bg-green-500 border-green-300 text-white'
                    }`}>
                      {achievement.rarity}
                    </div>
                    {achievement.reward && (
                      <div className="bg-p5-red text-p5-white px-2 py-1 rounded-comic border border-p5-white text-sm font-bold">
                        {achievement.reward}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AchievementsModal; 