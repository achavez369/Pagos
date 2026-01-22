import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Customer, StageConfig } from '../types';
import { THEME_STYLES } from '../constants';
import { CustomerCard } from './CustomerCard';

interface Props {
  stage: StageConfig;
  customers: Customer[];
  onCustomerClick: (customer: Customer) => void;
  isHighlighted?: boolean;
}

export const StageColumn: React.FC<Props> = ({ stage, customers, onCustomerClick, isHighlighted = false }) => {
  const styles = THEME_STYLES[stage.colorTheme];

  return (
    <div className={`
        flex flex-col h-full min-w-[320px] w-full snap-center rounded-xl overflow-hidden transition-all duration-300
        ${isHighlighted 
            ? 'bg-white border border-indigo-100 shadow-sm' 
            : 'bg-slate-50 border border-slate-200/60 opacity-60 grayscale-[0.3] hover:opacity-100 hover:grayscale-0'}
    `}>
      {/* Header - Formal/Minimal */}
      <div className={`
        p-4 border-b flex justify-between items-center sticky top-0 z-10 transition-colors
        ${isHighlighted ? 'bg-white border-indigo-50' : 'bg-slate-50 border-slate-200'}
      `}>
          <div className="flex items-center gap-2">
            {/* Minimal Dot instead of gradient */}
            <div className={`w-2 h-2 rounded-full ${styles.dot}`}></div>
            <h3 className={`font-bold text-sm ${isHighlighted ? 'text-slate-900' : 'text-slate-600'}`}>
              {stage.label}
            </h3>
          </div>
          <span className={`
            text-xs font-mono px-2 py-0.5 rounded-md
            ${isHighlighted ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 bg-slate-100'}
          `}>
              {customers.length}
          </span>
      </div>

      {/* Customer List Area */}
      <div className={`flex-1 overflow-y-auto no-scrollbar p-3 ${isHighlighted ? 'bg-slate-50/30' : 'bg-slate-50'}`}>
        <AnimatePresence mode='popLayout'>
          {customers.map((customer) => (
            <CustomerCard 
              key={customer.id} 
              customer={customer} 
              theme={stage.colorTheme} 
              onClick={onCustomerClick}
            />
          ))}
        </AnimatePresence>
        
        {customers.length === 0 && (
            <div className="h-32 flex flex-col items-center justify-center text-slate-400 opacity-50">
                <div className="w-12 h-1 border-t-2 border-dashed border-slate-300 mb-2"></div>
                <span className="text-xs">Sin actividad</span>
            </div>
        )}
      </div>
    </div>
  );
};