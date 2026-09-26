export default async function handler(req, res) {
  // Add full CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Reject non-POST and non-GET methods
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Read secret key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
  }

  try {
    // Robustly parse req.body or use req.query
    let body = {};
    if (req.method === 'POST') {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    }
    
    // Extract message and context
    const message = req.method === 'POST' ? body.message : req.query?.message;
    const context = req.method === 'POST' ? body.context : null;
    const userMessage = message || '';

    // Pass student financial context in the system prompt
    const systemPrompt = `You are ArthMitra AI, an empathetic, practical financial copilot for Indian college students.
Keep in mind the student's context: remaining allowance is ₹${context?.remainingBudget ?? 'unknown'}, total spent so far is ₹${context?.totalSpent ?? 'unknown'}.
Give concise, relatable advice in a friendly tone.`;

    // Target OpenAI endpoint
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(response.status).json({ error: data.error?.message || 'Error communicating with OpenAI' });
    }

    // Extract the generated text
    const text = data.choices[0].message.content;
    
    // Return { "reply": text }
    return res.status(200).json({ reply: text });
    
  } catch (error) {
    console.error("Error in copilot API handler:", error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}