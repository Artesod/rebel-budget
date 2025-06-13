import { AchievementCategory, AchievementRarity } from '../components/GameProgress';

// Achievement interface for type safety
export interface Achievement {
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

// Transaction interface
export interface Transaction {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: Date;
  type: 'income' | 'expense';
}

// Financial Goal interface
export interface FinancialGoal {
  id: string;
  name: string;
  progress: number;
  target: string;
  targetAmount: number;
  currentAmount: number;
  category: 'savings' | 'investment' | 'debt' | 'purchase';
  deadline?: Date;
}

// User Progress interface
export interface UserProgress {
  level: number;
  experience: number;
  nextLevelExp: number;
  totalBalance: number;
  monthlySavings: number;
  investmentReturns: number;
}

// Mock Achievements Data
export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Budget Master',
    description: 'Stayed within budget for 3 months',
    icon: '🎯',
    unlocked: true,
    category: 'budgeting',
    rarity: 'rare',
    unlockedDate: new Date('2024-01-15'),
    reward: '+50 XP'
  },
  {
    id: '2',
    title: 'Savings Champion',
    description: 'Saved 20% of income',
    icon: '💰',
    unlocked: true,
    category: 'savings',
    rarity: 'epic',
    unlockedDate: new Date('2024-01-10'),
    reward: '+100 XP'
  },
  {
    id: '3',
    title: 'Investment Novice',
    description: 'Made your first investment',
    icon: '📈',
    unlocked: false,
    category: 'investing',
    rarity: 'common',
    progress: 0,
    maxProgress: 1
  },
  {
    id: '4',
    title: 'Expense Detective',
    description: 'Track expenses for 7 days',
    icon: '🔍',
    unlocked: true,
    category: 'spending',
    rarity: 'common',
    unlockedDate: new Date('2024-01-05'),
    reward: '+25 XP'
  },
  {
    id: '5',
    title: 'Week Warrior',
    description: 'Log expenses for 7 days straight',
    icon: '⚡',
    unlocked: false,
    category: 'streaks',
    rarity: 'common',
    progress: 5,
    maxProgress: 7
  },
  {
    id: '6',
    title: 'Emergency Fund',
    description: 'Build a $1,000 emergency fund',
    icon: '🛡️',
    unlocked: false,
    category: 'savings',
    rarity: 'rare',
    progress: 650,
    maxProgress: 1000
  },
  {
    id: '7',
    title: 'Frugal Master',
    description: 'Reduce monthly expenses by 20%',
    icon: '✂️',
    unlocked: false,
    category: 'spending',
    rarity: 'rare',
    progress: 12,
    maxProgress: 20
  }
];

// Mock Transactions Data
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    name: 'Grocery Shopping',
    amount: -85.50,
    category: 'Food',
    date: new Date('2024-01-20'),
    type: 'expense'
  },
  {
    id: '2',
    name: 'Salary Deposit',
    amount: 3500,
    category: 'Income',
    date: new Date('2024-01-15'),
    type: 'income'
  },
  {
    id: '3',
    name: 'Netflix Subscription',
    amount: -15.99,
    category: 'Entertainment',
    date: new Date('2024-01-18'),
    type: 'expense'
  },
  {
    id: '4',
    name: 'Gas Station',
    amount: -45.20,
    category: 'Transportation',
    date: new Date('2024-01-19'),
    type: 'expense'
  },
  {
    id: '5',
    name: 'Freelance Payment',
    amount: 750,
    category: 'Income',
    date: new Date('2024-01-17'),
    type: 'income'
  }
];

// Mock Financial Goals Data
export const mockFinancialGoals: FinancialGoal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    progress: 75,
    target: '$10,000',
    targetAmount: 10000,
    currentAmount: 7500,
    category: 'savings',
    deadline: new Date('2024-12-31')
  },
  {
    id: '2',
    name: 'Vacation Fund',
    progress: 30,
    target: '$3,000',
    targetAmount: 3000,
    currentAmount: 900,
    category: 'savings',
    deadline: new Date('2024-06-15')
  },
  {
    id: '3',
    name: 'New Car Fund',
    progress: 15,
    target: '$25,000',
    targetAmount: 25000,
    currentAmount: 3750,
    category: 'purchase',
    deadline: new Date('2025-03-01')
  }
];

// Mock User Progress Data
export const mockUserProgress: UserProgress = {
  level: 5,
  experience: 750,
  nextLevelExp: 1000,
  totalBalance: 12345,
  monthlySavings: 1234,
  investmentReturns: 567
};

// Combined mock data export
export const mockData = {
  userProgress: mockUserProgress,
  achievements: mockAchievements,
  transactions: mockTransactions,
  financialGoals: mockFinancialGoals
};

export default mockData; 