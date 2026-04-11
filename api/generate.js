export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.POLLINATIONS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server API key is not configured.' });
    return;
  }

  const { prompt, width, height, seed, enhance, safe } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Prompt is required.' });
    return;
  }

  const encodedPrompt = encodeURIComponent(prompt.trim());
  const params = new URLSearchParams();

  params.append('model', 'zimage');
  params.append('width', String(width || 1024));
  params.append('height', String(height || 1024));
  params.append('enhance', String(enhance ?? true));
  params.append('safe', String(safe ?? true));

  if (typeof seed === 'number') {
    params.append('seed', String(seed));
  }

  const pollinationsUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?${params.toString()}`;

  try {
    const response = await fetch(pollinationsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const text = await response.text();
      res.status(response.status).send(text || 'Failed to generate image.');
      return;
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(imageBuffer);
  } catch (error) {
    console.error('Pollinations proxy error:', error);
    res.status(500).json({ error: 'Image generation failed.' });
  }
}
