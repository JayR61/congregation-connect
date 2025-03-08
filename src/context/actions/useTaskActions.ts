
import { Task, TaskComment, User, Member } from '@/types';
import { toast } from '@/lib/toast';

interface UseTaskActionsProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  currentUser: User;
  members: Member[];
  addNotification: (notification: Omit<import('@/types').Notification, 'id' | 'createdAt' | 'read'>) => void;
}

export const useTaskActions = ({
  tasks,
  setTasks,
  currentUser,
  members,
  addNotification
}: UseTaskActionsProps) => {
  
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdById' | 'comments'>) => {
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
      targetUrl: `/tasks/${newTask.id}`
    });
    
    toast.success("Task created successfully");
  };

  const updateTask = (id: string, task: Partial<Task>, editorId?: string) => {
    const editor = editorId || currentUser.id;
    const oldTask = tasks.find(t => t.id === id);
    
    if (!oldTask) return;
    
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === id 
          ? { 
              ...t, 
              ...task, 
              updatedAt: new Date(),
              lastModifiedById: editor,
              lastModifiedAction: task.status === 'completed' ? 'completed' : 'updated'
            } 
          : t
      )
    );
    
    const editorMember = members.find(m => m.id === editor);
    const editorName = editorMember 
      ? `${editorMember.firstName} ${editorMember.lastName}`
      : 'Someone';
    
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
      targetUrl: `/tasks/${id}`
    });
    
    toast.success("Task updated successfully");
  };

  const deleteTask = (id: string, deleterId?: string) => {
    const deleter = deleterId || currentUser.id;
    const taskToDelete = tasks.find(t => t.id === id);
    
    if (!taskToDelete) return;
    
    setTasks(prevTasks => prevTasks.filter(t => t.id !== id));
    
    const deleterMember = members.find(m => m.id === deleter);
    const deleterName = deleterMember 
      ? `${deleterMember.firstName} ${deleterMember.lastName}`
      : 'Someone';
    
    addNotification({
      title: "Task Deleted",
      message: `${deleterName} deleted the task: "${taskToDelete.title}"`,
      type: "warning",
      targetUrl: `/tasks`
    });
    
    toast.success("Task deleted successfully");
  };

  const addTaskComment = (taskId: string, content: string) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    
    if (!taskToUpdate) {
      toast.error("Task not found");
      return;
    }
    
    const newComment: TaskComment = {
      id: `comment-${Date.now()}`,
      content,
      authorId: currentUser.id,
      createdAt: new Date()
    };
    
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === taskId 
          ? { 
              ...t, 
              comments: [...t.comments, newComment],
              updatedAt: new Date()
            } 
          : t
      )
    );
    
    const commenterName = `${currentUser.firstName} ${currentUser.lastName}`;
    
    addNotification({
      title: "New Comment",
      message: `${commenterName} commented on task "${taskToUpdate.title}"`,
      type: "info",
      targetUrl: `/tasks/${taskId}`
    });
    
    toast.success("Comment added successfully");
  };

  return {
    addTask,
    updateTask,
    deleteTask,
    addTaskComment
  };
};
