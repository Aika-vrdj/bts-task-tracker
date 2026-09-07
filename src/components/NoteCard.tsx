import { useState } from "react";
import { Note, PriorityType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Tag from "./Tag";
import TagInput from "./TagInput";
import { Trash2, Pencil, GripVertical, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface NoteCardProps {
  note: Note;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEditNote: (id: string, updates: {
    title: string;
    content: string;
    priority: PriorityType;
    tags: string[];
  }) => void;
  dragDisabled?: boolean;
}

const NoteCard = ({ note, onToggleComplete, onDelete, onEditNote, dragDisabled = false }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [editPriority, setEditPriority] = useState<PriorityType>(note.priority);
  const [editTags, setEditTags] = useState<string[]>(note.tags);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id, disabled: dragDisabled || isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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

  const startEditing = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditPriority(note.priority);
    setEditTags(note.tags);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveEditing = () => {
    if (!editTitle.trim()) return;
    onEditNote(note.id, {
      title: editTitle.trim(),
      content: editContent.trim(),
      priority: editPriority,
      tags: editTags,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="paper p-4 animate-fade ring-2 ring-primary/40">
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
            className="font-medium"
            autoFocus
          />

          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Content"
            className="resize-none"
            rows={3}
          />

          <Select
            value={editPriority}
            onValueChange={(value: PriorityType) => setEditPriority(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
            </SelectContent>
          </Select>

          <TagInput
            tags={editTags}
            onAddTag={(tag) => setEditTags([...editTags, tag])}
            onRemoveTag={(tag) => setEditTags(editTags.filter(t => t !== tag))}
          />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={cancelEditing}>
              <X size={16} className="mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={saveEditing} disabled={!editTitle.trim()}>
              <Check size={16} className="mr-1" /> Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div ref={setNodeRef} style={style} className={`paper p-4 animate-fade ${note.completed ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-3">
        {!dragDisabled && (
          <button
            type="button"
            className="mt-1.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
            aria-label="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={18} />
          </button>
        )}

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
                onClick={startEditing}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                title="Edit note"
              >
                <Pencil size={16} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(note.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                title="Delete note"
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
