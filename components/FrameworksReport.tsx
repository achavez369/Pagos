
import React from 'react';
import { Layers, ArrowRight, Zap, Clock } from 'lucide-react';

const FRAMEWORKS_DATA = [
  {
    id: 'f1',
    name: 'Preventivo',
    resolved: 3420,
    avgDays: 0,
    distribution: { onTime: 95, late: 5, escalated: 0 },
    campaigns: ['Upsell Q1', 'Suscripción Ene'],
    score: 98
  },
  {
    id: 'f2',
    name: 'Post Pago',
    resolved: 1250,
    avgDays: 3.5,
    distribution: { onTime: 60, late: 38, escalated: 2 },
    campaigns: ['Promo Verano'],
    score: 85
  },
  {
    id: 'f3',
    name: 'Renegociación',
    resolved: 450,
    avgDays: 12,
    distribution: { onTime: 10, late: 70, escalated: 20 },
    campaigns: ['Plan Anual'],
    score: 65
  },
  {
    id: 'f4',
    name: 'Escalación',
    resolved: 120,
    avgDays: 25,
    distribution: { onTime: 0, late: 10, escalated: 90 },
    campaigns: ['All'],
    score: 40
  }
];

export const FrameworksReport: React.FC = () => {
  return (
    <div className="space-y-8">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Más Efectivo</p>
                <h3 className="text-2xl font-bold text-slate-900">Preventivo</h3>
                <p className="text-sm text-emerald-600 font-medium mt-1">98% tasa de éxito</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <Zap className="w-5 h-5" />
            </div>
        </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tiempo Promedio</p>
                <h3 className="text-2xl font-bold text-slate-900">4.2 días</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">En todos los playbooks</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <Clock className="w-5 h-5" />
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Resueltos</p>
                <h3 className="text-2xl font-bold text-slate-900">5,240</h3>
                <p className="text-sm text-emerald-600 font-medium mt-1">+12% vs mes anterior</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <Layers className="w-5 h-5" />
            </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Efectividad por Playbook</h3>
        </div>
        
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4">Playbook</th>
                    <th className="px-6 py-4">Compromisos Resueltos</th>
                    <th className="px-6 py-4">Días Promedio</th>
                    <th className="px-6 py-4 w-1/3">Distribución de Resultados</th>
                    <th className="px-6 py-4 text-right">Score</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {FRAMEWORKS_DATA.map(fw => (
                    <tr key={fw.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{fw.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[150px]">
                                {fw.campaigns.join(', ')}
                            </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600">
                            {fw.resolved.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600">
                            {fw.avgDays} días
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex w-full h-2.5 rounded-full overflow-hidden bg-slate-100">
                                    <div style={{ width: `${fw.distribution.onTime}%` }} className="bg-emerald-500 h-full" title="A tiempo"></div>
                                    <div style={{ width: `${fw.distribution.late}%` }} className="bg-amber-400 h-full" title="Tardío"></div>
                                    <div style={{ width: `${fw.distribution.escalated}%` }} className="bg-rose-500 h-full" title="Escalado"></div>
                                </div>
                                <div className="flex gap-4 text-[10px] text-slate-400 font-medium">
                                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>{fw.distribution.onTime}% Ok</span>
                                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>{fw.distribution.late}% Late</span>
                                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>{fw.distribution.escalated}% Esc</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <div className="inline-block px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold border border-slate-200">
                                {fw.score}
                             </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};
