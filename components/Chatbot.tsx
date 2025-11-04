import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useVisitorEngagement } from '../hooks/useVisitorEngagement';
import { ChatIcon, CloseIcon, SendIcon, MicrophoneIcon, MicrophoneActiveIcon } from './icons/ChatbotIcons';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice recognition
  const {
    isListening,
    transcript,
    isSupported: voiceSupported,
    startListening,
    stopListening,
    resetTranscript,
    error: voiceError,
  } = useVoiceRecognition();

  // Visitor engagement
  const {
    shouldAutoOpen,
    showNotification,
    showWelcomeTooltip,
    isFirstVisit,
    markInteraction,
    dismissTooltip,
  } = useVisitorEngagement();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Auto-send when voice recording stops and there's a transcript
  useEffect(() => {
    if (!isListening && transcript && transcript.trim()) {
      // Small delay to ensure transcript is complete
      const timer = setTimeout(() => {
        if (transcript.trim() && !isLoading) {
          sendMessage(transcript);
          setInput('');
          resetTranscript();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, isLoading]);

  // Auto-open chat for engagement
  useEffect(() => {
    if (shouldAutoOpen && !isOpen) {
      setIsOpen(true);
      markInteraction();
    }
  }, [shouldAutoOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !isListening) {
      sendMessage(input);
      setInput('');
      resetTranscript();
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleChatToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markInteraction();
    }
  };

  return (
    <>
      {/* Welcome Tooltip */}
      {showWelcomeTooltip && !isOpen && (
        <div className="fixed bottom-28 right-6 z-50 animate-bounce">
          <div className="bg-white border-2 border-[#E63946] rounded-lg shadow-2xl p-4 max-w-xs relative">
            <button
              onClick={dismissTooltip}
              className="absolute -top-2 -right-2 bg-[#E63946] text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-[#D62837] text-xs font-bold"
            >
              ×
            </button>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-3xl">👋</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">
                  {isFirstVisit ? 'Welcome to Phoenix Automation!' : 'Welcome back!'}
                </h4>
                <p className="text-sm text-gray-600">
                  {isFirstVisit
                    ? 'I can help you with instant quotes using real-time pricing! Click to chat or use voice input 🎤'
                    : 'Need a quote? I have access to real-time pricing and can use voice commands!'}
                </p>
              </div>
            </div>
            {/* Arrow pointing to button */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-[#E63946] transform rotate-45"></div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleChatToggle}
          className={`bg-[#E63946] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-[#D62837] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E63946] relative ${
            showNotification && !isOpen ? 'animate-[bounce_1s_ease-in-out_infinite]' : ''
          }`}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}

          {/* Notification Badge */}
          {showNotification && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-yellow-500 items-center justify-center text-xs font-bold text-white">
                !
              </span>
            </span>
          )}
        </button>
      </div>
      
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-full max-w-sm h-[60vh] bg-white border border-gray-200 shadow-xl flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        style={{ borderRadius: '1rem' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-black text-white" style={{borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem'}}>
          <h3 className="font-bold text-lg tracking-wider">Phoenix Assistant</h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-xs px-4 py-2 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-[#457B9D] text-white rounded-br-none'
                      : 'bg-gray-200 text-black rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="px-4 py-2 rounded-2xl bg-gray-200 text-black rounded-bl-none">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                    </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white" style={{borderBottomLeftRadius: '1rem', borderBottomRightRadius: '1rem'}}>
          {voiceError && (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
              {voiceError}
            </div>
          )}
          {isListening && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs flex items-center">
              <span className="mr-2">🎤</span>
              <span>Listening... Speak now</span>
            </div>
          )}
          <form onSubmit={handleSend} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask a question or use voice..."}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#457B9D] focus:border-[#457B9D] transition-shadow duration-200 outline-none"
              disabled={isLoading || isListening}
            />
            {voiceSupported && (
              <button
                type="button"
                onClick={handleMicClick}
                disabled={isLoading}
                className={`p-3 rounded-full transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                aria-label={isListening ? 'Stop recording' : 'Start voice input'}
                title={isListening ? 'Click to stop' : 'Click to speak'}
              >
                {isListening ? <MicrophoneActiveIcon /> : <MicrophoneIcon />}
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !input.trim() || isListening}
              className="bg-[#E63946] text-white p-3 rounded-full hover:bg-[#D62837] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
