export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  updated: string;
  readTime: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
}

export const guideArticles: GuideArticle[] = [
  {
    slug: 'write-ai-image-prompts',
    title: 'How to write AI image prompts that produce usable artwork',
    description:
      'A practical guide to prompt structure, visual detail, and revision habits for people using AI image generators.',
    updated: 'June 29, 2026',
    readTime: '7 min read',
    sections: [
      {
        heading: 'Start with the job of the image',
        paragraphs: [
          'A useful prompt begins with the job the image needs to do. A thumbnail, a poster background, a character concept, and a product mockup all need different levels of detail. Before choosing style words, decide what the viewer should understand in the first second.',
          'For example, "a fantasy castle" is a subject, but "a lonely cliffside castle used as a book cover background" is a direction. It tells the model that the scene needs atmosphere, readable shape, and space for text. That extra context usually matters more than adding a long list of art styles.',
        ],
      },
      {
        heading: 'Use a stable prompt order',
        paragraphs: [
          'A reliable order is subject, setting, action, materials, lighting, composition, and style. You do not need every part every time, but this order keeps the prompt easy to edit. If the output is wrong, you can see which part needs to change.',
          'A strong prompt might be: "A ceramic fox reading under a brass desk lamp, cozy study, warm evening light, close-up product photography, soft shadows, detailed handmade texture." The subject is clear, the materials are concrete, and the image has a defined frame.',
        ],
      },
      {
        heading: 'Prefer concrete visual nouns',
        paragraphs: [
          'Concrete words give the model something visible to build. "Elegant" can help, but "polished walnut table, linen curtains, amber wall lamp, marble floor" gives stronger guidance. Materials, colors, weather, scale, and camera angle make a prompt more controllable.',
          'This is also why short prompts can sometimes beat long prompts. A compact prompt with five specific visual details is usually cleaner than a paragraph full of vague mood words. Keep the words that change the picture and remove the words that only repeat the feeling.',
        ],
      },
      {
        heading: 'Revise one thing at a time',
        paragraphs: [
          'When an image is close but not right, change one part of the prompt rather than rewriting everything. If the lighting is wrong, change only the lighting phrase. If the subject is too small, change the composition phrase. This makes the next result easier to compare.',
          'A good revision habit is to keep the original prompt, copy it, and make a small edit. Over time, you build a personal library of phrases that work for your visual taste. That library becomes more valuable than any single generated image.',
        ],
      },
    ],
  },
  {
    slug: 'choose-aspect-ratio',
    title: 'Choosing the right aspect ratio for AI generated images',
    description:
      'How square, vertical, and horizontal formats change composition, cropping, and the final use of an AI image.',
    updated: 'June 29, 2026',
    readTime: '6 min read',
    sections: [
      {
        heading: 'Aspect ratio changes the idea',
        paragraphs: [
          'Aspect ratio is not only a technical setting. It changes what kind of picture the model tries to create. A square image often centers the subject. A vertical image emphasizes height and character. A horizontal image gives more room for environments and storytelling.',
          'Choosing the ratio before writing the prompt helps the image feel intentional. If you know the result is for a phone story, ask for a vertical composition. If it is for a banner, ask for a wide composition with open space on one side.',
        ],
      },
      {
        heading: 'Use square for balanced subjects',
        paragraphs: [
          'Square works well for profile images, icons, album-style covers, social posts, and centered objects. It is forgiving because the model can place the subject in the middle without needing complex layout instructions.',
          'When using square format, describe the subject and the immediate surrounding details. A prompt like "a glass terrarium on a stone table, tiny moss landscape inside, soft window light, centered product photo" fits the format naturally.',
        ],
      },
      {
        heading: 'Use vertical for characters and mobile media',
        paragraphs: [
          'Vertical images are useful for characters, fashion concepts, posters, mobile wallpapers, stories, and tall architecture. The extra height gives the model space for full-body poses, towers, trees, and foreground-to-background depth.',
          'Vertical prompts benefit from composition words such as full body, tall frame, portrait orientation, low angle, or stacked layers. These words help the model understand that the height is part of the design, not just a crop.',
        ],
      },
      {
        heading: 'Use horizontal for scenes and thumbnails',
        paragraphs: [
          'Horizontal images are best when the environment matters. Landscapes, rooms, city streets, cinematic scenes, and thumbnails often need a wide frame. This format gives the viewer context and leaves room for text overlays.',
          'For thumbnails, ask for clear subject separation and simple background shapes. A crowded wide image can look impressive up close but fail at small sizes. The best thumbnail images stay readable even when reduced.',
        ],
      },
    ],
  },
  {
    slug: 'safe-family-friendly-prompts',
    title: 'Writing safe and family friendly AI image prompts',
    description:
      'A guide to keeping prompts clear, useful, and appropriate for general audiences while still getting creative results.',
    updated: 'June 29, 2026',
    readTime: '5 min read',
    sections: [
      {
        heading: 'Safe prompts are usually better prompts',
        paragraphs: [
          'A safe prompt is not a boring prompt. It is a prompt that gives the model a clear creative direction without relying on explicit, shocking, or harmful content. General-audience prompts are easier to share, publish, and reuse in professional projects.',
          'Imagio is designed around safe-for-work image generation. The backend blocks explicit requests before the image request is sent, and the generator sends safe mode with each image request. That makes the tool better suited for broad creative use.',
        ],
      },
      {
        heading: 'Describe mood without unsafe shortcuts',
        paragraphs: [
          'People often use unsafe or extreme words when they are really trying to describe mood. Instead of leaning on those words, describe lighting, color, location, facial expression, weather, and camera angle. These details create mood without creating policy risk.',
          'For example, "mysterious detective poster, rain-soaked street, blue neon reflection, silhouette under umbrella" creates a strong dramatic feeling while staying appropriate for a general audience.',
        ],
      },
      {
        heading: 'Avoid private or identifying details',
        paragraphs: [
          'Do not put private information, addresses, phone numbers, private photos, or identifying details about real people into prompts. Even when a tool is convenient, prompts should be treated as content that may be processed by external services.',
          'If you need a person-like subject, use fictional descriptions such as "a young explorer with a green jacket" rather than naming a private individual. This keeps the prompt useful while reducing privacy and rights concerns.',
        ],
      },
      {
        heading: 'Keep a review step before publishing',
        paragraphs: [
          'AI images can include unexpected details. Before publishing or using an output commercially, inspect the image for unwanted text, confusing symbols, distorted objects, or anything that changes the meaning of the work.',
          'A simple review habit protects the final project. Generate several options, keep the best one, and only publish after checking that the image matches the prompt and fits the audience.',
        ],
      },
    ],
  },
  {
    slug: 'turn-prompts-into-social-graphics',
    title: 'Turning AI image prompts into social media graphics',
    description:
      'How to plan AI images for posts, thumbnails, stories, and banners without losing readability after cropping.',
    updated: 'June 29, 2026',
    readTime: '6 min read',
    sections: [
      {
        heading: 'Design for the final size',
        paragraphs: [
          'Social graphics are often viewed quickly and at small sizes. A detailed image may look good on a desktop monitor but become unreadable in a feed. Start by deciding where the graphic will be used, then write the prompt for that final size.',
          'For feed posts, ask for a centered subject and simple background. For stories, ask for a vertical composition with room at the top or bottom. For thumbnails, ask for high contrast and a clear focal point.',
        ],
      },
      {
        heading: 'Leave space for text',
        paragraphs: [
          'If you plan to add a headline later, the prompt should include empty space. Phrases such as "open dark sky on the left", "clean background area", or "negative space for title text" can help the model create a more usable layout.',
          'Do not ask the image model to create important readable text inside the image. Add text later in a design tool where you control spelling, alignment, contrast, and accessibility.',
        ],
      },
      {
        heading: 'Use contrast intentionally',
        paragraphs: [
          'Social images need contrast because viewers scroll fast. Contrast can come from light against dark, warm against cool, sharp subject against soft background, or simple shape against detailed texture.',
          'A prompt like "bright orange camping tent under a deep blue night sky, wide frame, clean silhouette, soft stars, high contrast editorial illustration" gives the model a readable graphic structure.',
        ],
      },
      {
        heading: 'Build a reusable prompt set',
        paragraphs: [
          'If you publish often, create a small set of prompt templates for your brand or project. Keep the subject variable, but reuse style, lighting, and layout phrases. This gives your visuals a consistent identity without making every image identical.',
          'A reusable template might be: "main subject, clean editorial background, warm key light, subtle texture, high contrast, space for headline, modern social graphic." Change the subject and colors while keeping the layout logic.',
        ],
      },
    ],
  },
];

export function getGuideArticle(slug: string | undefined) {
  return guideArticles.find((article) => article.slug === slug);
}
