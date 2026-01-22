import React from 'react';
import { MoreHorizontal, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const CAMPAIGN_DATA = [
  {
    id: 1,
    name: 'Upsell Q1',
    status: 'Activa',
    commitments: '1,248',
    onTimePct: 62,
    latePct: 38,
    framework: 'Preventivo',
    trend: 12, // +12%
    risk: 'Medio',
    riskColor: 'yellow',
    image: 'https://picsum.photos/seed/upsell/100/100',
    selected: false
  },
  {
    id: 2,
    name: 'Suscripción Ene',
    status: 'Activa',
    commitments: '980',
    onTimePct: 81,
    latePct: 19,
    framework: 'Post Pago',
    trend: 5, // +5%
    risk: 'Bajo',
    riskColor: 'green',
    image: 'https://picsum.photos/seed/sub/100/100',
    selected: false
  },
  {
    id: 3,
    name: 'Plan Anual',
    status: 'En riesgo',
    commitments: '340',
    onTimePct: 45,
    latePct: 45, 
    framework: 'Renegociación',
    trend: -8, // -8%
    risk: 'Critico',
    riskColor: 'red',
    image: 'https://picsum.photos/seed/plan/100/100',
    selected: true
  },
  {
    id: 4,
    name: 'Préstamo Personal',
    status: 'Pausada',
    commitments: '210',
    onTimePct: 0,
    latePct: 0,
    framework: '—',
    trend: 0,
    risk: '—',
    riskColor: 'slate',
    image: 'https://picsum.photos/seed/loan/100/100',
    selected: false
  }
];

export const CampaignsReport: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider items-center">
            <div className="col-span-3">Campaña</div>
            <div className="col-span-1">Estado</div>
            <div className="col-span-1">Compromisos</div>
            <div className="col-span-3">Rendimiento (A tiempo / Tarde)</div>
            <div className="col-span-2">Framework Dom.</div>
            <div className="col-span-1 text-right">Tendencia</div>
            <div className="col-span-1 text-right">Riesgo</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-50">
            {CAMPAIGN_DATA.map((row) => (
                <div 
                    key={row.id} 
                    className={`
                        grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-slate-50 transition-colors cursor-pointer relative group
                    `}
                >
                    {/* Active Indicator Line */}
                    {row.selected && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r"></div>
                    )}

                    {/* Campaign Name & Icon */}
                    <div className="col-span-3 flex items-center gap-4">
                        <div className="relative">
                            <img src={row.image} className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-100" alt="" />
                            {/* Google Icon Badge */}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow border border-slate-100">
                                <span className="text-[8px] font-bold text-blue-600">G</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">{row.name}</h3>
                            <span className="text-xs text-slate-400">ID: CAM-{row.id}0{row.id}</span>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                        <span className={`
                            px-2.5 py-1 rounded text-xs font-bold
                            ${row.status === 'Activa' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : ''}
                            ${row.status === 'En riesgo' ? 'bg-amber-50 text-amber-700 border border-amber-100' : ''}
                            ${row.status === 'Pausada' ? 'bg-slate-100 text-slate-600 border border-slate-200' : ''}
                        `}>
                            {row.status}
                        </span>
                    </div>

                    {/* Commitments */}
                    <div className="col-span-1">
                        <div className="text-sm font-bold text-slate-800">{row.commitments}</div>
                        <div className="text-xs text-slate-400">Total</div>
                    </div>

                    {/* Performance Bars */}
                    <div className="col-span-3 pr-4">
                        {row.status === 'Pausada' ? (
                             <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                        ) : (
                            <div className="space-y-1.5">
                                <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-slate-100">
                                    <div style={{ width: `${row.onTimePct}%` }} className="bg-emerald-500 h-full"></div>
                                    <div style={{ width: `${row.latePct}%` }} className="bg-orange-400 h-full"></div>
                                    <div className="bg-slate-200 h-full flex-1"></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-semibold">
                                    <span className="text-emerald-600">{row.onTimePct}% OK</span>
                                    <span className="text-orange-600">{row.latePct}% Tarde</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Framework */}
                    <div className="col-span-2">
                        <span className={`
                            text-xs font-medium text-slate-600
                            ${row.framework === '—' ? 'text-slate-400' : ''}
                        `}>
                            {row.framework}
                        </span>
                    </div>

                    {/* Trend */}
                    <div className="col-span-1 flex justify-end">
                        {row.trend > 0 && (
                            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">
                                <TrendingUp className="w-3 h-3" /> {row.trend}%
                            </div>
                        )}
                        {row.trend < 0 && (
                            <div className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-xs font-bold">
                                <TrendingDown className="w-3 h-3" /> {Math.abs(row.trend)}%
                            </div>
                        )}
                        {row.trend === 0 && (
                             <div className="flex items-center gap-1 text-slate-400 px-2 py-0.5 rounded text-xs font-bold">
                                <Minus className="w-3 h-3" />
                            </div>
                        )}
                    </div>

                    {/* Risk */}
                    <div className="col-span-1 flex items-center justify-end gap-2">
                        <div className={`w-2 h-2 rounded-full 
                            ${row.riskColor === 'green' ? 'bg-emerald-500' : ''}
                            ${row.riskColor === 'yellow' ? 'bg-amber-400' : ''}
                            ${row.riskColor === 'red' ? 'bg-rose-600' : ''}
                            ${row.riskColor === 'slate' ? 'bg-slate-300' : ''}
                        `}></div>
                        <span className={`
                            text-sm font-semibold
                            ${row.riskColor === 'green' ? 'text-emerald-700' : ''}
                            ${row.riskColor === 'yellow' ? 'text-amber-700' : ''}
                            ${row.riskColor === 'red' ? 'text-rose-700' : ''}
                            ${row.riskColor === 'slate' ? 'text-slate-400' : ''}
                        `}>
                            {row.risk}
                        </span>
                    </div>

                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
