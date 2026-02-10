import { useState, useCallback } from 'react';
import { Transaction, Category } from '../types';
import { graphqlClient } from '../graphql/client';
import {
  GET_TRANSACTIONS_QUERY,
  CREATE_TRANSACTION_MUTATION,
  UPDATE_TRANSACTION_MUTATION,
} from '../graphql/queries';
import { useErrorHandling } from './useErrorHandling';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txDescription, setTxDescription] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txCategory, setTxCategory] = useState('');
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txError, setTxError] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const { getFriendlyError } = useErrorHandling();

  const loadTransactions = useCallback(async () => {
    try {
      const response = await graphqlClient.request(GET_TRANSACTIONS_QUERY) as { transactions: Transaction[] };
      setTransactions(response.transactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }, []);

  const handleAddTransaction = useCallback(async (user: any) => {
    if (!user) return;
    if (!txAmount || !txCategory || !txDate) {
      setTxError('Por favor, preencha todos os campos obrigatórios, incluindo a data.');
      return;
    }
    
    try {
      const dateObj = new Date(txDate + 'T00:00:00');
      if (isNaN(dateObj.getTime())) {
        setTxError('Data inválida. Por favor, selecione uma data válida.');
        return;
      }

      if (editingTransaction) {
        await graphqlClient.request(UPDATE_TRANSACTION_MUTATION, {
          id: editingTransaction.id,
          description: txDescription,
          amount: parseFloat(txAmount.replace(',', '.')),
          date: dateObj.toISOString(),
          type: txType,
          categoryId: txCategory,
        });
      } else {
        await graphqlClient.request(CREATE_TRANSACTION_MUTATION, {
          description: txDescription,
          amount: parseFloat(txAmount.replace(',', '.')),
          date: dateObj.toISOString(),
          type: txType,
          categoryId: txCategory,
        });
      }
      
      resetTransactionForm();
      loadTransactions();
    } catch (error) {
      const msg = getFriendlyError(error) || 'Erro desconhecido';
      setTxError('Erro ao salvar transação: ' + msg);
    }
  }, [txDescription, txAmount, txDate, txCategory, txType, editingTransaction, loadTransactions, getFriendlyError]);

  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setTxDescription(transaction.description || '');
    setTxError(null);
    setTxAmount(
      typeof transaction.amount === 'number' 
        ? transaction.amount.toString().replace('.', ',') 
        : String(transaction.amount).replace('.', ',')
    );
    
    try {
      const date = transaction.date as Date | string;
      const dateStr = date instanceof Date 
        ? date.toISOString().split('T')[0]
        : typeof date === 'string' 
          ? date.split('T')[0]
          : new Date().toISOString().split('T')[0];
      setTxDate(dateStr);
    } catch {
      setTxDate(new Date().toISOString().split('T')[0]);
    }
    
    setTxCategory(transaction.categoryId);
    setTxType(transaction.type as 'income' | 'expense');
    setIsTxModalOpen(true);
  }, []);

  const openNewTransactionModal = useCallback(() => {
    resetTransactionForm();
    setIsTxModalOpen(true);
  }, []);

  const resetTransactionForm = useCallback(() => {
    setEditingTransaction(null);
    setTxDescription('');
    setTxAmount('');
    setTxDate(new Date().toISOString().split('T')[0]);
    setTxCategory('');
    setTxType('expense');
    setTxError(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsTxModalOpen(false);
    resetTransactionForm();
  }, []);

  return {
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
    closeModal,
  };
};
