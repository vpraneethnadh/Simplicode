app.post('/api/ask-ai', async (req, res) => {
    const { messages } = req.body;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages
      })
    });
  
    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  });
  