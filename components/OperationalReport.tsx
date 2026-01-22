import React from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, Users, CheckSquare } from 'lucide-react';

export const OperationalReport: React.FC = () => {
  return (
    <div className="space-y-8">
      
       {/* Big Stats Row */}
       <div className="grid grid-cols-4 gap-6">
            <StatCard 
                label="Creados (Semana)" 
                value="1,204" 
                trend="+8%" 
                trendDirection="up"
                icon={<Activity className="w-4 h-4" />}
            />
            <StatCard 
                label="Resueltos (Semana)" 
                value="982" 
                trend="+12%" 
                trendDirection="up"
                icon={<CheckSquare className="w-4 h-4" />}
            />
            <StatCard 
                label="Backlog Actual" 
                value="450" 
                trend="-5%" 
                trendDirection="down" // Good for backlog
                isPositive={true}
                icon={<Users className="w-4 h-4" />}
            />
            <StatCard 
                label="Tiempo Resolución" 
                value="2.4d" 
                trend="-0.2d" 
                trendDirection="down" // Good for time
                isPositive={true}
                icon={<Activity className="w-4 h-4" />}
            />
       </div>

       {/* Chart Container */}
       <div className="grid grid-cols-3 gap-6 h-96">
            {/* Main Volume Chart */}
            <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                <h3 className="font-bold text-slate-800 mb-6">Volumen: Creados vs Resueltos</h3>
                
                <div className="flex-1 flex items-end gap-2 relative">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        <div className="border-t border-slate-100 w-full h-px"></div>
                        <div className="border-t border-slate-100 w-full h-px"></div>
                        <div className="border-t border-slate-100 w-full h-px"></div>
                        <div className="border-t border-slate-100 w-full h-px"></div>
                    </div>

                    {/* Bars (Mock Data) */}
                    {[40, 60, 45, 70, 55, 80, 65, 85, 75, 90, 60, 70, 80, 95].map((h, i) => (
                        <div key={i} className="flex-1 flex gap-1 items-end h-full z-10 group cursor-pointer">
                            <div 
                                style={{ height: `${h}%` }} 
                                className="flex-1 bg-indigo-500 rounded-t-sm opacity-90 group-hover:opacity-100 transition-opacity"
                                title={`Creados: ${h}`}
                            ></div>
                            <div 
                                style={{ height: `${h * 0.8}%` }} 
                                className="flex-1 bg-emerald-400 rounded-t-sm opacity-90 group-hover:opacity-100 transition-opacity"
                                title={`Resueltos: ${h * 0.8}`}
                            ></div>
                        </div>
                    ))}
                </div>
                
                {/* X Axis */}
                <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium px-2">
                    <span>Sem 1</span>
                    <span>Sem 2</span>
                    <span>Sem 3</span>
                    <span>Sem 4</span>
                </div>

                <div className="flex items-center gap-4 mt-6 justify-center">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div> Tickets Creados
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <div className="w-3 h-3 bg-emerald-400 rounded-sm"></div> Resueltos
                    </div>
                </div>
            </div>

            {/* Efficiency Box */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-1">Eficiencia Operativa</h3>
                <p className="text-xs text-slate-400 mb-6">Velocidad de procesamiento</p>

                <div className="space-y-6">
                    <div className="relative pt-2">
                         <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-slate-700">Tasa de Resolución</span>
                            <span className="font-bold text-emerald-600">92%</span>
                         </div>
                         <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[92%]"></div>
                         </div>
                    </div>

                    <div className="relative pt-2">
                         <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-slate-700">Dentro de SLA (24h)</span>
                            <span className="font-bold text-indigo-600">78%</span>
                         </div>
                         <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[78%]"></div>
                         </div>
                    </div>

                    <div className="relative pt-2">
                         <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-slate-700">Automatizado</span>
                            <span className="font-bold text-amber-600">45%</span>
                         </div>
                         <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[45%]"></div>
                         </div>
                    </div>
                </div>
                
                <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 leading-relaxed">
                        <strong className="text-slate-800">Insight:</strong> La automatización ha reducido la carga manual en un 15% esta semana, permitiendo mejor atención en casos escalados.
                    </p>
                </div>
            </div>
       </div>
    </div>
  );
};

const StatCard: React.FC<{ 
    label: string; 
    value: string; 
    trend: string; 
    trendDirection: 'up' | 'down';
    icon: React.ReactNode;
    isPositive?: boolean; 
}> = ({ label, value, trend, trendDirection, icon, isPositive }) => {
    
    // Default: Up is Good (Green), Down is Bad (Red)
    // If isPositive is true (e.g. for Backlog reduction): Down is Good (Green), Up is Bad (Red)
    
    let trendColor = 'text-slate-500';
    if (isPositive) {
        trendColor = trendDirection === 'down' ? 'text-emerald-600' : 'text-rose-600';
    } else {
        trendColor = trendDirection === 'up' ? 'text-emerald-600' : 'text-rose-600';
    }

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
                <div className="text-slate-300">
                    {icon}
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{value}</span>
                <span className={`text-xs font-bold flex items-center ${trendColor}`}>
                    {trendDirection === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </span>
            </div>
        </div>
    );
};
