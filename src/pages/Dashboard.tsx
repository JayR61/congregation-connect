import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/AppContext";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { CheckSquare, Clock, CalendarRange, Users, DollarSign, FileText, ArrowUpRight, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { TeamPerformance } from '@/components/dashboard/TeamPerformance';

const Dashboard = () => {
  const { tasks, members, transactions, documents } = useAppContext();

  // Calculate task statistics
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  
  // Calculate deadline statistics
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const dueToday = tasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate).toDateString() === today.toDateString() && 
    task.status !== 'completed'
  ).length;
  
  const dueTomorrow = tasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate).toDateString() === tomorrow.toDateString() && 
    task.status !== 'completed'
  ).length;
  
  const overdueTasks = tasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate) < today && 
    task.status !== 'completed'
  ).length;

  // Calculate finance statistics
  const totalIncome = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const totalExpenses = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const currentBalance = totalIncome - totalExpenses;
  const percentChange = totalIncome > 0 ? Number(((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)) : 0;
  
  // Calculate team performance data
  const memberPerformance = members.map(member => {
    const memberTasks = tasks.filter(task => task.assigneeIds.includes(member.id));
    const completedMemberTasks = memberTasks.filter(task => task.status === 'completed').length;
    const totalMemberTasks = memberTasks.length;
    
    return {
      name: `${member.firstName} ${member.lastName}`,
      completionRate: totalMemberTasks > 0 ? Math.round((completedMemberTasks / totalMemberTasks) * 100) : 0,
      tasksAssigned: totalMemberTasks
    };
  });
  
  // Task status chart data
  const taskStatusData = [
    { name: 'Completed', value: completedTasks, color: '#10b981' },
    { name: 'In Progress', value: inProgressTasks, color: '#f59e0b' },
    { name: 'Pending', value: pendingTasks, color: '#6366f1' }
  ];

  // Finance chart data
  const financeData = [
    { name: 'Income', value: totalIncome, color: '#10b981' },
    { name: 'Expenses', value: totalExpenses, color: '#ef4444' }
  ];

  // Monthly transactions data
  const monthlyData = [
    { name: 'Jan', income: 8000, expenses: 6000 },
    { name: 'Feb', income: 6500, expenses: 5500 },
    { name: 'Mar', income: 9000, expenses: 7000 },
    { name: 'Apr', income: 8700, expenses: 6200 },
    { name: 'May', income: 7500, expenses: 5800 },
    { name: 'Jun', income: 10000, expenses: 7500 }
  ];
  
  // Task progress data
  const taskProgressByCategory = [
    { category: 'Design', completed: 12, total: 18 },
    { category: 'Development', completed: 22, total: 30 },
    { category: 'Marketing', completed: 8, total: 15 },
    { category: 'Research', completed: 5, total: 10 },
    { category: 'Admin', completed: 7, total: 12 }
  ];
  
  // Calculate completion percentage for each category
  const taskProgressData = taskProgressByCategory.map(item => ({
    subject: item.category,
    completion: Math.round((item.completed / item.total) * 100)
  }));
  
  // Weekly activity data
  const weeklyActivityData = [
    { day: 'Mon', tasks: 5, documents: 2 },
    { day: 'Tue', tasks: 7, documents: 3 },
    { day: 'Wed', tasks: 10, documents: 5 },
    { day: 'Thu', tasks: 8, documents: 4 },
    { day: 'Fri', tasks: 12, documents: 6 },
    { day: 'Sat', tasks: 3, documents: 1 },
    { day: 'Sun', tasks: 2, documents: 0 }
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Tasks" 
          value={tasks.length.toString()} 
          description="Active tasks" 
          icon={<CheckSquare className="h-5 w-5 text-muted-foreground" />}
          trend={{ value: completedTasks, label: "completed" }}
        />
        <StatCard 
          title="Members" 
          value={members.length.toString()} 
          description="Active members" 
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          trend={{ 
            value: members.filter(m => m.isActive).length, 
            label: "active" 
          }}
        />
        <StatCard 
          title="Balance" 
          value={`$${currentBalance.toLocaleString()}`} 
          description="Current balance" 
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          trend={{ 
            value: percentChange, 
            label: `${percentChange > 0 ? '+' : ''}${percentChange}%`, 
            icon: percentChange > 0 ? 
              <TrendingUp className="h-3 w-3" /> : 
              <TrendingDown className="h-3 w-3" />
          }}
        />
        <StatCard 
          title="Deadlines" 
          value={overdueTasks.toString()} 
          description="Overdue tasks" 
          icon={<Clock className="h-5 w-5 text-muted-foreground" />}
          trend={{ 
            value: dueToday + dueTomorrow, 
            label: "due soon",
            icon: <CalendarRange className="h-3 w-3" />
          }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Income and expenses over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [value, ""]} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} name="Income" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Task Status</CardTitle>
                <CardDescription>Current task distribution</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Tasks"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>Tasks and documents created</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={230}>
                  <AreaChart
                    data={weeklyActivityData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="tasks" stroke="#6366f1" fillOpacity={1} fill="url(#colorTasks)" name="Tasks" />
                    <Area type="monotone" dataKey="documents" stroke="#f59e0b" fillOpacity={1} fill="url(#colorDocs)" name="Documents" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Income vs Expenses</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={financeData} barSize={30}>
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis tickFormatter={(value) => `$${value}`} stroke="#888888" />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {financeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Deadlines and meetings</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingEvents />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Task Progress</CardTitle>
                <CardDescription>Completion rate by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={taskProgressData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Completion %" dataKey="completion" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                    <Tooltip formatter={(value) => [`${value}%`, "Completion"]} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Task Priority</CardTitle>
                <CardDescription>Tasks by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
                        { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
                        { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
                        { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
                        { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Tasks"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Due Date Overview</CardTitle>
              <CardDescription>Tasks by due date status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h3 className="font-medium text-red-600 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Overdue
                  </h3>
                  <p className="text-2xl font-bold">{overdueTasks}</p>
                  <p className="text-sm text-muted-foreground">Require immediate attention</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-medium text-orange-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Due Today
                  </h3>
                  <p className="text-2xl font-bold">{dueToday}</p>
                  <p className="text-sm text-muted-foreground">Need to be completed today</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <h3 className="font-medium text-yellow-600 flex items-center gap-2">
                    <CalendarRange className="h-4 w-4" /> Due Tomorrow
                  </h3>
                  <p className="text-2xl font-bold">{dueTomorrow}</p>
                  <p className="text-sm text-muted-foreground">Due within next 24 hours</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-medium text-green-600 flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" /> Completed
                  </h3>
                  <p className="text-2xl font-bold">{completedTasks}</p>
                  <p className="text-sm text-muted-foreground">Successfully finished</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  From {transactions.filter(t => t.type === 'income').length} transactions
                </div>
                <div className="mt-2 h-1 w-full bg-green-100 rounded-full">
                  <div className="h-1 bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  From {transactions.filter(t => t.type === 'expense').length} transactions
                </div>
                <div className="mt-2 h-1 w-full bg-red-100 rounded-full">
                  <div 
                    className="h-1 bg-red-500 rounded-full" 
                    style={{ width: `${totalExpenses / totalIncome * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  ${currentBalance.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Updated {new Date().toLocaleDateString()}
                </div>
                <div className="mt-2 h-1 w-full bg-blue-100 rounded-full">
                  <div 
                    className="h-1 bg-blue-500 rounded-full" 
                    style={{ width: `${Math.min(100, (currentBalance / totalIncome) * 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {totalIncome > 0 ? `${((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)}%` : '0%'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Of total income
                </div>
                <div className="mt-2 h-1 w-full bg-purple-100 rounded-full">
                  <div 
                    className="h-1 bg-purple-500 rounded-full" 
                    style={{ width: `${totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Where your money is going</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Rent', value: 2000, color: '#6366f1' },
                      { name: 'Utilities', value: 500, color: '#10b981' },
                      { name: 'Food', value: 800, color: '#f59e0b' },
                      { name: 'Transportation', value: 400, color: '#ef4444' },
                      { name: 'Entertainment', value: 300, color: '#8b5cf6' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: 'Rent', value: 2000, color: '#6366f1' },
                      { name: 'Utilities', value: 500, color: '#10b981' },
                      { name: 'Food', value: 800, color: '#f59e0b' },
                      { name: 'Transportation', value: 400, color: '#ef4444' },
                      { name: 'Entertainment', value: 300, color: '#8b5cf6' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Task completion rate by team member</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <TeamPerformance />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Workload Distribution</CardTitle>
                <CardDescription>Tasks assigned per team member</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={memberPerformance.slice(0, 5)}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(value) => [value, "Tasks"]} />
                    <Bar dataKey="tasksAssigned" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Active Members Overview</CardTitle>
              <CardDescription>Status and activity of team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {members.slice(0, 4).map((member) => (
                  <div key={member.id} className="p-4 border rounded-lg flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{member.firstName} {member.lastName}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.roles && Array.isArray(member.roles) ? member.roles.join(', ') : 'No roles assigned'}
                      </div>
                      <div className="mt-2 flex items-center text-xs">
                        <div className={`w-2 h-2 rounded-full ${member.isActive ? 'bg-green-500' : 'bg-gray-300'} mr-1`}></div>
                        <span>{member.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
