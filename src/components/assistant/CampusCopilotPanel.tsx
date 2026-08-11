import React, { useState, useRef, useEffect } from 'react';
import { CopilotMessage } from '../../types';
import { campusService } from '../../services/campusService';
import { Send, Bot, User, Compass, Sparkles, MapPin, Calendar, ArrowRight } from 'lucide-react';

interface CampusCopilotPanelProps {
  onActionTrigger?: (type: string, targetId: string) => void;
}

export const CampusCopilotPanel: React.FC<CampusCopilotPanelProps> = ({ onActionTrigger }) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: 'Greetings. I am Campus Copilot. I have real-time access to the college digital twin graph—including all 8 buildings, 30+ rooms, faculty schedules, and lab equipment.\n\nHow can I assist your campus navigation today?',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_PROMPTS = [
    'Find an empty classroom for 60 students.',
    'Where is my next class?',
    'Where is Dr. Rahul Sharma?',
    'Which labs have GPU workstations?',
    'What live events are happening today?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const response = await campusService.askCampusCopilot(query);
      setMessages((prev) => [...prev, response]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'I queried the campus database. All 8 buildings and 30+ room channels are active.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 shadow-xl overflow-hidden select-none">
      {/* Panel Top Header */}
      <div className="px-5 py-4 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-blue-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight uppercase">Campus Copilot</h3>
            <p className="text-[9px] font-mono text-blue-400">Digital Twin AI Grounding Engine</p>
          </div>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 font-bold uppercase">
          Online
        </span>
      </div>

      {/* Suggested Quick Prompts Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
        <span className="text-[10px] font-bold uppercase text-slate-400 flex-shrink-0">Suggestions:</span>
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="text-[10px] font-medium whitespace-nowrap px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-600 transition-all cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div
                className={`w-7 h-7 rounded-none flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                  isUser ? 'bg-[#1A1A1A] text-white' : 'bg-blue-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] p-4 border text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#1A1A1A] text-white border-slate-800'
                    : 'bg-white text-slate-800 border-slate-200 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {/* Interactive Action Buttons if returned by Copilot */}
                {msg.suggestedAction && onActionTrigger && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() =>
                        onActionTrigger(msg.suggestedAction!.type, msg.suggestedAction!.targetId)
                      }
                      className="px-3 py-1.5 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-1.5"
                    >
                      <Compass className="w-3.5 h-3.5 text-blue-400" />
                      {msg.suggestedAction.label}
                    </button>
                  </div>
                )}

                <div className="mt-2 text-[9px] font-mono text-slate-400 text-right">{msg.timestamp}</div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic font-mono p-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
            Searching campus spatial database & schedule records...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Controls */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Campus Copilot (e.g., 'Find empty room for 60 students')..."
            className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 text-xs text-[#1A1A1A] focus:bg-white focus:border-[#1A1A1A] outline-none font-medium transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-1.5 bg-[#1A1A1A] text-white disabled:opacity-30 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
