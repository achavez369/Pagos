
import React from 'react';
import { 
  FileText, Sparkles, User, 
  Terminal, BarChart3, Clock, Zap
} from 'lucide-react';
import { ChatMessage } from './GlobalAIChat';

interface Props {
    chatHistory: ChatMessage[];
}

export const AdvancedReporting: React.FC<Props> = ({ chatHistory }) => {
  // Filter only meaningful messages (those with artifacts or AI responses)
  const artifacts = chatHistory.filter(m => 
      m.type !== 'text' || (m.role === 'ai' && m.content.text.length > 20)
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        
        {artifacts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                    <Sparkles className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">Historial Vacío</h3>
                <p className="text-sm max-w-md text-center">
                    Usa el chat de IA (botón flotante) para generar análisis, gráficos y playbooks. 
                    Tus resultados se archivarán aquí automáticamente.
                </p>
            </div>
        ) : (
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-5xl mx-auto space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Sesión Actual • Artefactos Generados</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {artifacts.map((msg) => (
                            <div key={msg.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg ${
                                            msg.type === 'chart' ? 'bg-emerald-50 text-emerald-600' :
                                            msg.type === 'playbook_draft' ? 'bg-indigo-50 text-indigo-600' :
                                            msg.type === 'email_draft' ? 'bg-amber-50 text-amber-600' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {msg.type === 'chart' && <BarChart3 className="w-4 h-4" />}
                                            {msg.type === 'playbook_draft' && <Terminal className="w-4 h-4" />}
                                            {msg.type === 'email_draft' && <FileText className="w-4 h-4" />}
                                            {msg.type === 'text' && <Sparkles className="w-4 h-4" />}
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 uppercase">
                                            {msg.type.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {msg.cost && (
                                             <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded" title="Costo Real">
                                                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                -{msg.cost}
                                             </div>
                                        )}
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-sm text-slate-700 leading-relaxed mb-4 line-clamp-3">
                                    {msg.content.text}
                                </div>

                                {/* Artifact Preview Snippets */}
                                {msg.type === 'playbook_draft' && msg.content.playbookData && (
                                    <div className="bg-slate-50 border border-slate-100 rounded p-3 text-xs font-mono">
                                        <div className="font-bold text-indigo-700 mb-1">{msg.content.playbookData.title}</div>
                                        <ul className="list-disc pl-4 text-slate-500">
                                            {msg.content.playbookData.steps.slice(0, 2).map((s, i) => (
                                                <li key={i}>{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {msg.type === 'email_draft' && msg.content.emailData && (
                                    <div className="bg-slate-50 border border-slate-100 rounded p-3 text-xs font-mono">
                                        <div className="text-slate-500 mb-1">Subject: {msg.content.emailData.subject}</div>
                                        <div className="text-slate-400 truncate">{msg.content.emailData.body}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
