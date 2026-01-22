import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Customer, StageConfig } from '../types';
import { THEME_STYLES } from '../constants';
import { CustomerCard } from './CustomerCard';

interface Props {
  stage: StageConfig;
  customers: Customer[];
  onCustomerClick: (customer: Customer) => void;
}

export const StageColumn: React.FC<Props> = ({ stage, customers, onCustomerClick }) => {
  const styles = THEME_STYLES[stage.colorTheme];

  return (
    <div className="flex flex-col h-full min-w-[300px] w-full snap-center bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
      {/* Header - Formal/Minimal */}
      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {/* Minimal Dot instead of gradient */}
            <div className={`w-2 h-2 rounded-full ${styles.dot}`}></div>
            <h3 className="font-semibold text-sm text-slate-800">
              {stage.label}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              {customers.length}
          </span>
      </div>

      {/* Customer List Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 bg-slate-50">
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