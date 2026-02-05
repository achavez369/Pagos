
import React, { useState } from 'react';
import { 
  BookOpen, Plus, Search, Filter, MoreHorizontal, 
  Workflow, ArrowRight, CheckCircle2, AlertTriangle, 
  Clock, DollarSign, Copy, Edit, Trash, Shield, 
  Users, Layers, ChevronRight, X, Save, Zap,
  Mail, MessageSquare, Smartphone, Phone, Settings
} from 'lucide-react';
import { 
  Playbook, PlaybookStageConfig, Framework, StageId, RiskProfile, UseCase, FrameworkAction, ChannelType 
} from '../types';
import { STAGES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateFrameworkModal, MOCK_FRAMEWORKS as INITIAL_FRAMEWORKS } from './FrameworksManager';

// --- MOCK PLAYBOOKS ---
const MOCK_PLAYBOOKS: Playbook[] = [
    {
        id: 'pb-001',
        name: 'Estrategia Core: Suscripción Mensual',
        description: 'Flujo estándar para clientes recurrentes de bajo riesgo.',
        status: 'active',
        riskProfile: 'low',
        useCase: 'subscription',
        version: 1.2,
        updatedAt: new Date(),
        updatedBy: 'Admin',
        campaigns: ['Suscripción Marzo', 'Suscripción Abril'],
        stages: [
            { stageId: StageId.PREVENTIVE, frameworkIds: ['fw-001'] },
            { stageId: StageId.PAYMENT_DAY, frameworkIds: ['fw-002'] },
            { stageId: StageId.POST_PAYMENT, frameworkIds: ['fw-003'] }
        ]
    },
    {
        id: 'pb-002',
        name: 'Recuperación Agresiva',
        description: 'Diseñado para segmentos de alto riesgo con deuda > $500.',
        status: 'draft',
        riskProfile: 'high',
        useCase: 'custom',
        version: 0.1,
        updatedAt: new Date(),
        updatedBy: 'Admin',
        campaigns: [],
        stages: [
            { stageId: StageId.PAYMENT_DAY, frameworkIds: ['fw-002'] },
            { stageId: StageId.ESCALATION, frameworkIds: ['fw-004'] }
        ]
    }
];

