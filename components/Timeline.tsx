import React from 'react';
import { StageConfig, Customer, StageId } from '../types';
import { StageColumn } from './StageColumn';
import { STAGES } from '../constants';

interface Props {
  customers: Customer[];
  onCustomerClick: (customer: Customer) => void;
}

export const Timeline: React.FC<Props> = ({ customers, onCustomerClick }) => {
  return (
    <div className="relative w-full h-full flex flex-col bg-slate-50/50">
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
        <div className="h-full flex gap-6 px-8 min-w-max pb-6 items-start pt-12">
            {STAGES.map((stage) => {
                const stageCustomers = customers.filter(c => c.stage === stage.id);
                // Sort by lag (descending for urgency)
                stageCustomers.sort((a, b) => b.currentLag - a.currentLag);

                const isPaymentDay = stage.id === StageId.PAYMENT_DAY;

                return (
                    <div key={stage.id} className="relative flex flex-col h-full">
                         {/* Today Marker Visuals for Payment Day column */}
                         {isPaymentDay && (
                            <div className="absolute -top-10 left-0 right-0 flex flex-col items-center z-20 pointer-events-none">
                                <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-indigo-500/30 ring-4 ring-white">
                                    HOY
                                </div>
                                <div className="w-px h-4 bg-indigo-300"></div>
                                <div className="w-2 h-2 rounded-full bg-indigo-500 mb-[-4px]"></div>
                            </div>
                         )}

                         <div className={`
                            h-full relative transition-all duration-500 ease-out flex
                            ${isPaymentDay 
                                ? 'z-10 scale-100' 
                                : 'scale-[0.98] opacity-100'}
                         `}>
                            {/* Shadow/Ring layer for Payment Day */}
                            {isPaymentDay && (
                                <div className="absolute -inset-4 bg-gradient-to-b from-indigo-50/50 to-transparent rounded-3xl -z-10 pointer-events-none border border-indigo-100/50 dashed"></div>
                            )}

                            <StageColumn 
                                stage={stage} 
                                customers={stageCustomers} 
                                onCustomerClick={onCustomerClick}
                                isHighlighted={isPaymentDay}
                            />
                         </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};