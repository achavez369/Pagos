import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Customer } from '../types';
import { THEME_STYLES } from '../constants';
import { Mail, Phone, MessageSquare, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface Props {
  customer: Customer;
  theme: keyof typeof THEME_STYLES;
  onClick: (customer: Customer) => void;
}

export const CustomerCard: React.FC<Props> = ({ customer, theme, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isPaid = customer.status === 'paid';
  
  // Use theme but muted
  const styles = THEME_STYLES[theme];

  // Helper to determine the icon based on the last activity text
  const getLastActivityIcon = (action: string) => {
    if (isPaid) return <CheckCircle2 className="w-3 h-3 text-emerald-600" />;
    
    const text = action.toLowerCase();
    const iconClass = "w-3 h-3 text-slate-400";

    if (text.includes('llamada') || text.includes('call')) return <Phone className={iconClass} />;
    if (text.includes('sms') || text.includes('message')) return <MessageSquare className={iconClass} />;
    if (text.includes('email') || text.includes('recordatorio') || text.includes('factura')) return <Mail className={iconClass} />;
    if (text.includes('fallido') || text.includes('failed')) return <AlertCircle className="w-3 h-3 text-rose-500" />;
    if (text.includes('promesa') || text.includes('acuerdo')) return <CheckCircle2 className={iconClass} />;
    return <Clock className={iconClass} />;
  };

  const getStatusText = () => {
    if (isPaid) return "Completado";
    if (customer.currentLag === 0) return "Vence hoy";
    if (customer.currentLag > 0) return `+${customer.currentLag}d tarde`;
    return `${Math.abs(customer.currentLag)}d restantes`;
  };

  const lastActivity = customer.history[customer.history.length - 1];
  const lastActivityText = lastActivity ? lastActivity.action : "Sin actividad";

  // Formal status colors
  const getStatusColorClass = () => {
    if (isPaid) return "text-emerald-600";
    if (customer.currentLag > 0) return "text-rose-600";
    if (customer.currentLag === 0) return "text-blue-600";
    return "text-slate-400";
  };

  return (
    <div className="relative z-10 w-full mb-2"> 
      <motion.div
        layoutId={customer.id}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={() => onClick(customer)}
        className={`
          relative group cursor-pointer 
          bg-white border border-slate-200 hover:border-slate-300
          rounded-md shadow-sm hover:shadow-md 
          p-3 flex flex-col gap-2
          transition-all duration-200 ease-out
          w-full select-none
          ${isPaid ? 'opacity-75' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header: Avatar & Name */}
        <div className="flex items-center gap-3">
            <div className="relative">
                <img 
                    src={customer.avatarUrl} 
                    alt={customer.name} 
                    className={`w-8 h-8 rounded-full object-cover border border-slate-100 ${isPaid ? 'grayscale' : ''}`}
                />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <h4 className={`text-sm font-semibold truncate text-slate-900`}>
                        {customer.name}
                    </h4>
                    <span className={`text-[10px] font-mono ${getStatusColorClass()}`}>
                        {getStatusText()}
                    </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                    {customer.campaign}
                </p>
            </div>
        </div>

        {/* Footer: Activity */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-50 mt-1">
             <div className="flex items-center justify-center w-4 h-4">
                {getLastActivityIcon(lastActivityText)}
             </div>
             
             <span className="text-[11px] text-slate-500 truncate flex-1">
                 {lastActivityText}
             </span>

             {isHovered && !isPaid && (
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
             )}
        </div>
      </motion.div>
    </div>
  );
};