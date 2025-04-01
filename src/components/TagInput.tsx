
import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import Tag from "./Tag";

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const TagInput = ({ tags, onAddTag, onRemoveTag }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      
      // Add tag if it doesn't already exist
      if (!tags.includes(inputValue.trim().toLowerCase())) {
        onAddTag(inputValue.trim().toLowerCase());
      }
      
      setInputValue("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          placeholder="Add tags... (press Enter)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-20"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <Tag 
            key={tag} 
            name={tag} 
            showRemove 
            onRemove={() => onRemoveTag(tag)} 
          />
        ))}
      </div>
    </div>
  );
};

export default TagInput;
