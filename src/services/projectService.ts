
import { Project } from "@/types";

const STORAGE_KEY = 'retro-notes-app-projects';
const DEFAULT_PROJECT_ID = 'default';

// Initialize with a default project if none exist
export const initializeProjects = (): Project[] => {
  const projects = loadProjects();
  if (projects.length === 0) {
    const defaultProject: Project = {
      id: DEFAULT_PROJECT_ID,
      name: 'Personal Notes',
      createdAt: new Date().toISOString()
    };
    saveProjects([defaultProject]);
    return [defaultProject];
  }
  return projects;
};

export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to localStorage', error);
  }
};

export const loadProjects = (): Project[] => {
  try {
    const projectsJSON = localStorage.getItem(STORAGE_KEY);
    return projectsJSON ? JSON.parse(projectsJSON) : [];
  } catch (error) {
    console.error('Error loading projects from localStorage', error);
    return [];
  }
};

export const getDefaultProjectId = (): string => {
  return DEFAULT_PROJECT_ID;
};
