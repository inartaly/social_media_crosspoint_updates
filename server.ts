import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Server API endpoint to draft tweets from release notes using Gemini 3.8 Flash
app.post('/api/generate-tweet', async (req, res) => {
  try {
    const { releaseNotes, releaseUrl, focusVariant } = req.body;

    if (!releaseNotes || typeof releaseNotes !== 'string') {
      return res.status(400).json({ error: 'Release notes text is required' });
    }

    if (!ai) {
      return res.json({
        fallback: true,
        message: 'No server API key configured; using deterministic compiler',
      });
    }

    const systemPrompt = `You are a social media bot for the CrossPoint Reader open-source e-reader hardware community.
Your task is to process technical GitHub release notes for CrossPoint Reader firmware updates and draft a concise, engaging tweet for X (Twitter).

STRICT RULES:
1. Output ONLY the tweet text. Do NOT include intro/outro fluff, quotation marks, or notes.
2. High-level focus: Focus strictly on the 2-3 most exciting user-facing features, bug fixes, or newly supported hardware targets (e.g. e-ink devices like Xteink X4, LilyGo, M5Paper).
3. Keep the body of the text under 220 characters (excluding links) so it safely fits within the Twitter character limit alongside a URL.
4. Formatting: Use bullet points or short lines if clean. Include relevant emojis (e.g., 📱, ⚡, 🐛, 🚀).
5. Tone: Informative, concise, and developer/tech-enthusiast friendly.

Variant preference: ${focusVariant || 'balanced'}.
Always append this URL at the very end after a blank line: ${releaseUrl || 'https://github.com/crosspoint-reader/crosspoint-reader'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Draft the tweet for this release:\n\n${releaseNotes}`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
      },
    });

    const tweetText = response.text ? response.text.trim() : '';
    return res.json({ tweetText, success: true });
  } catch (error: any) {
    console.error('Gemini tweet generation error:', error);
    return res.status(500).json({ error: error.message || 'Generation failed' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CrossPoint Release Bot running on http://0.0.0.0:${port}`);
  });
}

startServer();
