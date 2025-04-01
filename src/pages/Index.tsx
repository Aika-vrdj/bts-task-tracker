
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import NoteForm from "@/components/NoteForm";
import NoteCard from "@/components/NoteCard";
import TagFilter from "@/components/TagFilter";
import ProjectSidebar from "@/components/ProjectSidebar";
import AnimatedHeader from "@/components/AnimatedHeader";
import { Note, PriorityType, Project } from "@/types";
import { saveNotes, loadNotes, getNotesForProject } from "@/services/storageService";
import { initializeProjects, saveProjects, getDefaultProjectId } from "@/services/projectService";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2,
};

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>(getDefaultProjectId());
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState("");

  // Load projects and notes from localStorage on mount
  useEffect(() => {
    const savedProjects = initializeProjects();
    setProjects(savedProjects);
    
    const savedNotes = loadNotes();
    setNotes(savedNotes);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const handleAddProject = (projectName: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: projectName,
      createdAt: new Date().toISOString(),
    };

    setProjects(prevProjects => [...prevProjects, newProject]);
    setActiveProjectId(newProject.id);
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
    };

    setNotes(prevNotes => [...prevNotes, newNote]);
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

  // Filter notes by the active project
  const projectNotes = getNotesForProject(notes, activeProjectId);

  // Get all unique tags from this project's notes
  const allTags = Array.from(
    new Set(projectNotes.flatMap(note => note.tags))
  );

  // Filter tags by search term
  const filteredTags = tagSearch.trim() 
    ? allTags.filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase()))
    : allTags;

  // Filter and sort notes
  const filteredNotes = projectNotes
    .filter(note => 
      selectedTags.length === 0 ||
      selectedTags.some(tag => note.tags.includes(tag))
    )
    .sort((a, b) => {
      // First by priority
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <ProjectSidebar 
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={setActiveProjectId}
          onAddProject={handleAddProject}
        />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Animated Header */}
            <AnimatedHeader />
            
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
            </div>
            
            <div className="space-y-4">
              {filteredNotes.length === 0 ? (
                <div className="paper p-8 text-center">
                  <p className="text-muted-foreground font-lora">
                    {projectNotes.length === 0 
                      ? "No notes yet. Add your first note above!" 
                      : "No notes match your filter. Try clearing filters or add a new note."}
                  </p>
                </div>
              ) : (
                filteredNotes.map(note => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteNote}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
