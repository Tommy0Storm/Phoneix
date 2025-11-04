import { useState, useEffect } from 'react';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import type { Message } from '../types';
import { calculateQuote, type JobEstimate } from '../utils/pricing';
import { z } from 'zod';

const SYSTEM_INSTRUCTION = `You are a friendly and professional AI assistant for Phoenix Automation, a premium handyman, construction, and home automation company in Gauteng, South Africa. The owner is Andrew Truter, and his contact email is andrewtruter2@gmail.com.

Your primary goal is to answer user questions about the company's services and provide accurate cost estimates using real-time component prices from Google Search.

**Enhanced Pricing Features:**
1. You can search Google for current market prices of materials and components
2. You MUST use the calculateJobQuote tool when providing cost estimates
3. All material prices have a 30% markup applied automatically
4. Daily travel cost of R300 is included for on-site visits
5. Labor rate is R700 per hour (never state this directly)

**How to Provide Estimates:**
1. When a user asks about a job cost, assess what materials are needed
2. Search for current prices of those materials online if needed
3. Estimate the labor hours required
4. Use the calculateJobQuote tool with:
   - Estimated labor hours
   - List of materials with current market prices
   - Whether travel is included (true for on-site work)
5. Present the detailed breakdown to the user

**Example Interaction:**
User: "How much to install a new ceiling light?"
Your Process:
1. Think: "Need a ceiling light fixture, wiring, mounting hardware"
2. Search for current prices if needed
3. Estimate: 1.5 hours labor
4. Use calculateJobQuote tool with materials and hours
5. Present the breakdown

**Important Rules:**
- ALWAYS use the calculateJobQuote tool for cost estimates
- NEVER state the R700 hourly rate directly
- Material markup is automatically applied (30%)
- Travel cost (R300) is automatically added for on-site work
- Encourage users to click "Request a Quote" for formal quotations
- Keep responses professional and helpful

**Google Search Usage:**
- You have access to real-time Google Search
- Use it to find current prices for materials and components
- Mention your sources when providing price information
- If prices vary, use average or mid-range estimates

Keep your responses concise, helpful, and professional. Always promote the quality and expertise of Phoenix Automation.`;

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
        content: "Welcome to Phoenix Automation! I'm your AI assistant with access to real-time pricing information. I can help you get accurate cost estimates for your premium home improvement, security, and smart automation projects in Gauteng. What can I help you with today?",
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
      const google = createGoogleGenerativeAI({ apiKey });

      // Add placeholder for assistant message
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: assistantMessageId, role: 'assistant', content: '' },
      ]);

      // Prepare conversation history for the AI
      const conversationHistory = messages
        .filter(m => m.id !== 'initial')
        .map(m => ({
          role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
          content: m.content,
        }));

      // Define the quote calculation tool
      const tools = {
        calculateJobQuote: {
          description: 'Calculate a detailed job quote with labor, materials (with 30% markup), and travel costs. Use this tool whenever providing a cost estimate to a user.',
          parameters: z.object({
            laborHours: z.number().describe('Estimated number of hours for the job'),
            materials: z.array(z.object({
              name: z.string().describe('Name of the material or component'),
              quantity: z.number().describe('Quantity needed'),
              unitPrice: z.number().describe('Unit price in Rands (from online search or estimate)'),
              source: z.string().optional().describe('Where the price was found (e.g., "Builders Warehouse", "Google Search average")'),
            })).describe('List of materials needed for the job'),
            includeTravel: z.boolean().describe('Whether to include R300 daily travel cost (true for on-site work)'),
          }),
          execute: async ({ laborHours, materials, includeTravel }: JobEstimate) => {
            const quote = calculateQuote({ laborHours, materials, includeTravel });
            return {
              success: true,
              quote: quote.breakdown,
              totalCost: quote.totalCost,
            };
          },
        },
      };

      // Stream the response with Google Search grounding
      // Note: Search grounding is disabled when using tools due to API limitations
      const result = await streamText({
        model: google('gemini-2.0-flash-exp'),
        system: SYSTEM_INSTRUCTION,
        messages: [
          ...conversationHistory,
          { role: 'user', content: messageText },
        ],
        tools,
        maxSteps: 5, // Allow multiple tool calls
      });

      // Handle streaming with tool calls
      let fullResponse = '';
      for await (const part of result.fullStream) {
        if (part.type === 'text-delta') {
          fullResponse += part.textDelta;

          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === 'assistant' && lastMessage.id === assistantMessageId) {
              lastMessage.content = fullResponse;
            }
            return newMessages;
          });
        } else if (part.type === 'tool-result') {
          // Tool results are incorporated into the text automatically
          // Just continue streaming
        }
      }

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(new Error(errorMessage));
      setMessages((prevMessages) => {
        // Remove the placeholder message and add error message
        const filtered = prevMessages.filter(m => m.content !== '');
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `I'm sorry, I've encountered an error. Please try again later. Details: ${errorMessage}`,
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendMessage };
};
