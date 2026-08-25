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
        'Hello. I am **MediCare AI**, your clinical health assistant. Ask any questions regarding symptoms, lab biomarkers, dietary modifications, or self-care protocols.',
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
          content: 'I apologize, but I could not connect to the clinical service. Please verify your connection and try again.',
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
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0b5755] hover:bg-[#084744] dark:bg-[#102629] dark:hover:bg-[#153438] text-white border border-[#3d8b72]/40 dark:border-[#1c4246] shadow-elevation transition-all cursor-pointer select-none"
        >
          <div className="relative flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-[#83c4b8]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#4aa497] rounded-full border-2 border-[#0b5755] dark:border-[#102629] animate-pulse" />
          </div>
          <span className="hidden sm:inline font-semibold text-xs tracking-tight">AI Clinical Assistant</span>
          <span className="sm:hidden font-semibold text-xs">AI Bot</span>
        </motion.button>
      </div>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 w-[92vw] sm:w-[430px] h-[560px] bg-white dark:bg-[#102629] border border-[#d6e4df] dark:border-[#1c4246] rounded-3xl shadow-elevation z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-[#f8faf8] dark:bg-[#0c1e20] border-b border-[#e2ebe7] dark:border-[#1c4246] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0b5755] dark:bg-[#4aa497] text-white dark:text-[#091617] flex items-center justify-center shadow-subtle">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-[#122b2e] dark:text-white">MediCare AI</h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-[#dcefe9] text-[#0b5755] dark:bg-[#173b3f] dark:text-[#83c4b8] border border-[#b8ded5] dark:border-[#2c5f64]">
                      Online
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6b8582] dark:text-[#7e9d97]">Symptom triage & lab explanations</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setMessages([
                      {
                        role: 'assistant',
                        content:
                          'Hello. I am **MediCare AI**, your clinical health assistant. Ask any questions regarding symptoms, lab biomarkers, dietary modifications, or self-care protocols.',
                        suggestedQuestions: defaultSuggested,
                      },
                    ])
                  }
                  className="p-1.5 rounded-lg text-[#6b8582] hover:text-[#122b2e] dark:text-[#7e9d97] dark:hover:text-white hover:bg-[#e9f1ed] dark:hover:bg-[#143236] transition-colors"
                  title="Reset Chat"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-[#6b8582] hover:text-[#122b2e] dark:text-[#7e9d97] dark:hover:text-white hover:bg-[#e9f1ed] dark:hover:bg-[#143236] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fbfcfa] dark:bg-[#091617]">
              {messages.map((msg, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div
                    className={`flex items-start gap-2 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-lg bg-[#dcefe9] dark:bg-[#173b3f] text-[#0b5755] dark:text-[#83c4b8] flex items-center justify-center shrink-0 mt-0.5 border border-[#b8ded5] dark:border-[#2c5f64]">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap shadow-subtle ${
                        msg.role === 'user'
                          ? 'bg-[#0b5755] text-white rounded-tr-sm'
                          : msg.isEmergency
                          ? 'bg-[#fef2f2] border border-red-400 text-[#991b1b] dark:bg-[#451010] dark:text-[#fca5a5] rounded-tl-sm'
                          : 'bg-white dark:bg-[#102629] text-[#122b2e] dark:text-[#edf7f3] border border-[#e2ebe7] dark:border-[#1c4246] rounded-tl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>

                  {msg.role === 'assistant' &&
                    msg.suggestedQuestions &&
                    msg.suggestedQuestions.length > 0 &&
                    idx === messages.length - 1 && (
                      <div className="pl-8 flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedQuestions.slice(0, 3).map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#f3f7f5] dark:bg-[#143236] text-[#0b5755] dark:text-[#83c4b8] border border-[#d7e4e0] dark:border-[#1c4246] hover:bg-[#dcefe9] dark:hover:bg-[#173b3f] transition-all text-left"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#6b8582] pl-8">
                  <div className="w-2 h-2 rounded-full bg-[#4aa497] animate-ping" />
                  <span>Synthesizing clinical response...</span>
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
              className="p-3 bg-white dark:bg-[#102629] border-t border-[#e2ebe7] dark:border-[#1c4246] flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask health or lab question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 rounded-xl text-xs border border-[#d6e4df] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#091617] px-3.5 py-2.5 text-[#122b2e] dark:text-[#edf7f3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
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
