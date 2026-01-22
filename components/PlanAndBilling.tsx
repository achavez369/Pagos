
import React, { useState, useMemo } from 'react';
import { 
  CreditCard, TrendingUp, Zap, CheckCircle2, 
  AlertTriangle, ArrowRight, Download, Info,
  BarChart3, PieChart, Smartphone, Mail, MessageSquare, Phone,
  ChevronRight, ShieldCheck, Sparkles, Layout, Plus, ShoppingBag,
  Layers, Users, Calculator, ArrowUpRight, Lock, FileText,
  Minimize2, Maximize2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES & INTERFACES ---

interface PlanLimit {
  used: number;
  total: number;
  label: string;
}

interface PlanConfig {
    id: string;
    name: string;
    price: number;
    capacity: {
        campaigns: number;
        playbooks: number;
        users: number;
    };
    features: string[];
}

// --- MOCK DATA ---

const AVAILABLE_PLANS: PlanConfig[] = [
    { id: 'starter', name: 'Starter', price: 99, capacity: { campaigns: 5, playbooks: 2, users: 1 }, features: ['IA Básica'] },
    { id: 'growth', name: 'Business Growth', price: 299, capacity: { campaigns: 20, playbooks: 10, users: 5 }, features: ['IA Avanzada', 'Soporte Email'] },
    { id: 'pro', name: 'Pro Scale', price: 499, capacity: { campaigns: 50, playbooks: 25, users: 15 }, features: ['IA Dedicada', 'Soporte 24/7', 'API Full'] },
    { id: 'enterprise', name: 'Enterprise', price: 999, capacity: { campaigns: 9999, playbooks: 9999, users: 9999 }, features: ['Custom', 'SLA', 'Account Manager'] }
];

const CURRENT_PLAN_DETAILS = {
  id: 'growth',
  name: 'Business Growth',
  price: 299,
  period: 'mensual',
  renewal: '15 Nov, 2023',
  limits: {
    campaigns: { used: 18, total: 20, label: 'Campañas Activas' },
    playbooks: { used: 5, total: 10, label: 'Playbooks Estratégicos' },
    users: { used: 3, total: 5, label: 'Usuarios' }
  } as Record<string, PlanLimit>,
};

// Tiers Definition (Volume-Based Pricing)
const CHANNEL_TIERS = [
  {
    id: 'wa', channel: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" />,
    currentVolume: 42000, unit: 'msgs',
    tiers: [
      { max: 10000, cost: 0.055, label: 'Tier 1' },
      { max: 50000, cost: 0.045, label: 'Tier 2 (Actual)' },
      { max: 100000, cost: 0.035, label: 'Tier 3' },
    ]
  },
  {
    id: 'email', channel: 'Email', icon: <Mail className="w-4 h-4" />,
    currentVolume: 80000, unit: 'envíos',
    tiers: [
      { max: 50000, cost: 0.0020, label: 'Tier 1' },
      { max: 200000, cost: 0.0015, label: 'Tier 2 (Actual)' },
      { max: 1000000, cost: 0.0010, label: 'Tier 3' },
    ]
  },
  {
    id: 'sms', channel: 'SMS', icon: <Smartphone className="w-4 h-4" />,
    currentVolume: 12500, unit: 'sms',
    tiers: [
      { max: 10000, cost: 0.040, label: 'Tier 1' },
      { max: 50000, cost: 0.030, label: 'Tier 2 (Actual)' },
      { max: 100000, cost: 0.020, label: 'Tier 3' },
    ]
  },
  {
    id: 'call', channel: 'Llamadas', icon: <Phone className="w-4 h-4" />,
    currentVolume: 850, unit: 'min',
    tiers: [
      { max: 1000, cost: 0.80, label: 'Tier 1 (Actual)' },
      { max: 5000, cost: 0.70, label: 'Tier 2' },
      { max: 10000, cost: 0.60, label: 'Tier 3' },
    ]
  }
];

// Add-ons (Buy Extras)
const ADD_ONS = [
  { id: 'extra_campaigns', category: 'capacity', title: 'Pack de Campañas', description: '+5 slots de campañas activas', price: 49, recurrence: 'mensual', icon: <Layers className="w-5 h-5 text-blue-600" />, limitType: 'campaigns', value: 5 },
  { id: 'extra_playbooks', category: 'capacity', title: 'Pack de Playbooks', description: '+2 playbooks estratégicos', price: 39, recurrence: 'mensual', icon: <Layout className="w-5 h-5 text-purple-600" />, limitType: 'playbooks', value: 2 },
  { id: 'extra_users', category: 'capacity', title: 'Pack de Usuarios', description: '+3 usuarios adicionales', price: 29, recurrence: 'mensual', icon: <Users className="w-5 h-5 text-orange-600" />, limitType: 'users', value: 3 },
  { id: 'token_pack_s', category: 'tokens', title: 'Bolsa de Tokens IA', description: '1,000 tokens para simulaciones', price: 15, recurrence: 'único', icon: <Zap className="w-5 h-5 text-yellow-500" />, limitType: 'tokens', value: 1000 }
];

// Invoices Mock
const INVOICES = [
    { 
        id: 'INV-2023-010', period: 'Octubre 2023', status: 'paid', date: '01 Nov, 2023', total: 543.20,
        breakdown: {
            platform: { name: 'Business Growth', amount: 299.00 },
            execution: [
                { channel: 'WhatsApp', volume: '41,200', cost: 185.40 },
                { channel: 'Email', volume: '75,000', cost: 11.25 },
                { channel: 'SMS', volume: '500', cost: 20.00 }
            ],
            addons: [
                { name: 'Pack Campañas (+5)', amount: 49.00 }
            ],
            tokens: { consumed: 1200, cost: 0.00 } // Included
        }
    },
    { 
        id: 'INV-2023-009', period: 'Septiembre 2023', status: 'paid', date: '01 Oct, 2023', total: 420.50,
        breakdown: {
            platform: { name: 'Business Growth', amount: 299.00 },
            execution: [
                { channel: 'WhatsApp', volume: '38,000', cost: 171.00 },
                { channel: 'Email', volume: '60,000', cost: 9.00 }
            ],
            addons: [],
            tokens: { consumed: 800, cost: 0.00 }
        }
    }
];

export const PlanAndBilling: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'optimization' | 'billing' | 'plans'>('optimization');
  const [isSimulatorMode, setIsSimulatorMode] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({});
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  // --- LOGIC: TIER PROGRESS ---
  const getTierProgress = (channel: typeof CHANNEL_TIERS[0]) => {
    const currentTierIdx = channel.tiers.findIndex(t => channel.currentVolume <= t.max);
    const idx = currentTierIdx === -1 ? channel.tiers.length - 1 : currentTierIdx;
    
    const currentTier = channel.tiers[idx];
    const nextTier = channel.tiers[idx + 1];
    
    if (!nextTier) return { percent: 100, nextLabel: 'Max Tier', needed: 0, savings: 0 };

    const needed = nextTier.max - channel.currentVolume;
    const percent = Math.min(100, (channel.currentVolume / nextTier.max) * 100); // Visual approximation
    const potentialSavings = (nextTier.max * (currentTier.cost - nextTier.cost)); 

    return { percent, nextLabel: nextTier.label, needed, savings: potentialSavings };
  };

  // --- LOGIC: SIMULATOR & RECOMMENDATION ---
  const simulationTotals = useMemo(() => {
    let monthlyAddonCost = 0;
    let oneTimeCost = 0;
    let newLimits: Record<string, PlanLimit> = JSON.parse(JSON.stringify(CURRENT_PLAN_DETAILS.limits));

    Object.entries(selectedExtras).forEach(([addonId, count]) => {
        const addon = ADD_ONS.find(a => a.id === addonId);
        const qty = count as number;

        if (addon && qty > 0) {
            if (addon.recurrence === 'mensual') {
                monthlyAddonCost += addon.price * qty;
                if (addon.limitType && newLimits[addon.limitType]) {
                    newLimits[addon.limitType].total += (addon.value * qty);
                }
            } else {
                oneTimeCost += addon.price * qty;
            }
        }
    });

    const totalMonthly = CURRENT_PLAN_DETAILS.price + monthlyAddonCost;
    
    // AI Recommendation Logic
    let recommendation = null;
    const nextPlan = AVAILABLE_PLANS.find(p => p.id === 'pro');
    
    // Type C: Upgrade Recommended
    if (nextPlan && totalMonthly >= nextPlan.price) {
        recommendation = {
            type: 'upgrade',
            title: `Upgrade a ${nextPlan.name}`,
            description: `Tus extras suman $${monthlyAddonCost}. Por $${nextPlan.price} (solo $${(nextPlan.price - totalMonthly).toFixed(0)} de diferencia/ahorro) obtienes más capacidad.`,
            action: 'Ver Comparativa',
            color: 'violet'
        };
    } 
    // Type B: Buy Extra Recommended
    else if (monthlyAddonCost > 0) {
         recommendation = {
            type: 'extra',
            title: 'Combinación Óptima',
            description: `Mantener tu plan actual + extras es la opción más rentable. Ahorras $${(nextPlan!.price - totalMonthly).toFixed(0)} vs el siguiente plan.`,
            action: 'Confirmar Extras',
            color: 'blue'
        };
    }
    // Type A: No Action / Balanced (Default if simulator is off)
    else {
        // Check for Volume Optimization (Type D)
        const waTier = getTierProgress(CHANNEL_TIERS[0]); // Checking WhatsApp example
        if (waTier.savings > 50) {
            recommendation = {
                type: 'volume',
                title: 'Oportunidad de Volumen',
                description: `Estás cerca del siguiente tier en WhatsApp. Aumentar volumen reduciría tu costo unitario un 22%.`,
                action: 'Ver Tiers',
                color: 'amber'
            };
        } else {
             recommendation = {
                type: 'balanced',
                title: 'Plan Balanceado',
                description: 'Tu configuración actual es eficiente. No requieres cambios inmediatos.',
                action: null,
                color: 'emerald'
            };
        }
    }

    return {
        base: CURRENT_PLAN_DETAILS.price,
        monthlyAddons: monthlyAddonCost,
        oneTime: oneTimeCost,
        totalMonthly,
        limits: newLimits,
        recommendation
    };
  }, [selectedExtras]);

  const toggleExtra = (id: string, increment: number) => {
    setSelectedExtras(prev => {
        const current = prev[id] || 0;
        const next = Math.max(0, current + increment);
        return { ...prev, [id]: next };
    });
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 font-sans text-slate-900 custom-scrollbar relative">
        
        {/* HEADER */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Facturación y Plan</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Gestiona tu inversión estratégica. Optimizado para crecimiento.
                    </p>
                </div>
                <div className="flex gap-2">
                    <TabButton label="Optimización" active={activeTab === 'optimization'} onClick={() => setActiveTab('optimization')} icon={<Zap className="w-4 h-4" />} />
                    <TabButton label="Historial y Facturas" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} icon={<FileText className="w-4 h-4" />} />
                    <TabButton label="Comparar Planes" active={activeTab === 'plans'} onClick={() => setActiveTab('plans')} icon={<Layout className="w-4 h-4" />} />
                </div>
            </div>
        </div>

        <div className="p-8 pb-32 max-w-7xl mx-auto">
            
            {/* TAB 1: OPTIMIZATION (THE MAXIMIZER) */}
            {activeTab === 'optimization' && (
                <div className="space-y-8">
                    
                    {/* AI Recommendation Banner */}
                    {!isSimulatorMode && (
                        <div className={`
                            bg-${simulationTotals.recommendation?.color === 'emerald' ? 'emerald' : 'white'} 
                            border border-${simulationTotals.recommendation?.color}-200 
                            rounded-xl p-6 shadow-sm flex items-start gap-4 relative overflow-hidden
                        `}>
                            {simulationTotals.recommendation?.color === 'emerald' ? (
                                <div className="absolute inset-0 bg-emerald-50/50"></div>
                            ) : (
                                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${simulationTotals.recommendation?.color}-500`}></div>
                            )}

                            <div className={`p-3 rounded-full bg-${simulationTotals.recommendation?.color}-100 text-${simulationTotals.recommendation?.color}-600 z-10`}>
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div className="z-10 flex-1">
                                <h3 className={`text-lg font-bold text-${simulationTotals.recommendation?.color}-900`}>
                                    {simulationTotals.recommendation?.title}
                                </h3>
                                <p className={`text-sm text-${simulationTotals.recommendation?.color}-700 mt-1 max-w-2xl`}>
                                    {simulationTotals.recommendation?.description}
                                </p>
                            </div>
                             {simulationTotals.recommendation?.action && (
                                <button className={`z-10 px-4 py-2 bg-${simulationTotals.recommendation.color}-600 hover:bg-${simulationTotals.recommendation.color}-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors`}>
                                    {simulationTotals.recommendation.action}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Simulator Control */}
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${isSimulatorMode ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                <Calculator className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Simulador de Decisión</h3>
                                <p className="text-xs text-slate-500">Prueba combinaciones de extras antes de comprar.</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                             <button 
                                onClick={() => { setIsSimulatorMode(false); setSelectedExtras({}); }}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${!isSimulatorMode ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Vista Real
                            </button>
                            <button 
                                onClick={() => setIsSimulatorMode(true)}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${isSimulatorMode ? 'bg-indigo-600 shadow-sm text-white' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Simulador Activo
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Capacity Card */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                                    <Layout className="w-5 h-5 text-indigo-600" />
                                    {CURRENT_PLAN_DETAILS.name}
                                </h3>
                                <button
                                    onClick={() => setActiveTab('plans')}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    Mejorar Plan
                                </button>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {Object.entries(isSimulatorMode ? simulationTotals.limits : CURRENT_PLAN_DETAILS.limits).map(([key, rawLimit]) => {
                                    const limit = rawLimit as PlanLimit;
                                    const percent = Math.min(100, (limit.used / limit.total) * 100);
                                    const isCritical = percent >= 90;
                                    const originalLimit = CURRENT_PLAN_DETAILS.limits[key];
                                    const isSimulated = isSimulatorMode && limit.total > originalLimit.total;

                                    return (
                                        <div key={key} className="space-y-3 relative group">
                                            <div className="flex justify-between items-end">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{limit.label}</label>
                                                <span className={`text-sm font-bold ${isCritical ? 'text-rose-600' : 'text-slate-900'}`}>
                                                    {limit.used} / {limit.total}
                                                    {isSimulated && <span className="text-emerald-500 text-xs ml-1">(+{limit.total - originalLimit.total})</span>}
                                                </span>
                                            </div>
                                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percent}%` }}
                                                    className={`h-full rounded-full ${isCritical ? 'bg-rose-500' : 'bg-slate-800'}`}
                                                />
                                                {isSimulated && (
                                                    <div className="absolute top-0 right-0 bottom-0 bg-emerald-400/30 w-full animate-pulse"></div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Marketplace */}
                        <div className="lg:col-span-3">
                             <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                                Marketplace de Extras
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {ADD_ONS.map(addon => {
                                    const count = selectedExtras[addon.id] || 0;
                                    return (
                                        <div 
                                            key={addon.id} 
                                            className={`
                                                relative bg-white rounded-xl border transition-all duration-200 flex flex-col p-5
                                                ${count > 0 && isSimulatorMode ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'border-slate-200 hover:border-slate-300 shadow-sm'}
                                            `}
                                        >
                                            {isSimulatorMode && count > 0 && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                    +{count} Simulado
                                                </div>
                                            )}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                                    {addon.icon}
                                                </div>
                                                <div className="text-xs font-bold px-2 py-1 rounded bg-indigo-50 text-indigo-700 capitalize">
                                                    {addon.recurrence}
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-slate-900 text-sm">{addon.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1 mb-4 h-8">{addon.description}</p>
                                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <span className="font-bold text-lg text-slate-900">${addon.price}</span>
                                                {isSimulatorMode ? (
                                                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                                                        <button onClick={() => toggleExtra(addon.id, -1)} disabled={count === 0} className="w-6 h-6 flex items-center justify-center rounded bg-white hover:text-rose-600 disabled:opacity-50">-</button>
                                                        <span className="w-4 text-center text-xs font-bold">{count}</span>
                                                        <button onClick={() => toggleExtra(addon.id, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-white text-indigo-600 hover:bg-indigo-50">+</button>
                                                    </div>
                                                ) : (
                                                    <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                                                        Comprar <Plus className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                         {/* Tiers Section */}
                         <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                             {CHANNEL_TIERS.slice(0, 2).map(channel => {
                                 const progress = getTierProgress(channel);
                                 return (
                                     <div key={channel.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                         <div className="flex justify-between items-center mb-4">
                                             <div className="flex items-center gap-3">
                                                 <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">{channel.icon}</div>
                                                 <div>
                                                     <h4 className="font-bold text-slate-900">{channel.channel}</h4>
                                                     <p className="text-xs text-slate-500">Volumen: <b>{channel.currentVolume.toLocaleString()}</b> {channel.unit}</p>
                                                 </div>
                                             </div>
                                         </div>
                                         {/* Simple Ladder */}
                                         <div className="flex justify-between items-center text-xs relative">
                                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10"></div>
                                            {channel.tiers.map((t, idx) => {
                                                const active = channel.currentVolume <= t.max && (idx === 0 || channel.currentVolume > channel.tiers[idx-1].max);
                                                return (
                                                    <div key={idx} className={`flex flex-col items-center gap-2 ${active ? 'scale-110' : 'opacity-60'}`}>
                                                        <div className={`w-3 h-3 rounded-full border-2 ${active ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`}></div>
                                                        <span className="font-bold">${t.cost.toFixed(4)}</span>
                                                    </div>
                                                );
                                            })}
                                         </div>
                                     </div>
                                 );
                             })}
                         </div>

                    </div>
                </div>
            )}

            {/* TAB 2: BILLING HISTORY (TRANSPARENCY) */}
            {activeTab === 'billing' && (
                <div className="grid grid-cols-12 gap-8">
                    {/* Invoice List */}
                    <div className="col-span-4 space-y-4">
                        <h3 className="font-bold text-slate-900 text-lg">Facturas Recientes</h3>
                        <div className="space-y-3">
                            {INVOICES.map(inv => (
                                <div 
                                    key={inv.id}
                                    onClick={() => setSelectedInvoice(inv.id)}
                                    className={`
                                        p-4 rounded-xl border cursor-pointer transition-all
                                        ${selectedInvoice === inv.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-slate-800">{inv.period}</span>
                                        <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase">{inv.status}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-xs text-slate-500">
                                            <p>Emisión: {inv.date}</p>
                                            <p className="font-mono mt-1 text-slate-400">{inv.id}</p>
                                        </div>
                                        <span className="text-lg font-bold text-slate-900">${inv.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-2 text-sm text-slate-500 font-medium hover:text-slate-900">Ver historial completo</button>
                    </div>

                    {/* Invoice Detail */}
                    <div className="col-span-8">
                         {selectedInvoice ? (
                            (() => {
                                const inv = INVOICES.find(i => i.id === selectedInvoice)!;
                                return (
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900">Detalle de Factura</h2>
                                                <p className="text-sm text-slate-500">Periodo: {inv.period}</p>
                                            </div>
                                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
                                                <Download className="w-4 h-4" /> PDF
                                            </button>
                                        </div>
                                        
                                        <div className="p-8 space-y-8">
                                            
                                            {/* A. Platform */}
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">A. Suscripción Plataforma</h4>
                                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                                    <span className="text-sm font-medium text-slate-900">{inv.breakdown.platform.name}</span>
                                                    <span className="text-sm font-mono text-slate-600">${inv.breakdown.platform.amount.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* B. Execution */}
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">B. Costos de Ejecución (Canales)</h4>
                                                {inv.breakdown.execution.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                                        <div>
                                                            <span className="text-sm font-medium text-slate-900 block">{item.channel}</span>
                                                            <span className="text-xs text-slate-500">Volumen: {item.volume}</span>
                                                        </div>
                                                        <span className="text-sm font-mono text-slate-600">${item.cost.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* C. Addons */}
                                            {inv.breakdown.addons.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">C. Extras & Add-ons</h4>
                                                    {inv.breakdown.addons.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                                            <span className="text-sm font-medium text-slate-900">{item.name}</span>
                                                            <span className="text-sm font-mono text-slate-600">${item.amount.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {/* Total */}
                                            <div className="pt-4 flex justify-end">
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Facturado</p>
                                                    <p className="text-3xl font-bold text-slate-900">${inv.total.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()
                         ) : (
                             <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                 <FileText className="w-12 h-12 mb-3 opacity-20" />
                                 <p className="text-sm font-medium">Selecciona una factura para ver el desglose.</p>
                             </div>
                         )}
                    </div>
                </div>
            )}

            {/* TAB 3: PLANS COMPARISON */}
            {activeTab === 'plans' && (
                <div className="space-y-8">
                     <div className="text-center max-w-2xl mx-auto mb-10">
                         <h2 className="text-2xl font-bold text-slate-900">Planes que escalan contigo</h2>
                         <p className="text-slate-500 mt-2">Puedes combinar cualquier plan con add-ons si no quieres subir de nivel completamente.</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                         {AVAILABLE_PLANS.map(plan => {
                             const isCurrent = plan.id === 'growth';
                             const isRecommended = plan.id === 'pro';

                             return (
                                 <div 
                                    key={plan.id} 
                                    className={`
                                        relative rounded-xl p-6 flex flex-col border transition-all
                                        ${isCurrent ? 'bg-white border-indigo-600 ring-1 ring-indigo-600 shadow-md z-10' : 'bg-white border-slate-200 hover:border-slate-300'}
                                        ${isRecommended ? 'bg-gradient-to-b from-indigo-50/50 to-white border-indigo-200' : ''}
                                    `}
                                 >
                                     {isCurrent && (
                                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-sm">
                                             Plan Actual
                                         </div>
                                     )}
                                     {isRecommended && !isCurrent && (
                                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-sm">
                                             Recomendado
                                         </div>
                                     )}

                                     <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                                     <div className="mt-4 mb-6">
                                         <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                                         <span className="text-slate-500 text-sm">/mes</span>
                                     </div>

                                     <div className="space-y-4 flex-1 mb-8">
                                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capacidad</div>
                                         <ul className="space-y-2 text-sm text-slate-700">
                                             <li className="flex justify-between">
                                                 <span>Campañas</span>
                                                 <span className="font-bold">{plan.capacity.campaigns}</span>
                                             </li>
                                             <li className="flex justify-between">
                                                 <span>Playbooks</span>
                                                 <span className="font-bold">{plan.capacity.playbooks}</span>
                                             </li>
                                             <li className="flex justify-between">
                                                 <span>Usuarios</span>
                                                 <span className="font-bold">{plan.capacity.users}</span>
                                             </li>
                                         </ul>
                                         
                                         <div className="h-px bg-slate-100"></div>
                                         
                                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Features</div>
                                         <ul className="space-y-2 text-sm text-slate-600">
                                             {plan.features.map((f, i) => (
                                                 <li key={i} className="flex items-center gap-2">
                                                     <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                     {f}
                                                 </li>
                                             ))}
                                         </ul>
                                     </div>

                                     <button className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${isCurrent ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
                                         {isCurrent ? 'Tu Plan' : 'Cambiar Plan'}
                                     </button>
                                 </div>
                             );
                         })}
                     </div>
                </div>
            )}

        </div>

        {/* FLOATING SIMULATOR BAR */}
        <AnimatePresence>
            {isSimulatorMode && activeTab === 'optimization' && (
                <motion.div 
                    initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-50 px-8 py-4 ml-16"
                >
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <Calculator className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Escenario Simulado</h4>
                                <div className="flex gap-4 text-xs mt-1">
                                    <span className="text-slate-500">Plan Base: <b>${simulationTotals.base}</b></span>
                                    <span className="text-slate-500">Extras: <b className="text-indigo-600">+${simulationTotals.monthlyAddons}</b></span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-slate-200"></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Total Mensual</p>
                                <p className="font-mono text-xl font-bold text-slate-900">${simulationTotals.totalMonthly}</p>
                            </div>
                            
                            {/* AI Recommendation Badge in Bar */}
                            {simulationTotals.recommendation && (
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-${simulationTotals.recommendation.color}-50 border border-${simulationTotals.recommendation.color}-100 ml-4`}>
                                    <Sparkles className={`w-3.5 h-3.5 text-${simulationTotals.recommendation.color}-600`} />
                                    <span className={`text-xs font-bold text-${simulationTotals.recommendation.color}-700`}>
                                        IA: {simulationTotals.recommendation.title}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                             <button onClick={() => { setIsSimulatorMode(false); setSelectedExtras({}); }} className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-800">Cancelar</button>
                             <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-sm flex items-center gap-2">
                                 Aplicar <ArrowRight className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

const TabButton: React.FC<{ label: string; icon: React.ReactNode; active: boolean; onClick: () => void }> = ({ label, icon, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
    >
        {icon} {label}
    </button>
);