export const PlaybooksManager: React.FC = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>(MOCK_PLAYBOOKS);
  const [availableFrameworks, setAvailableFrameworks] = useState<Framework[]>(INITIAL_FRAMEWORKS);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPlaybook, setEditingPlaybook] = useState<Partial<Playbook> | null>(null);

  const handleCreate = () => {
      setEditingPlaybook(null);
      setIsEditorOpen(true);
  };

  const handleEdit = (pb: Playbook) => {
      setEditingPlaybook(pb);
      setIsEditorOpen(true);
  };

  const handleDuplicate = (pb: Playbook) => {
      setEditingPlaybook({
          ...pb,
          id: undefined,
          name: `${pb.name} (Copia)`,
          status: 'draft',
          version: 1.0,
          campaigns: [] // Reset campaigns on duplicate
      });
      setIsEditorOpen(true);
  };

  const handleDelete = (id: string) => {
      if(confirm("¿Eliminar estrategia?")) {
          setPlaybooks(prev => prev.filter(p => p.id !== id));
      }
  };

  const handleSave = (pb: Partial<Playbook>) => {
      if (pb.id) {
          setPlaybooks(prev => prev.map(p => p.id === pb.id ? { ...p, ...pb } as Playbook : p));
      } else {
          const newPb = {
              ...pb,
              id: Math.random().toString(36).substr(2, 9),
              updatedAt: new Date(),
              updatedBy: 'Tu',
              campaigns: [],
              status: pb.status || 'draft',
              version: 1.0
          } as Playbook;
          setPlaybooks(prev => [...prev, newPb]);
      }
      setIsEditorOpen(false);
  };

  // Callback to update frameworks list when a framework is created/edited from within the Playbook Editor
  const handleFrameworkUpdate = (fw: Partial<Framework>) => {
      if (fw.id) {
          // Update existing
          setAvailableFrameworks(prev => prev.map(f => f.id === fw.id ? { ...f, ...fw } as Framework : f));
      } else {
          // Create new
          const newFramework: Framework = {
              ...fw,
              id: Math.random().toString(36).substr(2, 9),
              usage: { playbooks: 0, campaigns: 0 },
              updatedAt: new Date(),
              status: fw.status || 'active'
          } as Framework;
          setAvailableFrameworks(prev => [...prev, newFramework]);
      }
  };

  if (isEditorOpen) {
      return (
          <PlaybookEditor 
            initialData={editingPlaybook} 
            availableFrameworks={availableFrameworks}
            onClose={() => setIsEditorOpen(false)} 
            onSave={handleSave} 
            onUpdateFramework={handleFrameworkUpdate}
          />
      );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-white text-slate-900 font-sans">
      
      {/* HEADER */}
      <header className="px-8 py-6 border-b border-slate-100 bg-white">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                    Gestión de Estrategias
                </h1>
                <p className="text-slate-500 text-sm mt-1 max-w-2xl">
                    Orquestación de Playbooks a lo largo del ciclo de vida del cliente.
                </p>
            </div>
            <button 
                onClick={handleCreate}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
                <Plus className="w-4 h-4" /> Nueva Estrategia
            </button>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="px-8 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
                type="text" 
                placeholder="Buscar estrategia..." 
                className="pl-9 pr-4 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-100 outline-none w-64"
            />
        </div>
        <div className="h-4 w-px bg-slate-300 mx-2"></div>
        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <Filter className="w-3.5 h-3.5" /> Riesgo
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <Filter className="w-3.5 h-3.5" /> Estado
        </button>
      </div>

      {/* LIST VIEW */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
            <thead className="bg-white sticky top-0 z-10 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                    <th className="px-8 py-4 w-1/3">ESTRATEGIA</th>
                    <th className="px-6 py-4">ESTADO</th>
                    <th className="px-6 py-4">PLAYBOOKS</th>
                    <th className="px-6 py-4">COBERTURA</th>
                    <th className="px-6 py-4">CAMPAÑAS</th>
                    <th className="px-6 py-4">RIESGO</th>
                    <th className="px-6 py-4 w-10"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
                {playbooks.map((pb) => {
                    return (
                        <tr key={pb.id} className="hover:bg-slate-50 transition-colors group cursor-default">
                            <td className="px-8 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="font-bold text-slate-900 cursor-pointer hover:text-indigo-600" onClick={() => handleEdit(pb)}>{pb.name}</div>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{pb.description}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <StatusBadge status={pb.status} />
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-bold text-slate-800 text-lg">
                                    {pb.stages.reduce((acc, s) => acc + s.frameworkIds.length, 0)}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-1">
                                    {STAGES.map(stage => {
                                        const hasStage = pb.stages.some(s => s.stageId === stage.id && s.frameworkIds.length > 0);
                                        return (
                                            <div 
                                                key={stage.id}
                                                title={stage.label}
                                                className={`w-2 h-6 rounded-sm ${hasStage ? `bg-${stage.colorTheme}-500` : 'bg-slate-200'}`}
                                            />
                                        );
                                    })}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                    {pb.campaigns.length}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <RiskBadge risk={pb.riskProfile} />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDuplicate(pb)} className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-indigo-600" title="Duplicar">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(pb.id)} className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-rose-600" title="Eliminar">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>
    </div>
  );
};

// --- EDITOR COMPONENT ---

const PlaybookEditor: React.FC<{ 
    initialData?: Partial<Playbook> | null; 
    availableFrameworks: Framework[];
    onClose: () => void; 
    onSave: (pb: Partial<Playbook>) => void;
    onUpdateFramework: (fw: Partial<Framework>) => void;
}> = ({ initialData, availableFrameworks, onClose, onSave, onUpdateFramework }) => {
    const [activeTab, setActiveTab] = useState<'strategy' | 'preview'>('strategy');
    const [formData, setFormData] = useState<Partial<Playbook>>({
        name: '',
        description: '',
        riskProfile: 'medium',
        useCase: 'subscription',
        status: 'draft',
        stages: [],
        campaigns: [],
        ...initialData
    });

    const isComplete = formData.name && formData.description && formData.stages && formData.stages.length > 0;

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* EDITOR HEADER */}
            <div className="px-8 py-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {initialData?.id ? 'Editar Estrategia' : 'Crear Estrategia'}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>v{formData.version || '1.0'}</span>
                            <span>•</span>
                            <span className="uppercase tracking-wide">{formData.status}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
                        <TabButton label="Estrategia" active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')} />
                        <TabButton label="Simulación" active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} />
                    </div>
                    <div className="w-px h-6 bg-slate-300 mx-1"></div>
                    <button 
                        onClick={() => onSave(formData)}
                        disabled={!isComplete}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-lg flex items-center gap-2 transition-colors shadow-sm shadow-indigo-200"
                    >
                        <Save className="w-4 h-4" /> Guardar
                    </button>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'strategy' && (
                    <StrategyTab 
                        data={formData} 
                        onChange={setFormData} 
                        availableFrameworks={availableFrameworks}
                        onUpdateFramework={onUpdateFramework}
                    />
                )}
                {activeTab === 'preview' && (
                    <PreviewTab 
                        data={formData} 
                        availableFrameworks={availableFrameworks}
                    />
                )}
            </div>
        </div>
    );
};

