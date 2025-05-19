
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AddTaskDialog } from './AddTaskDialog';
import { ModeToggle } from './ModeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-950 border-b sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl text-study-600">StudyPlanner</Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <AddTaskDialog />
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    <User size={16} />
                    <span className="hidden sm:inline">{user.email}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => signOut()}
                    title="Sign out"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline ml-2">Sign out</span>
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
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
