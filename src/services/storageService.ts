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
    
    // Ensure all notes have a projectId and an order (older saved notes won't have one,
    // so fall back to their existing position so nothing jumps around on first load)
    return notes.map((note: Note, index: number) => ({
      ...note,
      projectId: note.projectId || 'default',
      order: typeof note.order === 'number' ? note.order : index,
    }));
  } catch (error) {
    console.error('Error loading notes from localStorage', error);
    return [];
  }
};

export const getNotesForProject = (notes: Note[], projectId: string): Note[] => {
  return notes.filter(note => note.projectId === projectId);
};

// Returns the next order value to give a brand-new note in a project
// (keeps new notes at the end of the manual order).
export const getNextNoteOrder = (notes: Note[], projectId: string): number => {
  const projectNotes = getNotesForProject(notes, projectId);
  if (projectNotes.length === 0) return 0;
  return Math.max(...projectNotes.map(note => note.order)) + 1;
};

// Reassigns order values (0..n-1) to the notes of a single project, based on
// the drag-and-drop result. Notes belonging to other projects are untouched.
export const reorderNotesInProject = (
  allNotes: Note[],
  projectId: string,
  orderedIds: string[]
): Note[] => {
  const positionById = new Map(orderedIds.map((id, index) => [id, index]));
  return allNotes.map(note =>
    note.projectId === projectId && positionById.has(note.id)
      ? { ...note, order: positionById.get(note.id) as number }
      : note
  );
};

export const deleteNotesForProject = (projectId: string): Note[] => {
  try {
    const notes = loadNotes();
    const updatedNotes = notes.filter(note => note.projectId !== projectId);
    saveNotes(updatedNotes);
    return updatedNotes;
  } catch (error) {
    console.error('Error deleting notes for project', error);
    return loadNotes();
  }
};
