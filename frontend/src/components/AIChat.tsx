import React, { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { ChatMessage, ChatResponse } from '../types/ai';
import { useMascotContext } from './MascotContext';
import aiIntegration from '../services/aiIntegrationService';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const { changeEmotion, changeState } = useMascotContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI financial assistant. I can analyze your actual spending data and provide personalized insights. Ask me about your finances, spending patterns, or get budgeting advice!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [contextualSuggestions, setContextualSuggestions] = useState<string[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateContextualSuggestions = async () => {
    try {
      const context = await aiIntegration.getFinancialContext();
      const suggestions = [];
      
      if (context.monthlySpending > 1000) {
        suggestions.push("How can I reduce my monthly spending?");
      }
      if (context.topCategory && context.topCategory !== 'Other') {
        suggestions.push(`Tell me more about my ${context.topCategory} expenses`);
      }
      if (context.trends.increasing) {
        suggestions.push("Why is my spending increasing?");
      }
      suggestions.push("Show me my financial insights");
      suggestions.push("What budgeting tips do you have?");
      
      setContextualSuggestions(suggestions.slice(0, 3)); // Show max 3 suggestions
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    }
  };

  useEffect(() => {
    // Set mascot to welcoming state when chat opens
    changeEmotion('happy');
    changeState('speaking');
    generateContextualSuggestions();
  }, []); // Generate initial suggestions

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Mascot starts thinking when processing message
    changeEmotion('thinking');
    changeState('listening');

    try {
      // Use our enhanced AI integration for context-aware responses
      const response = await aiIntegration.chatWithFinancialContext(inputMessage);
      
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Mascot reacts to successful response
      if (response.includes('great') || response.includes('excellent') || response.includes('good')) {
        changeEmotion('happy');
        changeState('celebrating');
      } else if (response.includes('careful') || response.includes('concerned') || response.includes('reduce')) {
        changeEmotion('concerned');
        changeState('warning');
      } else {
        changeEmotion('neutral');
        changeState('speaking');
      }
      
      // Generate contextual suggestions based on the conversation
      await generateContextualSuggestions();
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      changeEmotion('concerned');
      changeState('warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    // Auto-send the suggestion
    setTimeout(() => {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      const form = document.querySelector('form');
      if (form) form.dispatchEvent(event);
    }, 100);
  };

  return (
    <div className="flex flex-col h-full bg-p5-black border-comic border-4 border-p5-red rounded-comic shadow-p5-pop relative overflow-hidden font-comic">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-4 right-4 w-16 h-16 border-4 border-p5-yellow transform rotate-45 animate-float"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-p5-red transform -rotate-12 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-8 w-8 h-8 bg-p5-yellow transform rotate-45 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="bg-p5-red border-b-4 border-p5-yellow p-4 relative z-10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-p5-yellow border-comic border-4 border-p5-black rounded-full flex items-center justify-center mr-3 animate-float">
              <svg className="w-5 h-5 text-p5-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-p5-white uppercase tracking-widest drop-shadow">
                🤖 AI Financial Assistant
              </h3>
            </div>
          </div>
          <div className="text-p5-yellow font-bold text-xs uppercase bg-p5-black bg-opacity-50 px-2 py-1 rounded-comic border-comic border-2 border-p5-yellow">
            💡 Smart Chat
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md lg:max-w-2xl px-4 py-3 border-comic border-3 ${
                message.isUser
                  ? 'bg-p5-yellow text-p5-black border-p5-red rounded-comic shadow-p5-pop transform rotate-1 hover:rotate-0 transition-all'
                  : 'bg-p5-white text-p5-black border-p5-black rounded-comic shadow-p5-pop transform -rotate-1 hover:rotate-0 transition-all'
              }`}
            >
              <div className={`flex items-start gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 rounded-full border-comic border-2 flex items-center justify-center flex-shrink-0 ${
                  message.isUser 
                    ? 'bg-p5-red border-p5-black' 
                    : 'bg-p5-black border-p5-red'
                }`}>
                  {message.isUser ? (
                    <span className="text-p5-white font-bold text-xs">👤</span>
                  ) : (
                    <span className="text-p5-yellow font-bold text-xs">🤖</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className={`w-8 h-1 ${message.isUser ? 'bg-p5-red' : 'bg-p5-yellow'} transform skew-x-12`}></div>
                    <p className="text-xs font-bold opacity-75 uppercase tracking-wider">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-p5-black text-p5-yellow px-4 py-3 rounded-comic border-comic border-3 border-p5-yellow max-w-xs shadow-p5-pop transform -rotate-1">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-p5-yellow border-comic border-2 border-p5-black flex items-center justify-center">
                  <span className="text-p5-black font-bold text-xs">🤖</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-p5-yellow rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-p5-yellow rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-p5-yellow rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              <p className="text-xs font-bold mt-2 uppercase tracking-wider">AI is thinking...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Suggestions */}
      {contextualSuggestions.length > 0 && (
        <div className="border-t-4 border-p5-yellow p-3 bg-p5-gray bg-opacity-50 relative z-10 flex-shrink-0">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-p5-yellow border-comic border-2 border-p5-black rounded-comic flex items-center justify-center mr-2">
              <span className="text-p5-black font-bold text-xs">💡</span>
            </div>
            <p className="text-sm font-extrabold text-p5-white uppercase tracking-wider">Try asking:</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {contextualSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-p5-black text-p5-yellow px-3 py-1 rounded-comic border-comic border-2 border-p5-yellow hover:bg-p5-yellow hover:text-p5-black hover:border-p5-red transition-all duration-300 font-bold uppercase shadow-p5-pop"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t-4 border-p5-red p-4 bg-p5-black relative z-10 flex-shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-5 h-5 bg-p5-yellow border-comic border-2 border-p5-black rounded-comic flex items-center justify-center">
                  <span className="text-p5-black font-bold text-xs">💬</span>
                </div>
              </div>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your finances, spending patterns, or budgeting tips..."
                className="w-full pl-12 pr-3 py-3 bg-p5-white border-comic border-4 border-p5-yellow rounded-comic text-p5-black placeholder-gray-600 focus:outline-none focus:border-p5-red focus:ring-4 focus:ring-p5-red focus:ring-opacity-50 font-bold text-sm resize-none transition-all duration-300"
                disabled={isLoading}
                rows={2}
              />
            </div>
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-p5-red text-p5-white px-4 py-3 rounded-comic border-comic border-4 border-p5-yellow hover:bg-p5-yellow hover:text-p5-black hover:border-p5-red disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-p5-red disabled:hover:text-p5-white transition-all duration-300 font-extrabold uppercase shadow-p5-pop hover:scale-105 flex items-center"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </form>
        
        {/* Input Tips */}
        <div className="mt-2 bg-p5-gray bg-opacity-30 border-comic border-2 border-p5-yellow rounded-comic p-2">
          <div className="flex items-center space-x-2">
            <span className="text-p5-yellow text-xs">🎯</span>
            <p className="text-p5-white text-xs font-bold uppercase tracking-wider">
              Pro tip: I analyze your actual spending data to give personalized advice!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat; 