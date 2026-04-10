import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, User, Bot, Search, Calendar, CreditCard, HelpCircle, Trash2, RotateCcw, Volume2, VolumeX, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import knowledgeData from '../data/chatbotKnowledge.json';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { id: 'plumbing', label: '🚰 Plumbing', query: 'I need a plumber' },
  { id: 'cleaning', label: '🧹 Cleaning', query: 'Find me a cleaner' },
  { id: 'electrical', label: '⚡ Electrical', query: 'Find an electrician' },
  { id: 'rates', label: '💰 Pricing/Rates', query: 'What are the charges?' },
  { id: 'booking', label: '📅 How to book?', query: 'How do I book?' }
];

export const ChatBot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAutoVoiceEnabled, setIsAutoVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {
        return [{ id: '1', text: "Greetings! I'm your LocalLink AI. Ready to help you discover the best services nearby.", sender: 'bot', timestamp: new Date() }];
      }
    }
    return [{ id: '1', text: "Greetings! I'm your LocalLink AI. Ready to help you discover the best services in your neighborhood.", sender: 'bot', timestamp: new Date() }];
  });
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateTicketId = () => {
    return 'LL-' + Math.floor(1000 + Math.random() * 9000);
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural')) && v.lang.startsWith('en')) || voices[0];
    if (naturalVoice) utterance.voice = naturalVoice;
    window.speechSynthesis.speak(utterance);
  };

  const clearChat = () => {
    const initialMsg: Message = { id: '1', text: "A fresh start! What can I help you find now?", sender: 'bot', timestamp: new Date() };
    setMessages([initialMsg]);
    localStorage.removeItem('chat_history');
    window.speechSynthesis.cancel();
  };

  const findBestResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    let bestMatch: any = null;

    for (const [intent, data] of Object.entries(knowledgeData.intents)) {
      if (intent === 'fallback') continue;
      if (data.keywords.some(keyword => lowerInput.includes(keyword))) {
        bestMatch = data;
        break;
      }
    }

    if (bestMatch) {
      const randomResponse = bestMatch.responses[Math.floor(Math.random() * bestMatch.responses.length)];
      return {
        text: randomResponse,
        action: bestMatch.action,
        target: bestMatch.target
      };
    } else {
      const ticketId = generateTicketId();
      const fallbackResponse = knowledgeData.intents.fallback.responses[0].replace('{{TICKET_ID}}', ticketId);
      return {
        text: fallbackResponse,
        action: null,
        target: null
      };
    }
  };

  const handleSend = (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;
    
    window.speechSynthesis.cancel();
    
    const userMessage: Message = { 
      id: Date.now().toString(), 
      text: textToSend, 
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    if (!textOverride) setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const result = findBestResponse(textToSend);
      
      const botMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        text: result.text, 
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      if (isAutoVoiceEnabled) {
        speak(result.text);
      }
      
      if (result.action === 'navigate' && result.target) {
        setTimeout(() => {
          setIsOpen(false);
          navigate(result.target);
        }, 2200);
      }
    }, 1300);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="flex flex-col w-[380px] h-[600px] mb-4 rounded-[2.5rem] overflow-hidden shadow-[0_30px_90px_-15px_rgba(0,0,0,0.6)] border border-white/10 relative group"
          >
            {/* Ultra-premium dark background */}
            <div className="absolute inset-0 bg-[#0a0a0c] -z-10">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px] animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-white/5 backdrop-blur-3xl bg-black/40">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/80 via-primary to-accent flex items-center justify-center shadow-[0_8px_25px_rgba(232,78,27,0.3)] relative z-10"
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-[2px] border-[#0a0a0c] rounded-full z-20 shadow-lg"></span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base tracking-tight">LocalLink AI</h3>
                  <div className="flex items-center gap-2 text-primary">
                    <span className="text-[9px] uppercase font-bold tracking-widest">Active Intelligence</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Toggle Auto-Speak"
                  className={`h-9 w-9 rounded-xl transition-all ${isAutoVoiceEnabled ? 'bg-primary/20 text-primary' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  onClick={() => {
                    setIsAutoVoiceEnabled(!isAutoVoiceEnabled);
                    if (isAutoVoiceEnabled) window.speechSynthesis.cancel();
                  }}
                >
                  {isAutoVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl" onClick={clearChat} title="Clear Chat">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[90%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xl border ${
                      msg.sender === 'user' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-white'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`flex flex-col group ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className="relative">
                        <div className={`px-6 py-4 text-[15px] shadow-2xl leading-relaxed backdrop-blur-md border ${
                          msg.sender === 'user' 
                            ? 'bg-primary/90 text-white rounded-3xl rounded-tr-none border-primary/20' 
                            : 'bg-white/5 text-gray-100 rounded-3xl rounded-tl-none border-white/10'
                        }`}>
                          {msg.text}
                        </div>
                        
                        <button
                          onClick={() => speak(msg.text)}
                          className={`absolute -right-2 top-0 translate-x-full h-8 w-8 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${msg.sender === 'user' ? 'left-[-40px] right-auto translate-x-0' : ''}`}
                          title="Speak this message"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-gray-400 hover:text-primary transition-colors" />
                        </button>
                      </div>
                      
                      <span className="text-[10px] text-gray-600 mt-2 font-semibold uppercase tracking-wider px-2">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 px-6 py-4 rounded-3xl rounded-tl-none border border-white/10 flex gap-2 backdrop-blur-md">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-4 bg-black/20 flex gap-3 overflow-x-auto no-scrollbar border-t border-white/5 backdrop-blur-3xl">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleSend(action.query)}
                  className="whitespace-nowrap px-5 py-2.5 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/50 rounded-2xl text-[13px] text-gray-400 font-semibold transition-all hover:-translate-y-1 active:scale-95 shadow-lg flex items-center gap-2"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-4">
                <div className="relative flex-1 group">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about local services..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary/50 h-14 px-6 rounded-2xl transition-all group-hover:bg-white/10 text-base"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <kbd className="text-[10px] bg-white/10 px-2 py-1 rounded border border-white/10 text-gray-500 font-bold uppercase tracking-tighter">Enter</kbd>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!input.trim() || isTyping}
                  className="bg-primary hover:bg-primary/90 text-white rounded-2xl shrink-0 h-14 w-14 transition-all shadow-2xl shadow-primary/30 active:scale-90 disabled:opacity-30 disabled:grayscale"
                >
                  <Send className="w-7 h-7" />
                </Button>
              </form>
              <div className="flex items-center justify-between mt-4 px-2">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">LocalLink Pro AI • v2.4</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Neural Engine Active</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.15, rotate: 12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-br from-primary via-primary to-accent rounded-[1.5rem] flex items-center justify-center text-white shadow-[0_15px_40px_rgba(232,78,27,0.4)] border border-white/40 animate-pulse-glow z-50 overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-full group-hover:translate-y-0"></div>
          <MessageCircle className="w-8 h-8 relative z-10" />
          <div className="absolute top-0 right-0 w-6 h-6 bg-red-600 border-[4px] border-[#0a0a0c] rounded-full z-20 shadow-2xl"></div>
        </motion.button>
      )}
    </div>
  );
};
