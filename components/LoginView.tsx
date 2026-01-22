
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onLogin: () => void;
}

export const LoginView: React.FC<Props> = ({ onLogin }) => {
  // Pre-filled credentials as requested
  const [email, setEmail] = useState('admin@fintech.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay for better UX
    setTimeout(() => {
      onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-8 bg-white border-b border-slate-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4">
              F
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bienvenido de nuevo</h1>
            <p className="text-slate-500 text-sm mt-2">
              Accede a tu panel de orquestación financiera
            </p>
        </div>

        {/* Form */}
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Correo Electrónico</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 font-medium text-slate-900 transition-all"
                            placeholder="nombre@empresa.com"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Contraseña</label>
                        <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">¿Olvidaste tu clave?</a>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 font-medium text-slate-900 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 py-2">
                    <div className="relative flex items-center">
                        <input type="checkbox" defaultChecked className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 shadow-sm checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                        <CheckCircle2 className="pointer-events-none absolute h-3 w-3 left-0.5 text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                    <label className="text-sm text-slate-600 font-medium cursor-pointer">Recordar este dispositivo por 30 días</label>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Iniciar Sesión <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Conexión segura encriptada end-to-end
            </p>
        </div>
      </motion.div>
    </div>
  );
};
