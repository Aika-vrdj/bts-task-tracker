import React, { useState } from 'react';
import { Project } from '@/types';
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProjectSidebarProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onAddProject: (projectName: string) => void;
  onDeleteProject?: (projectId: string) => void;
  onReorderProjects?: (orderedIds: string[]) => void;
}

interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
  onDeleteClick?: (e: React.MouseEvent) => void;
}

const ProjectItem = ({ project, isActive, onSelect, onDeleteClick }: ProjectItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center">
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none px-1"
        aria-label="Drag to reorder project"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <button
        onClick={onSelect}
        className={`flex-grow text-left p-2 rounded-md transition-colors ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-secondary'
        }`}
      >
        {project.name}
      </button>
      {onDeleteClick && project.id !== 'default' && (
        <Button 
          variant="ghost" 
          size="icon"
          className="ml-1 h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onDeleteClick}
          title="Delete project"
        >
          <Trash2 size={16} />
        </Button>
      )}
    </div>
  );
};

const ProjectSidebar = ({ 
  projects, 
  activeProjectId, 
  onSelectProject, 
  onAddProject,
  onDeleteProject,
  onReorderProjects,
}: ProjectSidebarProps) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

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

  const handleDeleteProject = () => {
    if (projectToDelete && onDeleteProject) {
      const projectName = projects.find(p => p.id === projectToDelete)?.name || '';
      onDeleteProject(projectToDelete);
      setProjectToDelete(null);
      toast({
        title: "Project deleted",
        description: `"${projectName}" and all its notes have been deleted`,
        variant: "destructive"
      });
    }
  };

  const confirmDelete = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete(projectId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorderProjects) return;

    const oldIndex = projects.findIndex(p => p.id === active.id);
    const newIndex = projects.findIndex(p => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(projects, oldIndex, newIndex);
    onReorderProjects(reordered.map(p => p.id));
  };

  const baseClasses = isMobile
    ? "w-full bg-background/90 backdrop-blur-sm overflow-y-auto"
    : "w-64 h-[calc(100vh-4rem)] border-r border-border bg-background/90 backdrop-blur-sm overflow-y-auto";

  return (
    <aside className={baseClasses}>
      <div className="p-4">
        <h2 className="text-lg font-lora mb-4 text-foreground">Projects</h2>
        
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {projects.map(project => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  isActive={project.id === activeProjectId}
                  onSelect={() => onSelectProject(project.id)}
                  onDeleteClick={onDeleteProject ? (e) => confirmDelete(project.id, e) : undefined}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

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
      
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the project and all of its notes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
};
