
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TagProps {
  name: string;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

const Tag = ({ name, selected, onSelect, onRemove, showRemove = false }: TagProps) => {
  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors",
        selected 
          ? "bg-primary text-primary-foreground" 
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
      )}
      onClick={onSelect}
    >
      {name}
      {showRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default Tag;
