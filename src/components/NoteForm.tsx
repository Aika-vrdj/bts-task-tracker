
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriorityType } from "@/types";
import TagInput from "./TagInput";

interface NoteFormProps {
  onAddNote: (note: {
    title: string;
    content: string;
    priority: PriorityType;
    tags: string[];
  }) => void;
}

const NoteForm = ({ onAddNote }: NoteFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<PriorityType>("medium");
  const [tags, setTags] = useState<string[]>([]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    onAddNote({
      title: title.trim(),
      content: content.trim(),
      priority,
      tags,
    });
    
    // Reset form
    setTitle("");
    setContent("");
    setPriority("medium");
    setTags([]);
  };
  
  const handleAddTag = (tag: string) => {
    setTags([...tags, tag]);
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <form onSubmit={handleSubmit} className="paper p-4 mb-6 animate-fade-in">
      <h2 className="text-xl font-lora font-semibold mb-4">Add New Note</h2>
      
      <div className="space-y-4">
        <div>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="font-medium"
          />
        </div>
        
        <div>
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>
        
        <div>
          <Select 
            value={priority} 
            onValueChange={(value: PriorityType) => setPriority(value)}
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
        </div>
        
        <div>
          <TagInput 
            tags={tags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
        </div>
        
        <Button type="submit" className="w-full">
          Add Note
        </Button>
      </div>
    </form>
  );
};

export default NoteForm;
