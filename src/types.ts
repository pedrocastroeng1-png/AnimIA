export type AppState = 'home' | 'create_mascot' | 'workspace';
export type WorkspaceView = 'scenes' | 'backgrounds' | 'products' | 'vehicles' | 'scripts' | 'director' | 'projects' | 'settings' | 'voices';

export interface Character {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  defaultVoice?: string;
  defaultExpression?: string;
  speakingStyle?: string;
  favoriteBehaviors?: string[];
  frequentObjects?: string[];
  favoriteScenes?: string[];
  description?: string;
  personality?: string;
}

export interface Background {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

export interface Behavior {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface Scene {
  id: string;
  name: string;
  backgroundId: string;
  description: string;
  characterId?: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface VideoHistory {
  id: string;
  title: string;
  characterId: string;
  backgroundId: string;
  script: string;
  voice: string;
  format: string;
  videoUrl?: string;
  thumbnailUrl: string;
  createdAt: string;
  status: 'completed' | 'generating' | 'failed';
}

export interface DraftVideo {
  characterId?: string;
  backgroundId?: string;
  script: string;
  voice?: string;
  style?: string;
  format?: string;
  resolution?: string;
}
