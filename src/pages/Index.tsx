import { useState, useEffect } from "react";
import Header from "@/components/Header";
import NoteForm from "@/components/NoteForm";
import NoteCard from "@/components/NoteCard";
import TagFilter from "@/components/TagFilter";
import ProjectSidebar from "@/components/ProjectSidebar";
import HighPrioritySidebar from "@/components/HighPrioritySidebar";
import { Note, PriorityType, Project } from "@/types";
import {
  saveNotes,
  loadNotes,
  getNotesForProject,
  deleteNotesForProject,
  getNextNoteOrder,
  reorderNotesInProject,
} from "@/services/storageService";
import {
  initializeProjects,
  saveProjects,
  getDefaultProjectId,
  deleteProject,
  getNextProjectOrder,
  reorderProjects,
} from "@/services/projectService";
import { Input } from "@/components/ui/input";
import { Search, MenuIcon, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Footer from "@/components/Footer";
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
  arrayMove,
} from "@dnd-kit/sortable";

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>(getDefaultProjectId());
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [showProjectDrawer, setShowProjectDrawer] = useState(false);
  const [showPriorityDrawer, setShowPriorityDrawer] = useState(false);
  const isMobile = useIsMobile();

  const noteSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    const savedProjects = initializeProjects();
    setProjects(savedProjects);
    
    const savedNotes = loadNotes();
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const handleAddProject = (projectName: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: projectName,
      createdAt: new Date().toISOString(),
      order: getNextProjectOrder(projects),
    };

    setProjects(prevProjects => [...prevProjects, newProject]);
    setActiveProjectId(newProject.id);
    if (isMobile) {
      setShowProjectDrawer(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedNotes = deleteNotesForProject(projectId);
    setNotes(updatedNotes);
    
    const updatedProjects = deleteProject(projectId);
    setProjects(updatedProjects);
    
    if (projectId === activeProjectId) {
      setActiveProjectId(getDefaultProjectId());
    }
    
    if (isMobile) {
      setShowProjectDrawer(false);
    }
  };

  const handleReorderProjects = (orderedIds: string[]) => {
    setProjects(prevProjects => reorderProjects(prevProjects, orderedIds));
  };

  const handleAddNote = ({ 
    title, 
    content, 
    priority, 
    tags 
  }: { 
    title: string; 
    content: string; 
    priority: PriorityType; 
    tags: string[]; 
  }) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      priority,
      completed: false,
      tags,
      projectId: activeProjectId,
      createdAt: new Date().toISOString(),
      order: getNextNoteOrder(notes, activeProjectId),
    };

    setNotes(prevNotes => [...prevNotes, newNote]);
  };

  const handleEditNote = (id: string, updates: {
    title: string;
    content: string;
    priority: PriorityType;
    tags: string[];
  }) => {
    setNotes(prevNotes => prevNotes.map(note =>
      note.id === id ? { ...note, ...updates } : note
    ));
  };

  const handleToggleComplete = (id: string) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setTagSearch("");
  };

  const projectNotes = getNotesForProject(notes, activeProjectId);

  const allTags = Array.from(
    new Set(projectNotes.flatMap(note => note.tags))
  );

  const filteredTags = tagSearch.trim() 
    ? allTags.filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase()))
    : allTags;

  // Manual drag order is now the primary sort, with completed tasks sinking to the
  // bottom. Priority is still visible on each card and has its own dedicated view
  // in the High Priority sidebar.
  const filteredNotes = projectNotes
    .filter(note => 
      selectedTags.length === 0 ||
      selectedTags.some(tag => note.tags.includes(tag))
    )
    .sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return a.order - b.order;
    });

  // Reordering only makes sense against the full, unfiltered manual order for the
  // project, so drag-and-drop is disabled while a tag filter is active.
  const isReorderable = selectedTags.length === 0;

  const highPriorityNotes = notes.filter(note => note.priority === "high").length;

  const handleNotesDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredNotes.findIndex(note => note.id === active.id);
    const newIndex = filteredNotes.findIndex(note => note.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(filteredNotes, oldIndex, newIndex);
    const newOrderIds = reordered.map(note => note.id);

    setNotes(prevNotes => reorderNotesInProject(prevNotes, activeProjectId, newOrderIds));
  };

  const renderNotesList = () => {
    if (filteredNotes.length === 0) {
      return (
        <div className="paper p-8 text-center">
          <p className="text-muted-foreground font-lora">
            {projectNotes.length === 0 
              ? "No notes yet. Add your first note above!" 
              : "No notes match your filter. Try clearing filters or add a new note."}
          </p>
        </div>
      );
    }

    const noteCards = filteredNotes.map(note => (
      <NoteCard 
        key={note.id} 
        note={note} 
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteNote}
        onEditNote={handleEditNote}
        dragDisabled={!isReorderable}
      />
    ));

    if (!isReorderable) {
      return noteCards;
    }

    return (
      <DndContext
        sensors={noteSensors}
        collisionDetection={closestCenter}
        onDragEnd={handleNotesDragEnd}
      >
        <SortableContext items={filteredNotes.map(note => note.id)} strategy={verticalListSortingStrategy}>
          {noteCards}
        </SortableContext>
      </DndContext>
    );
  };

  const renderContent = () => {
    if (isMobile) {
      return (
        <>
          <Header />
          
          <div className="flex justify-between items-center px-4 py-2 bg-background/80 backdrop-blur-sm border-b border-border sticky top-16 z-10">
            <Drawer open={showProjectDrawer} onOpenChange={setShowProjectDrawer}>
              <DrawerTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm">
                  <MenuIcon size={16} />
                  <span>{projects.find(p => p.id === activeProjectId)?.name || 'Projects'}</span>
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="h-[70vh] overflow-auto">
                  <ProjectSidebar 
                    projects={projects}
                    activeProjectId={activeProjectId}
                    onSelectProject={(id) => {
                      setActiveProjectId(id);
                      setShowProjectDrawer(false);
                    }}
                    onAddProject={handleAddProject}
                    onDeleteProject={handleDeleteProject}
                    onReorderProjects={handleReorderProjects}
                  />
                </div>
              </DrawerContent>
            </Drawer>
            
            <Drawer open={showPriorityDrawer} onOpenChange={setShowPriorityDrawer}>
              <DrawerTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-100/50 dark:bg-red-900/30 text-sm">
                  <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
                  <span>{highPriorityNotes} High Priority</span>
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="h-[70vh] overflow-auto">
                  <HighPrioritySidebar 
                    notes={notes} 
                    onToggleComplete={handleToggleComplete}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          
          <main className="container mx-auto px-4 py-6">
            <NoteForm onAddNote={handleAddNote} />
            
            <div className="paper p-4 mb-6 animate-fade-in">
              <h2 className="text-lg font-lora font-medium mb-2">Filter by tags</h2>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tags..."
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <TagFilter 
                availableTags={filteredTags}
                selectedTags={selectedTags}
                onSelectTag={handleSelectTag}
                onClearFilters={handleClearFilters}
              />

              {!isReorderable && (
                <p className="text-xs text-muted-foreground mt-3 italic">
                  Clear filters to drag and reorder tasks.
                </p>
              )}
            </div>
            
            <div className="space-y-4 mb-20">
              {renderNotesList()}
            </div>
          </main>
          
          <Footer />
        </>
      );
    }
    
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <div className="flex flex-1">
          <ProjectSidebar 
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onReorderProjects={handleReorderProjects}
          />
  
          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">            
              <h2 className="text-2xl font-lora mb-6">
                {projects.find(p => p.id === activeProjectId)?.name || 'Notes'}
              </h2>
              
              <NoteForm onAddNote={handleAddNote} />
              
              <div className="paper p-4 mb-6 animate-fade-in">
                <h2 className="text-lg font-lora font-medium mb-2">Filter by tags</h2>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tags..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <TagFilter 
                  availableTags={filteredTags}
                  selectedTags={selectedTags}
                  onSelectTag={handleSelectTag}
                  onClearFilters={handleClearFilters}
                />

                {!isReorderable && (
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    Clear filters to drag and reorder tasks.
                  </p>
                )}
              </div>
              
              <div className="space-y-4">
                {renderNotesList()}
              </div>
            </div>
          </main>
  
          <HighPrioritySidebar 
            notes={notes} 
            onToggleComplete={handleToggleComplete}
          />
        </div>
        
        <Footer />
      </div>
    );
  };

  return renderContent();
};
