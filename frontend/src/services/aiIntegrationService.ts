import { aiAPI, expenseAPI, analyticsAPI } from './api';
import { Expense } from '../types/expense';
import { MascotEmotion, MascotState } from '../components/Mascot';

// Smart insights based on user behavior and data
export interface SmartInsight {
  id: string;
  type: 'warning' | 'celebration' | 'tip' | 'reminder' | 'achievement';
  title: string;
  message: string;
  emotion: MascotEmotion;
  state: MascotState;
  action?: {
    label: string;
    callback: () => void;
  };
  priority: number; // 1-5, higher = more important
}

// Context for AI interactions
export interface AIContext {
  recentExpenses: Expense[];
  monthlySpending: number;
  topCategory: string;
  expenseCount: number;
  avgDailySpend: number;
  trends: {
    increasing: boolean;
    percentage: number;
  };
}

class AIIntegrationService {
  private mascotCallbacks: {
    showMessage: (text: string, emotion?: MascotEmotion, state?: MascotState) => void;
    changeEmotion: (emotion: MascotEmotion) => void;
    changeState: (state: MascotState) => void;
  } | null = null;

  // Register mascot controls
  setMascotControls(callbacks: {
    showMessage: (text: string, emotion?: MascotEmotion, state?: MascotState) => void;
    changeEmotion: (emotion: MascotEmotion) => void;
    changeState: (state: MascotState) => void;
  }) {
    this.mascotCallbacks = callbacks;
  }

  // Get current financial context for AI
  async getFinancialContext(): Promise<AIContext> {
    try {
      const [recentExpenses, analytics] = await Promise.all([
        expenseAPI.getExpenses({ limit: 10 }),
        analyticsAPI.getOverview(1) // Last month
      ]);

      const monthlySpending = analytics.total_expenses;
      const expenseCount = analytics.expense_count;
      const avgDailySpend = monthlySpending / 30;
      const topCategory = analytics.categories[0]?.category || 'Other';

      // Calculate trends (simplified)
      const trends = {
        increasing: analytics.monthly_trends.length > 1 ? 
          analytics.monthly_trends[0].total_amount > analytics.monthly_trends[1].total_amount : false,
        percentage: analytics.monthly_trends.length > 1 ? 
          ((analytics.monthly_trends[0].total_amount - analytics.monthly_trends[1].total_amount) / 
           analytics.monthly_trends[1].total_amount) * 100 : 0
      };

      return {
        recentExpenses,
        monthlySpending,
        topCategory,
        expenseCount,
        avgDailySpend,
        trends
      };
    } catch (error) {
      console.error('Failed to get financial context:', error);
      return {
        recentExpenses: [],
        monthlySpending: 0,
        topCategory: 'Other',
        expenseCount: 0,
        avgDailySpend: 0,
        trends: { increasing: false, percentage: 0 }
      };
    }
  }

  // Generate smart insights based on user data
  async generateSmartInsights(): Promise<SmartInsight[]> {
    const context = await this.getFinancialContext();
    const insights: SmartInsight[] = [];

    // Check for spending patterns and generate insights
    if (context.monthlySpending > 2000) {
      insights.push({
        id: 'high-spending',
        type: 'warning',
        title: 'High Spending Alert!',
        message: `You've spent $${context.monthlySpending.toFixed(2)} this month. Consider reviewing your ${context.topCategory} expenses.`,
        emotion: 'concerned',
        state: 'warning',
        priority: 4
      });
    }

    if (context.trends.increasing && context.trends.percentage > 20) {
      insights.push({
        id: 'spending-increase',
        type: 'warning',
        title: 'Spending Trend Alert',
        message: `Your spending has increased by ${context.trends.percentage.toFixed(1)}% compared to last month!`,
        emotion: 'concerned',
        state: 'warning',
        priority: 5
      });
    }

    if (context.expenseCount >= 5 && context.expenseCount < 10) {
      insights.push({
        id: 'good-tracking',
        type: 'celebration',
        title: 'Great Job Tracking!',
        message: `You've logged ${context.expenseCount} expenses. Keep it up to get better insights!`,
        emotion: 'happy',
        state: 'celebrating',
        priority: 2
      });
    }

    if (context.expenseCount >= 20) {
      insights.push({
        id: 'tracking-master',
        type: 'achievement',
        title: 'Tracking Master!',
        message: `Amazing! You've tracked ${context.expenseCount} expenses this month. You're a financial warrior!`,
        emotion: 'excited',
        state: 'celebrating',
        priority: 3
      });
    }

    if (context.avgDailySpend < 50) {
      insights.push({
        id: 'frugal-hero',
        type: 'celebration',
        title: 'Frugal Hero!',
        message: `Your daily average of $${context.avgDailySpend.toFixed(2)} shows great financial discipline!`,
        emotion: 'winking',
        state: 'celebrating',
        priority: 2
      });
    }

    // Category-specific insights
    if (context.topCategory === 'Food & Dining' && context.monthlySpending > 500) {
      insights.push({
        id: 'food-spending',
        type: 'tip',
        title: 'Food Budget Tip',
        message: 'Food is your top spending category. Try meal planning to save money!',
        emotion: 'thinking',
        state: 'helping',
        priority: 3
      });
    }

    return insights.sort((a, b) => b.priority - a.priority);
  }

