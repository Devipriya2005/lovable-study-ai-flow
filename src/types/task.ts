
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'not-started' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedMinutes: number;
  completedMinutes: number;
}
