import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { Expense } from "@/hooks/useExpenses";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => Promise<void>;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Food": "bg-success/10 text-success border-success/20",
    "Transport": "bg-primary/10 text-primary border-primary/20",
    "Transportation": "bg-primary/10 text-primary border-primary/20",
    "Entertainment": "bg-warning/10 text-warning border-warning/20",
    "Bills": "bg-expense/10 text-expense border-expense/20",
    "Shopping": "bg-accent/10 text-accent border-accent/20",
    "Healthcare": "bg-muted text-muted-foreground border-border",
    "Investment": "bg-primary/20 text-primary border-primary/30",
    "Other": "bg-muted text-muted-foreground border-border",
  };
  return colors[category] || colors["Other"];
};

export const ExpenseList = ({ expenses, onEdit, onDelete }: ExpenseListProps) => {
  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast.success("Expense deleted successfully");
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No expenses recorded yet. Add your first expense!
            </p>
          ) : (
            sortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-foreground">{expense.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={getCategoryColor(expense.category)}
                    >
                      {expense.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                    {expense.notes && (
                      <span className="text-xs italic truncate max-w-32">{expense.notes}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-foreground">₹{Number(expense.amount).toFixed(2)}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(expense)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{expense.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(expense.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
