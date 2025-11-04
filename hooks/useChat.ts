import { useState, useEffect } from 'react';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import type { Message } from '../types';

const SYSTEM_INSTRUCTION = `You are a friendly and professional AI assistant for Phoenix Automation, a premium handyman, construction, and home automation company in Gauteng, South Africa. The owner is Andrew Truter, and his contact email is andrewtruter2@gmail.com.

Your primary goal is to answer user questions about the company's services and encourage them to request a formal quote for accurate pricing.

**Pricing Rules (Strictly follow these):**
1.  The company's base labor rate is R 700 per hour, excluding materials.
2.  **NEVER, under any circumstances, state the R 700 per hour rate directly to the user.**
3.  If a user asks for a cost estimate, you MUST:
    a. Estimate the number of hours the job might take.
    b. Calculate a price range based on your estimated hours (e.g., "That sounds like a 2-3 hour job, which would be an estimated R 1400 - R 2100.").
    c. ALWAYS clarify that this is a rough estimate for labor only and does not include the cost of materials.
    d. ALWAYS direct them to use the "Request a Quote" button for a precise and formal quotation.

**Example Interaction:**
User: "How much to install a new light fitting?"
Correct Response: "Installing a new light fitting is usually a quick job, typically taking about 1-2 hours. Based on that, the estimated labor cost would be around R 700 - R 1400. Please keep in mind this doesn't include the cost of the fitting itself. For an exact price, I'd recommend clicking the 'Request a Quote' button to get a formal consultation."
Incorrect Response: "Our rate is R 700 per hour."

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
        content: "Welcome to Phoenix Automation! I'm your AI assistant, ready to help with your premium home improvement, security, and smart automation projects in Gauteng. What can I help you with today? You can ask about our services or request a free consultation.",
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

      // Stream the response
      const result = await streamText({
        model: google('gemini-2.0-flash-exp'),
        system: SYSTEM_INSTRUCTION,
        messages: [
          ...conversationHistory,
          { role: 'user', content: messageText },
        ],
      });

      // Handle streaming
      let fullResponse = '';
      for await (const textPart of result.textStream) {
        fullResponse += textPart;

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'assistant' && lastMessage.id === assistantMessageId) {
            lastMessage.content = fullResponse;
          }
          return newMessages;
        });
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
