
import React, { useState } from 'react';
import { CampaignsReport } from './CampaignsReport';
import { FrameworksReport } from './FrameworksReport';
import { OperationalReport } from './OperationalReport';
import { AdvancedReporting } from './AdvancedReporting';
import { Calendar, ChevronDown, Filter, Download, Zap, MessageSquare } from 'lucide-react';
import { ChatMessage } from './GlobalAIChat';

type ReportTab = 'campaigns' | 'frameworks' | 'operational' | 'advanced';

interface Props {
    chatHistory?: ChatMessage[];
    onOpenChat?: () => void;
}

export const ReportsHub: React.FC<Props> = ({ chatHistory = [], onOpenChat }) => {
  const [activeTab, setActiveTab] = useState<ReportTab>('campaigns');
  const [period, setPeriod] = useState('Este Mes');

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col bg-white font-sans text-slate-900">
      
      {/* 1. Module Header & Global Filters */}
      <header className="px-8 py-5 bg-white border-b border-slate-100 flex-none z-10">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    Reportes
                    {activeTab === 'advanced' && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide rounded border border-slate-200">
                            Knowledge Base
                        </span>
                    )}
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                    {activeTab === 'advanced' 
                        ? 'Historial de análisis y artefactos generados por IA.'
                        : 'Métricas de rendimiento unificadas y análisis de tendencias.'}
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                {activeTab === 'advanced' ? (
                     <button 
                        onClick={onOpenChat}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        <MessageSquare className="w-4 h-4" /> Abrir Chat IA
                    </button>
                ) : (
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <Download className="w-4 h-4" /> Exportar CSV
                    </button>
                )}
            </div>
        </div>

        <div className="flex items-center justify-between">
            {/* Navigation Tabs */}
            <div className="flex gap-1">
                <TabButton 
                    label="Campañas" 
                    isActive={activeTab === 'campaigns'} 
                    onClick={() => setActiveTab('campaigns')} 
                />
                <TabButton 
                    label="Efectividad Frameworks" 
                    isActive={activeTab === 'frameworks'} 
                    onClick={() => setActiveTab('frameworks')} 
                />
                <TabButton 
                    label="Operativo" 
                    isActive={activeTab === 'operational'} 
                    onClick={() => setActiveTab('operational')} 
                />
                 <TabButton 
                    label="Historial IA" 
                    isActive={activeTab === 'advanced'} 
                    onClick={() => setActiveTab('advanced')}
                    icon={<Zap className="w-3.5 h-3.5 mr-1" />}
                />
            </div>

            {/* Global Filters - Hide in Advanced Mode */}
            {activeTab !== 'advanced' && (
                <div className="flex items-center gap-3 animate-in fade-in duration-300">
                    <div className="h-4 w-px bg-slate-200 mx-2"></div>
                    
                    {/* Period Filter */}
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md text-slate-700 hover:border-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {period}
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {/* Status Filter */}
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md text-slate-700 hover:border-slate-300">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        Estado: Todos
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                </div>
            )}
        </div>
      </header>

      {/* 2. Content Area */}
      {/* Advanced has its own scroll/layout handling */}
      {activeTab === 'advanced' ? (
          <div className="flex-1 overflow-hidden bg-slate-50">
             <AdvancedReporting chatHistory={chatHistory} />
          </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-6 bg-slate-50">
            <div className="max-w-6xl mx-auto">
                {activeTab === 'campaigns' && <CampaignsReport />}
                {activeTab === 'frameworks' && <FrameworksReport />}
                {activeTab === 'operational' && <OperationalReport />}
            </div>
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; icon?: React.ReactNode }> = ({ label, isActive, onClick, icon }) => (
    <button
        onClick={onClick}
        className={`
            px-4 py-2 text-sm font-medium border-b-2 transition-all flex items-center
            ${isActive 
                ? 'border-indigo-600 text-indigo-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}
        `}
    >
        {icon}
        {label}
    </button>
);
