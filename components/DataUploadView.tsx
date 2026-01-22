
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, FileSpreadsheet, ArrowRight, CheckCircle2, 
  AlertCircle, X, ChevronRight, Database, Play, AlertTriangle, BookOpen,
  DollarSign, Calculator, HelpCircle
} from 'lucide-react';

// --- MOCK DATA SIMULATION ---
// Simulates the content of an uploaded Excel file
const MOCK_HEADERS = ['nombre_cliente', 'fecha_venta', 'email_contacto', 'telefono_movil', 'monto_deuda', 'notas_adicionales'];
const MOCK_ROWS = [
    { 'nombre_cliente': 'Ana Silva', 'fecha_venta': '2023-10-01', 'email_contacto': 'ana@gmail.com', 'telefono_movil': '+525512345678', 'monto_deuda': '500' },
    { 'nombre_cliente': 'Carlos Ruiz', 'fecha_venta': '2023-09-15', 'email_contacto': 'carlos.ruiz@hotmail.com', 'telefono_movil': '5598765432', 'monto_deuda': '1200' },
    { 'nombre_cliente': 'Beatriz Lopez', 'fecha_venta': '2023-10-05', 'email_contacto': 'betty_lop@yahoo.com', 'telefono_movil': '+525511223344', 'monto_deuda': '300' },
    { 'nombre_cliente': 'Jorge M.', 'fecha_venta': 'invalid-date', 'email_contacto': 'jorge@test', 'telefono_movil': 'N/A', 'monto_deuda': '0' }, // Error row
    { 'nombre_cliente': 'Lucia Fernandez', 'fecha_venta': '2023-10-10', 'email_contacto': 'lucia@outlook.com', 'telefono_movil': '+525599887766', 'monto_deuda': '750' },
];

const REQUIRED_FIELDS = [
    { id: 'name', label: 'Nombre del Cliente', icon: 'User' },
    { id: 'date', label: 'Fecha de Venta', icon: 'Calendar' },
    { id: 'email', label: 'Correo Electrónico', icon: 'Mail' },
    { id: 'phone', label: 'Teléfono Móvil', icon: 'Smartphone' },
];

const AVAILABLE_PLAYBOOKS = [
    { id: 'pb-001', name: 'Estrategia Core: Suscripción Mensual', risk: 'Bajo', costPerLead: 1.55, channels: ['WhatsApp', 'Email'] },
    { id: 'pb-002', name: 'Recuperación Agresiva (High Risk)', risk: 'Alto', costPerLead: 4.80, channels: ['SMS', 'Call', 'Email'] },
    { id: 'pb-003', name: 'Retención Preventiva', risk: 'Medio', costPerLead: 0.50, channels: ['Email'] },
];