  // Show next appropriate insight to user
  async showNextInsight() {
    if (!this.mascotCallbacks) return;

    const insights = await this.generateSmartInsights();
    if (insights.length === 0) {
      // Default encouraging message
      this.mascotCallbacks.showMessage(
        "You're doing great! Keep tracking your expenses for personalized insights!",
        'happy',
        'speaking'
      );
      return;
    }

    const topInsight = insights[0];
    this.mascotCallbacks.showMessage(
      `${topInsight.title}: ${topInsight.message}`,
      topInsight.emotion,
      topInsight.state
    );
  }

  // React to specific user actions
  async reactToExpenseAdded(expense: Expense) {
    if (!this.mascotCallbacks) return;

    // Get category suggestion and react
    if (expense.amount > 100) {
      this.mascotCallbacks.showMessage(
        `Whoa! That's a big expense in ${expense.category}. Make sure it's worth it!`,
        'surprised',
        'warning'
      );
    } else if (expense.category === 'Investment') {
      this.mascotCallbacks.showMessage(
        'Smart move! Investing in your future is always wise!',
        'excited',
        'celebrating'
      );
    } else {
      this.mascotCallbacks.showMessage(
        `Got it! Added ${expense.description} to ${expense.category}.`,
        'happy',
        'speaking'
      );
    }
  }

  // React to page navigation
  async reactToPageChange(page: string) {
    if (!this.mascotCallbacks) return;

    switch (page) {
      case 'dashboard':
        this.mascotCallbacks.changeEmotion('happy');
        this.mascotCallbacks.changeState('idle');
        // Show insight after a short delay
        setTimeout(() => this.showNextInsight(), 2000);
        break;
      
      case 'expenses':
        this.mascotCallbacks.showMessage(
          'Ready to track some expenses? I can help suggest categories!',
          'excited',
          'helping'
        );
        break;
      
      case 'analytics':
        this.mascotCallbacks.showMessage(
          'Let\'s dive into your spending patterns! I love analyzing data!',
          'thinking',
          'helping'
        );
        break;
    }
  }

  // Enhanced chat with financial context
  async chatWithFinancialContext(message: string): Promise<string> {
    const context = await this.getFinancialContext();
    
    // Add context to the message
    const contextualMessage = {
      message: message,
      context: {
        monthly_spending: context.monthlySpending,
        top_category: context.topCategory,
        expense_count: context.expenseCount,
        recent_expenses: context.recentExpenses.slice(0, 3).map(e => ({
          description: e.description,
          amount: e.amount,
          category: e.category
        }))
      }
    };

    try {
      const response = await aiAPI.chat({ message: message });
      
      // Update mascot based on response tone
      if (this.mascotCallbacks) {
        if (response.response.includes('great') || response.response.includes('good')) {
          this.mascotCallbacks.changeEmotion('happy');
        } else if (response.response.includes('concerned') || response.response.includes('careful')) {
          this.mascotCallbacks.changeEmotion('concerned');
        } else {
          this.mascotCallbacks.changeEmotion('thinking');
        }
        this.mascotCallbacks.changeState('speaking');
      }

      return response.response;
    } catch (error) {
      console.error('Chat error:', error);
      return 'I\'m having trouble processing that right now. Let me think about your spending patterns and get back to you!';
    }
  }

  // Auto-categorize with AI feedback
  async smartCategorizeExpense(description: string): Promise<{
    category: string;
    confidence: number;
    mascotMessage?: string;
  }> {
    try {
      const result = await aiAPI.categorizeDescription(description);
      
      // Provide mascot feedback based on categorization
      let mascotMessage = undefined;
      if (this.mascotCallbacks) {
        const category = result.suggested_category;
        if (category === 'Food & Dining') {
          mascotMessage = 'Looks like a food expense! Bon appétit! 🍽️';
        } else if (category === 'Investment') {
          mascotMessage = 'Investment detected! Building wealth like a true financial warrior! 💪';
        } else if (category === 'Entertainment') {
          mascotMessage = 'Entertainment expense! Everyone needs some fun! 🎮';
        } else {
          mascotMessage = `I think this belongs in ${category}. Does that look right?`;
        }
        
        this.mascotCallbacks.showMessage(mascotMessage, 'thinking', 'helping');
      }

      return {
        category: result.suggested_category,
        confidence: 0.8, // Simplified confidence score
        mascotMessage
      };
    } catch (error) {
      console.error('Categorization error:', error);
      return {
        category: 'Other',
        confidence: 0.3,
        mascotMessage: 'Hmm, I\'m not sure about this one. You can choose the category!'
      };
    }
  }

  // Celebrate achievements
  async checkAndCelebrateAchievements() {
    const context = await this.getFinancialContext();
    
    if (!this.mascotCallbacks) return;

    // Achievement: First 10 expenses
    if (context.expenseCount === 10) {
      this.mascotCallbacks.showMessage(
        '🎉 Achievement Unlocked: First 10 expenses tracked! You\'re on your way to financial mastery!',
        'excited',
        'celebrating'
      );
    }

    // Achievement: Low daily spending
    if (context.avgDailySpend < 30 && context.expenseCount > 5) {
      this.mascotCallbacks.showMessage(
        '🏆 Frugal Master! Your daily spending is impressively low. Keep up the great work!',
        'winking',
        'celebrating'
      );
    }

    // Achievement: Consistent tracking
    if (context.expenseCount >= 30) {
      this.mascotCallbacks.showMessage(
        '👑 Tracking Champion! You\'ve become a true expense tracking master!',
        'excited',
        'celebrating'
      );
    }
  }
}

// Export singleton instance
export const aiIntegration = new AIIntegrationService();
export default aiIntegration; 