import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, PiggyBank } from "lucide-react";

interface BudgetOverviewProps {
  budget: number;
  spent: number;
  saved: number;
}

export const BudgetOverview = ({ budget, spent, saved }: BudgetOverviewProps) => {
  const spentPercentage = (spent / budget) * 100;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Budget
          </CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold text-foreground">₹{budget.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Monthly budget limit</p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-expense/10 to-expense/5" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Spent
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-expense" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold text-foreground">₹{spent.toLocaleString()}</div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-expense h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{spentPercentage.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-success/5" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Money Saved
          </CardTitle>
          <PiggyBank className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold text-foreground">₹{saved.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {saved > 0 ? "Great saving!" : "Consider reducing expenses"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};