export const DataUploadView: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // Mapping State: Which Excel Header maps to which Required Field
    const [mappings, setMappings] = useState<Record<string, string>>({
        name: '', date: '', email: '', phone: ''
    });

    const [campaignName, setCampaignName] = useState('');
    const [selectedPlaybookId, setSelectedPlaybookId] = useState('');

    // --- STEP 1: UPLOAD SIMULATION ---
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setIsAnalyzing(true);
            
            // Simulate processing delay
            setTimeout(() => {
                setIsAnalyzing(false);
                setStep(2);
                // Auto-suggest mappings based on mock headers
                setMappings({
                    name: 'nombre_cliente',
                    date: 'fecha_venta',
                    email: 'email_contacto',
                    phone: 'telefono_movil'
                });
                const dateStr = new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
                setCampaignName(`Carga – ${dateStr}`);
            }, 1500);
        }
    };

    // --- STEP 3: VALIDATION LOGIC ---
    const getValidationStats = () => {
        let valid = 0;
        let errors = 0;
        
        MOCK_ROWS.forEach(row => {
            // Simplified validation check based on the mock error row
            const email = row['email_contacto' as keyof typeof row];
            const phone = row['telefono_movil' as keyof typeof row];
            if (!email.includes('@') || phone === 'N/A' || phone.length < 5) {
                errors++;
            } else {
                valid++;
            }
        });
        return { valid, errors, total: MOCK_ROWS.length };
    };

    const stats = getValidationStats();

    // --- RENDERERS ---

    const renderStep1_Upload = () => (
        <div className="space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Sube tu archivo de clientes</h2>
                <p className="text-slate-500">Aceptamos formatos .xlsx o .csv</p>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50 hover:bg-slate-100 transition-colors relative">
                <input 
                    type="file" 
                    accept=".xlsx, .csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                        <UploadCloud className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-700">Haz clic o arrastra tu archivo aquí</p>
                        <p className="text-xs text-slate-400 mt-1">Máximo 10MB</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-left flex items-start gap-3">
                <div className="bg-blue-100 p-1.5 rounded-full text-blue-600 mt-0.5">
                    <Database className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-900 text-sm">Principio de Mínimos Datos</h4>
                    <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                        Con solo <span className="font-bold">4 campos</span> (Nombre, Fecha, Email, Teléfono), la plataforma puede comenzar a ejecutar playbooks y contactar a tus clientes. El resto es opcional.
                    </p>
                </div>
            </div>
        </div>
    );

    const renderStep2_Mapping = () => (
        <div className="grid grid-cols-12 gap-8 h-full animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Left: Mapping Form */}
            <div className="col-span-5 flex flex-col gap-6">
                <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-lg">Mapeo de Campos</h3>
                    <p className="text-sm text-slate-500">Asocia las columnas de tu Excel a los 4 campos requeridos.</p>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                    {REQUIRED_FIELDS.map((field) => (
                        <div key={field.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                                {field.label}
                                <span className="text-rose-500" title="Requerido">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={mappings[field.id]}
                                    onChange={(e) => setMappings({ ...mappings, [field.id]: e.target.value })}
                                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 appearance-none transition-all"
                                >
                                    <option value="">Seleccionar columna...</option>
                                    {MOCK_HEADERS.map(h => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                            </div>
                            {mappings[field.id] && (
                                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Mapeado con columna "{mappings[field.id]}"
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Preview */}
            <div className="col-span-7 bg-slate-50 rounded-xl border border-slate-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold text-slate-600 uppercase">Vista Previa ({file?.name})</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Mostrando 5 filas</span>
                </div>
                <div className="flex-1 overflow-x-auto p-4">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr>
                                {MOCK_HEADERS.map(h => (
                                    <th key={h} className="p-2 border-b border-slate-200 font-bold text-slate-500 whitespace-nowrap bg-slate-50">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {MOCK_ROWS.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    {MOCK_HEADERS.map(h => (
                                        <td key={h} className="p-2 whitespace-nowrap text-slate-700">
                                            {row[h as keyof typeof row]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderStep3_Validation = () => (
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-900">Resultados de la Validación</h2>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-bold text-emerald-700">{stats.valid}</span>
                    <span className="text-sm font-medium text-emerald-600">Registros Válidos</span>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl flex flex-col items-center">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-bold text-amber-700">{stats.errors}</span>
                    <span className="text-sm font-medium text-amber-600">Registros con Errores</span>
                </div>
            </div>

            {stats.errors > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg p-4 text-left shadow-sm">
                    <h4 className="text-sm font-bold text-slate-800 mb-2">Detalle de problemas detectados:</h4>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                        <li>Fila 4: Formato de fecha inválido.</li>
                        <li>Fila 4: Número de teléfono faltante o incompleto.</li>
                    </ul>
                    <p className="text-xs text-slate-400 mt-3 italic">
                        * Los registros con errores serán omitidos de la campaña.
                    </p>
                </div>
            )}
        </div>
    );

    const renderStep4_Confirmation = () => {
        const selectedPlaybook = AVAILABLE_PLAYBOOKS.find(p => p.id === selectedPlaybookId);
        const estimatedTotal = selectedPlaybook ? (stats.valid * selectedPlaybook.costPerLead).toFixed(2) : '0.00';
        const hasCall = selectedPlaybook?.channels.some(c => c.toLowerCase().includes('call'));

        return (
            <div className="max-w-lg mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8 ml-1" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Todo listo para lanzar</h2>
                    <p className="text-slate-500">Asigna la estrategia y confirma la inversión.</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Nombre de la Campaña</label>
                        <input 
                            type="text" 
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-100 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Playbook de Gestión</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={selectedPlaybookId}
                                onChange={(e) => setSelectedPlaybookId(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 appearance-none"
                            >
                                <option value="">Seleccionar estrategia...</option>
                                {AVAILABLE_PLAYBOOKS.map(pb => (
                                    <option key={pb.id} value={pb.id}>{pb.name} ({pb.risk})</option>
                                ))}
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                        </div>
                    </div>
                    
                    {/* Investment Estimation Box */}
                    {selectedPlaybook && (
                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                                    <Calculator className="w-3.5 h-3.5" />
                                    Inversión Estimada
                                </span>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-indigo-700 block leading-none">
                                        ${estimatedTotal}
                                    </span>
                                    <span className="text-[10px] text-indigo-500 font-medium">
                                        ~${selectedPlaybook.costPerLead.toFixed(2)} / lead
                                    </span>
                                </div>
                            </div>
                            
                            <div className="h-px bg-indigo-100 w-full"></div>
                            
                            <div className="flex items-start gap-2">
                                <HelpCircle className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-none" />
                                <p className="text-[10px] text-indigo-600 leading-tight">
                                    Calculado para {stats.valid} leads. 
                                    Incluye canales: {selectedPlaybook.channels.join(', ')}.
                                    {hasCall && <span className="block mt-1 font-semibold">Nota: El costo de llamadas puede variar según la duración.</span>}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="pt-2 flex justify-between text-sm">
                        <span className="text-slate-500">Registros a procesar:</span>
                        <span className="font-bold text-slate-900">{stats.valid} clientes</span>
                    </div>
                </div>
            </div>
        );
    };

    // --- NAVIGATION ---
    const canProceed = () => {
        if (step === 1) return !!file;
        if (step === 2) return Object.values(mappings).every(v => v !== ''); // All 4 required
        return true;
    };

    const handleNext = () => setStep(prev => Math.min(prev + 1, 4) as any);
    
    // Final action just closes the modal for the demo
    const handleFinish = () => {
        const pb = AVAILABLE_PLAYBOOKS.find(p => p.id === selectedPlaybookId);
        alert(`Campaña "${campaignName}" creada con ${stats.valid} registros.\nPlaybook asignado: ${pb?.name}`);
        onCancel();
    };

    return (
        <div className="absolute inset-0 bg-white z-50 flex flex-col">
            {/* Header */}
            <div className="px-8 py-4 border-b border-slate-100 flex justify-between items-center bg-white flex-none">
                <div className="flex items-center gap-4">
                    <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Importar Datos</h1>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className={step >= 1 ? 'text-indigo-600 font-bold' : ''}>Subida</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={step >= 2 ? 'text-indigo-600 font-bold' : ''}>Mapeo</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={step >= 3 ? 'text-indigo-600 font-bold' : ''}>Validación</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={step >= 4 ? 'text-indigo-600 font-bold' : ''}>Confirmación</span>
                        </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
                        style={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden p-8 bg-slate-50/50 flex flex-col items-center justify-center">
                <div className="w-full max-w-5xl h-full flex flex-col">
                    {isAnalyzing ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-pulse">
                            <Database className="w-12 h-12 text-indigo-300" />
                            <p className="text-slate-500 font-medium">Analizando estructura del archivo...</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                            {step === 1 && renderStep1_Upload()}
                            {step === 2 && renderStep2_Mapping()}
                            {step === 3 && renderStep3_Validation()}
                            {step === 4 && renderStep4_Confirmation()}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-slate-200 bg-white flex justify-between items-center flex-none">
                <button 
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                    Cancelar
                </button>
                
                {step < 4 ? (
                    <button 
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-sm shadow-indigo-200 transition-all flex items-center gap-2"
                    >
                        Continuar <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setStep(2)}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Volver al mapeo
                        </button>
                        <button 
                            onClick={handleFinish}
                            disabled={!selectedPlaybookId}
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-sm shadow-emerald-200 transition-all flex items-center gap-2"
                        >
                            Crear Campaña y Ejecutar <Play className="w-4 h-4 fill-current" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
