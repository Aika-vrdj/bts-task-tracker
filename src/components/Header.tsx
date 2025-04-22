
import ThemeToggle from './ThemeToggle';
import Clock from './Clock';
import { BookCheck } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="w-full py-3 px-4 bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookCheck className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          <h1 className="text-lg md:text-xl font-bold font-lora text-foreground">Beat the System - Task Tracker</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Clock />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
