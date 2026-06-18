export interface SampleGalleryItem {
  title: string;
  prompt: string;
  notes: string;
  imageUrl: string;
}

export const sampleGalleryItems: SampleGalleryItem[] = [
  {
    title: 'Moonlit library observatory',
    prompt:
      'A quiet circular library inside a mountain observatory, brass telescope, moonlight through tall windows, warm lamps, detailed fantasy concept art',
    notes:
      'A strong prompt names the subject, location, lighting, materials, and the final art direction.',
    imageUrl: '/assets/images/samples/moonlit-library-observatory.jpg',
  },
  {
    title: 'Art deco sunrise station',
    prompt:
      'An art deco train station at sunrise, polished stone floor, gold trim, travelers as small silhouettes, cinematic wide angle, soft haze',
    notes:
      'Architecture prompts work best when they include a period, surface details, scale, and camera direction.',
    imageUrl: '/assets/images/samples/art-deco-sunrise-station.jpg',
  },
  {
    title: 'Bioluminescent greenhouse',
    prompt:
      'A glass greenhouse filled with bioluminescent plants, rain on the windows, deep emerald leaves, tiny blue flowers, macro photography style',
    notes:
      'Nature prompts become more specific when color, weather, lens style, and small details are included.',
    imageUrl: '/assets/images/samples/bioluminescent-greenhouse.jpg',
  },
  {
    title: 'Solar desert library',
    prompt:
      'A miniature clay model of a solar powered desert library, sun shades, sand colored walls, tiny readers, handmade stop motion set',
    notes:
      'Medium words like clay model or stop motion set can push the result toward a distinctive visual language.',
    imageUrl: '/assets/images/samples/solar-desert-library.jpg',
  },
];

export const guideSections = [
  {
    title: 'Start With A Clear Subject',
    body:
      'Lead with the main subject before adding style. A direct subject gives the model an anchor, while the later details refine mood and composition.',
    example:
      'A small wooden boat on a misty lake at dawn, quiet atmosphere, realistic watercolor, soft gray and blue palette',
  },
  {
    title: 'Add Context And Materials',
    body:
      'Use concrete nouns for the setting and surfaces. Words like brass, linen, glass, stone, paper, or neon help the output feel intentional.',
    example:
      'A brass desk lamp on an old oak writing table, scattered sketch paper, rainy window, cozy studio lighting',
  },
  {
    title: 'Control The Frame',
    body:
      'Camera and composition words help shape the image. Try wide angle for scenes, close-up for objects, or overhead view for layouts.',
    example:
      'Overhead view of a handmade map, ink rivers, small compass, warm parchment texture, clean editorial lighting',
  },
  {
    title: 'Keep It Safe And Specific',
    body:
      'Imagio blocks explicit prompts and is tuned for general creative use. Safe, specific prompts also tend to produce cleaner results.',
    example:
      'A friendly robot gardener watering balcony plants, bright morning light, cheerful 3D illustration, family friendly',
  },
];
