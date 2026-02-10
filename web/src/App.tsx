import React, { useEffect } from 'react';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Categories } from './pages/Categories';
import { Layout } from './components/Layout';
import { Modal, Input, Button } from './components/UI';
import {
  useAuth,
  useTransactions,
  useCategories,
  useAppState,
} from './hooks';

const App: React.FC = () => {
  const { user, loading, checkAuth, handleLogin, handleSignup, handleLogout } = useAuth();
  const { activeTab, setActiveTab } = useAppState();
  const {
    transactions,
    isTxModalOpen,
    setIsTxModalOpen,
    txDescription,
    setTxDescription,
    txAmount,
    setTxAmount,
    txDate,
    setTxDate,
    txCategory,
    setTxCategory,
    txType,
    setTxType,
    txError,
    setTxError,
    editingTransaction,
    loadTransactions,
    handleAddTransaction,
    handleEditTransaction,
    openNewTransactionModal,
    closeModal: closeTxModal,
  } = useTransactions();
  const {
    categories,
    isCatModalOpen,
    setIsCatModalOpen,
    catName,
    setCatName,
    catColor,
    setCatColor,
    catIcon,
    setCatIcon,
    editingCategory,
    catError,
    setCatError,
    loadCategories,
    handleAddCategory,
    handleEditCategory,
    openNewCategoryModal,
    closeModal: closeCatModal,
  } = useCategories();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      Promise.all([loadCategories(), loadTransactions()]);
    }
  }, [user, loadCategories, loadTransactions]);

  const handleLoginWrapper = async (email: string, password: string) => {
    await handleLogin(email, password);
    Promise.all([loadCategories(), loadTransactions()]);
  };

  const handleSignupWrapper = async (email: string, password: string, name: string) => {
    await handleSignup(email, password, name);
    Promise.all([loadCategories(), loadTransactions()]);
  };

  const handleAddTransactionWrapper = () => {
    handleAddTransaction(user);
  };

  const handleAddCategoryWrapper = () => {
    handleAddCategory(user);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!user) {
    return (
      <Auth 
        onLogin={handleLoginWrapper}
        onSignup={handleSignupWrapper}
      />
    );
  }

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {activeTab === 'dashboard' && (
        <Dashboard 
          user={user}
          transactions={transactions}
          categories={categories}
          onOpenNewTransaction={openNewTransactionModal}
          onEditTransaction={handleEditTransaction}
          onViewAllTransactions={() => setActiveTab('transactions')}
          onManageCategories={() => setActiveTab('categories')}
          onTransactionUpdate={loadTransactions}
        />
      )}
      
      {activeTab === 'transactions' && (
        <Transactions 
          user={user} 
          transactions={transactions}
          categories={categories}
          onOpenNewTransaction={openNewTransactionModal} 
          onEditTransaction={handleEditTransaction} 
          onTransactionUpdate={loadTransactions}
        />
      )}

      {activeTab === 'categories' && (
        <Categories 
          user={user} 
          categories={categories} 
          transactions={transactions}
          onOpenNewCategory={openNewCategoryModal} 
          onEditCategory={handleEditCategory} 
          onCategoriesRefresh={() => Promise.all([loadCategories(), loadTransactions()])} 
        />
      )}

      {/* Transaction Modal */}
      <Modal 
        isOpen={isTxModalOpen} 
        onClose={closeTxModal} 
        title={editingTransaction ? "Editar transação" : "Nova transação"}
      >
        <div className="space-y-6">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button 
              onClick={() => { setTxType('expense'); setTxError(null); }}
              className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${txType === 'expense' ? 'bg-white text-expense shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              (-) Despesa
            </button>
            <button 
              onClick={() => { setTxType('income'); setTxError(null); }}
              className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${txType === 'income' ? 'bg-white text-revenue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              (+) Receita
            </button>
          </div>

          <Input label="Descrição" placeholder="Ex. Almoço no restaurante" value={txDescription} onChange={e => { setTxDescription(e.target.value); setTxError(null); }} />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Data" type="date" value={txDate} onChange={e => { setTxDate(e.target.value); setTxError(null); }} required />
            <Input
              label="Valor"
              type="text"
              placeholder="0,00"
              value={txAmount}
              onChange={e => {
                const raw = e.target.value;
                const onlyAllowed = raw.replace(/[^0-9,]/g, '');
                const parts = onlyAllowed.split(',');
                const sanitized = parts[0] + (parts.length > 1 ? ',' + parts.slice(1).join('') : '');
                setTxAmount(sanitized);
                setTxError(null);
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Categoria</label>
            <select 
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={txCategory}
              onChange={e => { setTxCategory(e.target.value); setTxError(null); }}
            >
              <option value="">Selecione...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {txError && (
            <p className="text-sm text-red-600">{txError}</p>
          )}
          <Button fullWidth onClick={handleAddTransactionWrapper}>{editingTransaction ? 'Atualizar' : 'Salvar'} Transação</Button>
        </div>
      </Modal>

      {/* Category Modal */}
      <Modal isOpen={isCatModalOpen} onClose={closeCatModal} title={editingCategory ? "Editar categoria" : "Nova categoria"}>
        <div className="space-y-6">
           <Input label="Nome da categoria" placeholder="Ex. Saúde, Educação..." value={catName} onChange={e => setCatName(e.target.value)} />
           {catError && (
             <p className="text-sm text-red-600">{catError}</p>
           )}
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
             <div className="flex gap-2">
               <input 
                 type="color" 
                 value={catColor} 
                 onChange={e => setCatColor(e.target.value)}
                 className="w-12 h-10 rounded cursor-pointer border border-gray-200"
               />
               <div className="flex-1 flex items-center px-3 bg-gray-50 rounded-lg border border-gray-200">
                 <span className="text-sm text-gray-600">{catColor}</span>
               </div>
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
             <div className="grid grid-cols-6 gap-2">
               {['📁', '💰', '🏠', '🎓', '🏥', '🎮', '✈️', '🚗', '🍔', '💡', '📱', '⚽', '🎬', '💼', '🍕', '👕', '🎵', '📺', '⚙️', '🎁', '🏋️', '💻', '🚴', '🎨'].map(icon => (
                 <button
                   key={icon}
                   onClick={() => setCatIcon(icon)}
                   className={`p-3 text-2xl rounded-lg border-2 transition-all ${
                     catIcon === icon 
                       ? 'border-blue-500 bg-blue-50' 
                       : 'border-gray-200 hover:border-gray-300'
                   }`}
                 >
                   {icon}
                 </button>
               ))}
             </div>
           </div>

           <Button fullWidth onClick={handleAddCategoryWrapper}>{editingCategory ? 'Atualizar' : 'Criar'} Categoria</Button>
        </div>
      </Modal>

    </Layout>
  );
};

export default App;
