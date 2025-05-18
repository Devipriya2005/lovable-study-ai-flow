
import { useState } from 'react';
import { TaskCard } from './TaskCard';
import { useTaskContext } from '../context/TaskContext';
import { Task, TaskStatus } from '../types/task';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar, ListTodo, Calendar as CalendarIcon } from 'lucide-react';

export function TaskList() {
  const { tasks } = useTaskContext();
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'subject'>('dueDate');
  
  const filteredTasks = tasks.filter(task => {
    // Apply status filter
    if (filter !== 'all' && task.status !== filter) return false;
    
    // Apply search term filter
    const searchLower = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.subject.toLowerCase().includes(searchLower)
    );
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    if (sortBy === 'priority') {
      const priorityValue = { high: 3, medium: 2, low: 1 };
      return priorityValue[b.priority] - priorityValue[a.priority];
    }
    if (sortBy === 'subject') {
      return a.subject.localeCompare(b.subject);
    }
    return 0;
  });
  
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status).length;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        
        <div className="flex flex-wrap gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="subject">Subject</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all" onClick={() => setFilter('all')}>
            All ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="not-started" onClick={() => setFilter('not-started')}>
            To Do ({getTasksByStatus('not-started')})
          </TabsTrigger>
          <TabsTrigger value="in-progress" onClick={() => setFilter('in-progress')}>
            In Progress ({getTasksByStatus('in-progress')})
          </TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setFilter('completed')}>
            Completed ({getTasksByStatus('completed')})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {sortedTasks.length === 0 && (
              <div className="col-span-full text-center py-12">
                <ListTodo className="mx-auto h-12 w-12 text-muted-foreground/80" />
                <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
                <p className="text-muted-foreground mt-2">
                  {searchTerm ? 'Try adjusting your search or filters' : 'Add a task to get started!'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="not-started" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTasks.filter(task => task.status === 'not-started').map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {sortedTasks.filter(task => task.status === 'not-started').length === 0 && (
              <div className="col-span-full text-center py-12">
                <ListTodo className="mx-auto h-12 w-12 text-muted-foreground/80" />
                <h3 className="mt-4 text-lg font-medium">No tasks to do</h3>
                <p className="text-muted-foreground mt-2">
                  All caught up! Add more tasks or check other tabs.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTasks.filter(task => task.status === 'in-progress').map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {sortedTasks.filter(task => task.status === 'in-progress').length === 0 && (
              <div className="col-span-full text-center py-12">
                <ListTodo className="mx-auto h-12 w-12 text-muted-foreground/80" />
                <h3 className="mt-4 text-lg font-medium">No tasks in progress</h3>
                <p className="text-muted-foreground mt-2">
                  Start working on some tasks!
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTasks.filter(task => task.status === 'completed').map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {sortedTasks.filter(task => task.status === 'completed').length === 0 && (
              <div className="col-span-full text-center py-12">
                <ListTodo className="mx-auto h-12 w-12 text-muted-foreground/80" />
                <h3 className="mt-4 text-lg font-medium">No completed tasks</h3>
                <p className="text-muted-foreground mt-2">
                  Complete some tasks to see them here.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