// --- TABS ---

const StrategyTab: React.FC<{ 
    data: Partial<Playbook>; 
    onChange: (d: Partial<Playbook>) => void;
    availableFrameworks: Framework[];
    onUpdateFramework: (fw: Partial<Framework>) => void;
}> = ({ data, onChange, availableFrameworks, onUpdateFramework }) => {
    const [isAddingToStage, setIsAddingToStage] = useState<StageId | null>(null);
    const [editingFrameworkId, setEditingFrameworkId] = useState<string | null>(null);
    const [isCreatingFramework, setIsCreatingFramework] = useState(false);

    // Filter available frameworks for the edit modal
    const frameworkToEdit = editingFrameworkId ? availableFrameworks.find(f => f.id === editingFrameworkId) : null;

    const getFrameworksForStage = (stageId: StageId) => {
        const stageConfig = data.stages?.find(s => s.stageId === stageId);
        if (!stageConfig) return [];
        return stageConfig.frameworkIds.map(fid => availableFrameworks.find(f => f.id === fid)).filter(Boolean) as Framework[];
    };

    const addFramework = (stageId: StageId, frameworkId: string) => {
        const newStages = [...(data.stages || [])];
        const existingStageIndex = newStages.findIndex(s => s.stageId === stageId);
        
        if (existingStageIndex > -1) {
            newStages[existingStageIndex] = {
                ...newStages[existingStageIndex],
                frameworkIds: [...newStages[existingStageIndex].frameworkIds, frameworkId]
            };
        } else {
            newStages.push({ stageId, frameworkIds: [frameworkId] });
        }
        
        onChange({ ...data, stages: newStages });
        setIsAddingToStage(null);
    };

    const removeFramework = (stageId: StageId, frameworkId: string) => {
        const newStages = [...(data.stages || [])];
        const stageIndex = newStages.findIndex(s => s.stageId === stageId);
        if (stageIndex === -1) return;

        newStages[stageIndex] = {
            ...newStages[stageIndex],
            frameworkIds: newStages[stageIndex].frameworkIds.filter(fid => fid !== frameworkId)
        };

        onChange({ ...data, stages: newStages });
    };

    const handleFrameworkSaved = (fw: Partial<Framework>) => {
        onUpdateFramework(fw);
        setEditingFrameworkId(null);
        setIsCreatingFramework(false);
    };

    return (
        <div className="h-full flex flex-col">
            
            {/* METADATA HEADER (Merged Config) */}
            <div className="px-8 py-6 bg-white border-b border-slate-200 flex items-start gap-8 shadow-sm z-10 shrink-0">
                <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nombre Estrategia</label>
                        <input 
                            type="text" 
                            value={data.name}
                            onChange={e => onChange({ ...data, name: e.target.value })}
                            className="w-full text-xl font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none transition-colors placeholder:text-slate-300"
                            placeholder="Nombre de la Estrategia"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Descripción</label>
                        <input 
                            type="text" 
                            value={data.description}
                            onChange={e => onChange({ ...data, description: e.target.value })}
                            className="w-full text-sm text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none transition-colors placeholder:text-slate-300"
                            placeholder="Breve descripción del objetivo..."
                        />
                    </div>
                </div>

                <div className="w-px h-20 bg-slate-100 mx-4"></div>

                <div className="w-64 space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-500 uppercase">Perfil de Riesgo</label>
                        <select 
                            value={data.riskProfile} 
                            onChange={e => onChange({ ...data, riskProfile: e.target.value as RiskProfile })}
                            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-300"
                        >
                            <option value="low">Bajo</option>
                            <option value="medium">Medio</option>
                            <option value="high">Alto</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-500 uppercase">Caso de Uso</label>
                        <select 
                            value={data.useCase} 
                            onChange={e => onChange({ ...data, useCase: e.target.value as UseCase })}
                            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-300"
                        >
                            <option value="subscription">Suscripción</option>
                            <option value="installments">Cuotas</option>
                            <option value="one_time">Pago Único</option>
                            <option value="custom">Personalizado</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-500 uppercase">Estado</label>
                        <div className="flex gap-1 bg-slate-100 p-0.5 rounded">
                            {(['draft', 'active'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => onChange({ ...data, status: s })}
                                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${data.status === s ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* STAGE BUILDER */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-slate-100/50">
                <div className="h-full flex px-8 py-8 gap-6 min-w-max">
                    {STAGES.map(stage => {
                        const frameworks = getFrameworksForStage(stage.id);
                        const isTarget = isAddingToStage === stage.id;

                        return (
                            <div key={stage.id} className="w-80 flex flex-col h-full">
                                {/* STAGE HEADER */}
                                <div className={`
                                    p-4 rounded-t-xl border-b-2 flex justify-between items-center bg-white border-slate-100
                                    border-b-${stage.colorTheme}-500 shadow-sm
                                `}>
                                    <div className="font-bold text-slate-800">{stage.label}</div>
                                    <div className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                        {frameworks.length}
                                    </div>
                                </div>

                                {/* DROP ZONE / LIST */}
                                <div className="flex-1 bg-slate-50/50 border border-t-0 border-slate-200 rounded-b-xl p-3 overflow-y-auto space-y-3 relative">
                                    {frameworks.map((fw, idx) => (
                                        <div key={`${fw.id}-${idx}`} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm group hover:border-indigo-300 transition-all relative">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="text-sm font-bold text-slate-800">{fw.name}</div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => setEditingFrameworkId(fw.id)}
                                                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                                                        title="Editar Playbook"
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                    </button>
                                                    <button 
                                                        onClick={() => removeFramework(stage.id, fw.id)}
                                                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded"
                                                        title="Quitar"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mb-2">
                                                {fw.actions.map(a => (
                                                    <div key={a.id} className="p-1 bg-slate-50 rounded text-slate-500 border border-slate-100" title={a.channel}>
                                                        <ChannelIcon channel={a.channel} size={10} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                                                <span>{fw.actions.length} acciones</span>
                                                <span className="text-emerald-600">${fw.actions.reduce((sum, a) => sum + (CHANNEL_PRICING[a.channel] || 0), 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}

                                    <button 
                                        onClick={() => setIsAddingToStage(stage.id)}
                                        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                                    >
                                        <Plus className="w-4 h-4" /> Añadir Playbook
                                    </button>

                                    {/* SELECTOR POPUP */}
                                    <AnimatePresence>
                                        {isTarget && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="absolute inset-x-2 bottom-2 top-2 bg-white rounded-lg shadow-xl border border-slate-200 z-10 flex flex-col overflow-hidden"
                                            >
                                                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                                    <span className="text-xs font-bold text-slate-600 uppercase">Seleccionar</span>
                                                    <button onClick={() => setIsAddingToStage(null)}><X className="w-4 h-4 text-slate-400" /></button>
                                                </div>
                                                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                                    {/* Create New Button */}
                                                    <button 
                                                        onClick={() => { setIsCreatingFramework(true); setIsAddingToStage(null); }}
                                                        className="w-full text-left p-3 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-2"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                        <span className="text-xs font-bold">Crear Nuevo Playbook</span>
                                                    </button>
                                                    
                                                    <div className="h-px bg-slate-100 my-1"></div>

                                                    {/* Existing List */}
                                                    {availableFrameworks.filter(f => f.lane === stage.id).map(f => (
                                                        <button 
                                                            key={f.id}
                                                            onClick={() => addFramework(stage.id, f.id)}
                                                            className="w-full text-left p-3 rounded-md hover:bg-slate-50 hover:border-slate-200 border border-transparent transition-all group"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-700">{f.name}</div>
                                                                <div 
                                                                    className="text-slate-300 hover:text-indigo-500 p-1 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    onClick={(e) => { e.stopPropagation(); setEditingFrameworkId(f.id); setIsAddingToStage(null); }}
                                                                    title="Editar"
                                                                >
                                                                    <Edit className="w-3 h-3" />
                                                                </div>
                                                            </div>
                                                            <div className="text-xs text-slate-400 mt-0.5">{f.description}</div>
                                                        </button>
                                                    ))}
                                                    
                                                    {availableFrameworks.filter(f => f.lane === stage.id).length === 0 && (
                                                        <div className="text-center py-4 text-xs text-slate-400">
                                                            No hay más playbooks disponibles.
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* NESTED FRAMEWORK MODAL */}
            <AnimatePresence>
                {(isCreatingFramework || editingFrameworkId) && (
                    <CreateFrameworkModal 
                        initialData={frameworkToEdit}
                        onClose={() => { setIsCreatingFramework(false); setEditingFrameworkId(null); }}
                        onSave={handleFrameworkSaved}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// ... (Preview tab logic follows similarly)

const PreviewTab: React.FC<{ data: Partial<Playbook>; availableFrameworks: Framework[] }> = ({ data, availableFrameworks }) => {
    // Flatten all frameworks in order of stage
    const sequence = STAGES.flatMap(stage => {
        const stageConfig = data.stages?.find(s => s.stageId === stage.id);
        if (!stageConfig) return [];
        return stageConfig.frameworkIds.map(fid => {
            const fw = availableFrameworks.find(f => f.id === fid);
            return { stage, framework: fw };
        }).filter(item => item.framework);
    });

    const totalCost = sequence.reduce((acc, item) => {
        const fwCost = item.framework?.actions.reduce((sum, a) => sum + (CHANNEL_PRICING[a.channel] || 0), 0) || 0;
        return acc + fwCost;
    }, 0);

    return (
        <div className="h-full flex bg-slate-50 overflow-hidden">
            <div className="flex-1 p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                         <h3 className="text-2xl font-bold text-slate-900">Simulación de Ejecución</h3>
                         <p className="text-slate-500 mt-2">Flujo lineal de experiencia del cliente</p>
                    </div>

                    <div className="space-y-8 relative pl-8 border-l-2 border-slate-200">
                        {sequence.map((item, idx) => (
                            <div key={idx} className="relative animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className={`
                                    absolute -left-[41px] top-6 w-6 h-6 rounded-full border-4 border-slate-50 z-10
                                    bg-${item.stage.colorTheme}-500 shadow-sm
                                `}></div>
                                
                                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className={`text-xs font-bold uppercase tracking-wider text-${item.stage.colorTheme}-600 mb-1 block`}>
                                                {item.stage.label}
                                            </span>
                                            <h4 className="text-lg font-bold text-slate-900">{item.framework?.name}</h4>
                                        </div>
                                        <div className="flex gap-2">
                                            {item.framework?.actions.map(a => (
                                                <div key={a.id} className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                                                    <ChannelIcon channel={a.channel} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {item.framework?.actions.sort((a,b) => a.order - b.order).map(action => (
                                            <div key={action.id} className="flex items-center gap-4 text-sm group">
                                                <div className="w-12 text-right font-mono text-slate-400 text-xs">
                                                    {action.timing > 0 ? `+${action.timing}d` : `${action.timing}d`}
                                                </div>
                                                <ArrowRight className="w-3 h-3 text-slate-300" />
                                                <div className="flex-1 font-medium text-slate-700">{action.templateName}</div>
                                                <div className="text-xs font-mono text-slate-300 group-hover:text-emerald-600">
                                                    ${CHANNEL_PRICING[action.channel].toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                         
                         {sequence.length === 0 && (
                             <div className="text-center py-12 text-slate-400 italic">
                                 No hay playbooks configurados en la estrategia aún.
                             </div>
                         )}
                    </div>
                </div>
            </div>

            {/* SIDEBAR STATS */}
            <div className="w-80 bg-white border-l border-slate-200 p-8 flex flex-col gap-6 shadow-xl z-10">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4">Métricas Estimadas</h3>
                
                <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase">Costo Total por Ticket</p>
                    <p className="text-3xl font-bold text-emerald-600 font-mono">${totalCost.toFixed(2)}</p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase">Duración del Ciclo</p>
                    <p className="text-3xl font-bold text-slate-800 font-mono">~45 días</p>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 mt-auto">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                        <p className="text-xs text-slate-600 leading-relaxed">
                            <strong>Nota:</strong> El costo real dependerá de la tasa de resolución en etapas tempranas. Este cálculo asume que el ticket recorre todo el flujo.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- HELPERS ---

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
    >
        {label}
    </button>
);

const StatusBadge: React.FC<{ status: Playbook['status'] }> = ({ status }) => {
    const styles = {
        active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        draft: 'bg-slate-100 text-slate-600 border-slate-200',
        deprecated: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${styles[status]}`}>
            {status}
        </span>
    );
};

const RiskBadge: React.FC<{ risk: RiskProfile }> = ({ risk }) => {
    const styles = {
        low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        medium: 'bg-amber-50 text-amber-700 border-amber-200',
        high: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    const labels = { low: 'Bajo', medium: 'Medio', high: 'Alto' };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${styles[risk]}`}>
            {labels[risk]}
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

const CHANNEL_PRICING: Record<ChannelType, number> = {
    'email': 0.05,
    'whatsapp': 0.45,
    'sms': 0.25,
    'call': 0.80,
    'system': 0.00
};
