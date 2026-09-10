export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is missing' });
  }

  try {
    const { message, context } = req.body;

    const systemPrompt = `You are ArthMitra AI, a financial copilot for college students in India. 
Context: Remaining allowance is ₹${context?.remainingBudget ?? 10500}, spent so far is ₹${context?.totalSpent ?? 1500}. 
Give a direct, friendly, and practical answer in 2-3 sentences.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
          },
        ],
      }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      console.error('Gemini API Error:', data);
      return res.status(apiRes.status).json({ error: data.error?.message || 'Gemini API Error' });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Handler Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}