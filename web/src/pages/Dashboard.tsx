
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../components/UI';
import { Transaction, Category, User } from '../types';
import { graphqlClient } from '../graphql/client';
import { DELETE_TRANSACTION_MUTATION } from '../graphql/queries';
import { formatCurrency, formatDate } from '../utils/date';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
  categories: Category[];
  onOpenNewTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onViewAllTransactions: () => void;
  onManageCategories: () => void;
  onTransactionUpdate: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  transactions,
  categories,
  onOpenNewTransaction, 
  onEditTransaction, 
  onViewAllTransactions, 
  onManageCategories, 
  onTransactionUpdate 
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transactions.length > 0 || categories.length > 0) {
      setLoading(false);
    }
  }, [transactions, categories]);

  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalRevenue - totalExpense;

  const handleDelete = async (id: string) => {
    try {
      await graphqlClient.request(DELETE_TRANSACTION_MUTATION, { id });
      setDeleteConfirmId(null);
      onTransactionUpdate();
    } catch (error) {
      alert('Erro ao excluir transação: ' + (error as any).message);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando painel...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm4-8v4m-2-2h4" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">SALDO TOTAL</p>
              <h2 className="text-2xl font-black text-gray-900">{formatCurrency(balance)}</h2>
            </div>
          </div>
        </Card>
        <Card className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 0V4m0 8v-2" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">RECEITAS DO MÊS</p>
              <h2 className="text-2xl font-black text-green-600">{formatCurrency(totalRevenue)}</h2>
            </div>
          </div>
        </Card>
        <Card className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 0V4m0 8v-2" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">DESPESAS DO MÊS</p>
              <h2 className="text-2xl font-black text-red-600">{formatCurrency(totalExpense)}</h2>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Transações recentes</h3>
            <button onClick={onViewAllTransactions} className="text-green-600 text-sm font-bold hover:underline">Ver todas &gt;</button>
          </div>
          <Card className="p-0 overflow-hidden bg-white rounded-lg shadow-sm">
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-gray-400">Nenhuma transação cadastrada.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {transactions.slice(0, 5).map(t => {
                  const category = categories.find(c => c.id === t.categoryId);
                  return (
                  <div key={t.id} className="p-4 flex items-center hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                        {category?.icon || '📦'}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{t.description}</p>
                        <p className="text-xs text-gray-400">{formatDate(t.date)}</p>
                      </div>
                      {category && (
                        <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                          {category.name}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        <p className="font-bold">
                          {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                        </p>
                      </div>
                      <div className="w-5 h-5 flex items-center justify-center rounded-full" style={{ backgroundColor: t.type === 'income' ? '#10B981' : '#EF4444' }}>
                        {t.type === 'income' ? 
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                          :
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                        }
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <Button fullWidth variant="ghost" className="text-green-600 font-bold" onClick={onOpenNewTransaction}>
                + Nova transação
              </Button>
            </div>
          </Card>
        </div>

        {/* Categories Summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Categorias</h3>
            <button onClick={onManageCategories} className="text-green-600 text-sm font-bold hover:underline">Gerenciar &gt;</button>
          </div>
          <Card className="p-4 space-y-2 bg-white rounded-lg shadow-sm">
            {categories.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Nenhuma categoria.</p>
            ) : (
              categories.slice(0, 5).map(c => {
                 const categoryAmount = transactions
                    .filter(t => t.categoryId === c.id)
                    .reduce((acc, t) => {
                      return t.type === 'income' ? acc + t.amount : acc - t.amount;
                    }, 0);

                 return (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                        {c.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">{transactions.filter(t => t.categoryId === c.id).length} itens</span>
                      <span className={`text-sm font-bold ${categoryAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {categoryAmount >= 0 ? '+' : ''}{formatCurrency(categoryAmount)}
                      </span>
                    </div>
                  </div>
                 );
              })
            )}
          </Card>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteConfirmId !== null} 
        onClose={() => setDeleteConfirmId(null)}
        title="Excluir transação"
      >
        <div className="space-y-6">
          <p className="text-gray-600">Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.</p>
          <div className="flex gap-3">
            <Button 
              fullWidth 
              onClick={() => setDeleteConfirmId(null)}
              className="bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              Cancelar
            </Button>
            <Button 
              fullWidth 
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
