
import React, { useState } from 'react';
import { Project } from '@/types';
import { PlusCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectSidebarProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onAddProject: (projectName: string) => void;
}

const ProjectSidebar = ({ 
  projects, 
  activeProjectId, 
  onSelectProject, 
  onAddProject 
}: ProjectSidebarProps) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim());
      setNewProjectName('');
      setIsAdding(false);
      toast({
        title: "Project created",
        description: `Created project "${newProjectName.trim()}"`,
      });
    }
  };

  const baseClasses = isMobile
    ? "w-full bg-background/90 backdrop-blur-sm overflow-y-auto"
    : "w-64 h-[calc(100vh-4rem)] border-r border-border bg-background/90 backdrop-blur-sm overflow-y-auto";

  return (
    <aside className={baseClasses}>
      <div className="p-4">
        <h2 className="text-lg font-lora mb-4 text-foreground">Projects</h2>
        
        <div className="space-y-2">
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`w-full text-left p-2 rounded-md transition-colors ${
                project.id === activeProjectId
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              }`}
            >
              {project.name}
            </button>
          ))}
        </div>

        {isAdding ? (
          <div className="mt-4 space-y-2">
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
              autoFocus
              className="h-8"
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="w-full" 
                onClick={handleAddProject}
                disabled={!newProjectName.trim()}
              >
                Create
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full" 
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4 flex items-center gap-1" 
            onClick={() => setIsAdding(true)}
          >
            <PlusCircle size={16} />
            <span>New Project</span>
          </Button>
        )}
      </div>
    </aside>
  );
};

export default ProjectSidebar;
