import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Message } from '../types';
import { calculateQuote, type JobEstimate } from '../utils/pricing';

const SYSTEM_INSTRUCTION = `You are Phoenix Projects' AI assistant for Andrew Truter's construction company in Garsfontein, Pretoria.

SEARCH & ESTIMATE PROCESS:
1. Search "Gauteng South Africa [specific product] price 2024 ZAR rand" for current material costs
2. Use ONLY Gauteng suppliers and South African Rands (R)
3. Apply Phoenix rates: Labor R700/hr, Travel R300/day (<30km) or R500/day (>30km), Materials +30% markup
4. Ask 2-3 targeted questions to fine-tune the estimate

SERVICES: Garage doors & motors, electrical, plumbing, construction, smart home automation, handyman services

RESPONSE FORMAT:
- Brief material costs found (Gauteng suppliers only)
- Estimated total using Phoenix rates
- Ask specific questions to refine quote (size, location, access, current condition, etc.)
- Keep under 150 words

EXAMPLE: "Found garage motors in Gauteng: R2,800-R4,200. With installation (3hrs @ R700/hr) and travel, estimate R5,000-R7,000. Questions: What's your door size? Single or double? Current motor brand? Distance from Garsfontein?"

CONTACT: Andrew - 079 463 5951

Stay concise, search Gauteng prices, use Phoenix rates, ask targeted questions.`;

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
          maxOutputTokens: 250
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
