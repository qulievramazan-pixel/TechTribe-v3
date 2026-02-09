import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../lib/api';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('techtribe_chat_session');
    if (stored) return stored;
    const id = 'chat_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('techtribe_chat_session', id);
    return id;
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await chatAPI.history(sessionId);
      if (res.data.messages.length > 0) {
        setMessages(res.data.messages);
      } else {
        setMessages([{
          id: 'welcome',
          sender: 'bot',
          content: 'Salam! TechTribe-a xoş gəlmisiniz. Sizə necə kömək edə bilərəm?',
          created_at: new Date().toISOString()
        }]);
      }
    } catch {
      setMessages([{
        id: 'welcome',
        sender: 'bot',
        content: 'Salam! TechTribe-a xoş gəlmisiniz. Sizə necə kömək edə bilərəm?',
        created_at: new Date().toISOString()
      }]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');

    const userMsg = { id: Date.now(), sender: 'user', content: text, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await chatAPI.send({ session_id: sessionId, message: text });
      const botMsg = { id: Date.now() + 1, sender: 'bot', content: res.data.reply, created_at: new Date().toISOString() };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'bot',
        content: 'Bağışlayın, texniki xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.',
        created_at: new Date().toISOString()
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6" style={{ zIndex: 9999 }} data-testid="chat-widget">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="absolute bottom-20 right-0 w-[400px] h-[560px] rounded-3xl overflow-hidden flex flex-col"
            style={{ background: 'rgba(5, 7, 16, 0.98)', border: '1px solid rgba(59,130,246,0.15)', boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.08)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">TechTribe Köməkçi</p>
                  <p className="text-xs text-muted-foreground">Hər zaman onlayn</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" data-testid="chat-close-btn">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-primary/20' : 'bg-white/5'}`}>
                      {msg.sender === 'user' ? <User className="w-3.5 h-3.5 text-primary" /> : <Bot className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                    <div className={msg.sender === 'user' ? 'chat-bubble-user px-4 py-2.5' : 'chat-bubble-bot px-4 py-2.5'}>
                      <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="chat-bubble-bot px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 border-t border-white/10">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2">
                <input
                  data-testid="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button
                  data-testid="chat-send-btn"
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2 rounded-lg bg-primary hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        data-testid="chat-toggle-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary hover:bg-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center transition-all duration-300"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
