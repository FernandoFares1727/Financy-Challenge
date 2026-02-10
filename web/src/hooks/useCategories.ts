import { useState, useCallback } from 'react';
import { Category } from '../types';
import { graphqlClient } from '../graphql/client';
import {
  GET_CATEGORIES_QUERY,
  CREATE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
} from '../graphql/queries';
import { useErrorHandling } from './useErrorHandling';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#3B82F6');
  const [catIcon, setCatIcon] = useState('📁');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catError, setCatError] = useState<string | null>(null);
  
  const { getFriendlyError } = useErrorHandling();

  const loadCategories = useCallback(async () => {
    try {
      const response = await graphqlClient.request(GET_CATEGORIES_QUERY) as { categories: Category[] };
      setCategories(response.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, []);

  const handleAddCategory = useCallback(async (user: any) => {
    if (!user) return;
    
    const nameTrim = catName.trim();
    if (!nameTrim) {
      setCatError('Nome da categoria é obrigatório.');
      return;
    }

    const duplicate = categories.some(
      c => 
        c.name.trim().toLowerCase() === nameTrim.toLowerCase() && 
        (editingCategory ? c.id !== editingCategory.id : true)
    );
    
    if (duplicate) {
      setCatError('Já existe uma categoria com esse nome.');
      return;
    }

    setCatError(null);
    try {
      if (editingCategory) {
        await graphqlClient.request(UPDATE_CATEGORY_MUTATION, {
          id: editingCategory.id,
          name: nameTrim,
          color: catColor,
          icon: catIcon,
        });
      } else {
        await graphqlClient.request(CREATE_CATEGORY_MUTATION, {
          name: nameTrim,
          color: catColor,
          icon: catIcon,
        });
      }
      resetCategoryForm();
      loadCategories();
    } catch (error) {
      const msg = getFriendlyError(error) || 'Erro desconhecido';
      setCatError('Erro ao salvar categoria: ' + msg);
    }
  }, [catName, catColor, catIcon, categories, editingCategory, loadCategories, getFriendlyError]);

  const handleEditCategory = useCallback((category: Category) => {
    setEditingCategory(category);
    setCatName(category.name);
    setCatColor(category.color);
    setCatIcon(category.icon);
    setCatError(null);
    setIsCatModalOpen(true);
  }, []);

  const openNewCategoryModal = useCallback(() => {
    resetCategoryForm();
    setIsCatModalOpen(true);
  }, []);

  const resetCategoryForm = useCallback(() => {
    setEditingCategory(null);
    setCatName('');
    setCatColor('#3B82F6');
    setCatIcon('📁');
    setCatError(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsCatModalOpen(false);
    resetCategoryForm();
  }, []);

  return {
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
    closeModal,
  };
};
