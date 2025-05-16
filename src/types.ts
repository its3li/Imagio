export interface ImageSettings {
  model?: string;
  enhance?: boolean;
  nologo?: boolean;
  private?: boolean;
  safe?: boolean;
  imageCount?: number;
  aspectRatio?: 'square' | 'vertical' | 'horizontal';
  originalPrompt?: string;
}

export interface ImageHistory {
  url: string;
  prompt: string;
}

export interface ImageData {
  url: string;
  prompt: string;
  editPrompt?: string;
  isEditing: boolean;
  isLoading: boolean;
  settings: {
    model: string;
  };
  history?: ImageHistory[];
}

export interface ImageResponse {
  url: string;
  settings: ImageSettings;
}