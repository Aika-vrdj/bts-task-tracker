export interface Note {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: string;
  projectId: string; // Added projectId field
  order: number; // Manual sort position within its project
}

export type PriorityType = 'low' | 'medium' | 'high';

export interface Tag {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  order: number; // Manual sort position in the sidebar
}
