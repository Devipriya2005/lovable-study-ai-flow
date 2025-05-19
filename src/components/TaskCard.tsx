import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Task } from "@/types/task";
import { priorityMap, statusMap } from "@/lib/utils";
import { useTasks } from "@/context/TaskContext";
import { EditTaskDialog } from "./EditTaskDialog";
import { toast } from "@/components/ui/sonner";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { deleteTask, updateTaskStatus } = useTasks();

  const handleDeleteTask = async () => {
    try {
      await deleteTask(task.id);
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const handleCheckboxChange = async (checked: boolean) => {
    try {
      await updateTaskStatus(task.id, checked ? "completed" : "todo");
      toast.success(`Task ${checked ? "completed" : "marked as To Do"}!`);
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update task status.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4 cursor-pointer opacity-50 hover:opacity-100" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" forceMount>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <EditTaskDialog taskId={task.id}>
                <div className="flex items-center space-x-2">
                  <Pencil className="h-4 w-4" />
                  <span>Edit</span>
                </div>
              </EditTaskDialog>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteTask}>
              <div className="flex items-center space-x-2 text-destructive">
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground line-clamp-2">
          {task.description}
        </CardDescription>
        <div className="flex items-center justify-between mt-4">
          <Badge variant="secondary">{task.subject}</Badge>
          <Badge variant="outline">{priorityMap[task.priority]}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Due: {task.dueDate?.toLocaleDateString() || "No due date"}
        </p>
        <Checkbox
          id={`task-${task.id}`}
          defaultChecked={task.status === "completed"}
          onCheckedChange={handleCheckboxChange}
        />
      </CardFooter>
    </Card>
  );
}
