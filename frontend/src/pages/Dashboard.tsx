import React, { useState, useEffect } from 'react';
import GameProgress from '../components/GameProgress';
import AnalyticsSummary from '../components/AnalyticsSummary';
import RecentExpenses from '../components/RecentExpenses';
import { mockData, mockAchievements } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useMascotContext } from '../components/MascotContext';
import aiIntegration, { SmartInsight } from '../services/aiIntegrationService';

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

// Smart Insights Component
const SmartInsightsWidget = () => {
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useMascotContext();

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true);
      try {
        const smartInsights = await aiIntegration.generateSmartInsights();
        setInsights(smartInsights.slice(0, 2)); // Show top 2 insights
      } catch (error) {
        console.error('Failed to load insights:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  const handleInsightClick = (insight: SmartInsight) => {
    showMessage(insight.message, insight.emotion, insight.state);
  };

  if (loading) {
    return (
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-4 animate-p5-slide-in h-full">
        <h3 className="text-base lg:text-lg font-extrabold text-p5-white uppercase mb-2 tracking-widest">🧠 AI Insights</h3>
        <div className="flex items-center justify-center h-16">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-p5-yellow"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-4 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300 h-full flex flex-col">
      <h3 className="text-base lg:text-lg font-extrabold text-p5-white uppercase mb-2 tracking-widest">🧠 AI Insights</h3>
      
      {insights.length === 0 ? (
        <div className="text-center py-4 flex-1 flex items-center justify-center">
          <p className="text-p5-yellow font-bold text-sm">Keep tracking expenses to unlock AI insights!</p>
        </div>
      ) : (
        <div className="space-y-2 flex-1">
          {insights.map((insight) => (
            <div 
              key={insight.id}
              onClick={() => handleInsightClick(insight)}
              className={`p-2 rounded-comic border-comic border-2 cursor-pointer hover:scale-105 transition-all duration-300 ${
                insight.type === 'warning' ? 'bg-p5-red bg-opacity-20 border-p5-red' :
                insight.type === 'celebration' || insight.type === 'achievement' ? 'bg-p5-yellow bg-opacity-20 border-p5-yellow' :
                'bg-p5-blue bg-opacity-20 border-p5-blue'
              }`}
            >
              <div className="flex items-start space-x-2">
                <span className="text-base flex-shrink-0">
                  {insight.type === 'warning' ? '⚠️' :
                   insight.type === 'celebration' ? '🎉' :
                   insight.type === 'achievement' ? '🏆' :
                   insight.type === 'tip' ? '💡' : '📊'}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-p5-white text-xs lg:text-sm uppercase">{insight.title}</h4>
                  <p className="text-p5-white text-xs leading-relaxed">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
    <div className="space-y-3 font-comic p-2 relative w-full max-w-none mx-2">
      {/* Top Row - Welcome Message and Stats in one horizontal line */}
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-3 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          {/* Welcome Message */}
          <div className="flex-shrink-0">
            <SpeechBubble>Welcome Back, {getUserDisplayName()}!</SpeechBubble>
          </div>
          
          {/* Stats Cards - Always horizontal on medium+ screens */}
          <div className="flex-1 flex flex-col sm:flex-row gap-2 min-w-0">
            <div className="bg-p5-red bg-opacity-90 border-comic border-4 rounded-comic p-3 shadow-p5-pop text-center hover:scale-105 hover:shadow-p5 transition-all duration-300 flex-1">
              <h3 className="text-xs font-bold text-p5-white uppercase mb-1">Total Balance</h3>
              <p className="text-lg lg:text-xl font-extrabold text-p5-yellow drop-shadow">${mockData.userProgress.totalBalance.toLocaleString()}</p>
            </div>
            <div className="bg-p5-black border-comic border-4 rounded-comic p-3 shadow-p5-pop text-center hover:scale-105 hover:shadow-p5 transition-all duration-300 flex-1">
              <h3 className="text-xs font-bold text-p5-white uppercase mb-1">Monthly Savings</h3>
              <p className="text-lg lg:text-xl font-extrabold text-p5-yellow drop-shadow">${mockData.userProgress.monthlySavings.toLocaleString()}</p>
            </div>
            <div className="bg-p5-yellow border-comic border-4 rounded-comic p-3 shadow-p5-pop text-center hover:scale-105 hover:shadow-p5 transition-all duration-300 flex-1">
              <h3 className="text-xs font-bold text-p5-black uppercase mb-1">Investment Returns</h3>
              <p className="text-lg lg:text-xl font-extrabold text-p5-red drop-shadow">+${mockData.userProgress.investmentReturns}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Row - Now with 4 sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Game Progress */}
        <div className="animate-p5-slide-in">
          <GameProgress
            level={mockData.userProgress.level}
            experience={mockData.userProgress.experience}
            nextLevelExp={mockData.userProgress.nextLevelExp}
            achievements={mockAchievements}
          />
        </div>

        {/* AI Insights */}
        <div className="animate-p5-slide-in">
          <SmartInsightsWidget />
        </div>

        {/* Recent Expenses */}
        <div className="animate-p5-slide-in">
          <RecentExpenses limit={5} />
        </div>

        {/* Analytics Summary */}
        <div className="animate-p5-slide-in">
          <div className="h-full">
            <AnalyticsSummary months={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 