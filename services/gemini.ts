
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initializing GoogleGenAI directly inside the function using process.env.API_KEY to ensure compliance with SDK guidelines.
export async function analyzeMarket(pair: string, type: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze the current trading conditions for ${pair} (${type}). 
  Explain the Trend, Support & Resistance, and Momentum. 
  Output a JSON object with: 
  1. rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Weak Sell' | 'Strong Sell'
  2. confidence: number (0-100)
  3. explanationUrdu: A very simple, friendly explanation in Roman Urdu (for a beginner).
  Use mentoring tone. Keep sentences short.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          rating: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          explanationUrdu: { type: Type.STRING }
        },
        required: ["rating", "confidence", "explanationUrdu"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

// Fix: Initializing GoogleGenAI directly inside the function using process.env.API_KEY to ensure compliance with SDK guidelines.
export async function getLessonQA(question: string, context: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Context: ${context}. 
  User Question: ${question}. 
  Reply as a friendly trading teacher named Rashid. 
  Language: Simple Roman Urdu. 
  Tone: Encouraging and easy to understand. 
  Avoid complex jargon. Keep it short.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });

  return response.text;
}
