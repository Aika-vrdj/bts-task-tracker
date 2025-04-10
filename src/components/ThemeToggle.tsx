
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ThemeToggle = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Default to dark mode for the cyberpunk theme
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      const storedTheme = localStorage.getItem('theme');
      return storedTheme === 'light' ? 'light' : 'dark';
    }
    return 'dark';
  });
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    toast({
      title: newTheme === 'dark' ? "Terminal mode activated" : "Standard mode activated",
      description: newTheme === 'dark' 
        ? "Welcome to the cyberpunk interface, hacker" 
        : "Reverting to standard visual parameters",
      duration: 2000,
    });
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 transition-all hover:bg-secondary dark:cyber-border dark:hover:cyber-glow"
      title={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === 'light' ? (
        <Terminal className="text-primary" size={20} />
      ) : (
        <Sun className="text-neon-cyan" size={20} />
      )}
    </Button>
  );
};

export default ThemeToggle;
