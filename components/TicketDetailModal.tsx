import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Customer, Ticket, TicketActivity } from '../types';
import { STAGES } from '../constants';
import { 
  X, Calendar, CheckCircle2, AlertCircle, Clock, 
  Mail, Phone, MessageSquare, FileText, CreditCard, 
  ArrowRight, ShieldAlert, Send, PhoneCall, MoreHorizontal
} from 'lucide-react';

interface Props {
  ticket: Ticket;
  customer: Customer;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<Props> = ({ ticket, customer, onClose }) => {
  if (!ticket) return null;

  // Helper for status colors
  const getStatusColor = () => {
    if (ticket.result === 'on_time') return 'emerald';
    if (ticket.daysDiff > 0) return 'rose';
    if (ticket.result === 'pending') return 'slate';
    return 'amber';
  };

  const statusColor = getStatusColor();

  const getStageLabel = () => {
    const stage = STAGES.find(s => s.id === ticket.resolutionStage);
    return stage ? stage.label : ticket.resolutionStage;
  };

  // Calculate Issue Date (approx 15 days before due date for this mock)
  const issueDate = new Date(ticket.dueDate);
  issueDate.setDate(issueDate.getDate() - 15);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Darker Backdrop for stacking */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
        />
        
        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* 1. Header Section */}
          <div className="bg-white border-b border-slate-200 p-6 shadow-sm z-10">
            <div className="flex justify-between items-start">
              
              {/* Left: Customer & Ticket Info */}
              <div className="flex items-center gap-4">
                 <img 
                    src={customer.avatarUrl} 
                    alt={customer.name} 
                    className="w-12 h-12 rounded-full border border-slate-200 shadow-sm"
                 />
                 <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">{customer.name}</h2>
                        <span className="text-slate-400 text-sm">•</span>
                        <span className="text-slate-500 text-sm font-medium">{customer.campaign}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-slate-700">{ticket.period}</span>
                        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                            ID: {ticket.id}
                        </span>
                    </div>
                 </div>
              </div>

              {/* Right: Actions & Close */}
              <div className="flex items-center gap-3">
                 <div className="flex flex-col items-end mr-4">
                     <div className={`
                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                        bg-${statusColor}-50 text-${statusColor}-700 border-${statusColor}-200
                     `}>
                        {ticket.result === 'on_time' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {ticket.result === 'late' && <Clock className="w-3.5 h-3.5" />}
                        {ticket.result === 'very_late' && <AlertCircle className="w-3.5 h-3.5" />}
                        {ticket.result === 'pending' && <Clock className="w-3.5 h-3.5" />}
                        
                        {ticket.result === 'on_time' ? 'Pagado a tiempo' : 
                         ticket.result === 'pending' ? 'Pendiente' : 
                         ticket.daysDiff > 15 ? 'Crítico' : 'Tardío'}
                     </div>
                     <span className="text-[10px] text-slate-400 font-medium mt-1">
                        Framework Final: {getStageLabel()}
                     </span>
                 </div>
                 
                 <button 
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                 >
                    <X className="w-6 h-6" />
                 </button>
              </div>
            </div>
          </div>

          {/* 2. Main Layout Grid */}
          <div className="flex-1 overflow-hidden flex bg-slate-50">
            
            {/* Left: Activity Timeline (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    Línea de Tiempo
                </h3>

                <div className="relative pl-4 space-y-8">
                    {/* Vertical Line */}
                    <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-slate-200 border-l border-dashed border-slate-300"></div>

                    {ticket.activities.map((activity, idx) => (
                        <TimelineEvent 
                            key={activity.id} 
                            activity={activity} 
                            isLast={idx === ticket.activities.length - 1} 
                        />
                    ))}
                    
                    {/* Start Marker */}
                    <div className="relative flex items-center gap-4 group">
                         <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center z-10 ml-[1.5px]">
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                         </div>
                         <div className="text-xs text-slate-400 font-medium">
                            Inicio del ciclo de facturación
                         </div>
                    </div>
                </div>
            </div>

            {/* Right: Summary Panel (Fixed Width) */}
            <div className="w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    Detalles del Ticket
                </h3>

                {/* Dates Card */}
                <div className="space-y-4 mb-8">
                    <DetailRow 
                        label="Fecha de Emisión" 
                        value={issueDate.toLocaleDateString()} 
                    />
                    <DetailRow 
                        label="Fecha Vencimiento" 
                        value={ticket.dueDate.toLocaleDateString()} 
                    />
                    <DetailRow 
                        label="Fecha de Pago" 
                        value={ticket.paidDate ? ticket.paidDate.toLocaleDateString() : '-'} 
                        highlight={!!ticket.paidDate}
                    />
                    <div className="pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">Días Diferencia</span>
                            <span className={`text-sm font-bold ${ticket.daysDiff > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {ticket.daysDiff > 0 ? `+${ticket.daysDiff} días` : `${ticket.daysDiff} días`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Provider Info */}
                <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                         <CreditCard className="w-3 h-3" />
                         Procesado vía <span className="font-semibold text-slate-700">{customer.provider}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                    <button className="w-full py-2 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Send className="w-3.5 h-3.5" /> Reenviar Factura
                    </button>
                    <button className="w-full py-2 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <PhoneCall className="w-3.5 h-3.5" /> Registrar Llamada
                    </button>
                    <button className="w-full py-2 px-4 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <ShieldAlert className="w-3.5 h-3.5" /> Escalar Caso
                    </button>
                </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const DetailRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
    <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">{label}</span>
        <span className={`text-sm font-medium ${highlight ? 'text-emerald-600' : 'text-slate-900'}`}>{value}</span>
    </div>
);

const TimelineEvent: React.FC<{ activity: TicketActivity; isLast: boolean }> = ({ activity, isLast }) => {
    
    const getIcon = () => {
        switch (activity.type) {
            case 'email': return <Mail className="w-3.5 h-3.5 text-blue-600" />;
            case 'sms': return <MessageSquare className="w-3.5 h-3.5 text-amber-600" />;
            case 'call': return <Phone className="w-3.5 h-3.5 text-purple-600" />;
            case 'payment': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
            case 'system': return <FileText className="w-3.5 h-3.5 text-slate-500" />;
            default: return <div className="w-2 h-2 rounded-full bg-slate-400" />;
        }
    };

    const getBgColor = () => {
        switch (activity.type) {
            case 'email': return 'bg-blue-50 border-blue-200';
            case 'sms': return 'bg-amber-50 border-amber-200';
            case 'call': return 'bg-purple-50 border-purple-200';
            case 'payment': return 'bg-emerald-50 border-emerald-200';
            case 'system': return 'bg-slate-50 border-slate-200';
            default: return 'bg-slate-100';
        }
    };

    return (
        <div className="relative flex gap-4 group">
            {/* Icon Bubble */}
            <div className={`
                w-7 h-7 rounded-full border flex items-center justify-center z-10 shrink-0
                ${getBgColor()} transition-transform group-hover:scale-110
            `}>
                {getIcon()}
            </div>

            {/* Content Card */}
            <div className="flex-1 pb-2">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        {activity.type}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                        {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {activity.date.toLocaleDateString()}
                    </span>
                </div>
                <div className="mt-1 bg-white border border-slate-200 rounded-lg p-3 shadow-sm group-hover:shadow-md transition-shadow">
                    <p className="text-sm text-slate-700 font-medium">
                        {activity.description}
                    </p>
                    {activity.user && (
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[8px] font-bold">
                                {activity.user.charAt(0)}
                            </div>
                            {activity.user}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};