import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;

    const systemInstruction = `
      You are ArthMitra AI, an empathetic financial assistant for college students in India.
      Current context:
      - Remaining Monthly Budget: ₹${context?.remainingBudget ?? 10500}
      - Total Spent So Far: ₹${context?.totalSpent ?? 1500}
      Provide concise, practical advice in 2-3 sentences.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    return res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error('Copilot Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}