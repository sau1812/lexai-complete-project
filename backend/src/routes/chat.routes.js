const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const { protect } = require('../middleware/auth.middleware');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const LANG_NAMES = {
  en: 'English', hi: 'Hindi', mr: 'Marathi',
  gu: 'Gujarati', ta: 'Tamil', te: 'Telugu',
};

// POST /api/chat
router.post('/', protect, async (req, res) => {
  try {
    const { question, context, lang = 'en' } = req.body;

    if (!question || !context) {
      return res.status(400).json({ error: 'Question and context are required.' });
    }

    const langName = LANG_NAMES[lang] || 'English';

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `You are a helpful legal document assistant. Answer in ${langName} language only. Keep answer under 80 words, simple and clear for a non-lawyer.

Document context:
${context}

User question: ${question}`,
      }],
      temperature: 0.3,
      max_tokens: 300,
    });

    const answer = completion.choices[0]?.message?.content || 'Sorry, could not get an answer.';
    res.json({ answer });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get answer.' });
  }
});

module.exports = router;