import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Expense {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type NewExpense = Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export const useExpenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
    }
  }, [user]);

  const fetchExpenses = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  };

  const addExpense = async (expense: NewExpense) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        notes: expense.notes,
      });

    if (!error) {
      await fetchExpenses();
    }
    return { error };
  };

  const updateExpense = async (id: string, updates: Partial<NewExpense>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      await fetchExpenses();
    }
    return { error };
  };

  const deleteExpense = async (id: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      await fetchExpenses();
    }
    return { error };
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return { 
    expenses, 
    loading, 
    addExpense, 
    updateExpense, 
    deleteExpense, 
    totalSpent,
    refetch: fetchExpenses 
  };
};
