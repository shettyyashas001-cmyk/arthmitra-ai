export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is missing' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { message, context } = body || {};

    const systemPrompt = `You are ArthMitra AI, an intelligent financial copilot for college students in India.
Context: Student's remaining allowance is ₹${context?.remainingBudget ?? 10500}, spent so far is ₹${context?.totalSpent ?? 1500}.
Provide a clear, realistic, and encouraging budget answer in 2-3 concise sentences.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser Question: ${message || 'Hi'}` }],
          },
        ],
      }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      console.error('Gemini API Error:', data);
      return res.status(apiRes.status).json({ error: data.error?.message || 'Gemini API Error' });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that response.";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Handler Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}