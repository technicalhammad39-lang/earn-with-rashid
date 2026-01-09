
import { GoogleGenAI, Type } from "@google/genai";

export async function analyzeMarket(pair: string, type: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as an elite institutional trading mentor named Rashid. Perform a high-precision technical analysis for ${pair} (${type}). 
  Analyze the following components with maximum accuracy:
  1. Market Structure (BOS, CHoCH, Market Shift).
  2. Liquidity Zones (BSL, SSL) and Imbalances (FVG).
  3. Fibonacci Retracements and Key Psychological Levels.
  4. Momentum Indicators and Volume Profile.

  Output a JSON object with: 
  1. rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Weak Sell' | 'Strong Sell'
  2. confidence: number (0-100)
  3. smcElements: string (Summarize the institutional footprints found)
  4. entryZone: string (Precise range)
  5. targets: string (Target levels)
  6. explanationUrdu: A VERY SHORT, high-accuracy professional explanation in Roman Urdu. 
  Explain ONLY the core logic in 1-2 sentences maximum. Avoid long paragraphs. Use terms like 'Liquidity', 'Demand Zone', 'Resistance'.
  
  Example: "Price ne SSL sweep karke strong bullish CHoCH diya hai, ab H1 FVG se bounce expected hai."
  
  Keep it strictly professional and concise.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          rating: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          smcElements: { type: Type.STRING },
          entryZone: { type: Type.STRING },
          targets: { type: Type.STRING },
          explanationUrdu: { type: Type.STRING }
        },
        required: ["rating", "confidence", "explanationUrdu", "entryZone", "targets"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function getLessonQA(question: string, context: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Context: ${context}. 
  User Question: ${question}. 
  Reply as a friendly trading teacher named Rashid. 
  Language: Simple Roman Urdu. 
  Tone: Encouraging, authoritative yet easy. 
  Avoid complex jargon unless explaining it. Keep it short. Minimum messages.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });

  return response.text;
}
