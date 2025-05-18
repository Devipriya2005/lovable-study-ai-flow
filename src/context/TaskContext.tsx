
import React, { createContext, useContext, useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { defaultTasks } from '../data/defaultTasks';
import { toast } from '@/components/ui/sonner';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateTaskProgress: (id: string, completedMinutes: number) => void;
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
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
    toast.success('Task added successfully!');
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    toast.success('Task updated successfully!');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully!');
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, status };
        if (status === 'completed') {
          updatedTask.completedMinutes = updatedTask.estimatedMinutes;
        }
        return updatedTask;
      }
      return task;
    }));
    toast.success('Task status updated!');
  };

  const updateTaskProgress = (id: string, completedMinutes: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, completedMinutes };
        if (completedMinutes >= task.estimatedMinutes) {
          updatedTask.status = 'completed';
        } else if (completedMinutes > 0) {
          updatedTask.status = 'in-progress';
        }
        return updatedTask;
      }
      return task;
    }));
    toast.success('Progress updated!');
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, updateTaskStatus, updateTaskProgress }}>
      {children}
    </TaskContext.Provider>
  );
};
