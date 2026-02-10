export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  userId: string;
  createdAt?: string;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  title: string;
  description?: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  categoryId: string;
  category?: Category;
  userId: string;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
