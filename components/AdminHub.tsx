import React, { useState } from 'react';
import { 
  Search, ChevronDown, Plus, Filter, 
  MoreHorizontal, Star, CheckCircle2, 
  AlertCircle, Clock, Info, ArrowRight,
  User
} from 'lucide-react';

// Mock Data matching the structure
const LIST_DATA = [
  {
    id: 'c1',
    user: { name: 'Kataleia Garcia', avatar: 'https://picsum.photos/seed/k/40/40', email: 'kataleia@demo.com' },
    company: { name: '[Demo]', type: 'Empresa' },
    subject: 'Suscripción Q1',
    activity: 'Install Messenger',
    description: 'Instalación completada en servidor...',
    priority: false,
    waitingSince: '1 año',
    lastActive: '1 año',
    nextStep: 'Seguimiento',
    status: 'Abierta',
    initial: 'K'
  },
  {
    id: 'c2',
    user: { name: 'Juan Perez', avatar: null, email: 'juan@demo.com' },
    company: { name: '[Demo]', type: 'Empresa' },
    subject: 'Renovación Anual',
    activity: 'Email enviado',
    description: 'Recordatorio de pago enviado...',
    priority: true,
    waitingSince: '2 días',
    lastActive: '5 min',
    nextStep: 'Llamada',
    status: 'Pendiente',
    initial: 'J'
  },
  {
    id: 'c3',
    user: { name: 'Tech Solutions', avatar: 'https://picsum.photos/seed/t/40/40', email: 'support@tech.com' },
    company: { name: 'Tech Inc', type: 'Partner' },
    subject: 'Integración API',
    activity: 'Ticket creado',
    description: 'Problema con endpoint v2...',
    priority: false,
    waitingSince: '5 horas',
    lastActive: '1 hora',
    nextStep: 'Revisión técnica',
    status: 'En progreso',
    initial: 'T'
  },
  {
    id: 'c4',
    user: { name: 'Maria Gonzalez', avatar: null, email: 'maria@demo.com' },
    company: { name: '[Demo]', type: 'Empresa' },
    subject: 'Upgrade Plan',
    activity: 'Pago fallido',
    description: 'Tarjeta rechazada por banco...',
    priority: true,
    waitingSince: '1 día',
    lastActive: '2 días',
    nextStep: 'Reintento',
    status: 'Riesgo',
    initial: 'M'
  },
  {
    id: 'c5',
    user: { name: 'Global Corp', avatar: 'https://picsum.photos/seed/g/40/40', email: 'billing@global.com' },
    company: { name: 'Global', type: 'Enterprise' },
    subject: 'Factura #9921',
    activity: 'Factura vista',
    description: 'Cliente descargó el PDF...',
    priority: false,
    waitingSince: '1 sem',
    lastActive: '3 días',
    nextStep: 'Esperar pago',
    status: 'Abierta',
    initial: 'G'
  },
  {
    id: 'c6',
    user: { name: 'Roberto Diaz', avatar: null, email: 'roberto@demo.com' },
    company: { name: '[Demo]', type: 'Empresa' },
    subject: 'Onboarding',
    activity: 'Sesión agendada',
    description: 'Demo programada para el martes...',
    priority: false,
    waitingSince: '3 días',
    lastActive: '3 días',
    nextStep: 'Demo',
    status: 'Abierta',
    initial: 'R'
  }
];

