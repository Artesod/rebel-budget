import React from 'react';
import GameProgress from '../components/GameProgress';
import { mockData, Transaction, FinancialGoal } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const SpeechBubble = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block">
    <div className="bg-p5-white text-p5-black border-comic border-4 rounded-comic px-4 py-2 shadow-p5-pop text-lg md:text-xl font-extrabold uppercase tracking-wider animate-p5-pop">
      {children}
    </div>
    <svg className="absolute left-6 -bottom-3" width="30" height="15" viewBox="0 0 30 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 30,0 15,15" fill="#fff" stroke="#e60012" strokeWidth="2"/>
    </svg>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Get user's display name (prefer full name, fallback to email, then default)
  const getUserDisplayName = () => {
    if (user?.full_name && user.full_name.trim()) {
      return user.full_name.split(' ')[0]; // Use first name only
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Use email username part
    }
    return 'Financial Warrior';
  };

  return (
    <div className="space-y-4 font-comic p-2 md:p-4 relative w-full">
      {/* Top Row - Welcome Message and Stats in one horizontal line */}
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Welcome Message */}
          <div className="flex-shrink-0">
            <SpeechBubble>Welcome Back, {getUserDisplayName()}!</SpeechBubble>
          </div>
          
          {/* Stats Cards - Always horizontal on medium+ screens */}
          <div className="flex-1 flex flex-col sm:flex-row gap-4 min-w-0">
            <div className="bg-p5-red bg-opacity-90 border-comic border-4 rounded-comic p-3 shadow-p5-pop text-center hover:scale-105 hover:shadow-p5 transition-all duration-300 flex-1">
              <h3 className="text-xs font-bold text-p5-white uppercase mb-1">Total Balance</h3>
              <p className="text-lg font-extrabold text-p5-yellow drop-shadow">${mockData.userProgress.totalBalance.toLocaleString()}</p>
            </div>
            <div className="bg-p5-black border-comic border-4 rounded-comic p-3 shadow-p5-pop text-center hover:scale-105 hover:shadow-p5 transition-all duration-300 flex-1">
              <h3 className="text-xs font-bold text-p5-white uppercase mb-1">Monthly Savings</h3>
              <p className="text-lg font-extrabold text-p5-yellow drop-shadow">${mockData.userProgress.monthlySavings.toLocaleString()}</p>
            </div>
            <div className="bg-p5-yellow border-comic border-4 rounded-comic p-3 shadow-p5-pop text-center hover:scale-105 hover:shadow-p5 transition-all duration-300 flex-1">
              <h3 className="text-xs font-bold text-p5-black uppercase mb-1">Investment Returns</h3>
              <p className="text-lg font-extrabold text-p5-red drop-shadow">+${mockData.userProgress.investmentReturns}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Row - All three sections horizontally */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Game Progress - Takes up 4 columns */}
        <div className="lg:col-span-4 animate-p5-slide-in">
          <GameProgress
            level={mockData.userProgress.level}
            experience={mockData.userProgress.experience}
            nextLevelExp={mockData.userProgress.nextLevelExp}
            achievements={mockData.achievements}
          />
        </div>

        {/* Recent Transactions - Takes up 4 columns */}
        <div className="lg:col-span-4 bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300">
          <h3 className="text-xl font-extrabold text-p5-white uppercase mb-4 tracking-widest">Recent Transactions</h3>
          <div className="space-y-3">
            {mockData.transactions.slice(0, 5).map((transaction: Transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-p5-gray rounded-comic border-comic border-2 hover:scale-105 hover:bg-opacity-80 transition-all duration-300">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-p5-white uppercase text-sm truncate">{transaction.name}</p>
                  <p className="text-xs text-p5-yellow">{transaction.category}</p>
                </div>
                <span className={`font-extrabold text-sm ml-2 flex-shrink-0 ${transaction.amount > 0 ? 'text-p5-yellow' : 'text-p5-red'}`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Goals - Takes up 4 columns */}
        <div className="lg:col-span-4 bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300">
          <h3 className="text-xl font-extrabold text-p5-white uppercase mb-4 tracking-widest">Financial Goals</h3>
          <div className="space-y-4">
            {mockData.financialGoals.map((goal: FinancialGoal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-p5-yellow font-bold uppercase truncate">{goal.name}</span>
                  <span className="text-p5-white flex-shrink-0 ml-2">{goal.target}</span>
                </div>
                <div className="w-full bg-p5-black rounded-comic h-3 border-comic border-2 overflow-hidden">
                  <div
                    className="bg-p5-red h-3 rounded-comic transition-all duration-500 animate-p5-swoosh"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 