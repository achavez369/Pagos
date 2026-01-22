import { StageConfig, StageId } from './types';

export const CAMPAIGNS = [
  "Suscripción Marzo",
  "Cuota 3/6",
  "Plan Anual",
  "Promo Verano",
  "Upsell Q1"
];

export const STAGES: StageConfig[] = [
  {
    id: StageId.PREVENTIVE,
    label: 'Preventivo',
    description: 'Próximos pagos',
    colorTheme: 'emerald', // We keep keys but map to monochrome styles
    minLag: -30,
    maxLag: -1,
  },
  {
    id: StageId.PAYMENT_DAY,
    label: 'Día de Pago',
    description: 'Vence hoy',
    colorTheme: 'blue',
    minLag: 0,
    maxLag: 0,
  },
  {
    id: StageId.POST_PAYMENT,
    label: 'Post Pago',
    description: 'Periodo de gracia',
    colorTheme: 'amber',
    minLag: 1,
    maxLag: 5,
  },
  {
    id: StageId.REFRAMING,
    label: 'Renegociación',
    description: 'Fase de acuerdo',
    colorTheme: 'orange',
    minLag: 6,
    maxLag: 15,
  },
  {
    id: StageId.ESCALATION,
    label: 'Escalación',
    description: 'Atención crítica',
    colorTheme: 'rose',
    minLag: 16,
    maxLag: 999,
  },
];

// REFACTORED TO SOBER / FORMAL STYLES (Monochrome base with tiny accents)
export const THEME_STYLES = {
  emerald: {
    bg: 'bg-white',
    border: 'border-slate-200',
    text: 'text-slate-900',
    textLight: 'text-slate-500',
    badge: 'bg-slate-100 text-slate-700',
    glow: 'shadow-slate-200',
    gradient: 'from-slate-50 to-slate-100',
    dot: 'bg-emerald-500' // Minimal accent
  },
  blue: {
    bg: 'bg-white',
    border: 'border-slate-200',
    text: 'text-slate-900',
    textLight: 'text-slate-500',
    badge: 'bg-slate-100 text-slate-700',
    glow: 'shadow-slate-200',
    gradient: 'from-slate-50 to-slate-100',
    dot: 'bg-blue-600'
  },
  amber: {
    bg: 'bg-white',
    border: 'border-slate-200',
    text: 'text-slate-900',
    textLight: 'text-slate-500',
    badge: 'bg-slate-100 text-slate-700',
    glow: 'shadow-slate-200',
    gradient: 'from-slate-50 to-slate-100',
    dot: 'bg-amber-500'
  },
  orange: {
    bg: 'bg-white',
    border: 'border-slate-200',
    text: 'text-slate-900',
    textLight: 'text-slate-500',
    badge: 'bg-slate-100 text-slate-700',
    glow: 'shadow-slate-200',
    gradient: 'from-slate-50 to-slate-100',
    dot: 'bg-orange-600'
  },
  rose: {
    bg: 'bg-white',
    border: 'border-slate-200',
    text: 'text-slate-900',
    textLight: 'text-slate-500',
    badge: 'bg-slate-100 text-slate-700',
    glow: 'shadow-slate-200',
    gradient: 'from-slate-50 to-slate-100',
    dot: 'bg-rose-600'
  },
};