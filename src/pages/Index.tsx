
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import NoteForm from "@/components/NoteForm";
import NoteCard from "@/components/NoteCard";
import TagFilter from "@/components/TagFilter";
import { Note, PriorityType } from "@/types";
import { saveNotes, loadNotes } from "@/services/storageService";

const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2,
};

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = loadNotes();
    setNotes(savedNotes);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

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
  };

  // Get all unique tags from notes
  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags))
  );

  // Filter and sort notes
  const filteredNotes = notes
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
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <NoteForm onAddNote={handleAddNote} />
          
          <TagFilter 
            availableTags={allTags}
            selectedTags={selectedTags}
            onSelectTag={handleSelectTag}
            onClearFilters={handleClearFilters}
          />
          
          <div className="space-y-4">
            {filteredNotes.length === 0 ? (
              <div className="paper p-8 text-center">
                <p className="text-muted-foreground font-lora">
                  {notes.length === 0 
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
  );
};

export default Index;
