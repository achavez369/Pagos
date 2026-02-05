
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Customer, Ticket, StageId, TicketActivity } from '../types';
import { STAGES } from '../constants';
import { 
  X, Calendar, Clock, CheckCircle2, 
  CreditCard, FileText, ArrowUpRight, 
  ChevronRight, LayoutGrid, ArrowLeft,
  AlertTriangle, Shield, TrendingUp,
  MoreHorizontal
} from 'lucide-react';
import { TicketDetailModal } from './TicketDetailModal';

interface Props {
  customer: Customer | null;
  onClose: () => void;
  breadcrumbContext?: string;
}

export const CustomerDetailModal: React.FC<Props> = ({ customer, onClose, breadcrumbContext = "Mapa de Compromisos" }) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  if (!customer) return null;

  // Compute Stats
  const totalTickets = customer.tickets.length;
  const paidTickets = customer.tickets.filter(t => t.status === 'paid');
  const onTimeTickets = paidTickets.filter(t => t.result === 'on_time');
  const onTimePercentage = paidTickets.length > 0 
    ? Math.round((onTimeTickets.length / paidTickets.length) * 100) 
    : 0;
  
  const lateTickets = paidTickets.filter(t => t.daysDiff > 0);
  const avgDelay = lateTickets.length > 0
    ? Math.round(lateTickets.reduce((acc, t) => acc + t.daysDiff, 0) / lateTickets.length)
    : 0;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="h-full overflow-y-auto bg-slate-50 flex flex-col font-sans text-slate-900 custom-scrollbar relative z-10"
      >
        {/* --- 1. Top Section: Header & Identity --- */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 shadow-sm sticky top-0 z-20">
          <div className="max-w-[1600px] mx-auto w-full">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4 select-none">
                <button 
                  onClick={onClose}
                  className="hover:text-indigo-600 hover:underline decoration-indigo-200 underline-offset-4 transition-all flex items-center gap-1.5"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  {breadcrumbContext}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  {customer.name}
                </span>
            </nav>

            <div className="flex justify-between items-start">
              {/* Identity */}
              <div className="flex items-center gap-5">
                <div className="relative">
                    <img 
                        src={customer.avatarUrl} 
                        alt={customer.name} 
                        className="w-16 h-16 rounded-full border-2 border-white shadow-md ring-1 ring-slate-200"
                    />
                    <div className={`
                        absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center
                        ${customer.status === 'paid' ? 'bg-emerald-500' : 'bg-indigo-500'}
                    `}>
                        {customer.status === 'paid' ? <CheckCircle2 className="w-3 h-3 text-white" /> : <Clock className="w-3 h-3 text-white" />}
                    </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">{customer.name}</h1>
                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                    <span className="font-medium text-slate-700">{customer.campaign}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="font-mono text-slate-400">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
                        {customer.provider}
                     </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                  <button 
                    onClick={onClose}
                    className="px-3 py-2 text-slate-500 hover:bg-slate-100 font-medium rounded-lg transition-colors flex items-center gap-2 text-sm border border-transparent hover:border-slate-200"
                  >
                    <ArrowLeft className="w-4 h-4" /> 
                    <span className="hidden sm:inline">Volver</span>
                  </button>
                  <div className="h-6 w-px bg-slate-200 mx-1"></div>
                  <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg transition-colors shadow-sm">
                      Contactar
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 transition-colors">
                      Gestionar Cuenta
                  </button>
              </div>
            </div>
          </div>
        </header>

        {/* --- 2. Main Two-Column Layout --- */}
        <div className="flex-1 max-w-[1600px] mx-auto w-full p-8 flex items-start gap-8">
            
            {/* Left Sidebar: Context & Metrics (Sticky) */}
            <aside className="w-72 flex-none sticky top-28 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Métricas Clave</h3>
                
                <SidebarKpiCard 
                    label="Total Tickets" 
                    value={totalTickets.toString()} 
                    icon={<FileText className="w-4 h-4" />} 
                />
                
                <SidebarKpiCard 
                    label="Pago a tiempo" 
                    value={`${onTimePercentage}%`} 
                    icon={<CheckCircle2 className="w-4 h-4" />} 
                    trend="positive"
                />
                
                <SidebarKpiCard 
                    label="Retraso Promedio" 
                    value={`${avgDelay} días`} 
                    icon={<Clock className="w-4 h-4" />} 
                    trend={avgDelay > 5 ? 'negative' : 'neutral'}
                />

                <div className="pt-4 mt-4 border-t border-slate-200/60">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-3">Nivel de Riesgo</h3>
                     <div className={`
                        p-4 rounded-xl border flex items-center gap-4 shadow-sm
                        ${customer.riskScore > 70 ? 'bg-rose-50 border-rose-100' : 
                          customer.riskScore > 30 ? 'bg-amber-50 border-amber-100' : 
                          'bg-emerald-50 border-emerald-100'}
                     `}>
                        <div className={`
                            p-2 rounded-full 
                            ${customer.riskScore > 70 ? 'bg-rose-100 text-rose-600' : 
                              customer.riskScore > 30 ? 'bg-amber-100 text-amber-600' : 
                              'bg-emerald-100 text-emerald-600'}
                        `}>
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <span className={`text-sm font-bold block
                                ${customer.riskScore > 70 ? 'text-rose-700' : 
                                  customer.riskScore > 30 ? 'text-amber-700' : 
                                  'text-emerald-700'}
                            `}>
                                {customer.riskScore > 70 ? 'Alto' : customer.riskScore > 30 ? 'Medio' : 'Bajo'}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">Score: {customer.riskScore}/100</span>
                        </div>
                     </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60">
                    <button className="w-full py-2 px-3 text-xs font-medium text-slate-500 hover:text-indigo-600 bg-transparent hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-between group">
                        Ver análisis completo
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </aside>

            {/* Right Content: Ticket History Table */}
            <main className="flex-1 min-w-0">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">Historial de Facturación</h3>
                                <p className="text-xs text-slate-500">Transacciones y tickets generados</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                            <select className="text-xs border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-600 px-3 py-1.5 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer hover:bg-white hover:border-slate-300 transition-colors">
                                <option>Últimos 12 meses</option>
                                <option>Todo el historial</option>
                                <option>Solo impagos</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 w-16 text-center">#</th>
                                    <th className="px-6 py-3">Campaña</th>
                                    <th className="px-6 py-3">Vencimiento</th>
                                    <th className="px-6 py-3">Pagado El</th>
                                    <th className="px-6 py-3">Resultado</th>
                                    <th className="px-6 py-3">Playbook</th>
                                    <th className="px-6 py-3 text-right">Días</th>
                                    <th className="px-6 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {customer.tickets.map(ticket => (
                                    <TicketRow 
                                        key={ticket.id} 
                                        ticket={ticket} 
                                        onSelect={() => setSelectedTicket(ticket)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 flex justify-center text-xs text-slate-400 font-medium">
                    <p>Fin del historial de {customer.name}</p>
                </div>
            </main>
        </div>

      </motion.div>
      
      {/* Nested Modal for Ticket Detail (Stays as a modal for specific transaction focus) */}
      {selectedTicket && (
        <TicketDetailModal 
            ticket={selectedTicket} 
            customer={customer} 
            onClose={() => setSelectedTicket(null)} 
        />
      )}
    </>
  );
};

