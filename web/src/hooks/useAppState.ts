import { useState, useEffect } from 'react';

export const useAppState = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'categories'>(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab ? (savedTab as 'dashboard' | 'transactions' | 'categories') : 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  return {
    activeTab,
    setActiveTab,
  };
};
