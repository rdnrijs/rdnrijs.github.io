
import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Ribbon from './navigation/Ribbon';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const Layout = ({
  children,
  className,
  fullWidth = false
}: LayoutProps) => {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => () => {
    // Force a clean navigation to the homepage
    if (path === '/') {
      // Prevent default behavior and use a direct URL change for the homepage
      window.location.href = '/';
      return;
    }
    navigate(path);
  };
  
  return <div className="min-h-screen flex flex-col">
      <header className="py-4 pl-20 pr-6 border-b border-border/50 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className={cn("mx-auto flex items-center justify-between", fullWidth ? "container px-0" : "max-w-6xl")}>
          <div onClick={handleNavigation('/')} className="font-medium text-2xl transition-opacity hover:opacity-80 flex items-center gap-3 cursor-pointer">
            <img src="/lovable-uploads/e3f13bd0-379f-4e01-8701-a83d72fc8f9d.png" alt="Methis Logo" className="w-8 h-8" />
            Methis BA tool
          </div>
          <nav className="flex items-center space-x-6">
            
          </nav>
        </div>
      </header>
      
      <main className={cn("flex-1 pl-20", className)}>
        <div className={fullWidth ? "container px-0" : "max-w-6xl mx-auto"}>
          {children}
        </div>
      </main>
      
      <footer className="py-6 pl-20 pr-6 border-t border-border/50">
        <div className={cn("mx-auto flex flex-col md:flex-row md:items-center justify-between text-sm text-muted-foreground", fullWidth ? "container px-0" : "max-w-6xl")}>
          <p>© {new Date().getFullYear()} Requlator. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
      
      <Ribbon />
    </div>;
};

export default Layout;
