
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
  if (availableTags.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No tags available</div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-2">
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
        {availableTags.length === 0 ? (
          <div className="text-sm text-muted-foreground">No matching tags</div>
        ) : (
          availableTags.map(tag => (
            <Tag 
              key={tag} 
              name={tag}
              selected={selectedTags.includes(tag)}
              onSelect={() => onSelectTag(tag)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TagFilter;
