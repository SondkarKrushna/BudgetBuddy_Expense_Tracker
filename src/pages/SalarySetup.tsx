import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { IndianRupee, Wallet, TrendingUp } from 'lucide-react';

const SalarySetup = () => {
  const navigate = useNavigate();
  const { updateSalary, profile } = useProfile();
  const [salary, setSalary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const salaryAmount = parseFloat(salary);
    if (isNaN(salaryAmount) || salaryAmount <= 0) {
      toast.error('Please enter a valid salary amount');
      return;
    }

    setLoading(true);
    const { error } = await updateSalary(salaryAmount);
    setLoading(false);

    if (error) {
      toast.error('Failed to save salary. Please try again.');
    } else {
      toast.success('Salary saved successfully!');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}!
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Let's set up your monthly income to get started
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="salary" className="text-foreground">Monthly Salary</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="salary"
                  type="number"
                  placeholder="Enter your monthly salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="pl-10 text-lg"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This will be used as your base budget for expense tracking
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                What happens next?
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Track your daily expenses against your salary</li>
                <li>• See real-time remaining balance</li>
                <li>• Get insights on your spending patterns</li>
                <li>• You can update your salary anytime in settings</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Continue to Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalarySetup;
