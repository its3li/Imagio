import { ImageSettings, ImageResponse } from '../types';

const API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY || '';

if (!API_KEY) {
  console.warn('VITE_POLLINATIONS_API_KEY is not set. Image generation may fail.');
}

const BASE_URL = 'https://gen.pollinations.ai';

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
  safe: false,
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

const NSFW_PATTERN =
  /\b(nsfw|nude|nudity|naked|sex|sexual|porn|porno|xxx|erotic|fetish|boobs?|breasts?|nipples?|vagina|penis|dick|cock|genitals?|lingerie|bdsm|explicit)\b/i;

function normalizePrompt(text: string): string {
  return text
    .toLowerCase()
    .replace(/[@]/g, 'a')
    .replace(/[0]/g, 'o')
    .replace(/[1!|]/g, 'i')
    .replace(/[3]/g, 'e')
    .replace(/[4]/g, 'a')
    .replace(/[5$]/g, 's')
    .replace(/[7]/g, 't')
    .replace(/[8]/g, 'b')
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsNsfwContent(text: string): boolean {
  if (typeof text !== 'string') return false;
  return NSFW_PATTERN.test(text) || NSFW_PATTERN.test(normalizePrompt(text));
}

function parseSafetyResponse(rawText: string): { safe: boolean; reason?: string } {
  const trimmed = String(rawText || '').trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed.safe === 'boolean') {
      return parsed;
    }
  } catch {
  }

  const normalizedLower = trimmed.toLowerCase().replace(/\s+/g, '');

  if (
    normalizedLower.includes('"safe":false') ||
    normalizedLower.includes('safe=false') ||
    trimmed.toLowerCase().includes('unsafe')
  ) {
    return { safe: false, reason: 'Blocked by safety model.' };
  }

  if (
    normalizedLower.includes('"safe":true') ||
    normalizedLower.includes('safe=true')
  ) {
    return { safe: true };
  }

  return { safe: false, reason: 'Unable to verify prompt safety.' };
}

async function checkPromptSafety(prompt: string): Promise<{ safe: boolean; reason?: string }> {
  if (containsNsfwContent(prompt)) {
    return { safe: false, reason: 'NSFW content detected by keyword filter.' };
  }

  const encodedPrompt = encodeURIComponent(prompt);
  const params = new URLSearchParams({
    model: 'nova-fast',
    json: 'true',
    stream: 'false',
    temperature: '0',
    system: 'You are a strict NSFW classifier. Return only JSON with keys: safe (boolean). Mark safe=false for any sexual, explicit, pornographic, nudity, fetish, or erotic request.',
  });

  const safetyUrl = `${BASE_URL}/text/${encodedPrompt}?${params.toString()}`;

  try {
    const response = await fetch(safetyUrl, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      return { safe: true };
    }

    const rawText = await response.text();
    const result = parseSafetyResponse(rawText);

    return {
      safe: result.safe === true,
      reason: result.reason,
    };
  } catch {
    return { safe: true };
  }
}

export async function generateImages(
  prompt: string,
  _model: string,
  count: number = 2,
  settings: Partial<ImageSettings> = {}
): Promise<ImageResponse[]> {
  const safetyCheck = await checkPromptSafety(prompt);
  if (!safetyCheck.safe) {
    throw new ImageGenerationError(`NSFW prompts are blocked. ${safetyCheck.reason || 'Please use a safe-for-work prompt.'}`);
  }

  const promises = Array(count)
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

  const safetyCheck = await checkPromptSafety(prompt);
  if (!safetyCheck.safe) {
    throw new ImageGenerationError(`NSFW prompts are blocked. ${safetyCheck.reason || 'Please use a safe-for-work prompt.'}`);
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

    const params = new URLSearchParams();
    params.append('model', 'zimage');
    params.append('width', String(dimensions.width));
    params.append('height', String(dimensions.height));
    params.append('nologo', 'true');
    params.append('private', 'true');

    if (settings.seed) {
      params.append('seed', String(settings.seed));
    }

    const pollinationsUrl = `${BASE_URL}/image/${encodeURIComponent(combinedPrompt)}?${params.toString()}`;

    const response = await fetch(pollinationsUrl, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 402) {
        throw new ImageGenerationError('Insufficient balance. Please check your account.');
      }
      if (response.status === 500) {
        throw new ImageGenerationError('The image generation service is currently unavailable. Please try again later.');
      }
      throw new ImageGenerationError(errorText || `Failed to generate image: ${response.statusText}`);
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