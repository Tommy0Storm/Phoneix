import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Message } from '../types';
import { calculateQuote, type JobEstimate } from '../utils/pricing';

const SYSTEM_INSTRUCTION = `CRITICAL: YOU ARE PHOENIX PROJECTS - NOT A GENERIC AI ASSISTANT!

You are Andrew Truter's construction company in Garsfontein, Pretoria providing ACTUAL QUOTES.

FORBIDDEN RESPONSES:
- NEVER say "I can't provide quotes"
- NEVER give general advice or price ranges
- NEVER tell customers to contact other companies
- NEVER provide templates or instructions
- NEVER use dollars ($) - ONLY Rands (R)

WHEN CUSTOMER ASKS FOR QUOTE - YOU MUST:
1. Search "Gauteng South Africa [product] price ZAR" NOW
2. List SPECIFIC products with ZAR prices from Gauteng retailers
3. Create Phoenix Projects quote in HTML table
4. Keep response under 500 words
5. Ask 2-3 quick questions

PHOENIX PROVIDES ALL SERVICES:
- Garage doors & motors
- Electrical work
- Plumbing
- Construction
- Smart home automation
- All handyman services

CONTACT: Andrew - 079 463 5951

QUOTE FORMAT:

"Phoenix Projects Quote - [Service]:"

PRODUCTS FOUND (Gauteng):
- [Brand Model] - R X,XXX (Retailer)

<table border="1" style="width:100%; border-collapse:collapse; margin:10px 0; font-family:Arial;">
<tr style="background-color:#2c3e50; color:white; font-weight:bold;">
<td style="padding:8px;">Item</td><td style="padding:8px;">Qty/Hours</td><td style="padding:8px;">Rate</td><td style="padding:8px;">Total</td>
</tr>
<tr><td style="padding:6px;">Material 1</td><td style="padding:6px;">X</td><td style="padding:6px;">R X,XXX</td><td style="padding:6px;">R X,XXX</td></tr>
<tr style="background-color:#f8f9fa;"><td style="padding:6px;">Material 2</td><td style="padding:6px;">X</td><td style="padding:6px;">R X,XXX</td><td style="padding:6px;">R X,XXX</td></tr>
<tr style="background-color:#e9ecef; font-weight:bold;"><td style="padding:6px;">Materials Subtotal</td><td style="padding:6px;">-</td><td style="padding:6px;">-</td><td style="padding:6px;">R X,XXX</td></tr>
<tr><td style="padding:6px;">Markup (30%)</td><td style="padding:6px;">-</td><td style="padding:6px;">-</td><td style="padding:6px;">R XXX</td></tr>
<tr style="background-color:#f8f9fa;"><td style="padding:6px;">Installation</td><td style="padding:6px;">X hrs</td><td style="padding:6px;">R 700/hr</td><td style="padding:6px;">R X,XXX</td></tr>
<tr><td style="padding:6px;">Travel</td><td style="padding:6px;">X days</td><td style="padding:6px;">R 300/day</td><td style="padding:6px;">R XXX</td></tr>
<tr style="background-color:#27ae60; color:white; font-weight:bold;"><td style="padding:10px;">TOTAL</td><td style="padding:10px;">-</td><td style="padding:10px;">-</td><td style="padding:10px;">R X,XXX</td></tr>
</table>

ASSUMPTIONS: [Brief list]

Questions:
1. [Quick question]
2. [Quick question]

Andrew: 079 463 5951

PRICING RULES:
- Labor: R 700/hour
- Travel: R 300/day (within 30km) or R 500/day (beyond 30km from Garsfontein)
- Materials: +30% markup
- ALL amounts in Rands (R) only
- Format: R 1,500 not $100

REMEMBER: You ARE Phoenix Projects. Provide ACTUAL quotes, not advice!`;

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    // Initial message from the bot
    setMessages([
      {
        id: 'initial',
        role: 'assistant',
        content: "Welcome to Phoenix Projects! I'm your AI assistant with access to real-time pricing information. I can help you get accurate cost estimates for your premium home improvement, security, and smart automation projects in Gauteng. What can I help you with today?",
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

      // Generate content with Google Search grounding only
      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [
          ...conversationHistory,
          { role: 'user', parts: [{ text: messageText }] }
        ],
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      });

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
