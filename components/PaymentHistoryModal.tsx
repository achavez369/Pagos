import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentRecord } from '../types';
import { X, CheckCircle2, CreditCard } from 'lucide-react';

interface Props {
  history: PaymentRecord[];
  onClose: () => void;
}

export const PaymentHistoryModal: React.FC<Props> = ({ history, onClose }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="bg-emerald-50 border-b border-emerald-100 p-6 flex justify-between items-center">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                     <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <div>
                    <h2 className="text-lg font-bold text-slate-900">Pagos Completados</h2>
                    <p className="text-xs text-emerald-700 font-medium">Historial reciente</p>
                 </div>
             </div>
             <button 
                onClick={onClose}
                className="p-2 hover:bg-emerald-100/50 rounded-full text-emerald-800 transition-colors"
             >
                <X className="w-5 h-5" />
             </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <CreditCard className="w-12 h-12 mb-2 opacity-20" />
                    <p className="text-sm">No hay pagos registrados aún en esta sesión.</p>
                </div>
            ) : (
                [...history].reverse().map((record) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={record.id}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl"
                    >
                        <div className="flex items-center gap-3">
                            <img src={record.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{record.customerName}</p>
                                <p className="text-[10px] text-slate-500 uppercase">{record.provider}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-sm font-bold text-emerald-600">Completado</p>
                             <p className="text-[10px] text-slate-400">{record.date.toLocaleTimeString()}</p>
                        </div>
                    </motion.div>
                ))
            )}
          </div>
          
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
             <button 
                onClick={onClose}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
             >
                 Cerrar
             </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};