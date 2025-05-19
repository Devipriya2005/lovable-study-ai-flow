
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateTaskProgress: (id: string, completedMinutes: number) => void;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        const formattedTasks: Task[] = data.map(task => ({
          ...task,
          id: task.id,
          dueDate: task.due_date ? new Date(task.due_date) : new Date(),
          priority: task.priority as TaskPriority,
          status: task.status as TaskStatus,
        }));
        setTasks(formattedTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            user_id: user?.id,
            title: task.title,
            description: task.description,
            subject: task.subject,
            due_date: task.dueDate,
            status: task.status,
            priority: task.priority,
            estimated_minutes: task.estimatedMinutes,
            completed_minutes: task.completedMinutes,
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newTask: Task = {
          id: data.id,
          title: data.title,
          description: data.description,
          subject: data.subject,
          dueDate: new Date(data.due_date),
          status: data.status as TaskStatus,
          priority: data.priority as TaskPriority,
          estimatedMinutes: data.estimated_minutes,
          completedMinutes: data.completed_minutes,
        };
        setTasks([newTask, ...tasks]);
        toast.success('Task added successfully!');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: updatedTask.title,
          description: updatedTask.description,
          subject: updatedTask.subject,
          due_date: updatedTask.dueDate,
          status: updatedTask.status,
          priority: updatedTask.priority,
          estimated_minutes: updatedTask.estimatedMinutes,
          completed_minutes: updatedTask.completedMinutes,
        })
        .eq('id', updatedTask.id);

      if (error) {
        throw error;
      }

      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
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

      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;
      
      let completedMinutes = taskToUpdate.completedMinutes;
      if (status === 'completed') {
        completedMinutes = taskToUpdate.estimatedMinutes;
      }

      const { error } = await supabase
        .from('tasks')
        .update({
          status,
          completed_minutes: completedMinutes,
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTasks(tasks.map(task => {
        if (task.id === id) {
          return { ...task, status, completedMinutes };
        }
        return task;
      }));
      toast.success('Task status updated!');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const updateTaskProgress = async (id: string, completedMinutes: number) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;
      
      let status = taskToUpdate.status;
      if (completedMinutes >= taskToUpdate.estimatedMinutes) {
        status = 'completed';
      } else if (completedMinutes > 0) {
        status = 'in-progress';
      }

      const { error } = await supabase
        .from('tasks')
        .update({
          status,
          completed_minutes: completedMinutes,
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTasks(tasks.map(task => {
        if (task.id === id) {
          return { ...task, status, completedMinutes };
        }
        return task;
      }));
      toast.success('Progress updated!');
    } catch (error) {
      console.error('Error updating task progress:', error);
      toast.error('Failed to update progress');
    }
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask, 
      updateTaskStatus, 
      updateTaskProgress,
      isLoading
    }}>
      {children}
    </TaskContext.Provider>
  );
};
