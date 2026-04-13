const NSFW_PATTERN = /\b(nsfw|nude|nudity|naked|sex|sexual|porn|porno|xxx|erotic|fetish|boobs?|breasts?|nipples?|vagina|penis|dick|cock|genitals?|lingerie|bdsm|explicit)\b/i;
const SAFETY_MODEL = 'qwen-safety';
const SAFETY_SYSTEM_PROMPT = 'You are a strict NSFW classifier. Return only JSON with keys: safe (boolean), category (string), reason (string). Mark safe=false for any sexual, explicit, pornographic, nudity, fetish, or erotic request.';

function normalizePrompt(text) {
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

function containsNsfwContent(text) {
  return NSFW_PATTERN.test(text) || NSFW_PATTERN.test(normalizePrompt(text));
}

function parseSafetyResponse(rawText) {
  const trimmed = rawText.trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed.safe === 'boolean') {
      return parsed;
    }
  } catch {
    // fall through to best-effort parsing
  }

  const lower = trimmed.toLowerCase();
  if (lower.includes('"safe":false') || lower.includes('safe=false') || lower.includes('unsafe')) {
    return { safe: false, reason: 'Blocked by qwen-safety model response.' };
  }

  if (lower.includes('"safe":true') || lower.includes('safe=true')) {
    return { safe: true };
  }

  return { safe: false, reason: 'Unable to verify prompt safety.' };
}

async function isPromptSafeWithModel(prompt, apiKey) {
  const encodedPrompt = encodeURIComponent(prompt);
  const params = new URLSearchParams({
    model: SAFETY_MODEL,
    json: 'true',
    stream: 'false',
    temperature: '0',
    system: SAFETY_SYSTEM_PROMPT
  });

  const safetyUrl = `https://gen.pollinations.ai/text/${encodedPrompt}?${params.toString()}`;
  const response = await fetch(safetyUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Safety model failed (${response.status}): ${detail || 'Unknown error'}`);
  }

  const rawText = await response.text();
  const result = parseSafetyResponse(rawText);

  return {
    safe: result.safe === true,
    reason: result.reason || ''
  };
}

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

  const { prompt, width, height, seed, safe } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Prompt is required.' });
    return;
  }

  if (containsNsfwContent(prompt)) {
    res.status(400).json({ error: 'NSFW prompts are blocked. Please use a safe-for-work prompt.' });
    return;
  }

  try {
    const safetyCheck = await isPromptSafeWithModel(prompt.trim(), apiKey);
    if (!safetyCheck.safe) {
      res.status(400).json({
        error: `NSFW prompts are blocked. ${safetyCheck.reason || 'Please use a safe-for-work prompt.'}`
      });
      return;
    }
  } catch (error) {
    console.error('Safety check failed, continuing with regex-only guard:', error);
  }

  const encodedPrompt = encodeURIComponent(prompt.trim());
  const params = new URLSearchParams();

  params.append('model', 'zimage');
  params.append('width', String(width || 1024));
  params.append('height', String(height || 1024));
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
