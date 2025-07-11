import { Task, TaskComment, User, Member, Notification } from '@/types';
import { toast } from '@/lib/toast';

interface UseTaskActionsProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  currentUser: User;
  members: Member[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

export const useTaskActions = ({
  tasks,
  setTasks,
  currentUser,
  members,
  addNotification
}: UseTaskActionsProps) => {
  
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdById: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      lastModifiedById: currentUser.id,
      lastModifiedAction: 'created'
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    const creatorName = `${currentUser.firstName} ${currentUser.lastName}`;
    addNotification({
      title: "New Task Created",
      message: `${creatorName} created a new task: "${task.title}"`,
      type: "info",
      userId: currentUser.id
    });
    
    toast.success("Task created successfully");
    return newTask;
  };

  const updateTask = (id: string, task: Partial<Task>) => {
    let updated = false;
    const oldTask = tasks.find(t => t.id === id);
    
    if (!oldTask) return false;
    
    setTasks(prevTasks => 
      prevTasks.map(t => {
        if (t.id === id) {
          updated = true;
          return { 
              ...t, 
              ...task, 
              updatedAt: new Date(),
              lastModifiedById: currentUser.id,
              lastModifiedAction: task.status === 'completed' ? 'completed' : 'updated'
            };
        }
        return t;
      })
    );
    
    if (updated) {
      const editorName = `${currentUser.firstName} ${currentUser.lastName}`;
      
      let message = `${editorName} updated the task: "${oldTask.title}"`;
      if (task.status === 'completed' && oldTask.status !== 'completed') {
        message = `${editorName} marked the task "${oldTask.title}" as completed`;
      } else if (task.status && task.status !== oldTask.status) {
        message = `${editorName} changed the status of "${oldTask.title}" to ${task.status}`;
      }
      
      addNotification({
        title: "Task Updated",
        message,
        type: "info",
        userId: currentUser.id
      });
      
      toast.success("Task updated successfully");
    }
    
    return updated;
  };

  const deleteTask = (id: string) => {
    let deleted = false;
    const taskToDelete = tasks.find(t => t.id === id);
    
    if (!taskToDelete) return false;
    
    setTasks(prevTasks => {
      const filtered = prevTasks.filter(t => {
        if (t.id === id) {
          deleted = true;
          return false;
        }
        return true;
      });
      return filtered;
    });
    
    if (deleted) {
      const deleterName = `${currentUser.firstName} ${currentUser.lastName}`;
      
      addNotification({
        title: "Task Deleted",
        message: `${deleterName} deleted the task: "${taskToDelete.title}"`,
        type: "warning",
        userId: currentUser.id
      });
      
      toast.success("Task deleted successfully");
    }
    
    return deleted;
  };

  const addTaskComment = (
    taskId: string,
    comment: Omit<TaskComment, "id" | "createdAt" | "taskId">
  ) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newComment: TaskComment = {
            id: `comment-${Date.now()}`,
            taskId,
            content: comment.content,
            createdBy: comment.userId || currentUser.id,
            createdAt: new Date(),
          };

          return {
            ...task,
            comments: [...(task.comments || []), newComment],
          };
        }
        return task;
      })
    );

    // Notify assignee if there is one and it's not the current user
    const task = tasks.find((t) => t.id === taskId);
    if (task?.assigneeId && task.assigneeId !== currentUser.id) {
      addNotification({
        userId: task.assigneeId,
        title: "New comment on your task",
        message: `${currentUser.firstName} commented on task: ${task.title}`,
        type: "info",
        link: `/tasks/${taskId}`
      });
    }
    
    return true;
  };

  return {
    addTask,
    updateTask,
    deleteTask,
    addTaskComment
  };
};
