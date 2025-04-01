
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
    return notesJSON ? JSON.parse(notesJSON) : [];
  } catch (error) {
    console.error('Error loading notes from localStorage', error);
    return [];
  }
};
