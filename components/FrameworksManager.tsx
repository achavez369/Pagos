
import React, { useState, useRef, useEffect } from 'react';
import { 
  Workflow, Plus, Search, Filter, MoreHorizontal, 
  MessageSquare, Mail, Phone, Zap, Clock, 
  CheckCircle2, AlertCircle, ArrowRight, X,
  Layers, ChevronRight, Calendar, Smartphone,
  DollarSign, Tag, Move, Trash2, Settings, MousePointer2,
  AlertTriangle, FileText, User, Copy, Edit, Trash
} from 'lucide-react';
import { Framework, StageId, ChannelType, FrameworkAction, WhatsAppConfig, EmailConfig, SMSConfig, CallConfig } from '../types';
import { STAGES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

// --- COST CONSTANTS ---
const CHANNEL_PRICING: Record<ChannelType, number> = {
    'email': 0.05,
    'whatsapp': 0.45,
    'sms': 0.25,
    'call': 0.80,
    'system': 0.00
};

// --- MOCK DATA ---
export const MOCK_FRAMEWORKS: Framework[] = [
  {
    id: 'fw-001',
    name: 'Preventivo Suave',
    description: 'Recordatorios amigables antes del vencimiento.',
    lane: StageId.PREVENTIVE,
    status: 'active',
    actions: [
      { 
        id: 'a1', order: 1, channel: 'email', timing: -5, templateName: 'Pre-Aviso 1', isValid: true,
        config: { fromAddress: 'billing@fintech.com', subject: 'Tu factura está lista', templateId: 'tpl_pre_1', includeInvoice: true } as EmailConfig
      },
      { 
        id: 'a2', order: 2, channel: 'whatsapp', timing: -2, templateName: 'Reminder Friendly', isValid: true,
        config: { sender: '+15550101', templateId: 'wa_reminder_v1', language: 'es', variables: { name: '{user.name}' } } as WhatsAppConfig
      }
    ],
    usage: { playbooks: 3, campaigns: 12 },
    updatedAt: new Date()
  },
  {
    id: 'fw-002',
    name: 'Día de Pago Urgente',
    description: 'Alta intensidad el mismo día del vencimiento.',
    lane: StageId.PAYMENT_DAY,
    status: 'active',
    actions: [
      { id: 'a3', order: 1, channel: 'sms', timing: 0, templateName: 'Vence Hoy SMS', isValid: true, config: { senderId: 'FINTECH', messageContent: 'Tu factura vence hoy.' } as SMSConfig },
      { id: 'a4', order: 2, channel: 'email', timing: 0, templateName: 'Factura Vence Hoy', isValid: true, config: { fromAddress: 'alert@fintech.com', subject: 'URGENTE: Vencimiento', templateId: 'tpl_urgent', includeInvoice: true } as EmailConfig }
    ],
    usage: { playbooks: 5, campaigns: 8 },
    updatedAt: new Date()
  },
  {
    id: 'fw-003', name: 'Post Pago Multicanal', description: 'Recuperación temprana', lane: StageId.POST_PAYMENT, status: 'paused',
    actions: [{ id: 'a5', order: 1, channel: 'email', timing: 1, templateName: 'Pago Fallido', isValid: true } as FrameworkAction],
    usage: { playbooks: 0, campaigns: 0 }, updatedAt: new Date()
  },
  {
    id: 'fw-004', name: 'Escalación Legal', description: 'Aviso pre-legal', lane: StageId.ESCALATION, status: 'paused',
    actions: [{ id: 'a6', order: 1, channel: 'email', timing: 30, templateName: 'Carta Documento', isValid: true } as FrameworkAction],
    usage: { playbooks: 0, campaigns: 0 }, updatedAt: new Date()
  },
    {
    id: 'fw-005', name: 'Renegociación Oferta', description: 'Quita del 20%', lane: StageId.REFRAMING, status: 'active',
    actions: [{ id: 'a7', order: 1, channel: 'whatsapp', timing: 10, templateName: 'Oferta 20 off', isValid: true } as FrameworkAction],
    usage: { playbooks: 1, campaigns: 0 }, updatedAt: new Date()
  }
];

export const FrameworksManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [frameworks, setFrameworks] = useState<Framework[]>(MOCK_FRAMEWORKS);
  const [editingFramework, setEditingFramework] = useState<Partial<Framework> | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const calculateFrameworkCost = (actions: FrameworkAction[]) => {
      return actions.reduce((acc, act) => acc + (CHANNEL_PRICING[act.channel] || 0), 0);
  };

  // --- ACTIONS ---

  const handleCreateNew = () => {
    setEditingFramework(null); // Clear for new
    setIsModalOpen(true);
  };

  const handleEdit = (fw: Framework) => {
    setEditingFramework(fw);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDuplicate = (fw: Framework) => {
    const duplicated: Partial<Framework> = {
        ...fw,
        id: undefined, // Will be generated on save
        name: `${fw.name} (Copia)`,
        status: 'paused', // Duplicate starts paused
        usage: { playbooks: 0, campaigns: 0 }, // Reset usage
        actions: fw.actions.map(a => ({ ...a, id: Math.random().toString(36).substr(2, 9) })) // Regenerate action IDs
    };
    setEditingFramework(duplicated);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este framework?')) {
        setFrameworks(prev => prev.filter(f => f.id !== id));
    }
    setActiveMenuId(null);
  };

  const handleSaveFramework = (frameworkData: Partial<Framework>) => {
      if (frameworkData.id) {
          // Update Existing
          setFrameworks(prev => prev.map(fw => fw.id === frameworkData.id ? { ...fw, ...frameworkData } as Framework : fw));
      } else {
          // Create New
          const newFramework: Framework = {
              ...frameworkData,
              id: Math.random().toString(36).substr(2, 9),
              usage: { playbooks: 0, campaigns: 0 },
              updatedAt: new Date(),
              status: frameworkData.status || 'active'
          } as Framework;
          setFrameworks(prev => [...prev, newFramework]);
      }
      setIsModalOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="flex-1 h-full flex flex-col bg-white text-slate-900 font-sans">
      
      {/* HEADER */}
      <header className="px-8 py-6 border-b border-slate-100 bg-white">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    <Workflow className="w-6 h-6 text-indigo-600" />
                    Gestión de Frameworks
                </h1>
                <p className="text-slate-500 text-sm mt-1 max-w-2xl">
                    Los Frameworks definen cómo se ejecutan las acciones y dónde se enrutan los compromisos durante el ciclo de vida del pago.
                </p>
            </div>
            <button 
                onClick={handleCreateNew}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
                <Plus className="w-4 h-4" /> Crear Framework
            </button>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="px-8 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
                type="text" 
                placeholder="Buscar framework..." 
                className="pl-9 pr-4 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-100 outline-none w-64"
            />
        </div>
        <div className="h-4 w-px bg-slate-300 mx-2"></div>
        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <Filter className="w-3.5 h-3.5" /> Bandeja
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <Filter className="w-3.5 h-3.5" /> Estado
        </button>
      </div>

      {/* LIST VIEW (TABLE) */}
      <div className="flex-1 overflow-y-auto min-h-0 pb-20">
        <table className="w-full text-left border-collapse">
            <thead className="bg-white sticky top-0 z-10 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 shadow-sm">
                <tr>
                    <th className="px-8 py-4 w-1/4">NOMBRE DEL FRAMEWORK</th>
                    <th className="px-6 py-4 w-40">🏷️ BANDEJA</th>
                    <th className="px-6 py-4 w-32">ACCIONES</th>
                    <th className="px-6 py-4 w-32">INVERSIÓN</th>
                    <th className="px-6 py-4 w-32">PLAYBOOKS</th>
                    <th className="px-6 py-4 w-32">CAMPAÑAS</th>
                    <th className="px-6 py-4">ESTADO</th>
                    <th className="px-6 py-4 w-10"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
                {frameworks.map((fw) => {
                    return (
                        <tr key={fw.id} className="hover:bg-slate-50 transition-colors group cursor-default">
                            <td className="px-8 py-4" onClick={() => handleEdit(fw)}>
                                <div className="flex items-center gap-2">
                                    <div className="font-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors">{fw.name}</div>
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{fw.description}</div>
                            </td>
                            <td className="px-6 py-4">
                                <LaneBadge laneId={fw.lane} />
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-bold text-slate-800 text-lg">{fw.actions.length}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1 font-mono text-emerald-600 font-bold text-base">
                                    <span>${calculateFrameworkCost(fw.actions).toFixed(2)}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-bold text-slate-800 text-lg ml-4">{fw.usage.playbooks}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-bold text-slate-800 text-lg ml-4">{fw.usage.campaigns}</span>
                            </td>
                            <td className="px-6 py-4">
                                <StatusBadge status={fw.status} />
                            </td>
                            <td className="px-6 py-4 text-right relative">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === fw.id ? null : fw.id); }}
                                    className={`p-2 rounded-md transition-colors ${activeMenuId === fw.id ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-600'}`}
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                                
                                {/* Context Menu */}
                                {activeMenuId === fw.id && (
                                    <div className="absolute right-8 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleEdit(fw); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" /> Editar
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDuplicate(fw); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
                                        >
                                            <Copy className="w-4 h-4" /> Duplicar
                                        </button>
                                        <div className="h-px bg-slate-100 my-1"></div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(fw.id); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                        >
                                            <Trash className="w-4 h-4" /> Eliminar
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>

      {/* CREATE/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
            <CreateFrameworkModal 
                initialData={editingFramework} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveFramework}
            />
        )}
      </AnimatePresence>

    </div>
  );
};

// ... (Rest of the file remains same, ensuring readOnly logic is removed from Modal if passed or handled by removing usage)
// I will rewrite the rest of the component to ensure clean removal of the logic

// --- SUBCOMPONENTS ---

const LaneBadge: React.FC<{ laneId: StageId }> = ({ laneId }) => {
    const stage = STAGES.find(s => s.id === laneId);
    if (!stage) return null;

    return (
        <span className={`
            inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wide
            text-${stage.colorTheme}-700 bg-${stage.colorTheme}-50 border-${stage.colorTheme}-200
        `}>
            {stage.label}
        </span>
    );
};

const StatusBadge: React.FC<{ status: Framework['status'] }> = ({ status }) => {
    const styles = {
        active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        paused: 'bg-amber-50 text-amber-700 border-amber-200',
        deprecated: 'bg-slate-100 text-slate-500 border-slate-200'
    };

    const labels = {
        active: 'Activo',
        paused: 'Pausado',
        deprecated: 'Deprecado'
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};

const ChannelIcon: React.FC<{ channel: ChannelType, size?: number }> = ({ channel, size = 14 }) => {
    switch(channel) {
        case 'email': return <Mail size={size} />;
        case 'whatsapp': return <MessageSquare size={size} />;
        case 'sms': return <Smartphone size={size} />;
        case 'call': return <Phone size={size} />;
        default: return <Zap size={size} />;
    }
};

// --- CREATE WIZARD MODAL ---

interface CreateModalProps {
    initialData?: Partial<Framework> | null;
    onClose: () => void;
    onSave: (data: Partial<Framework>) => void;
}

export const CreateFrameworkModal: React.FC<CreateModalProps> = ({ initialData, onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<Framework>>({
        name: '',
        description: '',
        lane: undefined,
        actions: [],
        status: 'active',
        ...initialData
    });

    const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
    
    // Validation for Flow step
    const hasInvalidActions = (formData.actions || []).some(a => !a.isValid);

    const isEditMode = !!initialData?.id;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white w-full max-w-[1400px] h-[85vh] rounded-xl shadow-2xl z-10 flex flex-col overflow-hidden"
            >
                {/* Wizard Header */}
                <div className="px-8 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {isEditMode ? 'Editar Framework' : 'Crear Nuevo Framework'}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span>Paso {step} de 4</span>
                            <span className="text-slate-300">•</span>
                            <span className="font-medium text-indigo-600">
                                {step === 1 ? 'Información Básica' : step === 2 ? 'Diseñador de Flujo' : step === 3 ? 'Reglas' : 'Vista Previa'}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-slate-100">
                    <div 
                        className="h-full bg-indigo-600 transition-all duration-300 ease-out" 
                        style={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-hidden bg-slate-50 relative">
                    {step === 1 && (
                        <div className="overflow-y-auto h-full p-8">
                            <StepBasicInfo data={formData} onChange={setFormData} />
                        </div>
                    )}
                    {step === 2 && <FlowBuilder data={formData} onChange={setFormData} />}
                    {step === 3 && (
                        <div className="overflow-y-auto h-full p-8">
                            <StepRules />
                        </div>
                    )}
                    {step === 4 && (
                        <div className="overflow-y-auto h-full p-8">
                            <StepPreview data={formData} />
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="px-8 py-4 border-t border-slate-200 bg-white flex justify-between items-center flex-none">
                    <button 
                        onClick={handleBack}
                        disabled={step === 1}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        Atrás
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={step === 4 ? () => onSave(formData) : handleNext}
                            disabled={
                                (step === 1 && (!formData.name || !formData.lane)) ||
                                (step === 2 && hasInvalidActions)
                            }
                            className={`px-6 py-2 text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                                ${step === 4 
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' 
                                    : 'bg-slate-900 hover:bg-slate-800 text-white'}
                            `}
                        >
                            {step === 4 ? (isEditMode ? 'Guardar Cambios' : 'Publicar Framework') : 'Siguiente'}
                            {step !== 4 && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

// --- FLOW BUILDER COMPONENTS ---

const FlowBuilder: React.FC<{ data: Partial<Framework>, onChange: (d: Partial<Framework>) => void }> = ({ data, onChange }) => {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Convert linear actions to nodes with positions
    const sortedActions = [...(data.actions || [])].sort((a, b) => a.timing - b.timing);
    
    // Add Trigger Node
    const nodes = [
        { id: 'start', type: 'trigger', x: 400, y: 50, label: 'Inicio', subLabel: 'Día de Vencimiento' },
        ...sortedActions.map((action, i) => ({
            id: action.id,
            type: 'action',
            x: 400,
            y: 180 + (i * 120), // Vertical spacing
            data: action
        }))
    ];

    const validateAction = (action: FrameworkAction): boolean => {
        if (!action.templateName) return false;
        if (!action.config) return false;
        
        switch (action.channel) {
            case 'whatsapp':
                const wa = action.config as WhatsAppConfig;
                return !!(wa.sender && wa.templateId && wa.language);
            case 'email':
                const em = action.config as EmailConfig;
                return !!(em.fromAddress && em.subject && em.templateId);
            case 'sms':
                const sms = action.config as SMSConfig;
                return !!(sms.senderId && sms.messageContent);
            case 'call':
                const call = action.config as CallConfig;
                return !!(call.callerId && call.type && call.objective);
            default:
                return true;
        }
    };

    const handleAddNode = (type: ChannelType) => {
        const lastAction = sortedActions[sortedActions.length - 1];
        const newTiming = lastAction ? lastAction.timing + 2 : 1;
        
        const newAction: FrameworkAction = {
            id: Math.random().toString(36).substr(2, 9),
            order: sortedActions.length + 1,
            channel: type,
            timing: newTiming,
            templateName: 'Nueva Acción',
            isValid: false
        };
        
        onChange({ ...data, actions: [...(data.actions || []), newAction] });
        setSelectedNodeId(newAction.id);
    };

    const handleDeleteNode = (id: string) => {
        const newActions = (data.actions || []).filter(a => a.id !== id);
        onChange({ ...data, actions: newActions });
        setSelectedNodeId(null);
    };

    const handleUpdateNode = (id: string, updates: Partial<FrameworkAction>) => {
        const currentActions = data.actions || [];
        const actionIndex = currentActions.findIndex(a => a.id === id);
        if (actionIndex === -1) return;

        const updatedAction = { ...currentActions[actionIndex], ...updates };
        // Re-validate
        updatedAction.isValid = validateAction(updatedAction);

        const newActions = [...currentActions];
        newActions[actionIndex] = updatedAction;
        
        onChange({ ...data, actions: newActions });
    };

    const handleConfigUpdate = (id: string, configUpdates: any) => {
         const currentActions = data.actions || [];
         const actionIndex = currentActions.findIndex(a => a.id === id);
         if (actionIndex === -1) return;

         const currentConfig = currentActions[actionIndex].config || {};
         const updatedAction = { 
             ...currentActions[actionIndex], 
             config: { ...currentConfig, ...configUpdates } 
         };
         
         updatedAction.isValid = validateAction(updatedAction);

         const newActions = [...currentActions];
         newActions[actionIndex] = updatedAction;
         onChange({ ...data, actions: newActions });
    };

    return (
        <div className="flex h-full w-full bg-[#f8f9fb]">
            {/* CANVAS AREA */}
            <div ref={containerRef} className="flex-1 relative overflow-auto cursor-grab active:cursor-grabbing custom-scrollbar">
                {/* Dotted Background */}
                <div 
                    className="absolute inset-0 w-[2000px] h-[2000px] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        opacity: 0.5
                    }}
                />

                <div className="relative min-h-[800px] w-full pt-10 pb-32 flex flex-col items-center">
                    
                    {/* Render Nodes & Edges */}
                    <div className="relative w-[800px] flex flex-col items-center">
                        
                        {/* Start Node */}
                        <div className="mb-8 z-10">
                            <Node 
                                type="trigger" 
                                label="Trigger: Vencimiento" 
                                subLabel="Fecha de corte"
                                icon={<Calendar className="w-4 h-4" />} 
                                selected={false}
                            />
                        </div>

                        {/* Action Nodes */}
                        {nodes.filter(n => n.type === 'action').map((node, index) => {
                            const action = (node as any).data as FrameworkAction;
                            const prevTiming = index === 0 ? 0 : ((nodes[index] as any).data as FrameworkAction).timing;

                            return (
                                <React.Fragment key={node.id}>
                                    {/* Edge Line with Time Badge */}
                                    <div className="h-16 w-0.5 bg-slate-300 relative flex items-center justify-center">
                                        <div className="absolute bg-white px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-mono font-bold text-slate-500 shadow-sm flex items-center gap-1 z-0">
                                            <Clock className="w-3 h-3" />
                                            {action.timing === 0 ? 'Mismo día' : action.timing > 0 ? `+${action.timing}d` : `${action.timing}d`}
                                        </div>
                                    </div>

                                    {/* The Node */}
                                    <div className="z-10" onClick={() => setSelectedNodeId(node.id)}>
                                        <Node 
                                            type="action"
                                            label={action.templateName}
                                            subLabel={`${action.channel}`}
                                            icon={<ChannelIcon channel={action.channel} />}
                                            channel={action.channel}
                                            selected={selectedNodeId === node.id}
                                            isValid={action.isValid}
                                        />
                                    </div>
                                </React.Fragment>
                            );
                        })}

                        {/* End Placeholder */}
                         <div className="h-16 w-0.5 bg-slate-300/50 border-l border-dashed border-slate-400"></div>
                         <div className="opacity-50 grayscale">
                             <Node type="trigger" label="Fin del Flujo" icon={<CheckCircle2 className="w-4 h-4" />} selected={false} />
                         </div>

                    </div>
                </div>

                {/* Floating Toolbar */}
                <div className="absolute left-6 top-6 bg-white p-2 rounded-xl shadow-xl border border-slate-100 flex flex-col gap-2 z-20">
                    <p className="text-[10px] font-bold text-slate-400 text-center uppercase mb-1">Añadir</p>
                    <ToolbarButton icon={<Mail />} label="Email" onClick={() => handleAddNode('email')} color="bg-blue-50 text-blue-600 hover:bg-blue-100" />
                    <ToolbarButton icon={<MessageSquare />} label="WhatsApp" onClick={() => handleAddNode('whatsapp')} color="bg-emerald-50 text-emerald-600 hover:bg-emerald-100" />
                    <ToolbarButton icon={<Smartphone />} label="SMS" onClick={() => handleAddNode('sms')} color="bg-amber-50 text-amber-600 hover:bg-amber-100" />
                    <ToolbarButton icon={<Phone />} label="Llamada" onClick={() => handleAddNode('call')} color="bg-purple-50 text-purple-600 hover:bg-purple-100" />
                </div>
            </div>

            {/* PROPERTIES PANEL */}
            <div className={`w-96 bg-white border-l border-slate-200 shadow-xl z-30 transition-all duration-300 ${selectedNodeId ? 'translate-x-0' : 'translate-x-full absolute right-0'}`}>
                {selectedNodeId && (() => {
                    const action = (data.actions || []).find(a => a.id === selectedNodeId);
                    if (!action) return null;

                    return (
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Settings className="w-4 h-4" /> Configuración
                                </h3>
                                <button onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                                
                                {/* Common Info */}
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Nombre de la Acción</label>
                                        <input 
                                            type="text" 
                                            value={action.templateName}
                                            onChange={(e) => handleUpdateNode(action.id, { templateName: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                                            placeholder="Ej: Recordatorio #1"
                                        />
                                    </div>
                                    
                                    <div className="space-y-1">
                                         <label className="text-xs font-bold text-slate-500 uppercase">Timing (Días)</label>
                                         <div className="flex items-center gap-2">
                                             <div className="relative flex-1">
                                                <input 
                                                    type="number" 
                                                    value={action.timing}
                                                    onChange={(e) => handleUpdateNode(action.id, { timing: parseInt(e.target.value) })}
                                                    className="w-full pl-3 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                                                />
                                             </div>
                                             <span className="text-xs text-slate-400 whitespace-nowrap">vs. Vencimiento</span>
                                         </div>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 w-full"></div>

                                {/* Channel Specific Form */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-1.5 bg-slate-100 rounded text-slate-600">
                                            <ChannelIcon channel={action.channel} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-800 capitalize">Configuración {action.channel}</span>
                                    </div>

                                    {action.channel === 'whatsapp' && (
                                        <WhatsAppConfigForm config={action.config as WhatsAppConfig} onChange={(c) => handleConfigUpdate(action.id, c)} />
                                    )}
                                    {action.channel === 'email' && (
                                        <EmailConfigForm config={action.config as EmailConfig} onChange={(c) => handleConfigUpdate(action.id, c)} />
                                    )}
                                    {action.channel === 'sms' && (
                                        <SMSConfigForm config={action.config as SMSConfig} onChange={(c) => handleConfigUpdate(action.id, c)} />
                                    )}
                                    {action.channel === 'call' && (
                                        <CallConfigForm config={action.config as CallConfig} onChange={(c) => handleConfigUpdate(action.id, c)} />
                                    )}
                                </div>

                                <div className="h-px bg-slate-100 w-full"></div>

                                {/* Cost Preview */}
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Costo estimado</span>
                                    <span className="text-lg font-bold text-emerald-600 font-mono">
                                        ${CHANNEL_PRICING[action.channel].toFixed(2)}
                                    </span>
                                </div>

                            </div>

                            <div className="p-4 border-t border-slate-100 bg-slate-50">
                                <button 
                                    onClick={() => handleDeleteNode(action.id)}
                                    className="w-full py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" /> Eliminar Acción
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

// ... (Rest of file including Config Forms and Steps logic kept intact, just ensuring readOnly logic is removed from FlowBuilder calls above)
// I already removed `readOnly` passed prop usage in FlowBuilder and CreateFrameworkModal above.

// --- CONFIG FORMS ---

const WhatsAppConfigForm: React.FC<{ config?: WhatsAppConfig, onChange: (c: Partial<WhatsAppConfig>) => void }> = ({ config, onChange }) => (
    <div className="space-y-4">
        <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Remitente (Número)</label>
            <select 
                value={config?.sender || ''} 
                onChange={e => onChange({ sender: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-indigo-400"
            >
                <option value="">Seleccionar...</option>
                <option value="+15550101">+1 (555) 0101 (Marketing)</option>
                <option value="+15550102">+1 (555) 0102 (Support)</option>
            </select>
        </div>
        <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Plantilla Aprobada</label>
            <select 
                value={config?.templateId || ''} 
                onChange={e => onChange({ templateId: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-indigo-400"
            >
                <option value="">Seleccionar...</option>
                <option value="wa_reminder_v1">Recordatorio de Pago (v1)</option>
                <option value="wa_urgent_v2">Aviso Urgente (v2)</option>
                <option value="wa_promo_q1">Promoción Q1</option>
            </select>
        </div>
        <div className="space-y-1">
             <label className="text-xs font-semibold text-slate-600">Idioma</label>
             <select 
                value={config?.language || ''} 
                onChange={e => onChange({ language: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-indigo-400"
            >
                <option value="">Seleccionar...</option>
                <option value="es">Español</option>
                <option value="en">Inglés</option>
                <option value="pt">Portugués</option>
            </select>
        </div>
        <div className="pt-2">
            <label className="text-xs font-semibold text-slate-600 mb-2 block">Variables (JSON)</label>
            <div className="bg-slate-100 p-2 rounded text-xs font-mono text-slate-500 break-all">
                {`{ "name": "{customer.name}", "amount": "{ticket.amount}" }`}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Mapeo automático basado en plantilla.</p>
        </div>
    </div>
);

const EmailConfigForm: React.FC<{ config?: EmailConfig, onChange: (c: Partial<EmailConfig>) => void }> = ({ config, onChange }) => (
    <div className="space-y-4">
        <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Dirección 'From'</label>
             <input 
                type="text" 
                value={config?.fromAddress || ''}
                onChange={e => onChange({ fromAddress: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-indigo-400"
                placeholder="billing@company.com"
            />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Asunto</label>
             <input 
                type="text" 
                value={config?.subject || ''}
                onChange={e => onChange({ subject: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-indigo-400"
                placeholder="Su factura vence pronto"
            />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Plantilla HTML</label>
            <select 
                value={config?.templateId || ''} 
                onChange={e => onChange({ templateId: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-indigo-400"
            >
                <option value="">Seleccionar...</option>
                <option value="tpl_basic">Estándar Corporativo</option>
                <option value="tpl_dark">Tema Oscuro</option>
                <option value="tpl_urgent">Alerta Roja</option>
            </select>
        </div>
        <div className="flex items-center gap-2 pt-2">
            <input 
                type="checkbox" 
                checked={config?.includeInvoice || false}
                onChange={e => onChange({ includeInvoice: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="text-xs font-medium text-slate-700">Adjuntar PDF de Factura</label>
        </div>
    </div>
);

const SMSConfigForm: React.FC<{ config?: SMSConfig, onChange: (c: Partial<SMSConfig>) => void }> = ({ config, onChange }) => (
    <div className="space-y-4">
         <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Sender ID</label>
             <input 
                type="text" 
                value={config?.senderId || ''}
                onChange={e => onChange({ senderId: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-indigo-400"
                placeholder="FINTECH / BRAND"
                maxLength={11}
            />
             <p className="text-[10px] text-slate-400">Máx 11 caracteres alfanuméricos.</p>
        </div>
        <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Contenido del Mensaje</label>
             <textarea 
                value={config?.messageContent || ''}
                onChange={e => onChange({ messageContent: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-indigo-400 min-h-[80px]"
                placeholder="Hola {name}, tu pago de {amount} vence hoy."
            />
             <p className="text-[10px] text-slate-400 text-right">{config?.messageContent?.length || 0} caracteres</p>
        </div>
    </div>
);

const CallConfigForm: React.FC<{ config?: CallConfig, onChange: (c: Partial<CallConfig>) => void }> = ({ config, onChange }) => (
    <div className="space-y-4">
         <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Caller ID</label>
            <select 
                value={config?.callerId || ''} 
                onChange={e => onChange({ callerId: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-indigo-400"
            >
                <option value="">Seleccionar...</option>
                <option value="+18005550000">Línea Principal (+1 800...)</option>
                <option value="+18005559999">Cobranzas (+1 800...)</option>
            </select>
        </div>
         <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Tipo de Llamada</label>
             <div className="flex gap-2">
                 {(['bot', 'human', 'ivr'] as const).map(t => (
                     <button 
                        key={t}
                        onClick={() => onChange({ type: t })}
                        className={`flex-1 py-1.5 text-xs font-medium rounded border ${config?.type === t ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'}`}
                     >
                         {t === 'bot' ? 'IA Voice' : t === 'human' ? 'Agente' : 'IVR'}
                     </button>
                 ))}
             </div>
        </div>
        <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Objetivo</label>
            <select 
                value={config?.objective || ''} 
                onChange={e => onChange({ objective: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-indigo-400"
            >
                <option value="">Seleccionar...</option>
                <option value="payment_reminder">Recordatorio de Pago</option>
                <option value="commitment">Obtener Promesa de Pago</option>
                <option value="renegotiation">Ofrecer Refinanciación</option>
            </select>
        </div>
        {config?.type === 'bot' && (
             <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Script ID (Reference)</label>
                <input 
                    type="text" 
                    value={config?.scriptId || ''}
                    onChange={e => onChange({ scriptId: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-indigo-400"
                    placeholder="script_v1_payment"
                />
            </div>
        )}
    </div>
);

const Node: React.FC<{ 
    type: 'trigger' | 'action'; 
    label: string; 
    subLabel?: string;
    icon: React.ReactNode; 
    channel?: ChannelType;
    selected: boolean;
    isValid?: boolean;
}> = ({ type, label, subLabel, icon, channel, selected, isValid = true }) => {
    
    // Node styling based on type
    const baseClasses = "relative w-64 rounded-xl border-2 shadow-sm transition-all duration-200 flex items-center gap-4 p-4 cursor-pointer hover:shadow-md group";
    const typeClasses = type === 'trigger' 
        ? "bg-slate-900 border-slate-900 text-white" 
        : selected 
            ? "bg-white border-indigo-500 ring-2 ring-indigo-100" 
            : "bg-white border-slate-200 hover:border-indigo-300";

    const iconClasses = type === 'trigger'
        ? "bg-slate-700 text-white"
        : selected
            ? "bg-indigo-100 text-indigo-600"
            : "bg-slate-100 text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50";

    return (
        <div className={baseClasses + " " + typeClasses}>
            {/* Input Handle (Top) */}
            {type !== 'trigger' && (
                <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 bg-white ${selected ? 'border-indigo-500' : 'border-slate-300'}`}></div>
            )}
            
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${iconClasses}`}>
                {icon}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className={`text-sm font-bold truncate ${type === 'trigger' ? 'text-white' : 'text-slate-800'}`}>
                    {label}
                </div>
                {subLabel && (
                    <div className={`text-xs truncate ${type === 'trigger' ? 'text-slate-400' : 'text-slate-400'}`}>
                        {subLabel}
                    </div>
                )}
            </div>

            {/* Validation Indicator */}
            {type !== 'trigger' && !isValid && (
                <div className="absolute -right-2 -top-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm z-20">
                    <AlertTriangle className="w-3 h-3" />
                </div>
            )}

            {/* Output Handle (Bottom) */}
            <div className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 bg-white ${selected ? 'border-indigo-500' : 'border-slate-300'}`}></div>
        </div>
    );
};

const ToolbarButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; color: string }> = ({ icon, label, onClick, color }) => (
    <button 
        onClick={onClick}
        className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${color} shadow-sm hover:shadow-md`}
        title={label}
    >
        <div className="w-5 h-5">{icon}</div>
    </button>
);


// --- WIZARD STEPS (Others) ---

const StepBasicInfo: React.FC<{ data: Partial<Framework>, onChange: (d: Partial<Framework>) => void }> = ({ data, onChange }) => {
    return (
        <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-800">Nombre del Framework</label>
                <input 
                    type="text" 
                    value={data.name}
                    onChange={e => onChange({ ...data, name: e.target.value })}
                    placeholder="Ej: Preventivo Suave, Renegociación Q1..." 
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    autoFocus
                />
                <p className="text-xs text-slate-500">Un nombre descriptivo que identifique la estrategia de ejecución.</p>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
                    🏷️ Tag de Bandeja (Lane Tag)
                    <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded uppercase">Requerido</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {STAGES.map(stage => (
                        <button
                            key={stage.id}
                            onClick={() => onChange({ ...data, lane: stage.id })}
                            className={`
                                p-3 rounded-lg border text-left transition-all
                                ${data.lane === stage.id 
                                    ? `bg-${stage.colorTheme}-50 border-${stage.colorTheme}-500 ring-1 ring-${stage.colorTheme}-500` 
                                    : 'bg-white border-slate-200 hover:border-slate-300'}
                            `}
                        >
                            <div className={`font-bold text-sm ${data.lane === stage.id ? `text-${stage.colorTheme}-700` : 'text-slate-700'}`}>
                                {stage.label}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">{stage.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-800">Descripción / Intención</label>
                <textarea 
                    value={data.description}
                    onChange={e => onChange({ ...data, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all h-24 resize-none"
                    placeholder="Describe el objetivo de esta estrategia..."
                />
            </div>
        </div>
    );
};

const StepRules: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-8 text-center">
                 <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                    <Tag className="w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900">Reglas de Asignación (Segmentación)</h3>
                 <p className="text-sm text-slate-500 max-w-lg mx-auto">
                    Define qué criterios deben cumplir los clientes para entrar automáticamente en este framework.
                 </p>
            </div>

            <div className="space-y-4">
                 {/* Rule 1 */}
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 opacity-75">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">1</div>
                     <div className="flex-1">
                         <div className="flex items-center gap-2 mb-1">
                             <span className="text-xs font-bold uppercase text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">IF</span>
                             <span className="text-sm font-mono text-indigo-600 font-semibold">risk_score</span>
                         </div>
                         <div className="text-sm text-slate-600">Mayor que <span className="font-bold">75</span></div>
                     </div>
                     <div className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded">AND</div>
                 </div>

                 {/* Rule 2 */}
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 opacity-75">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">2</div>
                     <div className="flex-1">
                         <div className="flex items-center gap-2 mb-1">
                             <span className="text-xs font-bold uppercase text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">IF</span>
                             <span className="text-sm font-mono text-indigo-600 font-semibold">debt_amount</span>
                         </div>
                         <div className="text-sm text-slate-600">Mayor que <span className="font-bold">$500.00</span></div>
                     </div>
                     <button className="text-slate-400 hover:text-rose-500 transition-colors">
                         <X className="w-4 h-4" />
                     </button>
                 </div>

                 <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 font-medium text-sm">
                     <Plus className="w-4 h-4" /> Añadir Condición
                 </button>
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-100 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-none" />
                <p>
                    Nota: En esta demo, las reglas son solo visuales. El framework se creará pero la asignación automática requiere integración con el motor de reglas.
                </p>
            </div>
        </div>
    );
};

const StepPreview: React.FC<{ data: Partial<Framework> }> = ({ data }) => {
    const laneInfo = STAGES.find(s => s.id === data.lane);
    const sortedActions = [...(data.actions || [])].sort((a, b) => a.timing - b.timing);
    const totalCost = (data.actions || []).reduce((acc, act) => acc + (CHANNEL_PRICING[act.channel] || 0), 0);

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 mb-4">
                    <Workflow className="w-3.5 h-3.5" />
                    Vista Previa de Ejecución
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{data.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                     <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">${totalCost.toFixed(2)} / ejecución</span>
                     <span className="text-slate-300">•</span>
                     <span className="text-slate-500 text-sm">{data.description}</span>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 relative overflow-hidden shadow-sm">
                
                {/* Lane Routing Info */}
                <div className="absolute top-0 right-0 p-4">
                    <div className={`text-xs font-bold uppercase tracking-wider text-${laneInfo?.colorTheme}-600 bg-${laneInfo?.colorTheme}-50 border border-${laneInfo?.colorTheme}-100 px-2 py-1 rounded`}>
                        Destino: {laneInfo?.label}
                    </div>
                </div>

                <div className="relative pl-8 border-l-2 border-slate-100 space-y-8 py-4">
                    {sortedActions.map((action, idx) => (
                        <div key={idx} className="relative">
                            {/* Dot */}
                            <div className="absolute -left-[39px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-indigo-500 z-10"></div>
                            
                            <div className="flex items-center gap-6 group">
                                <div className="w-16 flex-none text-right">
                                    <span className="text-xs font-bold text-slate-400 font-mono">
                                        {action.timing === 0 ? 'Día 0' : action.timing > 0 ? `D+${action.timing}` : `D${action.timing}`}
                                    </span>
                                </div>

                                <div className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center gap-4 transition-all group-hover:border-indigo-200 group-hover:shadow-sm">
                                    <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-indigo-600">
                                        <ChannelIcon channel={action.channel} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-slate-800">{action.templateName}</div>
                                        <div className="text-xs text-slate-400 capitalize">{action.channel} Channel</div>
                                    </div>
                                    <div className="text-xs font-mono font-bold text-slate-400 group-hover:text-emerald-600">
                                        ${CHANNEL_PRICING[action.channel].toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500 italic">
                        "Los compromisos que utilicen este framework aparecerán en la bandeja <strong>{laneInfo?.label}</strong> del Mapa de Compromisos."
                    </p>
                </div>

            </div>
        </div>
    );
};

// Helper Icon Wrapper
const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);
