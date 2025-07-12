import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Download, Search, Filter, Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Transaction } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { AddTransactionDialog } from '@/components/finance/AddTransactionDialog';

const Finance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all-time');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const { addTransaction, deleteTransaction, transactions, financeCategories, currentUser } = useAppContext();

  const summary = (transactions as Transaction[]).reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      acc.income += transaction.amount;
    } else {
      acc.expenses += transaction.amount;
    }
    return acc;
  }, { income: 0, expenses: 0 });

  const balance = summary.income - summary.expenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  // Category breakdown calculations
  const categoryBreakdown = financeCategories.map(category => {
    const categoryTransactions = (transactions as Transaction[]).filter(t => t.categoryId === category.id);
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      ...category,
      total,
      count: categoryTransactions.length,
      transactions: categoryTransactions
    };
  });

  const incomeCategories = categoryBreakdown.filter(cat => cat.type === 'income' && cat.total > 0);
  const expenseCategories = categoryBreakdown.filter(cat => cat.type === 'expense' && cat.total > 0);

  // Get category totals for chart
  const categoryTotals = categoryBreakdown
    .filter(cat => cat.total > 0)
    .map(cat => ({
      name: cat.name,
      value: cat.total,
      color: cat.color,
      type: cat.type
    }));

  const monthlyData = (transactions as Transaction[])
    .reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      const existingMonth = acc.find(m => m.name === monthYear);
      if (existingMonth) {
        if (transaction.type === 'income') {
          existingMonth.income += transaction.amount;
        } else {
          existingMonth.expense += transaction.amount;
        }
      } else {
        acc.push({
          name: monthYear,
          income: transaction.type === 'income' ? transaction.amount : 0,
          expense: transaction.type === 'expense' ? transaction.amount : 0
        });
      }
      return acc;
    }, [] as { name: string; income: number; expense: number }[]);

  monthlyData.sort((a, b) => {
    const aDate = new Date(a.name);
    const bDate = new Date(b.name);
    return aDate.getTime() - bDate.getTime();
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  const filteredTransactions = (transactions as Transaction[]).filter(transaction => {
    // Apply search filter
    const searchFilter = searchQuery.toLowerCase();
    const matchesSearch = transaction.description.toLowerCase().includes(searchFilter) ||
                          transaction.categoryId.toLowerCase().includes(searchFilter) ||
                          transaction.type.toLowerCase().includes(searchFilter);
    
    // Apply date filter
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    let matchesDate = true;
    
    if (dateRange === 'this-month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      matchesDate = transactionDate >= startOfMonth;
    } else if (dateRange === 'last-month') {
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      matchesDate = transactionDate >= startOfLastMonth && transactionDate < startOfThisMonth;
    }
    
    return matchesSearch && matchesDate;
  });

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsAddTransactionOpen(true);
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "createdById">) => {
    // Add createdById before passing to addTransaction
    addTransaction({
      ...newTransaction,
      createdById: currentUser.id
    });
    setIsAddTransactionOpen(false);
  };

  const exportFinanceReport = () => {
    const csvContent = [
      ['Date', 'Category', 'Description', 'Type', 'Amount', 'Notes'],
      ...filteredTransactions.map(transaction => {
        const category = financeCategories.find(cat => cat.id === transaction.categoryId);
        return [
          new Date(transaction.date).toLocaleDateString(),
          category?.name || 'Unknown Category',
          transaction.description,
          transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
          transaction.amount.toString(),
          transaction.notes || ''
        ];
      })
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderTransactionList = () => {

    if (filteredTransactions.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      );
    }

    return filteredTransactions.map((transaction) => {
      const category = financeCategories.find(cat => cat.id === transaction.categoryId);
      
      return (
        <div key={transaction.id} className="grid grid-cols-6 px-4 py-3 hover:bg-muted/50">
          <div>{new Date(transaction.date).toLocaleDateString()}</div>
          <div>{category?.name || 'Unknown Category'}</div>
          <div className="truncate">
            <div>{transaction.description}</div>
            {transaction.notes && (
              <div className="text-sm text-muted-foreground mt-1">
                {transaction.notes}
              </div>
            )}
          </div>
          <div className={transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'}>
            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
          </div>
          <div className={`text-right ${transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
            {formatCurrency(transaction.amount)}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEditTransaction(transaction)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDeleteTransaction(transaction.id)} className="text-red-500 hover:text-red-700">
              Delete
            </Button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Finance</h1>
          <p className="text-muted-foreground">Manage church finances and transactions</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAddTransactionOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
          <Button variant="outline" onClick={exportFinanceReport}>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
            <p className="text-xs text-muted-foreground">
              Current available funds
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.income)}</div>
            <p className="text-xs text-muted-foreground">
              Total income received
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.expenses)}</div>
            <p className="text-xs text-muted-foreground">
              Total expenses paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {(incomeCategories.length > 0 || expenseCategories.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {incomeCategories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Income Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {incomeCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-500">{category.count} transactions</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{formatCurrency(category.total)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {expenseCategories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
                  Expense Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenseCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-500">{category.count} transactions</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">{formatCurrency(category.total)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="income" fill="#10b981" name="Income" />
                  <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue={dateRange} onValueChange={setDateRange} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all-time">All Time</TabsTrigger>
                <TabsTrigger value="this-month">This Month</TabsTrigger>
                <TabsTrigger value="last-month">Last Month</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-6 border-b px-4 py-3 font-medium">
              <div>Date</div>
              <div>Category</div>
              <div>Description & Notes</div>
              <div>Type</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y">
              {renderTransactionList()}
            </div>
          </div>
        </CardContent>
      </Card>

      <AddTransactionDialog 
        open={isAddTransactionOpen} 
        onOpenChange={(open) => {
          setIsAddTransactionOpen(open);
          if (!open) setEditingTransaction(null);
        }}
        onAddTransaction={handleAddTransaction}
        editingTransaction={editingTransaction}
      />
    </div>
  );
};

export default Finance;
