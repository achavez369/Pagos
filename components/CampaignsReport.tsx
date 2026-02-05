
import React, { useState } from 'react';
import { 
  MoreHorizontal, TrendingUp, TrendingDown, 
  Minus, Filter, Plus, Layers, AlertTriangle, 
  Play, Pause, CheckCircle2, ChevronDown, 
  Search, SlidersHorizontal, BookOpen
} from 'lucide-react';

// --- MOCK DATA ENRICHED ---
const CAMPAIGN_DATA = [
  {
    id: 'CAM-101',
    name: 'Upsell Q1 - Base Premium',
    startDate: '01 Mar 2024',
    status: 'active',
    playbook: 'Estrategia Core: Suscripción',
    frameworksCount: 3,
    totalLeads: 1248,
    progress: {
        preventive: 45, // %
        paymentDay: 15,
        postPayment: 30,
        escalation: 10
    },
    collectionRate: 62,
    riskScore: 35, // 0-100
    riskTrend: 'stable',
    owner: 'Admin'
  },
  {
    id: 'CAM-102',
    name: 'Suscripción Ene - Recurrente',
    startDate: '01 Ene 2024',
    status: 'active',
    playbook: 'Retención Preventiva',
    frameworksCount: 2,
    totalLeads: 980,
    progress: {
        preventive: 10, 
        paymentDay: 5,
        postPayment: 80, // High late
        escalation: 5
    },
    collectionRate: 81,
    riskScore: 12,
    riskTrend: 'improving',
    owner: 'Admin'
  },
  {
    id: 'CAM-103',
    name: 'Plan Anual - High Ticket',
    startDate: '15 Feb 2024',
    status: 'risk',
    playbook: 'Recuperación Agresiva',
    frameworksCount: 4,
    totalLeads: 340,
    progress: {
        preventive: 0, 
        paymentDay: 0,
        postPayment: 20,
        escalation: 80 // Critical
    },
    collectionRate: 45,
    riskScore: 88,
    riskTrend: 'worsening',
    owner: 'J. Perez'
  },
  {
    id: 'CAM-104',
    name: 'Préstamo Personal - Lote B',
    startDate: '10 Mar 2024',
    status: 'paused',
    playbook: 'Draft v2',
    frameworksCount: 1,
    totalLeads: 210,
    progress: {
        preventive: 100, 
        paymentDay: 0,
        postPayment: 0,
        escalation: 0
    },
    collectionRate: 0,
    riskScore: 0,
    riskTrend: 'stable',
    owner: 'Admin'
  },
  {
    id: 'CAM-105',
    name: 'Reactivación Churn 2023',
    startDate: '20 Mar 2024',
    status: 'finished',
    playbook: 'Win-back Promo',
    frameworksCount: 2,
    totalLeads: 5000,
    progress: {
        preventive: 0, 
        paymentDay: 0,
        postPayment: 10,
        escalation: 90
    },
    collectionRate: 12,
    riskScore: 95,
    riskTrend: 'stable',
    owner: 'M. Garcia'
  }
];

export const CampaignsReport: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. OPERATIONAL HEADER / TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          
          {/* Filters Area */}
          <div className="flex items-center gap-2 flex-wrap">
              <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar campaña..." 
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-64 transition-all"
                  />
              </div>
              
              <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

              <FilterDropdown label="Estado" />
              <FilterDropdown label="Playbook" />
              <FilterDropdown label="Riesgo" />
          </div>

          {/* Actions */}
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm shadow-indigo-200 transition-colors">
              <Plus className="w-4 h-4" />
              Crear Campaña
          </button>
      </div>

      {/* 2. CAMPAIGNS LIST (TABLE) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider items-center">
            <div className="col-span-3">Detalles de Campaña</div>
            <div className="col-span-2">Playbook / Estrategia</div>
            <div className="col-span-4">
                <div className="flex justify-between">
                    <span>Progreso Operativo</span>
                    <span className="text-[10px] normal-case text-slate-400 font-medium">Prev • Hoy • Post • Esc</span>
                </div>
            </div>
            <div className="col-span-2 text-right">Salud & Riesgo</div>
            <div className="col-span-1 text-center">Acciones</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
            {CAMPAIGN_DATA.map((camp) => (
                <div 
                    key={camp.id} 
                    className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-slate-50 transition-colors group"
                >
                    {/* COL 1: Info */}
                    <div className="col-span-3">
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full flex-none ${
                                camp.status === 'active' ? 'bg-emerald-500 animate-pulse' : 
                                camp.status === 'risk' ? 'bg-rose-500' :
                                camp.status === 'paused' ? 'bg-amber-400' : 'bg-slate-300'
                            }`}></div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer">{camp.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-slate-400 font-mono">{camp.id}</span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-xs text-slate-500">{camp.startDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COL 2: Playbook */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-sm font-medium text-slate-700 truncate" title={camp.playbook}>{camp.playbook}</span>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            {camp.frameworksCount} frameworks activos
                        </span>
                    </div>

                    {/* COL 3: Progress Stacked Bar */}
                    <div className="col-span-4 pr-6">
                        <div className="h-3 w-full flex rounded-full overflow-hidden bg-slate-100 border border-slate-200/50">
                            <div style={{ width: `${camp.progress.preventive}%` }} className="bg-emerald-400 h-full" title="Preventivo"></div>
                            <div style={{ width: `${camp.progress.paymentDay}%` }} className="bg-blue-500 h-full" title="Día de Pago"></div>
                            <div style={{ width: `${camp.progress.postPayment}%` }} className="bg-amber-400 h-full" title="Post-Pago"></div>
                            <div style={{ width: `${camp.progress.escalation}%` }} className="bg-rose-500 h-full" title="Escalación"></div>
                        </div>
                        <div className="flex justify-between mt-1.5 text-[10px] font-medium text-slate-400">
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {camp.progress.preventive}%
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {camp.progress.paymentDay}%
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> {camp.progress.postPayment}%
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> {camp.progress.escalation}%
                            </span>
                        </div>
                    </div>

                    {/* COL 4: Health & Risk */}
                    <div className="col-span-2 text-right flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">Recupero</span>
                            <span className="text-sm font-bold text-slate-900">{camp.collectionRate}%</span>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold border
                            ${camp.riskScore > 70 ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                              camp.riskScore > 30 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              'bg-emerald-50 text-emerald-700 border-emerald-100'}
                        `}>
                            {camp.riskTrend === 'worsening' && <TrendingUp className="w-3 h-3" />}
                            {camp.riskTrend === 'improving' && <TrendingDown className="w-3 h-3" />}
                            {camp.riskTrend === 'stable' && <Minus className="w-3 h-3" />}
                            Riesgo: {camp.riskScore}
                        </div>
                    </div>

                    {/* COL 5: Actions */}
                    <div className="col-span-1 flex justify-center">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                </div>
            ))}
        </div>
        
        {/* Footer/Pagination */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
            <span>Mostrando {CAMPAIGN_DATA.length} campañas activas</span>
            <div className="flex gap-2">
                <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50">Anterior</button>
                <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100">Siguiente</button>
            </div>
        </div>

      </div>
    </div>
  );
};

// Helper Component for Filters
const FilterDropdown: React.FC<{ label: string }> = ({ label }) => (
    <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all">
        {label}
        <ChevronDown className="w-3 h-3 text-slate-400" />
    </button>
);
