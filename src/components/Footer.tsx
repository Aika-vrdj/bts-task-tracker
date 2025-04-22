
import { Link } from "lucide-react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-2 px-4 bg-background/80 backdrop-blur-sm border-t border-border z-10">
      <div className="container mx-auto flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-4">
        <div>© {new Date().getFullYear()} AIka Ioka</div>
        <div className="flex items-center gap-4">
          <a 
            href="https://aikavrdj.com/pages/beat-the-system" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-neon-cyan transition-colors"
          >
            beat the system books
            <Link className="h-3 w-3" />
          </a>
          <a 
            href="https://aikavrdj.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-neon-purple transition-colors"
          >
            more
            <Link className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
