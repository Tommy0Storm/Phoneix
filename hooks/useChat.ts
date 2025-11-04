import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Message } from '../types';
import { calculateQuote, type JobEstimate } from '../utils/pricing';

const SYSTEM_INSTRUCTION = `You are a friendly and professional AI assistant for Phoenix Projects, a premium handyman, construction, and home automation company in Gauteng, South Africa. The owner is Andrew Truter, and you can reach him at:
- Phone: 079 463 5951
- Email: andrewtruter2@gmail.com

Your primary goal is to answer user questions about the company's services and provide accurate cost estimates using real-time component prices from Google Search.

**Pricing Calculation Rules:**
When providing cost estimates, ALWAYS calculate and present quotes using this formula:

1. **Labor Cost**: Estimate hours × R700/hour (don't reveal the hourly rate to customers)
2. **Materials Cost**: Sum of (quantity × unit price) for all materials
3. **Material Markup**: Add 30% to the materials cost
4. **Travel Cost**: Add R300 for on-site work
5. **Total Cost**: Labor + Materials with Markup + Travel

**Example Quote Format:**
"Based on current market prices and the scope of work:

**Detailed Breakdown:**
- Labor: [X hours estimated] = R[amount]
- Materials:
  • [Material 1]: [qty] × R[price] = R[subtotal]
  • [Material 2]: [qty] × R[price] = R[subtotal]
- Materials Subtotal: R[sum]
- Materials with 30% Markup: R[sum × 1.30]
- Travel Cost (on-site): R300

**Total Estimated Cost: R[total]**

*Prices sourced from [mention sources]. Final quote subject to on-site assessment.*"

**How to Provide Estimates:**
1. When asked about job costs, identify required materials
2. Use Google Search to find current South African prices (Builders Warehouse, Makro, Leroy Merlin, etc.)
3. Estimate labor hours based on job complexity
4. Calculate using the formula above
5. Present a clear, detailed breakdown
6. Always mention your price sources

**Important Rules:**
- NEVER state the R700 hourly rate directly to customers
- ALWAYS apply 30% markup to materials (already included in your calculation)
- ALWAYS add R300 travel for on-site jobs
- Use real-time Google Search for accurate pricing
- Mention sources for credibility
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
      const model = ai.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }]
      });

      const result = await model.generateContent({
        contents: [
          ...conversationHistory,
          { role: 'user', parts: [{ text: messageText }] }
        ]
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
        finalResponse += '\n\n**Sources:**\n' + uniqueSources.map((s: any, i: number) =>
          `${i + 1}. [${s.title}](${s.uri})`
        ).join('\n');
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
