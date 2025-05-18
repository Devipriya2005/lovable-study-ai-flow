
import { useState } from 'react';
import { Task } from '../types/task';
import { useTaskContext } from '../context/TaskContext';
import { formatDate } from '../utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarClock, Timer } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditTaskDialog } from './EditTaskDialog';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTaskStatus, deleteTask } = useTaskContext();
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const progressPercentage = task.estimatedMinutes > 0
    ? Math.min(Math.round((task.completedMinutes / task.estimatedMinutes) * 100), 100)
    : 0;
  
  const renderPriorityBadge = () => {
    switch (task.priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-amber-500">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-slate-500">Low Priority</Badge>;
    }
  };
  
  const renderStatusBadge = () => {
    switch (task.status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">In Progress</Badge>;
      case 'not-started':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Not Started</Badge>;
    }
  };
  
  return (
    <Card className="task-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <Badge className="mb-2 bg-study-300 hover:bg-study-400 text-study-900">{task.subject}</Badge>
          {renderPriorityBadge()}
        </div>
        <CardTitle className="text-lg">{task.title}</CardTitle>
        <CardDescription className="line-clamp-2">{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <CalendarClock className="h-4 w-4" />
          <span>Due: {formatDate(task.dueDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Timer className="h-4 w-4" />
          <span>{task.completedMinutes} / {task.estimatedMinutes} minutes</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="pt-1 flex items-center justify-between">
        <div className="flex items-center">
          <Checkbox 
            id={`checkbox-${task.id}`}
            checked={task.status === 'completed'}
            onCheckedChange={(checked) => {
              if (checked) {
                updateTaskStatus(task.id, 'completed');
              } else {
                updateTaskStatus(task.id, task.completedMinutes > 0 ? 'in-progress' : 'not-started');
              }
            }}
          />
          <label 
            htmlFor={`checkbox-${task.id}`}
            className="text-sm ml-2 cursor-pointer"
          >
            Mark as complete
          </label>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
      <EditTaskDialog 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        task={task}
      />
    </Card>
  );
}
