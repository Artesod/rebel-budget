import { mockData, Achievement, Transaction, FinancialGoal, UserProgress } from '../data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Data service class to simulate API calls
export class DataService {
  // User Progress
  static async getUserProgress(): Promise<UserProgress> {
    await delay(500); // Simulate network delay
    return mockData.userProgress;
  }

  // Achievements
  static async getAchievements(): Promise<Achievement[]> {
    await delay(300);
    return mockData.achievements;
  }

  static async unlockAchievement(achievementId: string): Promise<Achievement | null> {
    await delay(200);
    const achievement = mockData.achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedDate = new Date();
      return achievement;
    }
    return null;
  }

  // Transactions
  static async getTransactions(limit?: number): Promise<Transaction[]> {
    await delay(400);
    return limit ? mockData.transactions.slice(0, limit) : mockData.transactions;
  }

  static async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    await delay(300);
    const newTransaction: Transaction = {
      ...transaction,
      id: (mockData.transactions.length + 1).toString()
    };
    mockData.transactions.unshift(newTransaction); // Add to beginning
    return newTransaction;
  }

  // Financial Goals
  static async getFinancialGoals(): Promise<FinancialGoal[]> {
    await delay(350);
    return mockData.financialGoals;
  }

  static async updateGoalProgress(goalId: string, newAmount: number): Promise<FinancialGoal | null> {
    await delay(250);
    const goal = mockData.financialGoals.find(g => g.id === goalId);
    if (goal) {
      goal.currentAmount = newAmount;
      goal.progress = Math.round((newAmount / goal.targetAmount) * 100);
      return goal;
    }
    return null;
  }

  static async addFinancialGoal(goal: Omit<FinancialGoal, 'id'>): Promise<FinancialGoal> {
    await delay(300);
    const newGoal: FinancialGoal = {
      ...goal,
      id: (mockData.financialGoals.length + 1).toString()
    };
    mockData.financialGoals.push(newGoal);
    return newGoal;
  }

  // Dashboard Summary
  static async getDashboardData() {
    await delay(600);
    return {
      userProgress: await this.getUserProgress(),
      recentTransactions: await this.getTransactions(3),
      financialGoals: await this.getFinancialGoals(),
      achievements: await this.getAchievements()
    };
  }
}

export default DataService; 