export const AdminHub: React.FC = () => {
  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col bg-white font-sans text-slate-900">
      
      {/* Top Controls Bar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-slate-800">kataleia garcia</span>
          </div>
      </div>

      {/* Tabs / Filter Row */}
      <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2">
           <div className="bg-slate-100 text-slate-900 px-3 py-1 rounded-md text-xs font-bold">
              4 Abierta
           </div>
           <button className="text-slate-500 hover:text-slate-900 px-3 py-1 rounded-md text-xs font-medium transition-colors">
              Cerrada
           </button>
           <button className="text-slate-500 hover:text-slate-900 px-3 py-1 rounded-md text-xs font-medium transition-colors">
              Pospuesta
           </button>
      </div>

      {/* Table Header */}
      <div className="flex items-center px-6 py-3 border-b border-slate-100 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wide">
           <div className="w-64 flex-none">Usuario</div>
           <div className="w-40 flex-none">Empresa</div>
           <div className="w-40 flex-none">Asunto/Título</div>
           <div className="w-48 flex-none">Actividad</div>
           <div className="flex-1">Descripción</div>
           <div className="w-20 flex-none text-center">Prioridad</div>
           <div className="w-32 flex-none">Esperando desde</div>
           <div className="w-32 flex-none flex items-center gap-1 text-orange-600">
               Última activi... <ArrowRight className="w-3 h-3 rotate-90" />
           </div>
           <div className="w-32 flex-none">Siguiente paso</div>
           <div className="w-10 flex-none"></div>
      </div>

      {/* Table Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
          {LIST_DATA.map((row) => (
              <div 
                key={row.id} 
                className="flex items-center px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group text-sm text-slate-700"
              >
                   {/* Usuario */}
                   <div className="w-64 flex-none flex items-center gap-3 pr-4">
                       {row.user.avatar ? (
                           <img src={row.user.avatar} className="w-8 h-8 rounded-full bg-slate-100" />
                       ) : (
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-blue-400`}>
                               {row.initial}
                           </div>
                       )}
                       <div className="flex flex-col truncate">
                           <span className="font-semibold text-slate-900 truncate">{row.user.name}</span>
                       </div>
                   </div>

                   {/* Empresa */}
                   <div className="w-40 flex-none flex items-center gap-1.5 text-slate-500">
                       <Info className="w-3.5 h-3.5" />
                       <span className="truncate">{row.company.name}</span>
                   </div>

                   {/* Asunto */}
                   <div className="w-40 flex-none text-slate-400">
                       {row.subject === '—' ? <span className="text-slate-300">—</span> : row.subject}
                   </div>

                   {/* Actividad */}
                   <div className="w-48 flex-none font-medium text-slate-600">
                       {row.activity}
                   </div>

                   {/* Descripción */}
                   <div className="flex-1 text-slate-400 truncate pr-4">
                       {row.description === '—' ? <span className="text-slate-200">—</span> : row.description}
                   </div>

                   {/* Prioridad */}
                   <div className="w-20 flex-none flex justify-center">
                       <Star className={`w-4 h-4 ${row.priority ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                   </div>

                   {/* Waiting */}
                   <div className="w-32 flex-none text-slate-500">
                       {row.waitingSince}
                   </div>

                   {/* Last Active */}
                   <div className="w-32 flex-none text-slate-500">
                       {row.lastActive}
                   </div>

                    {/* Next Step */}
                   <div className="w-32 flex-none text-slate-400">
                       {row.nextStep === '—' ? '—' : row.nextStep}
                   </div>
                   
                   {/* Status Badge */}
                   <div className="w-10 flex-none flex justify-end">
                       <span className={`
                            w-6 h-6 rounded flex items-center justify-center text-xs font-bold
                            ${row.status === 'Abierta' ? 'bg-blue-100 text-blue-700' : ''}
                            ${row.status === 'Pendiente' ? 'bg-slate-100 text-slate-600' : ''}
                            ${row.status === 'Riesgo' ? 'bg-red-100 text-red-700' : ''}
                            ${row.status === 'En progreso' ? 'bg-amber-100 text-amber-700' : ''}
                       `}>
                           {row.status.charAt(0)}
                       </span>
                   </div>
              </div>
          ))}
      </div>
      
      {/* Bottom Action Bar (Music player style from image) */}
      <div className="h-14 border-t border-slate-200 bg-white flex items-center justify-between px-6">
          <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-100 rounded">
                  <div className="flex gap-0.5 items-end h-3">
                      <div className="w-1 h-3 bg-slate-800"></div>
                      <div className="w-1 h-2 bg-slate-800"></div>
                  </div>
              </button>
               <button className="p-2 hover:bg-slate-100 rounded">
                  <div className="flex gap-0.5 items-end h-3">
                      <div className="w-1 h-2 bg-slate-800"></div>
                      <div className="w-1 h-3 bg-slate-800"></div>
                      <div className="w-1 h-2 bg-slate-800"></div>
                  </div>
              </button>
          </div>
          
          <div className="relative flex-1 mx-4 h-1 bg-slate-100 rounded-full overflow-hidden">
               <div className="absolute left-0 top-0 h-full w-1/3 bg-slate-400 rounded-full"></div>
          </div>

          <button className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white relative shadow-lg hover:scale-105 transition-transform">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center border border-white">1</span>
          </button>
      </div>

    </div>
  );
};