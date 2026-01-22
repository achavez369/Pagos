
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Zap, MessageSquare, Send, Sparkles, Bot, User, 
  X, Maximize2, Minimize2, ChevronDown, Terminal, 
  Copy, BarChart3, ArrowRight, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types (Reused for consistency) ---
type MessageType = 'text' | 'chart' | 'playbook_draft' | 'email_draft';

interface MessageContent {
  text: string;
  chartData?: { labels: string[]; values: number[] };
  playbookData?: { title: string; steps: string[] };
  emailData?: { subject: string; body: string };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  type: MessageType;
  content: MessageContent;
  cost?: number;
  timestamp: Date;
}

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  tokenBalance: number;
  onSpendTokens: (amount: number) => void;
  onNewMessage: (msg: ChatMessage) => void; // To sync with Advanced Reports
}

export const GlobalAIChat: React.FC<Props> = ({ 
    isOpen, onToggle, tokenBalance, onSpendTokens, onNewMessage 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
      {
          id: 'welcome',
          role: 'ai',
          type: 'text',
          content: { text: 'Hola. Soy tu estratega IA. Puedo analizar datos, redactar playbooks o sugerir acciones. ¿En qué trabajamos hoy?' },
          timestamp: new Date()
      }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  // Cost Calculation
  const estimatedCost = useMemo(() => {
    if (!input.trim()) return 0;
    const complexity = input.length > 50 ? 10 : 5;
    const typeCost = input.toLowerCase().includes('playbook') || input.toLowerCase().includes('email') ? 20 : 0;
    return 5 + complexity + typeCost;
  }, [input]);

  const handleSendMessage = async () => {
      if (!input.trim() || tokenBalance < estimatedCost) return;

      const userText = input;
      const cost = estimatedCost;
      setInput('');
      
      onSpendTokens(cost);

      const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          type: 'text',
          content: { text: userText },
          cost,
          timestamp: new Date()
      };

      setMessages(prev => [...prev, userMsg]);
      onNewMessage(userMsg); // Sync to history
      setIsTyping(true);

      // Simulate Response
      setTimeout(() => {
          const aiResponse = generateMockResponse(userText);
          setMessages(prev => [...prev, aiResponse]);
          onNewMessage(aiResponse); // Sync to history
          setIsTyping(false);
      }, 2000);
  };

  const generateMockResponse = (query: string): ChatMessage => {
      const q = query.toLowerCase();
      let type: MessageType = 'text';
      let content: MessageContent = { text: 'He procesado tu solicitud.' };

      if (q.includes('playbook') || q.includes('estrategia')) {
          type = 'playbook_draft';
          content = {
              text: 'He diseñado una propuesta basada en los patrones recientes.',
              playbookData: {
                  title: 'Recuperación Preventiva',
                  steps: ['Email Educativo (-5d)', 'SMS Soft Nudge (-2d)', 'WhatsApp Interactivo (0d)']
              }
          };
      } else if (q.includes('email') || q.includes('redacta')) {
          type = 'email_draft';
          content = {
              text: 'Borrador optimizado para conversión:',
              emailData: {
                  subject: 'Aviso: Tu servicio requiere atención',
                  body: 'Hola {nombre}, para asegurar la continuidad...'
              }
          };
      } else if (q.includes('grafico') || q.includes('analiza')) {
          type = 'chart';
          content = {
              text: 'Aquí tienes la tendencia solicitada:',
              chartData: {
                  labels: ['Sem 1', 'Sem 2', 'Sem 3'],
                  values: [45, 60, 55]
              }
          };
      } else {
          content.text = `Entendido. Basado en tu consulta "${query}", sugiero revisar el segmento de riesgo medio, donde la tasa de respuesta ha caído un 3%.`;
      }

      return {
          id: Date.now().toString(),
          role: 'ai',
          type,
          content,
          timestamp: new Date()
      };
  };

  return (
    <>
        {/* Floating Button */}
        <AnimatePresence>
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={onToggle}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group border border-slate-700"
                >
                    <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                </motion.button>
            )}
        </AnimatePresence>

        {/* Chat Interface */}
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-slate-900 px-4 py-3 flex justify-between items-center text-white flex-none">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-500 rounded-lg">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold">AI Strategist</h3>
                                <div className="flex items-center gap-1 text-[10px] text-slate-300">
                                    <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    {tokenBalance} tokens
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={onToggle} className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors">
                                <Minimize2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'ai' && (
                                    <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center flex-none mt-1">
                                        <Sparkles className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                
                                <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`
                                        p-3 rounded-2xl text-xs leading-relaxed shadow-sm
                                        ${msg.role === 'user' ? 'bg-white border border-slate-200 text-slate-800 rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}
                                    `}>
                                        <p>{msg.content.text}</p>
                                        
                                        {/* Artifacts */}
                                        {msg.type === 'playbook_draft' && (
                                            <div className="mt-2 bg-indigo-50 p-2 rounded border border-indigo-100">
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 mb-1 uppercase">
                                                    <Terminal className="w-3 h-3" /> Playbook
                                                </div>
                                                <div className="text-[10px] text-slate-600 font-bold">{msg.content.playbookData?.title}</div>
                                            </div>
                                        )}
                                        {msg.type === 'chart' && (
                                            <div className="mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                                                <div className="flex items-end gap-1 h-12 w-full pb-1 border-b border-slate-200">
                                                    {(msg.content.chartData?.values || []).map((v, i) => (
                                                        <div key={i} className="flex-1 bg-indigo-400 rounded-t" style={{ height: `${v}%` }}></div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {msg.cost && (
                                        <span className="text-[9px] text-slate-400 font-medium flex items-center gap-0.5">
                                            <Zap className="w-2.5 h-2.5" /> -{msg.cost}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center flex-none mt-1">
                                    <Sparkles className="w-3 h-3 text-white animate-pulse" />
                                </div>
                                <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-1">
                                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-100">
                        <div className="relative">
                            <input 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Escribe tu consulta..."
                                className="w-full pl-3 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-100 outline-none"
                            />
                            <button 
                                onClick={handleSendMessage}
                                disabled={!input.trim() || tokenBalance < estimatedCost}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="flex justify-between items-center mt-2 px-1">
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Shield className="w-2.5 h-2.5" /> Privado
                            </span>
                            <AnimatePresence>
                                {estimatedCost > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${tokenBalance >= estimatedCost ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}
                                    >
                                        <Zap className="w-3 h-3" /> {estimatedCost}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    </>
  );
};
