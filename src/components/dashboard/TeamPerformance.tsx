
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TeamPerformance = () => {
  const { tasks, members } = useAppContext();

  // Calculate performance data for each team member
  const memberPerformance = members.map(member => {
    // Support both single assignee and multiple assignees
    const memberTasks = tasks.filter(task => {
      if (task.assigneeIds && Array.isArray(task.assigneeIds)) {
        return task.assigneeIds.includes(member.id);
      }
      return task.assigneeId === member.id;
    });
    
    const completedMemberTasks = memberTasks.filter(task => 
      task.status === 'completed' || task.status === 'done').length;
    
    const inProgressMemberTasks = memberTasks.filter(task => 
      task.status === 'in-progress' || task.status === 'in progress').length;
    
    const pendingMemberTasks = memberTasks.filter(task => 
      task.status === 'pending' || task.status === 'open').length;
    
    const totalMemberTasks = memberTasks.length;
    
    return {
      name: `${member.firstName.charAt(0)}. ${member.lastName}`,
      completed: completedMemberTasks,
      inProgress: inProgressMemberTasks,
      pending: pendingMemberTasks,
      total: totalMemberTasks,
      completionRate: totalMemberTasks > 0 ? Math.round((completedMemberTasks / totalMemberTasks) * 100) : 0
    };
  })
  .filter(member => member.total > 0)  // Only include members with at least one task
  .sort((a, b) => b.completionRate - a.completionRate)  // Sort by completion rate descending
  .slice(0, 5);  // Take top 5 members

  return (
    <div>
      {memberPerformance.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={memberPerformance}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value, name) => {
              if (name === 'completionRate') return [`${value}%`, 'Completion Rate'];
              return [value, typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name];
            }} />
            <Legend />
            <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
            <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="In Progress" />
            <Bar dataKey="pending" stackId="a" fill="#6366f1" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No team performance data available
        </div>
      )}
    </div>
  );
};

export { TeamPerformance };
