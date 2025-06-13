import React, { useState } from 'react';

export type AchievementCategory = 
  | 'savings' 
  | 'budgeting' 
  | 'investing' 
  | 'spending' 
  | 'goals' 
  | 'streaks' 
  | 'milestones' 
  | 'special';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  category: AchievementCategory;
  rarity: AchievementRarity;
  unlockedDate?: Date;
  progress?: number;
  maxProgress?: number;
  reward?: string;
}

interface GameProgressProps {
  level: number;
  experience: number;
  nextLevelExp: number;
  achievements: Achievement[];
}

// Comprehensive achievement definitions
export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  // Savings Achievements
  { id: 'first_save', title: 'First Steps', description: 'Save your first $100', icon: '💰', category: 'savings', rarity: 'common', unlocked: false },
  { id: 'emergency_fund', title: 'Safety Net', description: 'Build a $1,000 emergency fund', icon: '🛡️', category: 'savings', rarity: 'rare', unlocked: false },
  { id: 'savings_streak', title: 'Consistent Saver', description: 'Save money for 30 days straight', icon: '🔥', category: 'savings', rarity: 'epic', unlocked: false },
  { id: 'big_saver', title: 'High Roller', description: 'Save $10,000 in total', icon: '💎', category: 'savings', rarity: 'legendary', unlocked: false },
  
  // Budgeting Achievements
  { id: 'first_budget', title: 'Budget Rookie', description: 'Create your first budget', icon: '📊', category: 'budgeting', rarity: 'common', unlocked: false },
  { id: 'budget_master', title: 'Budget Master', description: 'Stay under budget for 3 months', icon: '🎯', category: 'budgeting', rarity: 'rare', unlocked: false },
  { id: 'zero_based', title: 'Every Dollar Counts', description: 'Create a zero-based budget', icon: '⚖️', category: 'budgeting', rarity: 'epic', unlocked: false },
  { id: 'budget_ninja', title: 'Budget Ninja', description: 'Stay under budget for 12 months', icon: '🥷', category: 'budgeting', rarity: 'legendary', unlocked: false },
  
  // Investing Achievements
  { id: 'first_investment', title: 'Market Debut', description: 'Make your first investment', icon: '📈', category: 'investing', rarity: 'common', unlocked: false },
  { id: 'diversified', title: 'Diversification Pro', description: 'Invest in 5 different asset types', icon: '🌐', category: 'investing', rarity: 'rare', unlocked: false },
  { id: 'compound_king', title: 'Compound King', description: 'Earn $1,000 in investment returns', icon: '👑', category: 'investing', rarity: 'epic', unlocked: false },
  { id: 'warren_buffett', title: 'Oracle of Finance', description: 'Achieve 20% annual returns', icon: '🧙‍♂️', category: 'investing', rarity: 'legendary', unlocked: false },
  
  // Spending Achievements
  { id: 'expense_tracker', title: 'Expense Detective', description: 'Track expenses for 7 days', icon: '🔍', category: 'spending', rarity: 'common', unlocked: false },
  { id: 'frugal_living', title: 'Frugal Master', description: 'Reduce monthly expenses by 20%', icon: '✂️', category: 'spending', rarity: 'rare', unlocked: false },
  { id: 'no_impulse', title: 'Impulse Control', description: 'Go 30 days without impulse purchases', icon: '🧘', category: 'spending', rarity: 'epic', unlocked: false },
  { id: 'minimalist', title: 'Minimalist Mindset', description: 'Reduce expenses by 50%', icon: '🎋', category: 'spending', rarity: 'legendary', unlocked: false },
  
  // Goals Achievements
  { id: 'goal_setter', title: 'Goal Setter', description: 'Set your first financial goal', icon: '🎯', category: 'goals', rarity: 'common', unlocked: false },
  { id: 'goal_crusher', title: 'Goal Crusher', description: 'Complete 5 financial goals', icon: '💪', category: 'goals', rarity: 'rare', unlocked: false },
  { id: 'dream_chaser', title: 'Dream Chaser', description: 'Achieve a $50,000 goal', icon: '🌟', category: 'goals', rarity: 'epic', unlocked: false },
  { id: 'visionary', title: 'Financial Visionary', description: 'Complete 10 major goals', icon: '🔮', category: 'goals', rarity: 'legendary', unlocked: false },
  
  // Streak Achievements
  { id: 'week_warrior', title: 'Week Warrior', description: 'Log expenses for 7 days straight', icon: '⚡', category: 'streaks', rarity: 'common', unlocked: false },
  { id: 'month_master', title: 'Month Master', description: 'Perfect tracking for 30 days', icon: '🔥', category: 'streaks', rarity: 'rare', unlocked: false },
  { id: 'quarter_champion', title: 'Quarter Champion', description: 'Stay consistent for 90 days', icon: '🏆', category: 'streaks', rarity: 'epic', unlocked: false },
  { id: 'year_legend', title: 'Year Legend', description: 'Perfect year of financial tracking', icon: '🎖️', category: 'streaks', rarity: 'legendary', unlocked: false },
  
  // Milestone Achievements
  { id: 'net_worth_positive', title: 'In the Black', description: 'Achieve positive net worth', icon: '📊', category: 'milestones', rarity: 'common', unlocked: false },
  { id: 'debt_free', title: 'Debt Destroyer', description: 'Pay off all debt', icon: '⛓️‍💥', category: 'milestones', rarity: 'rare', unlocked: false },
  { id: 'six_figure', title: 'Six Figure Club', description: 'Reach $100,000 net worth', icon: '💯', category: 'milestones', rarity: 'epic', unlocked: false },
  { id: 'millionaire', title: 'Millionaire Status', description: 'Achieve $1,000,000 net worth', icon: '💰', category: 'milestones', rarity: 'legendary', unlocked: false },
  
  // Special Achievements
  { id: 'early_bird', title: 'Early Bird', description: 'Start investing before age 25', icon: '🐦', category: 'special', rarity: 'rare', unlocked: false },
  { id: 'side_hustle', title: 'Side Hustle Hero', description: 'Earn income from 3 sources', icon: '🚀', category: 'special', rarity: 'epic', unlocked: false },
  { id: 'financial_guru', title: 'Financial Guru', description: 'Complete all achievement categories', icon: '🧠', category: 'special', rarity: 'legendary', unlocked: false },
  { id: 'persona_master', title: 'Persona Master', description: 'Unlock all Persona 5 themed features', icon: '🎭', category: 'special', rarity: 'legendary', unlocked: false },
];

