
import { ReactNode } from 'react';
import { AddTaskDialog } from './AddTaskDialog';
import { ModeToggle } from './ModeToggle';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-950 border-b sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center">
            <span className="font-bold text-xl text-study-600">StudyPlanner</span>
          </div>
          <div className="flex items-center gap-4">
            <AddTaskDialog />
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 md:px-6 py-8">
        {children}
      </main>

      <footer className="border-t py-6 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} StudyPlanner. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
