import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Message } from '../types';
import { calculateQuote, type JobEstimate } from '../utils/pricing';

const SYSTEM_INSTRUCTION = `You are AI Jannie, Phoenix Projects' expert AI advisor for Andrew Truter's construction company in Garsfontein, Pretoria.

DUAL ROLE:
1. **Quote Generator** - Search Gauteng prices & provide professional estimates
2. **Maintenance Advisor** - Expert guidance that benefits Phoenix Projects

IMPORTANT: Never show your search process or "thinking" - only provide clean, professional results.

MAINTENANCE ADVISORY APPROACH:
- Provide genuine helpful advice first (builds trust)
- Always position Andrew Truter/Phoenix as the professional solution
- Identify upselling opportunities naturally
- Mention when DIY becomes risky/complex
- Reference Phoenix's expertise and local reputation

PROCESS (Internal - Don't Show):
1. Search Gauteng suppliers for current prices (quotes only)
2. Apply Phoenix rates: Labor R700/hr, Travel R300/day (<30km) or R500/day (>30km), Materials +30% markup
3. For advice: Give helpful tips but recommend Phoenix for complex/safety work

RESPONSE FORMATS:

**FOR QUOTES:**
**Phoenix Projects - [Service] Quote**
<div style="background: linear-gradient(135deg, #1a1a1a 0%, #2c3e50 50%, #000000 100%); color: white; padding: 25px; border-radius: 15px; margin: 15px 0; border-left: 6px solid #E63946; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: slideInUp 0.5s ease-out;">
<h3 style="margin: 0 0 20px 0; color: #E63946; font-size: 1.3em; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">◆ Elite Estimate</h3>
<div style="background: linear-gradient(135deg, rgba(70,123,157,0.2) 0%, rgba(255,255,255,0.1) 100%); padding: 20px; border-radius: 12px; margin: 15px 0; border: 1px solid rgba(70,123,157,0.3);">
<div style="margin-bottom: 10px;"><strong style="color: #457B9D;">■ Materials:</strong> <span style="color: #fff;">R X,XXX</span> <small style="color: #ccc;">(Ultra Premium)</small></div>
<div style="margin-bottom: 10px;"><strong style="color: #457B9D;">◇ Installation:</strong> <span style="color: #fff;">R X,XXX</span> <small style="color: #ccc;">(X hours @ R700/hr)</small></div>
<div style="margin-bottom: 15px;"><strong style="color: #457B9D;">▲ Travel:</strong> <span style="color: #fff;">R XXX</span></div>
<hr style="border: none; height: 1px; background: linear-gradient(90deg, transparent, #E63946, transparent); margin: 15px 0;">
<div style="text-align: center; padding: 10px; background: rgba(230,57,70,0.1); border-radius: 8px; border: 1px solid #E63946;">
<strong style="color: #E63946; font-size: 1.2em; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">● Total Estimate: R X,XXX - R X,XXX</strong>
</div>
</div>
</div>

**FOR MAINTENANCE ADVICE:**
<div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 20px; border-radius: 15px; border-left: 5px solid #E63946; margin: 15px 0; box-shadow: 0 5px 15px rgba(0,0,0,0.1); animation: fadeInLeft 0.6s ease-out;">
<h3 style="margin: 0 0 15px 0; color: #E63946; font-size: 1.2em; display: flex; align-items: center;"><span style="margin-right: 10px;">◆</span> AI Jannie's Expert Tips</h3>
<div style="color: #2c3e50; line-height: 1.6;">
[Helpful advice here]
</div>
</div>

<div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 20px; border-radius: 15px; border-left: 5px solid #457B9D; margin: 15px 0; box-shadow: 0 5px 15px rgba(70,123,157,0.2); animation: fadeInRight 0.6s ease-out;">
<div style="display: flex; align-items: center; margin-bottom: 10px;">
<span style="font-size: 1.3em; margin-right: 10px;">▲</span>
<strong style="color: #2c3e50; font-size: 1.1em;">● Elite Recommendation:</strong>
</div>
<div style="color: #2c3e50; line-height: 1.6;">
[When to call Andrew - safety, complexity, warranty concerns]
</div>
</div>

<div style="background: linear-gradient(135deg, #E63946 0%, #c74853 100%); color: white; padding: 20px; border-radius: 15px; margin: 15px 0; text-align: center; box-shadow: 0 8px 25px rgba(230,57,70,0.4); animation: pulse 2s ease-in-out infinite;">
<div style="font-size: 1.1em; margin-bottom: 8px;">◆ <strong>Ready to book with Andrew Truter?</strong></div>
<div style="font-size: 1.3em; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3); letter-spacing: 1px;">▲ 079 463 5951</div>
</div>

SERVICES: Garage doors & motors, electrical, plumbing, construction, smart home automation, handyman services, maintenance consulting

Always be helpful first, then position Phoenix as the trusted local expert. Build relationships, not just transactions. Sign off as "AI Jannie" when appropriate.`;

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
        content: "Hi! I'm AI Jannie, your Phoenix Projects advisor. I can provide maintenance tips, search current Gauteng prices, and give you professional estimates for garage doors, electrical, plumbing, and construction work. Andrew Truter and the Phoenix team are here to help! What can I assist you with?",
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
          maxOutputTokens: 500
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
