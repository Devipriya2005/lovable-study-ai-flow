
import { Task } from '../types/task';

// Get today's date
const today = new Date();

// Get tomorrow's date
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

// Get day after tomorrow
const dayAfter = new Date();
dayAfter.setDate(today.getDate() + 2);

// Get next week
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);

export const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Read Chapter 5 of Biology Textbook',
    description: 'Focus on cell structure and function',
    subject: 'Biology',
    dueDate: tomorrow,
    priority: 'high',
    status: 'not-started',
    estimatedMinutes: 60,
    completedMinutes: 0
  },
  {
    id: '2',
    title: 'Complete Math Problem Set',
    description: 'Problems 1-20 on page 145',
    subject: 'Mathematics',
    dueDate: tomorrow,
    priority: 'medium',
    status: 'in-progress',
    estimatedMinutes: 90,
    completedMinutes: 30
  },
  {
    id: '3',
    title: 'Research for History Essay',
    description: 'Find sources on the Industrial Revolution',
    subject: 'History',
    dueDate: dayAfter,
    priority: 'medium',
    status: 'not-started',
    estimatedMinutes: 120,
    completedMinutes: 0
  },
  {
    id: '4',
    title: 'Review Spanish Vocabulary',
    description: 'Chapter 7 vocabulary list',
    subject: 'Spanish',
    dueDate: today,
    priority: 'low',
    status: 'completed',
    estimatedMinutes: 45,
    completedMinutes: 45
  },
  {
    id: '5',
    title: 'Physics Lab Report',
    description: 'Write up results from the pendulum experiment',
    subject: 'Physics',
    dueDate: nextWeek,
    priority: 'high',
    status: 'not-started',
    estimatedMinutes: 180,
    completedMinutes: 0
  }
];
