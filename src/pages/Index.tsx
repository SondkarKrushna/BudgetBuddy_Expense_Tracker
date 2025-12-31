import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useExpenses, Expense, NewExpense } from "@/hooks/useExpenses";
import { DashboardHeader } from "@/components/DashboardHeader";
import { BudgetOverview } from "@/components/BudgetOverview";
import { ExpenseChart } from "@/components/ExpenseChart";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import EditExpenseDialog from "@/components/EditExpenseDialog";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, needsSalarySetup } = useProfile();
  const { expenses, loading: expensesLoading, addExpense, updateExpense, deleteExpense, totalSpent } = useExpenses();
  
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!profileLoading && profile && needsSalarySetup) {
      navigate('/salary-setup');
    }
  }, [profile, profileLoading, needsSalarySetup, navigate]);

  const handleAddExpense = async (expense: Omit<NewExpense, 'notes'>) => {
    await addExpense({ ...expense, notes: null });
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setEditDialogOpen(true);
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
  };

  const budget = profile?.monthly_salary || 0;
  const totalSaved = budget - totalSpent;

  // Loading state
  if (authLoading || profileLoading || expensesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4">
            <Skeleton className="h-12 w-48" />
          </div>
        </header>
        <main className="container mx-auto p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </main>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Map expenses to the format expected by chart components
  const chartExpenses = expenses.map(exp => ({
    id: exp.id,
    title: exp.title,
    amount: Number(exp.amount),
    category: exp.category,
    date: exp.date,
  }));

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={profile?.full_name} />
      
      <main className="container mx-auto p-6 space-y-8">
        <BudgetOverview 
          budget={budget}
          spent={totalSpent}
          saved={totalSaved}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ExpenseChart expenses={chartExpenses} />
          <CategoryBreakdown expenses={chartExpenses} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AddExpenseForm onAddExpense={handleAddExpense} />
          </div>
          <div className="lg:col-span-2">
            <ExpenseList 
              expenses={expenses} 
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        </div>
      </main>

      <EditExpenseDialog
        expense={editingExpense}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={updateExpense}
      />
    </div>
  );
};

export default Index;
