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
      createdAt: new Date().toISOString(),
      order: 0,
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
    const projects: Project[] = projectsJSON ? JSON.parse(projectsJSON) : [];
    
    // Fall back to existing array position for projects saved before ordering existed
    return projects
      .map((project, index) => ({
        ...project,
        order: typeof project.order === 'number' ? project.order : index,
      }))
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error loading projects from localStorage', error);
    return [];
  }
};

export const getNextProjectOrder = (projects: Project[]): number => {
  if (projects.length === 0) return 0;
  return Math.max(...projects.map(project => project.order)) + 1;
};

// Reassigns order values (0..n-1) based on the drag-and-drop result.
export const reorderProjects = (projects: Project[], orderedIds: string[]): Project[] => {
  const projectById = new Map(projects.map(project => [project.id, project]));
  return orderedIds
    .map((id, index) => {
      const project = projectById.get(id);
      return project ? { ...project, order: index } : null;
    })
    .filter((project): project is Project => project !== null);
};

export const deleteProject = (projectId: string): Project[] => {
  try {
    // Don't allow deletion of the default project
    if (projectId === DEFAULT_PROJECT_ID) {
      return loadProjects();
    }
    
    const projects = loadProjects().filter(project => project.id !== projectId);
    saveProjects(projects);
    return projects;
  } catch (error) {
    console.error('Error deleting project from localStorage', error);
    return loadProjects();
  }
};

export const getDefaultProjectId = (): string => {
  return DEFAULT_PROJECT_ID;
};
