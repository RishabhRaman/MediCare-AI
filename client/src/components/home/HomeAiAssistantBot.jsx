import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  HeartPulse,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import api from '../../services/api';
import Button from '../ui/Button';

const defaultSuggested = [
  'How do I lower high LDL cholesterol with diet?',
  'What causes throbbing tension headaches?',
  'Explain fasting blood glucose normal ranges',
  'What home recovery steps help acid reflux?',
];

const HomeAiAssistantBot = ({ onEmergencyTrigger }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello. I am **MediCare AI**, your clinical assistant. You can ask me anything about lab test results, symptom recovery protocols, medical terminology, or lifestyle modifications.',
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
          content: 'I apologize, but I encountered a momentary connection issue. Please submit your question again.',
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
          'Hello. I am **MediCare AI**, your clinical assistant. You can ask me anything about lab test results, symptom recovery protocols, medical terminology, or lifestyle modifications.',
        suggestedQuestions: defaultSuggested,
      },
    ]);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-elevation flex flex-col h-[600px] max-w-4xl mx-auto border border-[#e2ebe7] dark:border-[#1c4246]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e2ebe7] dark:border-[#1c4246]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0b5755] dark:bg-[#4aa497] text-white dark:text-[#091617] flex items-center justify-center shadow-subtle">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-serif-heading text-[#122b2e] dark:text-white">
                MediCare AI Clinical Assistant
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#eaf5f0] text-[#1c644d] dark:bg-[#13382c] dark:text-[#86e2bf] border border-[#c0e6d6] dark:border-[#1f5c49]">
                Online • Free Access
              </span>
            </div>
            <p className="text-xs text-[#6b8582] dark:text-[#7e9d97]">
              Symptom triage, biomarker explanations & evidence-informed recovery steps
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="text-xs text-[#6b8582] hover:text-[#122b2e] dark:text-[#7e9d97] dark:hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-[#f3f7f5] dark:hover:bg-[#143236] transition-colors border border-transparent hover:border-[#d6e4df] dark:hover:border-[#1c4246]"
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
                <div className="w-7 h-7 rounded-lg bg-[#dcefe9] dark:bg-[#173b3f] text-[#0b5755] dark:text-[#83c4b8] flex items-center justify-center shrink-0 mt-1 border border-[#b8ded5] dark:border-[#2c5f64]">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#0b5755] text-white rounded-tr-sm shadow-subtle'
                    : msg.isEmergency
                    ? 'bg-[#fef2f2] border border-red-400 text-[#991b1b] dark:bg-[#451010] dark:text-[#fca5a5] rounded-tl-sm shadow-glow-red'
                    : 'bg-[#f8faf8] dark:bg-[#0c1e20] border border-[#e2ebe7] dark:border-[#1c4246] text-[#122b2e] dark:text-[#edf7f3] rounded-tl-sm shadow-subtle'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#f3f7f5] dark:bg-[#143236] text-[#425b59] dark:text-[#b4cbc6] flex items-center justify-center shrink-0 mt-1 border border-[#d7e4e0] dark:border-[#1c4246]">
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
                    className="px-3 py-1.5 rounded-xl text-[11px] font-medium bg-white dark:bg-[#102629] text-[#0b5755] dark:text-[#83c4b8] border border-[#d6e4df] dark:border-[#1c4246] hover:bg-[#dcefe9] dark:hover:bg-[#173b3f] transition-all text-left shadow-subtle cursor-pointer"
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
            <div className="w-7 h-7 rounded-lg bg-[#dcefe9] dark:bg-[#173b3f] text-[#0b5755] dark:text-[#83c4b8] flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#f8faf8] dark:bg-[#0c1e20] border border-[#e2ebe7] dark:border-[#1c4246] rounded-2xl rounded-tl-sm p-3.5 text-xs text-[#6b8582] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4aa497] animate-ping" />
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
        className="pt-3 border-t border-[#e2ebe7] dark:border-[#1c4246] flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask a medical question, describe symptoms, or ask about a lab marker..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-white dark:bg-[#091617] px-4 py-3 text-[#122b2e] dark:text-[#edf7f3] placeholder-[#7e9d97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!input.trim() || isLoading}
          loading={isLoading}
          icon={Send}
        >
          Ask Assistant
        </Button>
      </form>
    </div>
  );
};

export default HomeAiAssistantBot;
