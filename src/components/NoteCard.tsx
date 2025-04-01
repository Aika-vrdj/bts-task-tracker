
import { Note } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Tag from "./Tag";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoteCardProps {
  note: Note;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const NoteCard = ({ note, onToggleComplete, onDelete }: NoteCardProps) => {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
  };
  
  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className={`paper p-4 animate-fade ${note.completed ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={note.completed} 
          onCheckedChange={() => onToggleComplete(note.id)} 
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h3 className={`font-medium text-lg font-lora ${note.completed ? 'line-through' : ''}`}>
              {note.title}
            </h3>
            
            <Badge className={`${priorityColors[note.priority]} capitalize`}>
              {note.priority}
            </Badge>
          </div>
          
          <p className={`text-muted-foreground mb-3 ${note.completed ? 'line-through' : ''}`}>
            {note.content}
          </p>
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {note.tags.map(tag => (
                <Tag key={tag} name={tag} />
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formattedDate}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(note.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
