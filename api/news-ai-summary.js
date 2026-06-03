import process from 'node:process';

const callOpenAi = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You summarize and analyze news in Korean. Do not invent facts outside the provided article data.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI API failed: ${response.status} ${detail}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
};

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini API failed: ${response.status} ${detail}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n') || '';
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const prompt = body.prompt || body.question || '';
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const answer = (await callOpenAi(prompt)) || (await callGemini(prompt));
    if (!answer) {
      return res.status(503).json({ error: 'AI API key is not configured. Set OPENAI_API_KEY or GEMINI_API_KEY in Vercel environment.' });
    }

    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'AI summary failed' });
  }
}
