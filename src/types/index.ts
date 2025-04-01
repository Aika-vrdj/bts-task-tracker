
export interface Note {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: string;
}

export type PriorityType = 'low' | 'medium' | 'high';

export interface Tag {
  id: string;
  name: string;
}
