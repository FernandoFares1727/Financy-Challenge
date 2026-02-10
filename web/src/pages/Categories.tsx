
import React, { useEffect, useState } from 'react';
import { Card, Button, Modal } from '../components/UI';
import { Category, User, Transaction } from '../types';
import { graphqlClient } from '../graphql/client';
import { GET_CATEGORIES_QUERY, DELETE_CATEGORY_MUTATION, UPDATE_CATEGORY_MUTATION } from '../graphql/queries';

interface CategoriesProps {
  user: User;
  categories: Category[];
  transactions: Transaction[];
  onOpenNewCategory: () => void;
  onEditCategory: (category: Category) => void;
  onCategoriesRefresh: () => void;
}

export const Categories: React.FC<CategoriesProps> = ({ user, categories, transactions, onOpenNewCategory, onEditCategory, onCategoriesRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await graphqlClient.request(DELETE_CATEGORY_MUTATION, { id });
      setDeleteConfirmId(null);
      onCategoriesRefresh();
    } catch (error) {
      alert('Erro ao excluir categoria: ' + (error as any).message);
    }
  };

  // Calcular categoria mais utilizada
  const mostUsedCategory = categories.length > 0 
    ? categories.reduce((max, category) => {
        const categoryCount = transactions.filter(t => t.categoryId === category.id).length;
        const maxCount = transactions.filter(t => t.categoryId === max.id).length;
        return categoryCount > maxCount ? category : max;
      })
    : null;

  // Contar transações por categoria
  const getCategoryTransactionCount = (categoryId: string) => {
    return transactions.filter(t => t.categoryId === categoryId).length;
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Categorias</h2>
          <p className="text-sm text-gray-500 mt-1">Organize suas transações por categorias</p>
        </div>
        <Button onClick={onOpenNewCategory}>+ Nova categoria</Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total de Categorias</p>
              <p className="text-3xl font-black text-gray-800 mt-2">{categories.length}</p>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.972 1.972 0 013 12V7a4 4 0 014-4z" /></svg>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total de Transações</p>
              <p className="text-3xl font-black text-gray-800 mt-2">{transactions.length}</p>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria Mais Utilizada</p>
              <p className="text-3xl font-black text-gray-800 mt-2">{mostUsedCategory?.name || '-'}</p>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
        </Card>
      </div>

      {categories.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
          Nenhuma categoria cadastrada. Comece criando uma!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(c => (
            <Card key={c.id} className="p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0" 
                  style={{ backgroundColor: `${c.color}20`, color: c.color }}
                >
                  {c.icon}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEditCategory(c)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Editar categoria"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button 
                    onClick={() => setDeleteConfirmId(c.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Deletar categoria"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-gray-800 text-lg mb-1">{c.name}</h3>
              {c.description && (
                <p className="text-xs text-gray-500 mb-4 flex-grow line-clamp-2">
                  {c.description}
                </p>
              )}

              <div className="flex items-center justify-between pts-4 border-t border-gray-100 mt-auto pt-4">
                <span className="text-xs font-semibold text-gray-500">
                  {getCategoryTransactionCount(c.id)} item{getCategoryTransactionCount(c.id) !== 1 ? 's' : ''}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteConfirmId !== null} 
        onClose={() => setDeleteConfirmId(null)}
        title="Excluir categoria"
      >
        <div className="space-y-6">
          <p className="text-gray-600">Tem certeza que deseja excluir esta categoria? Todas as transações vinculadas a ela também serão deletadas. Esta ação não pode ser desfeita.</p>
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
