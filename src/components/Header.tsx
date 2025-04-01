
import ThemeToggle from './ThemeToggle';
import Clock from './Clock';
import { BookCheck } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="w-full py-4 md:py-6 px-4 bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          <BookCheck className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="text-xl md:text-3xl font-bold font-lora text-foreground">Retro Notes</h1>
        </div>
        
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <Clock />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
