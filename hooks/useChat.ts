import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Message } from '../types';
import { calculateQuote, type JobEstimate } from '../utils/pricing';

const SYSTEM_INSTRUCTION = `You are Phoenix Projects' professional AI assistant for Andrew Truter's construction company in Garsfontein, Pretoria.

IMPORTANT: Never show your search process or "thinking" - only provide clean, professional results.

PROCESS (Internal - Don't Show):
1. Search Gauteng suppliers for current prices
2. Apply Phoenix rates: Labor R700/hr, Travel R300/day (<30km) or R500/day (>30km), Materials +30% markup
3. Calculate estimate and present professionally

RESPONSE FORMAT (Clean & Visual):
Use HTML formatting for professional presentation:

**Phoenix Projects - [Service] Quote**

<div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 20px; border-radius: 10px; margin: 10px 0; border-left: 5px solid #E63946;">
<h3 style="margin: 0 0 15px 0; color: #E63946;">💼 Professional Estimate</h3>
<div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 10px 0;">
<strong>Materials:</strong> R X,XXX (Premium quality)<br>
<strong>Installation:</strong> R X,XXX (X hours @ R700/hr)<br>
<strong>Travel:</strong> R XXX<br>
<strong style="color: #E63946; font-size: 1.1em;">Total Estimate: R X,XXX - R X,XXX</strong>
</div>
</div>

<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #E63946;">
<strong>🔍 To refine your quote:</strong><br>
• Question 1?<br>
• Question 2?<br>
• Question 3?
</div>

📞 **Ready to book?** Call Andrew: **079 463 5951**

SERVICES: Garage doors & motors, electrical, plumbing, construction, smart home automation, handyman services

Keep estimates realistic based on Gauteng market prices. Always be professional and confident.`;

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;

  useEffect(() => {
    // Initial message from the bot
    setMessages([
      {
        id: 'initial',
        role: 'assistant',
        content: "Hi! I'm Phoenix Projects AI. I can search current Gauteng prices and give you quick estimates for garage doors, electrical, plumbing, and construction work. What project can I help you with?",
      },
    ]);
  }, []);

  const sendMessage = async (messageText: string) => {
    if (!apiKey) {
      setError(new Error('API key is not configured'));
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I'm sorry, but the API key is not configured. Please contact support.",
        },
      ]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const ai = new GoogleGenAI({ apiKey });

      // Prepare conversation history
      const conversationHistory = messages
        .filter(m => m.id !== 'initial')
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

      // Generate content with Gemini 2.0 Flash and Google Search
      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [
          ...conversationHistory,
          { role: 'user', parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nUser: ${messageText}` }] }
        ],
        tools: [{ googleSearch: {} }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 400
        }
      } as any);

      const responseText = result.text || 'I apologize, but I was unable to generate a response.';

      // Extract sources from grounding metadata
      const rawSources = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = rawSources
        .map((chunk: any) => ({
          uri: chunk.web?.uri || '',
          title: chunk.web?.title || 'Untitled Source'
        }))
        .filter((source: any) => source.uri);

      const uniqueSources = Array.from(new Map(sources.map((item: any) => [item.uri, item])).values());

      // Format response with sources if available
      let finalResponse = responseText;
      if (uniqueSources.length > 0) {
        finalResponse += '<br><br><strong>Gauteng Sources:</strong><br>' + uniqueSources.map((s: any, i: number) =>
          `${i + 1}. <a href="${s.uri}" target="_blank">${s.title}</a>`
        ).join('<br>');
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: finalResponse,
        },
      ]);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(new Error(errorMessage));
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I'm sorry, I've encountered an error. Please try again later. Details: ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendMessage };
};
