
import { format, isToday, isTomorrow, addDays, isBefore, isAfter } from 'date-fns';

export function formatDate(date: Date): string {
  if (isToday(date)) {
    return 'Today';
  }
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  return format(date, 'MMM d, yyyy');
}

export function formatTime(date: Date): string {
  return format(date, 'h:mm a');
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function getPriorityLevel(dueDate: Date): 'low' | 'medium' | 'high' {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);

  if (isBefore(dueDate, tomorrow)) {
    return 'high';
  } else if (isBefore(dueDate, nextWeek)) {
    return 'medium';
  } else {
    return 'low';
  }
}

export function isOverdue(dueDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isBefore(dueDate, today);
}
