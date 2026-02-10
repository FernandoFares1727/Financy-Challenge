
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  activeTab: 'dashboard' | 'transactions' | 'categories';
  setActiveTab: (tab: 'dashboard' | 'transactions' | 'categories') => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, activeTab, setActiveTab, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-xl">$</span>
            </div>
            <span className="text-2xl font-bold text-brand">FINANCY</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`font-medium text-sm transition-colors ${activeTab === 'dashboard' ? 'text-brand underline underline-offset-8 decoration-2' : 'text-gray-500 hover:text-brand'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`font-medium text-sm transition-colors ${activeTab === 'transactions' ? 'text-brand underline underline-offset-8 decoration-2' : 'text-gray-500 hover:text-brand'}`}
            >
              Transações
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`font-medium text-sm transition-colors ${activeTab === 'categories' ? 'text-brand underline underline-offset-8 decoration-2' : 'text-gray-500 hover:text-brand'}`}
            >
              Categorias
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">{user.name}</p>
              <button onClick={onLogout} className="text-xs text-expense hover:underline">Sair</button>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 border-2 border-white shadow-sm overflow-hidden">
               {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} /> : user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  );
};
