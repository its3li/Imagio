import { ImageSettings, ImageResponse } from '../types';

export const modelOptions = [
  {
    id: 'zimage',
    label: 'Z-Image',
    description: 'Fast 6B Flux with 2x upscaling',
    promptSuffix: ''
  }
];

const defaultSettings: ImageSettings = {
  model: 'zimage',
  enhance: false,
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

async function readGenerationError(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = await response.json().catch(() => null);
    if (body && typeof body.error === 'string') {
      return body.error;
    }
  }

  const text = await response.text().catch(() => '');
  return text || `Failed to generate image: ${response.statusText}`;
}

export async function generateImages(
  prompt: string,
  _model: string,
  count: number = 2,
  settings: Partial<ImageSettings> = {}
): Promise<ImageResponse[]> {
  const imageCount = Math.min(Math.max(Math.floor(count || 1), 1), 4);
  const promises = Array(imageCount)
    .fill(null)
    .map(() =>
      generateImage(prompt, {
        ...settings,
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
      model: 'zimage',
      safe: true
    };

    const combinedPrompt = originalPrompt
      ? `${originalPrompt.trim()}, ${prompt.trim()}`
      : prompt.trim();
    const dimensions = aspectRatioSizes[finalSettings.aspectRatio || 'square'];

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: combinedPrompt,
        width: dimensions.width,
        height: dimensions.height,
        seed: finalSettings.seed,
        safe: true
      })
    });

    if (!response.ok) {
      const message = await readGenerationError(response);
      if (response.status === 402) {
        throw new ImageGenerationError('Insufficient balance. Please check your account.');
      }
      if (response.status === 503) {
        throw new ImageGenerationError('The image generation service is currently unavailable. Please try again later.');
      }
      throw new ImageGenerationError(message);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    return {
      url: blobUrl,
      settings: finalSettings
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
