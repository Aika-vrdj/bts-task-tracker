
import ThemeToggle from './ThemeToggle';
import Clock from './Clock';
import { BookCheck } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-6 px-4 bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookCheck className="h-8 w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold font-lora text-foreground">Retro Notes</h1>
        </div>
        <Clock />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