// Subcomponent: Compact Sidebar KPI Card
const SidebarKpiCard: React.FC<{ label: string; value: string; icon: React.ReactNode; trend?: 'positive' | 'negative' | 'neutral' }> = ({ label, value, icon, trend }) => {
    return (
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-colors cursor-default">
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{label}</span>
                <span className="text-xl font-bold text-slate-800 tabular-nums">{value}</span>
            </div>
            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${trend === 'positive' ? 'bg-emerald-50 text-emerald-600' : 
                  trend === 'negative' ? 'bg-rose-50 text-rose-600' : 
                  'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}
            `}>
                {icon}
            </div>
        </div>
    );
};

// Subcomponent: Ticket Row (Refined for Dense Table)
const TicketRow: React.FC<{ ticket: Ticket; onSelect: () => void }> = ({ ticket, onSelect }) => {
    // Helpers for badges
    const getResultBadge = (result: Ticket['result']) => {
        switch(result) {
            case 'on_time': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">A tiempo</span>;
            case 'late': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Tardío</span>;
            case 'very_late': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">Crítico</span>;
            case 'pending': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">Pendiente</span>;
        }
    };

    const getStageColor = (stageId: StageId) => {
        const stage = STAGES.find(s => s.id === stageId);
        if (!stage) return 'text-slate-500';
        return `text-${stage.colorTheme}-600`;
    };

    const getStageLabel = (stageId: StageId) => {
        const stage = STAGES.find(s => s.id === stageId);
        return stage ? stage.label : stageId;
    };

    return (
        <tr 
            onClick={onSelect}
            className="group cursor-pointer transition-colors hover:bg-slate-50 border-b border-transparent hover:border-slate-100"
        >
            <td className="px-6 py-4 text-center">
                 <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 group-hover:border-slate-300">
                    #{ticket.id.split('-')[1]}
                 </span>
            </td>
            <td className="px-6 py-4 font-semibold text-slate-900 capitalize">
                {ticket.period}
            </td>
            <td className="px-6 py-4 text-slate-500 tabular-nums">{ticket.dueDate.toLocaleDateString('es-ES')}</td>
            <td className="px-6 py-4 text-slate-700 font-medium tabular-nums">
                {ticket.paidDate ? ticket.paidDate.toLocaleDateString('es-ES') : <span className="text-slate-300">-</span>}
            </td>
            <td className="px-6 py-4">{getResultBadge(ticket.result)}</td>
            <td className="px-6 py-4">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-sm ${getStageColor(ticket.resolutionStage)}`}>
                    {getStageLabel(ticket.resolutionStage)}
                </span>
            </td>
            <td className={`px-6 py-4 text-right font-bold tabular-nums ${ticket.daysDiff > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {ticket.daysDiff > 0 ? `+${ticket.daysDiff}d` : `${ticket.daysDiff}d`}
            </td>
            <td className="px-6 py-4 text-right">
                <button className="text-slate-300 group-hover:text-indigo-600 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
};
