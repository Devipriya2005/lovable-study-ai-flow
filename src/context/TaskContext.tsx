
import { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/sonner';

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  isLoading: boolean;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch tasks from Supabase when user changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        setTasks([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        // Transform the data to match Task type
        const transformedTasks = data.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          subject: task.subject,
          dueDate: task.due_date ? new Date(task.due_date) : null,
          status: task.status as TaskStatus,
          priority: task.priority as TaskPriority,
          estimatedMinutes: task.estimated_minutes,
          completedMinutes: task.completed_minutes,
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at)
        }));

        setTasks(transformedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Transform task data to match Supabase schema
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: task.title,
          description: task.description,
          subject: task.subject,
          due_date: task.dueDate ? task.dueDate.toISOString() : null,
          status: task.status,
          priority: task.priority,
          estimated_minutes: task.estimatedMinutes,
          completed_minutes: task.completedMinutes
        })
        .select();

      if (error) {
        throw error;
      }

      // Transform the returned data to match Task type
      if (data && data[0]) {
        const newTask: Task = {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description,
          subject: data[0].subject,
          dueDate: data[0].due_date ? new Date(data[0].due_date) : null,
          status: data[0].status as TaskStatus,
          priority: data[0].priority as TaskPriority,
          estimatedMinutes: data[0].estimated_minutes,
          completedMinutes: data[0].completed_minutes,
          createdAt: new Date(data[0].created_at),
          updatedAt: new Date(data[0].updated_at)
        };
        
        setTasks(prevTasks => [...prevTasks, newTask]);
        toast.success('Task added successfully');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, taskUpdate: Partial<Task>) => {
    try {
      setIsLoading(true);
      
      // Transform task data to match Supabase schema
      const updateData: any = {};
      
      if (taskUpdate.title !== undefined) updateData.title = taskUpdate.title;
      if (taskUpdate.description !== undefined) updateData.description = taskUpdate.description;
      if (taskUpdate.subject !== undefined) updateData.subject = taskUpdate.subject;
      if (taskUpdate.dueDate !== undefined) updateData.due_date = taskUpdate.dueDate ? taskUpdate.dueDate.toISOString() : null;
      if (taskUpdate.status !== undefined) updateData.status = taskUpdate.status;
      if (taskUpdate.priority !== undefined) updateData.priority = taskUpdate.priority;
      if (taskUpdate.estimatedMinutes !== undefined) updateData.estimated_minutes = taskUpdate.estimatedMinutes;
      if (taskUpdate.completedMinutes !== undefined) updateData.completed_minutes = taskUpdate.completedMinutes;
      
      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, ...taskUpdate } : task
        )
      );
      
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        isLoading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
