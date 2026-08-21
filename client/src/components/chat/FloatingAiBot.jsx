import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  HeartPulse,
  Sparkles,
  RefreshCw,
  Minus,
} from 'lucide-react';
import api from '../../services/api';
import Button from '../ui/Button';

const defaultSuggested = [
  'How to lower high LDL cholesterol?',
  'What causes throbbing tension headaches?',
  'Explain fasting glucose normal ranges',
  'What to do for acute acid reflux?',
];

const FloatingAiBot = ({ onEmergencyTrigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi there! I am **MediCare AI**, your clinical assistant. Feel free to ask medical questions, describe symptoms, or get advice on reading lab reports.',
      suggestedQuestions: defaultSuggested,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
      });

      if (res.data.success) {
        const aiData = res.data.data;
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: aiData.message,
            suggestedQuestions: aiData.suggestedQuestions || [],
            isEmergency: aiData.isEmergency,
          },
        ]);

        if (aiData.isEmergency && onEmergencyTrigger) {
          onEmergencyTrigger(aiData.emergencyGuidance);
        }
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'I apologize, but I could not connect to the medical assistant service. Please try again.',
          suggestedQuestions: defaultSuggested,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3.5 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-400 text-white font-bold text-sm shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 border border-white/20 transition-all"
        >
          <div className="relative">
            <HeartPulse className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
          </div>
          <span className="hidden sm:inline">AI Medical Assistant</span>
          <span className="sm:hidden">AI Bot</span>
        </motion.button>
      </div>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[92vw] sm:w-[420px] h-[540px] glass-card rounded-3xl shadow-2xl z-50 flex flex-col border border-sky-500/30 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-sm">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white">MediCare AI Assistant</h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Free Help
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Ask health & lab questions 24/7</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setMessages([
                      {
                        role: 'assistant',
                        content:
                          'Hi there! I am **MediCare AI**, your clinical assistant. Feel free to ask medical questions, describe symptoms, or get advice on reading lab reports.',
                        suggestedQuestions: defaultSuggested,
                      },
                    ])
                  }
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Reset Chat"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div
                    className={`flex items-start gap-2 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-sky-500 text-white rounded-tr-sm'
                          : msg.isEmergency
                          ? 'bg-red-950 border border-red-500 text-red-200 rounded-tl-sm'
                          : 'bg-slate-100 dark:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>

                  {msg.role === 'assistant' &&
                    msg.suggestedQuestions &&
                    msg.suggestedQuestions.length > 0 &&
                    idx === messages.length - 1 && (
                      <div className="pl-8 flex flex-wrap gap-1">
                        {msg.suggestedQuestions.slice(0, 3).map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-all text-left"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 pl-8">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask health question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!input.trim() || isLoading}
                loading={isLoading}
                icon={Send}
              >
                Send
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAiBot;
