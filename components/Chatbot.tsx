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
        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-black via-[#2c3e50] to-[#457B9D] text-white border-b border-white/20 relative overflow-hidden" style={{borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem'}}>
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#E63946]/20 via-transparent to-[#457B9D]/20 animate-pulse"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="relative">
              {/* Phoenix logo for AI Jannie */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#E63946] to-[#D62837] rounded-full opacity-50 blur-sm animate-pulse"></div>
              <div className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center p-1">
                <img 
                  src="/logo.png" 
                  alt="Phoenix Projects" 
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-xl tracking-[0.1em] bg-gradient-to-r from-white via-[#E63946] to-white bg-clip-text text-transparent animate-pulse">AI JANNIE</h3>
              <span className="text-xs text-gray-300">Phoenix Projects Advisor</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/20 hover:scale-110 transform relative z-10">
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50/30 to-white/90 backdrop-blur-sm relative chat-scrollbar">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, #457B9D 1px, transparent 0)', backgroundSize: '20px 20px'}}></div>
          <div className="space-y-4 relative z-10">
            {messages.map((msg, index) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-500`} style={{animationDelay: `${index * 100}ms`}}>
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-xs px-5 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#457B9D] to-[#2c3e50] text-white rounded-br-none border border-[#457B9D]/30'
                      : 'bg-gradient-to-br from-white to-gray-50 text-black rounded-bl-none border border-gray-200 shadow-[0_4px_15px_rgba(70,123,157,0.1)]'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap font-medium">{msg.content}</p>
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
              <div className="flex justify-start animate-in slide-in-from-left duration-500">
                 <div className="px-5 py-3 rounded-2xl bg-gradient-to-br from-white to-gray-50 text-black rounded-bl-none shadow-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <span className="w-2 h-2 bg-[#457B9D] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-2 h-2 bg-[#E63946] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-2 h-2 bg-[#457B9D] rounded-full animate-bounce"></span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">AI Jannie is thinking...</span>
                    </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200/50 bg-gradient-to-r from-white via-gray-50/80 to-white backdrop-blur-sm relative overflow-hidden" style={{borderBottomLeftRadius: '1.5rem', borderBottomRightRadius: '1.5rem'}}>
          {/* Subtle animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#457B9D]/5 via-transparent to-[#E63946]/5 animate-pulse"></div>
          {voiceError && (
            <div className="mb-3 p-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg text-red-700 text-xs shadow-sm animate-in slide-in-from-top duration-300">
              <span className="font-medium">⚠️ {voiceError}</span>
            </div>
          )}
          {isListening && (
            <div className="mb-3 p-3 bg-gradient-to-r from-[#457B9D]/10 to-[#E63946]/10 border border-[#457B9D]/30 rounded-lg text-[#2c3e50] text-xs flex items-center shadow-sm animate-pulse">
              <span className="mr-2 text-lg animate-bounce">🎤</span>
              <span className="font-medium">Listening... Speak now</span>
            </div>
          )}
          <form onSubmit={handleSend} className="flex items-center space-x-3 relative z-10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask AI Jannie anything..."}
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-[#457B9D] focus:border-[#457B9D] transition-all duration-300 outline-none shadow-sm hover:shadow-md bg-white/90 backdrop-blur-sm font-medium"
              disabled={isLoading || isListening}
            />
            {voiceSupported && (
              <button
                type="button"
                onClick={handleMicClick}
                disabled={isLoading}
                className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg ${
                  isListening
                    ? 'bg-gradient-to-br from-[#E63946] to-[#D62837] text-white hover:from-[#D62837] hover:to-[#C5252F] animate-pulse'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-[#2c3e50] hover:from-[#457B9D] hover:to-[#2c3e50] hover:text-white'
                } disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none`}
                aria-label={isListening ? 'Stop recording' : 'Start voice input'}
                title={isListening ? 'Click to stop' : 'Click to speak'}
              >
                {isListening ? <MicrophoneActiveIcon /> : <MicrophoneIcon />}
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !input.trim() || isListening}
              className="bg-gradient-to-br from-[#E63946] to-[#D62837] text-white p-4 rounded-full hover:from-[#D62837] hover:to-[#C5252F] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 disabled:transform-none animate-pulse disabled:animate-none"
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
