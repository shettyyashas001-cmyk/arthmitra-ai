import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, context } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Valid message required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY missing on server' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are ArthMitra AI, a financial assistant for college students.
Context:
- Remaining Budget: ₹${context?.remainingBudget ?? 'Unknown'}
- Total Spent: ₹${context?.totalSpent ?? 'Unknown'}

User Question: "${message}"

Give a short, friendly, practical answer in 2-3 sentences max.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({ reply: response.text });
  } catch (err) {
    return res.status(500).json({ error: 'AI processing failed' });
  }
}