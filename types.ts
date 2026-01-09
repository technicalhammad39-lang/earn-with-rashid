
export type MarketType = 'Forex' | 'Crypto' | 'Stocks' | 'Binary Options';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phone: string;
  city: string;
  country: string;
  nickname: string;
  profilePic?: string;
  badge: 'Beginner' | 'Pro' | 'Mentor';
  role: 'admin' | 'user';
  completedLessons?: string[];
  joinedAt: number;
}

export interface SiteSettings {
  brandName: string;
  logoText: string;
  logoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
}

export interface MarketPair {
  symbol: string;
  name: string;
  type: MarketType;
  price: number;
  change: number;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'Long' | 'Short';
  entryPrice: number;
  amount: number;
  leverage: number;
  sl?: number;
  tp?: number;
  timestamp: number;
}

export interface TradeHistory {
  id: string;
  symbol: string;
  type: 'Long' | 'Short';
  entryPrice: number;
  exitPrice: number;
  amount: number;
  leverage: number;
  pnl: number;
  timestamp: number;
  exitType: 'Manual' | 'SL' | 'TP';
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  image: string;
  videoUrl?: string;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Beginner → Intermediate' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  chapters: Chapter[];
}

export interface Signal {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  market: MarketType;
  entry: string;
  tp: string;
  sl: string;
  confidence: number;
  timeframe: string;
  explanation: string;
  status: 'Active' | 'Hit' | 'Stopped';
}
