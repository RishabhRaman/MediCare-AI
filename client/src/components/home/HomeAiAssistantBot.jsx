import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Bot,
  User,
  AlertTriangle,
  HeartPulse,
  HelpCircle,
  Stethoscope,
  RefreshCw,
} from 'lucide-react';
import api from '../../services/api';
import Button from '../ui/Button';

const defaultSuggested = [
  'How do I lower high LDL cholesterol?',
  'What causes throbbing tension headaches?',
  'Explain my fasting blood glucose result',
  'What home care helps acute acid reflux?',
];

const HomeAiAssistantBot = ({ onEmergencyTrigger }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am **MediCare AI**, your free clinical assistant. Ask me anything about medical symptoms, lab test markers, dietary modifications, or self-care protocols.',
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
    scrollToBottom();
  }, [messages, isLoading]);

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
          content: 'I apologize, but I encountered a momentary connection issue. Please try your question again.',
          suggestedQuestions: defaultSuggested,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Hello! I am **MediCare AI**, your free clinical assistant. Ask me anything about medical symptoms, lab test markers, dietary modifications, or self-care protocols.',
        suggestedQuestions: defaultSuggested,
      },
    ]);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-sky-500/30 flex flex-col h-[580px] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                MediCare Free AI Assistant
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Online • Free Help
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instant clinical intelligence, symptom triage & lab explanations
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="text-xs text-slate-400 hover:text-sky-500 flex items-center gap-1 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Restart Conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="space-y-2">
            <div
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-1 border border-sky-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-sky-500 text-white rounded-tr-sm shadow-md'
                    : msg.isEmergency
                    ? 'bg-red-950/80 border border-red-500 text-red-100 rounded-tl-sm shadow-glow-red'
                    : 'bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Suggested Follow-up Quick Chips */}
            {msg.role === 'assistant' && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && idx === messages.length - 1 && (
              <div className="pl-9 flex flex-wrap gap-1.5 pt-1">
                {msg.suggestedQuestions.map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSendMessage(sug)}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-all text-left"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm p-4 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing clinical database & formulating response...</span>
            </div>
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
        className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask MediCare AI a medical question or describe symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!input.trim() || isLoading}
          loading={isLoading}
          icon={Send}
        >
          Ask Free AI
        </Button>
      </form>
    </div>
  );
};

export default HomeAiAssistantBot;
