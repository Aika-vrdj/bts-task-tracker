
import { Note } from "@/types";

const STORAGE_KEY = 'retro-notes-app';

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes to localStorage', error);
  }
};

export const loadNotes = (): Note[] => {
  try {
    const notesJSON = localStorage.getItem(STORAGE_KEY);
    const notes = notesJSON ? JSON.parse(notesJSON) : [];
    
    // Ensure all notes have a projectId
    return notes.map((note: Note) => ({
      ...note,
      projectId: note.projectId || 'default'
    }));
  } catch (error) {
    console.error('Error loading notes from localStorage', error);
    return [];
  }
};

export const getNotesForProject = (notes: Note[], projectId: string): Note[] => {
  return notes.filter(note => note.projectId === projectId);
};
