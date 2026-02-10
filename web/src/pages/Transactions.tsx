import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, Modal } from '../components/UI';
import { Transaction, Category, User } from '../types';
import { graphqlClient } from '../graphql/client';
import { DELETE_TRANSACTION_MUTATION } from '../graphql/queries';
import { formatDate, formatCurrency } from '../utils/date';

interface TransactionsProps {
  user: User;
  transactions: Transaction[];
  categories: Category[];
  onOpenNewTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onTransactionUpdate: () => void;
}

export const Transactions: React.FC<TransactionsProps> = ({ 
  user, 
  transactions,
  categories,
  onOpenNewTransaction, 
  onEditTransaction, 
  onTransactionUpdate 
}) => {
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (transactions.length > 0 || categories.length > 0) {
      setLoading(false);
    }
  }, [transactions, categories]);

  const handleDelete = async (id: string) => {
    try {
      await graphqlClient.request(DELETE_TRANSACTION_MUTATION, { id });
      setDeleteConfirmId(null);
      onTransactionUpdate();
    } catch (error) {
      alert('Erro ao excluir transação: ' + (error as any).message);
    }
  };

  const periods = useMemo(() => {
    const uniquePeriods = new Set<string>();
    transactions.forEach(t => {
      try {
        const date = new Date(t.date);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          uniquePeriods.add(`${year}-${month}`);
        }
      } catch (e) {
        console.error("Invalid date for transaction:", t)
      }
    });
    return Array.from(uniquePeriods).sort((a, b) => b.localeCompare(a));
  }, [transactions]);
  
  const formatPeriodForDisplay = (period: string) => { // period is 'YYYY-MM'
    const [year, month] = period.split('-');
    return `${month}/${year}`;
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const descriptionMatch = searchTerm === '' || t.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filterType === 'all' || t.type === filterType;
      const categoryMatch = filterCategory === 'all' || t.categoryId === filterCategory;
      const periodMatch = filterPeriod === 'all' || (t.date && new Date(t.date).toISOString().startsWith(filterPeriod));
      
      return descriptionMatch && typeMatch && categoryMatch && periodMatch;
    });
  }, [transactions, searchTerm, filterType, filterCategory, filterPeriod]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterCategory, filterPeriod]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-black text-gray-800">Transações</h2>
        <Button onClick={onOpenNewTransaction}>+ Nova transação</Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Buscar</label>
            <Input
              placeholder="Pesquisar por descrição..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tipo</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
            >
              <option value="all">Todos</option>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Categoria</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="all">Todas</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Período</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={filterPeriod}
              onChange={e => setFilterPeriod(e.target.value)}
            >
              <option value="all">Todos</option>
              {periods.map(p => <option key={p} value={p}>{formatPeriodForDisplay(p)}</option>)}
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Carregando...</td></tr>
              ) : filteredTransactions.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Nenhuma transação encontrada para os filtros aplicados.</td></tr>
              ) : (
                paginatedTransactions.map(t => {
                  const category = categories.find(c => c.id === t.categoryId);
                  const isRevenue = t.type === 'income';
                  return (
                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{category?.icon || '📦'}</span>
                          <span className="font-bold text-gray-800">{t.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(t.date)}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-gray-700" style={{backgroundColor: category?.color ? `${category.color}20` : '#f3f4f6'}}>
                          {category?.name || 'Sem categoria'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isRevenue ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className={`text-xs font-bold uppercase tracking-wider ${isRevenue ? 'text-green-700' : 'text-red-700'}`}>
                            {isRevenue ? 'Entrada' : 'Saída'}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 font-black ${isRevenue ? 'text-green-600' : 'text-red-600'}`}>
                        {isRevenue ? '+' : '-'} {formatCurrency(t.amount)}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => onEditTransaction(t)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Editar transação"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(t.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Deletar transação"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
            title="Página anterior"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  currentPage === page
                    ? 'bg-brand text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
            title="Próxima página"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

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
