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
    onChatClosed,
    onChatOpened,
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
      onChatOpened();
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
    const wasOpen = isOpen;
    setIsOpen(!isOpen);

    if (!wasOpen) {
      // Opening chat
      onChatOpened();
    } else {
      // Closing chat - start re-engagement
      onChatClosed();
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
                  {isFirstVisit ? 'Welcome to Phoenix Projects!' : 'Welcome back!'}
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
          className={`bg-gradient-to-br from-[#E63946] to-[#D62837] text-white w-20 h-20 rounded-full shadow-2xl flex items-center justify-center hover:from-[#D62837] hover:to-[#C5252F] transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#E63946]/30 relative border-2 border-white/20 backdrop-blur-sm ${
            showNotification && !isOpen ? 'animate-[bounce_1s_ease-in-out_infinite]' : ''
          }`}
          style={{boxShadow: '0 25px 50px -12px rgba(230, 57, 70, 0.4), 0 0 0 1px rgba(255,255,255,0.1)'}}
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
        className={`fixed bottom-28 right-6 z-50 w-full max-w-md h-[65vh] bg-gradient-to-b from-white to-gray-50 border border-gray-200/50 shadow-2xl flex flex-col transition-all duration-500 ease-in-out backdrop-blur-xl ${
          isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
        }`}
        style={{ borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-black via-gray-900 to-black text-white border-b border-white/10" style={{borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem'}}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#E63946] to-[#D62837] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h3 className="font-bold text-xl tracking-[0.1em] bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">PHOENIX AI</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10">
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white/80 backdrop-blur-sm">
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
                  {msg.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div 
                      className="text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/^\s*\*\s+(.+)$/gm, '<li>$1</li>')
                          .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
                          .replace(/\n/g, '<br>')
                      }}
                    />
                  )}
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
        <div className="p-6 border-t border-gray-200/50 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm" style={{borderBottomLeftRadius: '1.5rem', borderBottomRightRadius: '1.5rem'}}>
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
              className="bg-gradient-to-r from-[#E63946] to-[#D62837] text-white p-4 rounded-full hover:from-[#D62837] hover:to-[#C5252F] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
