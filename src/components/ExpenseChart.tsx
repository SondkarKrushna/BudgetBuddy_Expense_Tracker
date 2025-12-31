import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartExpense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseChartProps {
  expenses: ChartExpense[];
}

export const ExpenseChart = ({ expenses }: ExpenseChartProps) => {
  // Group expenses by date and sum amounts
  const chartData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    const existingEntry = acc.find(entry => entry.date === date);
    if (existingEntry) {
      existingEntry.amount += expense.amount;
    } else {
      acc.push({ date, amount: expense.amount });
    }
    
    return acc;
  }, [] as { date: string; amount: number }[])
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(-7); // Show last 7 days

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Daily Spending Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))"
              }}
              formatter={(value) => [`₹${value}`, "Amount"]}
            />
            <Bar 
              dataKey="amount" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};