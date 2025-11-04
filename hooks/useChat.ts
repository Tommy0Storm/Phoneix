import { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
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

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);

  const chat = useMemo(() => {
    return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
  }, [ai]);

  useEffect(() => {
    // Initial message from the bot
    setMessages([
      {
        role: 'model',
        parts: [{ text: "Welcome to Phoenix Automation! I'm your AI assistant, ready to help with your premium home improvement, security, and smart automation projects in Gauteng. What can I help you with today? You can ask about our services or request a free consultation." }],
      },
    ]);
  }, []);

  const sendMessage = async (messageText: string) => {
    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      role: 'user',
      parts: [{ text: messageText }],
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const stream = await chat.sendMessageStream({ message: messageText });
      
      let fullResponse = '';
      setMessages((prevMessages) => [...prevMessages, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].parts[0].text = fullResponse;
          return newMessages;
        });
      }

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(new Error(errorMessage));
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'model',
          parts: [{ text: `I'm sorry, I've encountered an error. Please try again later. Details: ${errorMessage}` }],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendMessage };
};