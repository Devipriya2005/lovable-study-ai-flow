
import { createContext, useState, useContext, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from './AuthContext';

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  isLoading: boolean;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedTasks: Task[] = data.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          subject: task.subject,
          status: task.status as TaskStatus,
          priority: task.priority as TaskPriority,
          dueDate: task.due_date ? new Date(task.due_date) : undefined,
          estimatedMinutes: task.estimated_minutes,
          completedMinutes: task.completed_minutes,
        }));
        setTasks(formattedTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      // Fix: Convert task to the format expected by Supabase
      const taskData = {
        title: task.title,
        description: task.description,
        subject: task.subject,
        status: task.status,
        priority: task.priority,
        due_date: task.dueDate,
        estimated_minutes: task.estimatedMinutes,
        completed_minutes: task.completedMinutes,
        user_id: user?.id
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData) // Fixed: Pass a single object, not an array
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const newTask: Task = {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description || '',
          subject: data[0].subject,
          status: data[0].status as TaskStatus,
          priority: data[0].priority as TaskPriority,
          dueDate: data[0].due_date ? new Date(data[0].due_date) : undefined,
          estimatedMinutes: data[0].estimated_minutes,
          completedMinutes: data[0].completed_minutes,
        };
        setTasks((prevTasks) => [newTask, ...prevTasks]);
        toast.success('Task added successfully');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      throw error;
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      const updateData: Record<string, any> = {};
      
      if (updatedTask.title !== undefined) updateData.title = updatedTask.title;
      if (updatedTask.description !== undefined) updateData.description = updatedTask.description;
      if (updatedTask.subject !== undefined) updateData.subject = updatedTask.subject;
      if (updatedTask.status !== undefined) updateData.status = updatedTask.status;
      if (updatedTask.priority !== undefined) updateData.priority = updatedTask.priority;
      if (updatedTask.dueDate !== undefined) updateData.due_date = updatedTask.dueDate;
      if (updatedTask.estimatedMinutes !== undefined) updateData.estimated_minutes = updatedTask.estimatedMinutes;
      if (updatedTask.completedMinutes !== undefined) updateData.completed_minutes = updatedTask.completedMinutes;
      
      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTasks((prevTasks) => 
        prevTasks.map((task) => 
          task.id === id ? { ...task, ...updatedTask } : task
        )
      );
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    await updateTask(id, { status });
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      throw error;
    }
  };

  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      updateTaskStatus,
      getTaskById,
      isLoading
    }}>
      {children}
    </TaskContext.Provider>
  );
};
