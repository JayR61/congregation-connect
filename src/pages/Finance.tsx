import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Download, Search, Filter, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Transaction } from '@/types';

const Finance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all-time');
  
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions
  });

  const summary = transactions.reduce((acc, transaction) => {
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

  const expenseCategories = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const existingCategory = acc.find(c => c.name === transaction.categoryId);
      if (existingCategory) {
        existingCategory.value += transaction.amount;
      } else {
        acc.push({ name: transaction.categoryId, value: transaction.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  const monthlyData = transactions
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

  const renderTransactionList = () => {
    if (isLoading) {
      return Array(3).fill(0).map((_, index) => (
        <div key={`loading-${index}`} className="grid grid-cols-5 px-4 py-5 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
        </div>
      ));
    }

    if (transactions.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      );
    }

    return transactions.map((transaction) => (
      <div key={transaction.id} className="grid grid-cols-5 px-4 py-3 hover:bg-muted/50">
        <div>{new Date(transaction.date).toLocaleDateString()}</div>
        <div>{transaction.categoryId}</div>
        <div className="truncate">{transaction.description}</div>
        <div className={transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'}>
          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </div>
        <div className={`text-right ${transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
          {formatCurrency(transaction.amount)}
        </div>
      </div>
    ));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Finance</h1>
          <p className="text-muted-foreground">Manage church finances and transactions</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
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
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
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
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
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
            <div className="grid grid-cols-5 border-b px-4 py-3 font-medium">
              <div>Date</div>
              <div>Category</div>
              <div>Description</div>
              <div>Type</div>
              <div className="text-right">Amount</div>
            </div>
            <div className="divide-y">
              {renderTransactionList()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Finance;
