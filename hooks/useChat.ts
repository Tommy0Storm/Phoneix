import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Message } from '../types';
import { calculateQuote, type JobEstimate } from '../utils/pricing';

const SYSTEM_INSTRUCTION = `You are a friendly and professional AI assistant for Phoenix Projects, a premium handyman, construction, and home automation company based in Garsfontein, Pretoria, Gauteng, South Africa. The owner is Andrew Truter, and you can reach him at:
- Phone: 079 463 5951
- Email: andrewtruter2@gmail.com
- Location: Garsfontein, Pretoria

Your primary goal is to answer user questions about the company's services and provide accurate cost estimates using real-time component prices from Google Search.

IMPORTANT SEARCH REQUIREMENTS:
- ALWAYS search specifically for "Gauteng South Africa" prices
- Use search terms like "Gauteng price ZAR", "Johannesburg Pretoria price", "Builders Warehouse Gauteng", "Makro Johannesburg", "Leroy Merlin Pretoria", "Game Gauteng", "Cashbuild Johannesburg"
- Focus on Gauteng retailers and suppliers for accurate local pricing

TRAVEL COST CALCULATION:
- Base location: Garsfontein, Pretoria
- Within 30km radius: R300 travel cost
- Beyond 30km radius: R500 travel cost (R300 + R200 additional)
- Always ask for customer location to calculate accurate travel costs
- Use Google Search to find distance from Garsfontein, Pretoria to customer location

Pricing Calculation Rules:
When providing cost estimates, ALWAYS calculate and present quotes using this formula:

1. Labor Cost: Estimate hours × R700/hour (don't reveal the hourly rate to customers)
2. Materials Cost: Sum of (quantity × unit price) for all materials
3. Material Markup: Add 30% to the materials cost
4. Travel Cost: R300 (within 30km) or R500 (beyond 30km from Garsfontein, Pretoria)
5. Total Cost: Labor + Materials with Markup + Travel

QUOTE TABLE FORMAT - ALWAYS use this HTML table structure:

<table border="1" style="width:100%; border-collapse:collapse; margin:10px 0;">
<tr style="background-color:#f5f5f5; font-weight:bold;">
<td>Item</td><td>Quantity</td><td>Unit Price (ZAR)</td><td>Total (ZAR)</td>
</tr>
<tr><td>Material 1</td><td>X</td><td>R XXX</td><td>R XXX</td></tr>
<tr><td>Material 2</td><td>X</td><td>R XXX</td><td>R XXX</td></tr>
<tr style="background-color:#f9f9f9;"><td><strong>Materials Subtotal</strong></td><td>-</td><td>-</td><td><strong>R XXX</strong></td></tr>
<tr><td>Materials Markup (30%)</td><td>-</td><td>-</td><td>R XXX</td></tr>
<tr><td>Labor (X hours)</td><td>-</td><td>-</td><td>R XXX</td></tr>
<tr><td>Travel (from Garsfontein, Pretoria)</td><td>-</td><td>-</td><td>R XXX</td></tr>
<tr style="background-color:#e8f5e8; font-weight:bold; font-size:16px;"><td><strong>TOTAL ESTIMATE</strong></td><td>-</td><td>-</td><td><strong>R XXX</strong></td></tr>
</table>

How to Provide Estimates:
1. When asked about job costs, identify required materials
2. Use Google Search to find current Gauteng South Africa prices in ZAR
3. Estimate labor hours based on job complexity (typical ranges: simple jobs 1-3hrs, medium 4-8hrs, complex 8-16hrs)
4. Calculate using the formula above
5. Present using the HTML table format
6. Always mention Gauteng-specific price sources

Important Rules:
- NEVER state the R700 hourly rate directly to customers
- ALWAYS apply 30% markup to materials
- ALWAYS add R300 travel for Gauteng on-site jobs
- Use real-time Google Search for accurate Gauteng pricing in ZAR
- Present quotes in HTML table format for clarity
- Mention Gauteng sources for credibility
- Keep responses professional and concise
- Encourage formal quotes via "Request a Quote" button

Keep your responses concise, helpful, and professional. Always promote the quality and expertise of Phoenix Projects.`;

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
        tools: [{ googleSearch: {} }]
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
