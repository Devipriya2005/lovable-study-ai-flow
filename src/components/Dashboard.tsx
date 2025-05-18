
import { useTaskContext } from '../context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, ListTodo, CalendarClock } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

export function Dashboard() {
  const { tasks } = useTaskContext();
  
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const notStartedTasks = tasks.filter(task => task.status === 'not-started').length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalEstimatedMinutes = tasks.reduce((acc, task) => acc + task.estimatedMinutes, 0);
  const totalCompletedMinutes = tasks.reduce((acc, task) => acc + task.completedMinutes, 0);
  const timeProgress = totalEstimatedMinutes > 0 
    ? Math.round((totalCompletedMinutes / totalEstimatedMinutes) * 100)
    : 0;
  
  // Find nearest upcoming task
  const now = new Date();
  const upcomingTasks = tasks
    .filter(task => task.status !== 'completed' && task.dueDate >= now)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
  const upcomingTask = upcomingTasks.length > 0 ? upcomingTasks[0] : null;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ListTodo className="h-5 w-5 text-study-600 mr-2" />
              <span className="text-2xl font-bold">{totalTasks}</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-xs text-muted-foreground">Task Distribution</div>
              <div className="grid grid-cols-3 gap-1 mt-1">
                <div className="h-2 bg-green-300 rounded-full" style={{ width: `${completedTasks / (totalTasks || 1) * 100}%` }}></div>
                <div className="h-2 bg-blue-300 rounded-full" style={{ width: `${inProgressTasks / (totalTasks || 1) * 100}%` }}></div>
                <div className="h-2 bg-gray-300 rounded-full" style={{ width: `${notStartedTasks / (totalTasks || 1) * 100}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{completionRate}%</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-xs text-muted-foreground">Task Progress</div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-study-600 mr-2" />
              <span className="text-2xl font-bold">{Math.floor(totalCompletedMinutes / 60)}h {totalCompletedMinutes % 60}m</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{timeProgress}%</span>
              </div>
              <Progress value={timeProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Due Task</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTask ? (
              <div className="space-y-2">
                <div className="flex items-start">
                  <CalendarClock className="h-5 w-5 text-study-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium line-clamp-1">{upcomingTask.title}</h4>
                    <p className="text-xs text-muted-foreground">{upcomingTask.subject}</p>
                  </div>
                </div>
                <div className="text-xs px-7">
                  Due: <span className="font-medium">{formatDate(upcomingTask.dueDate)}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center h-[52px]">
                <CalendarClock className="h-5 w-5 text-muted-foreground/70 mr-2" />
                <span className="text-sm text-muted-foreground">No upcoming tasks</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
