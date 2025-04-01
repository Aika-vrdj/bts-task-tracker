
import { Tag as TagType } from "@/types";
import Tag from "./Tag";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onSelectTag: (tag: string) => void;
  onClearFilters: () => void;
}

const TagFilter = ({ 
  availableTags, 
  selectedTags, 
  onSelectTag, 
  onClearFilters 
}: TagFilterProps) => {
  if (availableTags.length === 0) return null;

  return (
    <div className="paper p-4 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-lora font-medium">Filter by tags</h2>
        {selectedTags.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="h-8 text-xs flex items-center gap-1 text-muted-foreground"
          >
            <X size={14} /> Clear filters
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => (
          <Tag 
            key={tag} 
            name={tag}
            selected={selectedTags.includes(tag)}
            onSelect={() => onSelectTag(tag)}
          />
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
