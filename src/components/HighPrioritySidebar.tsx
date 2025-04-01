
import { Note } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock } from "lucide-react";
import Tag from "./Tag";
import { useIsMobile } from "@/hooks/use-mobile";

interface HighPrioritySidebarProps {
  notes: Note[];
  onToggleComplete: (id: string) => void;
}

const HighPrioritySidebar = ({ notes, onToggleComplete }: HighPrioritySidebarProps) => {
  const isMobile = useIsMobile();
  
  // Filter only high priority notes across all projects
  const highPriorityNotes = notes
    .filter(note => note.priority === "high")
    .sort((a, b) => {
      // First by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const baseClasses = isMobile
    ? "w-full bg-background/90 backdrop-blur-sm overflow-y-auto"
    : "w-64 h-[calc(100vh-4rem)] border-l border-border bg-background/90 backdrop-blur-sm overflow-y-auto";

  return (
    <aside className={baseClasses}>
      <div className="p-4">
        <h2 className="text-lg font-lora mb-4 flex items-center gap-2">
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
            High Priority
          </Badge>
          <span className="text-foreground">Notes</span>
        </h2>
        
        {highPriorityNotes.length === 0 ? (
          <div className="text-sm text-muted-foreground italic">
            No high priority notes
          </div>
        ) : (
          <div className="space-y-3">
            {highPriorityNotes.map(note => (
              <div 
                key={note.id}
                className={`paper p-3 animate-fade text-sm ${
                  note.completed ? "opacity-70" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  <Checkbox 
                    checked={note.completed} 
                    onCheckedChange={() => onToggleComplete(note.id)} 
                    className="mt-0.5"
                  />
                  
                  <div>
                    <h3 className={`font-medium font-lora ${
                      note.completed ? "line-through" : ""
                    }`}>
                      {note.title}
                    </h3>
                    
                    <p className={`text-xs text-muted-foreground mt-1 mb-2 ${
                      note.completed ? "line-through" : ""
                    }`}>
                      {note.content.length > 40 
                        ? `${note.content.substring(0, 40)}...` 
                        : note.content
                      }
                    </p>
                    
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {note.tags.slice(0, 3).map(tag => (
                          <Tag key={tag} name={tag} />
                        ))}
                        {note.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{note.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock size={12} className="mr-1" />
                      <span className="truncate">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default HighPrioritySidebar;