const GameProgress: React.FC<GameProgressProps> = ({
  level,
  experience,
  nextLevelExp,
  achievements,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const progressPercentage = (experience / nextLevelExp) * 100;
  
  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };
  
  const getRarityBorder = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-400';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-yellow-400';
      default: return 'border-gray-400';
    }
  };
  
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);
  
  const categories: { key: AchievementCategory | 'all', label: string, icon: string }[] = [
    { key: 'all', label: 'All', icon: '🏆' },
    { key: 'savings', label: 'Savings', icon: '💰' },
    { key: 'budgeting', label: 'Budget', icon: '📊' },
    { key: 'investing', label: 'Invest', icon: '📈' },
    { key: 'spending', label: 'Spending', icon: '💳' },
    { key: 'goals', label: 'Goals', icon: '🎯' },
    { key: 'streaks', label: 'Streaks', icon: '🔥' },
    { key: 'milestones', label: 'Milestones', icon: '🏁' },
    { key: 'special', label: 'Special', icon: '⭐' },
  ];

  return (
    <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-8 flex flex-col h-full relative overflow-hidden">
      {/* Splash SVG background */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 400 200" fill="none"><path d="M0 0L400 0L400 200L0 180Z" fill="#ffe600" fillOpacity="0.06"/></svg>
      <div className="flex items-center justify-between mb-8 z-10">
        <div>
          <h2 className="text-3xl font-extrabold text-p5-white uppercase tracking-widest">Level {level}</h2>
          <p className="text-p5-yellow font-bold uppercase">Financial Master</p>
        </div>
        <div className="w-20 h-20 bg-p5-red border-comic border-4 rounded-full flex items-center justify-center shadow-p5-pop animate-float">
          <span className="text-3xl font-extrabold text-p5-yellow drop-shadow">{level}</span>
        </div>
      </div>

      <div className="mb-8 z-10">
        <div className="flex justify-between text-base text-p5-white font-bold mb-2 uppercase">
          <span>Experience</span>
          <span>{experience} / {nextLevelExp} XP</span>
        </div>
        <div className="w-full bg-p5-black border-comic border-4 rounded-comic h-4">
          <div
            className="bg-p5-red h-4 rounded-comic transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="z-10">
        <h3 className="text-xl font-extrabold text-p5-white uppercase mb-4 tracking-widest">Achievements</h3>
        
        {/* Category Filter */}
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-3 py-1 text-xs font-bold uppercase rounded-comic border-2 transition-all duration-200 ${
                selectedCategory === category.key
                  ? 'bg-p5-red text-p5-white border-p5-white'
                  : 'bg-p5-black text-p5-yellow border-p5-red hover:bg-p5-red hover:text-p5-white'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
        
        {/* Achievement Stats */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="bg-p5-black bg-opacity-50 border-2 border-p5-red rounded-comic p-3">
            <div className="text-p5-yellow font-bold text-sm">UNLOCKED</div>
            <div className="text-p5-white font-extrabold text-xl">
              {achievements.filter(a => a.unlocked).length} / {achievements.length}
            </div>
          </div>
          <div className="bg-p5-black bg-opacity-50 border-2 border-p5-yellow rounded-comic p-3">
            <div className="text-p5-red font-bold text-sm">COMPLETION</div>
            <div className="text-p5-white font-extrabold text-xl">
              {Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}%
            </div>
          </div>
        </div>
        
        {/* Achievement List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative rounded-comic border-4 shadow-p5-pop transition-all duration-300 hover:scale-102 ${
                achievement.unlocked
                  ? 'bg-p5-white border-p5-black'
                  : 'bg-gradient-to-br from-p5-black to-gray-900 border-p5-red'
              }`}
            >
              {/* Rarity accent stripe */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-comic ${
                achievement.rarity === 'common' ? 'bg-gray-400' :
                achievement.rarity === 'rare' ? 'bg-blue-400' :
                achievement.rarity === 'epic' ? 'bg-purple-400' :
                'bg-yellow-400'
              }`}></div>
              
              <div className="flex items-center p-4 pl-6">
                {/* Achievement Icon */}
                <div className={`w-14 h-14 rounded-comic flex items-center justify-center mr-4 border-4 shadow-lg relative ${
                  achievement.unlocked 
                    ? 'bg-p5-red border-p5-black' 
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 border-p5-white'
                }`}>
                  <span className={`text-2xl ${achievement.unlocked ? '' : 'opacity-50'}`}>
                    {achievement.icon}
                  </span>
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-p5-black bg-opacity-60 rounded-comic">
                      <span className="text-p5-white text-lg">🔒</span>
                    </div>
                  )}
                </div>
                
                {/* Achievement Content */}
                <div className="flex-1">
                  {/* Title and Rarity */}
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-extrabold uppercase text-base ${
                      achievement.unlocked ? 'text-p5-black' : 'text-p5-yellow'
                    }`}>
                      {achievement.title}
                    </h4>
                    <div className={`px-2 py-1 rounded-comic text-xs font-bold uppercase border-2 ${
                      achievement.unlocked ? (
                        achievement.rarity === 'common' ? 'bg-gray-100 text-gray-700 border-gray-400' :
                        achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700 border-blue-400' :
                        achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700 border-purple-400' :
                        'bg-yellow-100 text-yellow-700 border-yellow-400'
                      ) : (
                        achievement.rarity === 'common' ? 'bg-gray-800 text-gray-300 border-gray-600' :
                        achievement.rarity === 'rare' ? 'bg-blue-900 text-blue-300 border-blue-600' :
                        achievement.rarity === 'epic' ? 'bg-purple-900 text-purple-300 border-purple-600' :
                        'bg-yellow-900 text-yellow-300 border-yellow-600'
                      )
                    }`}>
                      {achievement.rarity}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className={`text-sm font-bold mb-2 ${
                    achievement.unlocked ? 'text-p5-black opacity-80' : 'text-p5-white opacity-90'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  {/* Progress bar for achievements with progress */}
                  {achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className={achievement.unlocked ? 'text-p5-black' : 'text-p5-white'}>
                          Progress
                        </span>
                        <span className={achievement.unlocked ? 'text-p5-red' : 'text-p5-yellow'}>
                          {achievement.progress} / {achievement.maxProgress}
                        </span>
                      </div>
                      <div className="w-full bg-p5-gray rounded-full h-3 border-2 border-p5-black">
                        <div
                          className="bg-p5-red h-full rounded-full transition-all duration-500"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Bottom info row */}
                  <div className="flex items-center justify-between text-xs font-bold">
                    {/* Unlock date */}
                    {achievement.unlocked && achievement.unlockedDate && (
                      <div className="text-p5-red">
                        Unlocked: {achievement.unlockedDate.toLocaleDateString()}
                      </div>
                    )}
                    
                    {/* Reward */}
                    {achievement.reward && achievement.unlocked && (
                      <div className="bg-p5-yellow text-p5-black px-2 py-1 rounded-comic border-2 border-p5-black">
                        {achievement.reward}
                      </div>
                    )}
                    
                    {/* Status for locked achievements */}
                    {!achievement.unlocked && (
                      <div className="bg-p5-red text-p5-white px-3 py-1 rounded-comic border-2 border-p5-white text-xs font-bold uppercase tracking-wide">
                        🔒 Locked
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameProgress; 