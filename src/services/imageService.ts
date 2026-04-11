import { ImageSettings, ImageResponse } from '../types';

export const modelOptions = [
  {
    id: 'zimage',
    label: 'zimage',
    description: 'Pollinations zimage model',
    promptSuffix: ''
  }
];

const defaultSettings: ImageSettings = {
  model: 'zimage',
  enhance: true,
  nologo: true,
  private: true,
  safe: true,
  imageCount: 2,
  aspectRatio: 'square'
};

const aspectRatioSizes = {
  square: { width: 1024, height: 1024 },
  vertical: { width: 768, height: 1024 },
  horizontal: { width: 1024, height: 768 }
};

export class ImageGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageGenerationError';
  }
}

export async function generateImages(
  prompt: string,
  _model: string,
  count: number = 2,
  settings: Partial<ImageSettings> = {}
): Promise<ImageResponse[]> {
  const promises = Array(count)
    .fill(null)
    .map(() =>
      generateImage(prompt, {
        ...settings,
        model: 'zimage',
        seed: Math.floor(Math.random() * 1000000)
      })
    );
  return Promise.all(promises);
}

export async function generateImage(
  prompt: string,
  settings: Partial<ImageSettings> = {},
  originalPrompt?: string
): Promise<ImageResponse> {
  if (!prompt?.trim()) {
    throw new ImageGenerationError('Prompt is required');
  }

  try {
    const finalSettings = {
      ...defaultSettings,
      ...settings,
      model: 'zimage'
    };

    let combinedPrompt = prompt.trim();

    if (originalPrompt) {
      combinedPrompt = `${originalPrompt}, ${prompt.trim()}`;
    }

    const dimensions = aspectRatioSizes[finalSettings.aspectRatio || 'square'];

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: combinedPrompt,
        model: 'zimage',
        width: dimensions.width,
        height: dimensions.height,
        seed: settings.seed,
        enhance: finalSettings.enhance,
        safe: finalSettings.safe
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 500) {
        throw new ImageGenerationError('The image generation service is currently unavailable. Please try again later.');
      }
      throw new ImageGenerationError(errorText || `Failed to generate image: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    return {
      url: blobUrl,
      settings: {
        ...finalSettings,
        model: 'zimage'
      }
    };
  } catch (error) {
    console.error('Error generating image:', error);
    if (error instanceof ImageGenerationError) {
      throw error;
    }
    throw new ImageGenerationError('Failed to generate image. Please try again.');
  }
}

export async function downloadImage(url: string, filename?: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;

    const randomString = Math.random().toString(36).substring(2, 15);
    link.download = filename || `imagio-${randomString}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Failed to download image:', error);
    throw new Error('Failed to download image. Please try right-clicking and "Save Image As" instead.');
  }
}
