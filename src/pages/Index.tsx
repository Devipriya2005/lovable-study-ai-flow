
import { TaskProvider } from '../context/TaskContext';
import { Layout } from '../components/Layout';
import { TaskList } from '../components/TaskList';
import { Dashboard } from '../components/Dashboard';
import { StudyTips } from '../components/StudyTips';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  return (
    <Layout>
      <TaskProvider>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Study Planner</h1>
          <p className="text-muted-foreground">Organize your study schedule and track your progress</p>
        </div>
        
        <Tabs defaultValue="dashboard" className="mb-8">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-6 mt-6">
            <Dashboard />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
                <TaskList />
              </div>
              <div>
                <StudyTips />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="tasks" className="space-y-6 mt-6">
            <TaskList />
          </TabsContent>
        </Tabs>
      </TaskProvider>
    </Layout>
  );
};

export default Index;
