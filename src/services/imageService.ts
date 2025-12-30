import { ImageSettings, ImageResponse } from '../types';

export const modelOptions = [
  {
    id: 'none',
    label: 'No Style',
    description: 'Generate images without any specific style modifications',
    promptSuffix: ' '
  },
  {
    id: 'photorealistic',
    label: 'Photorealistic',
    description: 'Ultra-realistic photographs with professional lighting and composition',
    promptSuffix: ', hyperrealistic, professional photography, cinematic lighting, photorealistic details, award-winning photography, masterpiece, sharp focus, high dynamic range, photorealistic, Canon EOS R5, f/2.8 aperture, golden hour lighting, studio quality'
  },
  {
    id: 'anime',
    label: 'Anime Style',
    description: 'Japanese animation style with vibrant colors and distinctive aesthetics',
    promptSuffix: ', anime masterpiece, Studio Ghibli inspired, detailed anime illustration, vibrant anime colors, professional anime art, manga style, cel shaded, clean linework, anime key visual, high quality anime rendering'
  },
  {
    id: 'logo',
    label: 'Logo Design',
    description: 'Professional and modern logo designs with clean aesthetics',
    promptSuffix: ', professional logo design, minimalist, vector art, clean design, corporate branding, scalable, iconic logo, modern logo design, commercial quality, geometric shapes, professional branding'
  },
  {
    id: 'cartoon3d',
    label: 'Cartoon 3D',
    description: 'Stylized 3D cartoon renders with playful character design',
    promptSuffix: ', 3D cartoon render, Pixar style, stylized 3D art, cute character design, smooth textures, playful aesthetic, vibrant colors, professional 3D animation, cartoon lighting, polished finish'
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

const nsfwKeywords = [
  'porn', 'porno', 'sex', 'nude', 'naked', 'erotic', 'hentai', 'xxx', 'masturbate', 'masturbation', 'jerk off', 'orgasm', 
  'rape', 'raping', 'raped', 'incest', 'child abuse', 'cp', 'loli', 'shota', 'pedophile', 'pedophilia', 'sexual explicit', 
  'explicit', 'pussy', 'vagina', 'penis', 'dick', 'cock', 'balls', 'boobs', 'tits', 'breasts', 'nipples', 'ass', 'butt', 
  'buttocks', 'anal', 'fuck', 'fucked', 'fucking', 'cum', 'jizz', 'sperm', 'semen', 'blowjob', 'bj', 'handjob', 'hj', 
  'facial', 'deepthroat', 'throatfuck', 'gangbang', 'orgy', 'threesome', 'foursome', 'pegging', 'rimming', '69', 
  'bondage', 'bdsm', 'dominatrix', 'submissive', 'fetish', 'footjob', 'fisting', 'cock ring', 'vibrator', 'dildo', 
  'buttplug', 'gag', 'choke', 'spanking', 'squirting', 'creampie', 'milf', 'teen', 'barely legal', 'underage', 'schoolgirl',
  'camgirl', 'webcam sex', 'onlyfans', 'escort', 'prostitute', 'whore', 'slut', 'hooker', 'bitch', 'tranny', 'shemale', 
  'trap', 'futa', 'futanari', 'vore', 'tentacle', 'beastiality', 'zoophilia', 'scat', 'watersports', 'piss', 'pee', 'urine',
  'blood', 'bloody', 'gore', 'violent', 'violence', 'gruesome', 'decapitated', 'torture', 'mutilation', 'disembowel', 
  'dead body', 'corpse', 'necrophilia', 'snuff', 'knifeplay', 'rapeplay', 'abduction', 'chloroform', 'drugged', 
  'nonconsensual', 'forced', 'molest', 'molestation', 'child porn', 'underaged', 'abuse', 'abusive', 'tittyfuck', 'doggystyle',
  'missionary', 'cowgirl', 'reverse cowgirl', 'handcuffs', 'nipple clamps', 'sex toy', 'pornhub', 'xvideos', 'xnxx', 'redtube',
  'bangbros', 'brazzers', 'nasty', 'cumshot', 'money shot', 'licking', 'suck', 'deep', 'wet', 'hard', 'moan', 'groan',
  'sex tape', 'leaked', 'amateur porn', 'hardcore', 'softcore', 'adult', 'XXX', 'NSFW', 'taboo', 'stepmom', 'stepsis', 
  'stepbro', 'gay sex', 'lesbian sex', 'gay porn', 'lesbian porn', 'trans porn', 'intercourse', 'penetration', 
  'rear entry', 'nudity', 'strip', 'stripping', 'lap dance', 'pole dance','blow jop','gay','sexy','hot'];


export async function generateImages(
  prompt: string,
  model: string,
  count: number = 2,
  settings: Partial<ImageSettings> = {}
): Promise<ImageResponse[]> {
  const promises = Array(count).fill(null).map(() => 
    generateImage(prompt, { 
      ...settings, 
      model,
      seed: Math.floor(Math.random() * 1000000) // Generate unique seed for each image
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
      ...settings
    };

    const selectedStyle = modelOptions.find(option => option.id === finalSettings.model) || modelOptions[0];
    let combinedPrompt = prompt.trim();
    
    // For editing, combine original and new prompts
    if (originalPrompt) {
      combinedPrompt = `${originalPrompt}, ${prompt.trim()}`;
    }
    
    // Add style suffix
    combinedPrompt += selectedStyle.promptSuffix;

    const dimensions = aspectRatioSizes[finalSettings.aspectRatio || 'square'];
    const params = new URLSearchParams();
    
    params.append('enhance', finalSettings.enhance.toString());
    params.append('nologo', finalSettings.nologo.toString());
    params.append('private', finalSettings.private.toString());
    params.append('safe', finalSettings.safe.toString());
    params.append('width', dimensions.width.toString());
    params.append('height', dimensions.height.toString());
    params.append('guidance', '8');
    params.append('steps', '30');
    if (settings.seed !== undefined) {
      params.append('seed', settings.seed.toString());
    }

    const encodedPrompt = encodeURIComponent(combinedPrompt);
    const baseUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
    const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 500) {
        throw new ImageGenerationError('The image generation service is currently unavailable. Please try again later.');
      }
      throw new ImageGenerationError(`Failed to generate image: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      throw new ImageGenerationError('Invalid response from the server');
    }

    return {
      url,
      settings: {
        ...finalSettings,
        model: finalSettings.model
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
    link.download = filename || `dreamator-${randomString}.png`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Failed to download image:', error);
    throw new Error('Failed to download image. Please try right-clicking and "Save Image As" instead.');
  }
}
