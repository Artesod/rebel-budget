import React, { useState } from 'react';
import AchievementsModal from './AchievementsModal';

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
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const progressPercentage = (experience / nextLevelExp) * 100;
  


  return (
    <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-4 flex flex-col h-full relative overflow-hidden">
      {/* Splash SVG background */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 400 200" fill="none"><path d="M0 0L400 0L400 200L0 180Z" fill="#ffe600" fillOpacity="0.06"/></svg>
      <div className="flex items-center justify-between mb-3 z-10">
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-p5-white uppercase tracking-widest">Level {level}</h2>
          <p className="text-p5-yellow font-bold uppercase text-xs lg:text-sm">Financial Master</p>
        </div>
        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-p5-red border-comic border-4 rounded-full flex items-center justify-center shadow-p5-pop animate-float">
          <span className="text-xl lg:text-2xl font-extrabold text-p5-yellow drop-shadow">{level}</span>
        </div>
      </div>

      <div className="mb-3 z-10">
        <div className="flex justify-between text-xs lg:text-sm text-p5-white font-bold mb-2 uppercase">
          <span>Experience</span>
          <span>{experience} / {nextLevelExp} XP</span>
        </div>
        <div className="w-full bg-p5-black border-comic border-4 rounded-comic h-2 lg:h-3">
          <div
            className="bg-p5-red h-2 lg:h-3 rounded-comic transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="z-10 flex-1 flex flex-col">
        <h3 className="text-base lg:text-lg font-extrabold text-p5-white uppercase mb-2 tracking-widest">Achievements</h3>
        
        {/* Achievement Stats */}
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div className="bg-p5-black bg-opacity-50 border-2 border-p5-red rounded-comic p-2 text-center">
            <div className="text-p5-yellow font-bold text-xs">UNLOCKED</div>
            <div className="text-p5-white font-extrabold text-sm lg:text-base">
              {achievements.filter(a => a.unlocked).length} / {achievements.length}
            </div>
          </div>
          <div className="bg-p5-black bg-opacity-50 border-2 border-p5-yellow rounded-comic p-2 text-center">
            <div className="text-p5-red font-bold text-xs">COMPLETION</div>
            <div className="text-p5-white font-extrabold text-sm lg:text-base">
              {Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}%
            </div>
          </div>
        </div>

        {/* Recent Achievements Preview */}
        <div className="mb-3 flex-1">
          <p className="text-xs font-bold text-p5-yellow uppercase mb-2">Recent Achievements</p>
          <div className="space-y-2">
            {achievements.filter(a => a.unlocked).slice(0, 2).map((achievement) => (
              <div key={achievement.id} className="flex items-center p-2 bg-p5-gray bg-opacity-30 rounded-comic border border-p5-white">
                <span className="text-base mr-2">{achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-p5-white uppercase truncate">{achievement.title}</p>
                  <p className="text-xs text-p5-yellow">{achievement.reward}</p>
                </div>
              </div>
            ))}
            {achievements.filter(a => a.unlocked).length > 2 && (
              <p className="text-xs text-p5-yellow text-center font-bold">
                +{achievements.filter(a => a.unlocked).length - 2} more unlocked
              </p>
            )}
          </div>
        </div>

        {/* View All Button */}
        <button
          onClick={() => setIsAchievementsModalOpen(true)}
          className="w-full bg-p5-red text-p5-white py-2 px-3 rounded-comic border-comic border-2 border-p5-yellow hover:bg-red-600 hover:scale-105 hover:shadow-p5-pop transition-all duration-300 text-sm font-extrabold uppercase tracking-wider"
        >
          🏆 View All Achievements
        </button>
      </div>

      <AchievementsModal 
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
      />
    </div>
  );
};

export default GameProgress; 