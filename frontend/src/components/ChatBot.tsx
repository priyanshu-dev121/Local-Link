import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export const ChatBot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hey! I'm LocalLink Assistant 👋 How can I help you find services near you?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { id: Date.now().toString(), text: input, sender: 'user' as const }];
    setMessages(newMessages);
    setInput('');
    
    // Mock bot response optimized for LocalLink marketplace
    setTimeout(() => {
      let botResponse = "I can help with that. Are you looking for plumbers, electricians, or cleaners?";
      const lowerInput = input.toLowerCase();
      let shouldNavigateToServices = false;
      
      if (lowerInput.includes('clean')) {
        botResponse = "We have highly rated cleaners in your neighborhood! Redirecting you to their profiles...";
        shouldNavigateToServices = true;
      }
      else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
        botResponse = "Prices vary by provider, but standard rates start at around $30/hr. Should I filter by your budget?";
      }
      else if (lowerInput.includes('book')) {
        botResponse = "To book a service, simply find a provider's profile and click 'Book Now'. Easy peasy!";
      }
      else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        botResponse = "Hello! What kind of service do you need today?";
      }
      else if (lowerInput.includes('plumb')) {
        botResponse = "Got a leak? Redirecting you to our active plumbers nearby...";
        shouldNavigateToServices = true;
      }
      
      setMessages(prev => [...prev, { id: Date.now().toString(), text: botResponse, sender: 'bot' }]);
      
      // Handle the redirection delay
      if (shouldNavigateToServices) {
        setTimeout(() => {
          setIsOpen(false);
          navigate('/services');
        }, 1500);
      }
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass flex flex-col w-[350px] h-[500px] mb-4 rounded-2xl overflow-hidden shadow-2xl border border-white/20"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/10 bg-secondary/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary animate-pulse-glow" />
                <h3 className="font-semibold text-white">LocalLink Assistant</h3>
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white rounded-full h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/40">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 text-sm shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-2xl rounded-br-sm' 
                      : 'bg-white/10 text-white rounded-2xl rounded-bl-sm border border-white/5 backdrop-blur-md'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-secondary/80">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about local services..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-primary h-10"
                />
                <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-white rounded-full shrink-0 shadow-card-hover h-10 w-10">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white shadow-card-hover border border-white/20 animate-pulse-glow"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};
