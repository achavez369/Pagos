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
    <div className="relative w-full h-full flex flex-col">
      {/* Visual Guide: Today Marker Line */}
      {/* We position this relative to the Payment Day column, but since it's a flex layout, 
          it's tricky to do absolute positioning globally. 
          Instead, we can style the Payment Day column specifically. */}

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex gap-3 px-6 min-w-max pb-4">
            {STAGES.map((stage) => {
                const stageCustomers = customers.filter(c => c.stage === stage.id);
                // Sort by lag (descending for urgency)
                stageCustomers.sort((a, b) => b.currentLag - a.currentLag);

                const isPaymentDay = stage.id === StageId.PAYMENT_DAY;

                return (
                    <div key={stage.id} className="relative flex items-start h-full pt-6">
                         {/* Today Marker Visuals for Payment Day column */}
                         {isPaymentDay && (
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
                                <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-indigo-500/30">
                                    HOY
                                </div>
                                <div className="w-px h-6 bg-indigo-600/30"></div>
                            </div>
                         )}

                         <div className={`
                            h-full relative transition-all duration-300
                            ${isPaymentDay ? 'scale-105 z-10 mx-2 shadow-2xl shadow-indigo-100 rounded-2xl' : 'scale-100 opacity-95'}
                         `}>
                            <StageColumn 
                                stage={stage} 
                                customers={stageCustomers} 
                                onCustomerClick={onCustomerClick}
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