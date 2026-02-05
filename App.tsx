
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Timeline } from './components/Timeline';
import { generateMockCustomers, simulateMovement } from './services/dataService';
import { Customer, StageId, PaymentRecord, FilterState } from './types';
import { 
  Play, Pause, RefreshCw, Search, LayoutDashboard, Settings, 
  BarChart2, Inbox, Bell, HelpCircle, Command, Workflow,
  BookOpen, UploadCloud, CreditCard
} from 'lucide-react';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { PaymentHistoryModal } from './components/PaymentHistoryModal';
import { FilterBar } from './components/FilterBar';
import { ReportsHub } from './components/ReportsHub';
import { FrameworksManager } from './components/FrameworksManager';
import { PlaybooksManager } from './components/PlaybooksManager';
import { DataUploadView } from './components/DataUploadView';
import { PlanAndBilling } from './components/PlanAndBilling';
import { LoginView } from './components/LoginView';
import { GlobalAIChat, ChatMessage } from './components/GlobalAIChat'; 
import { AppTour, TourStep } from './components/AppTour';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [paidCustomersList, setPaidCustomersList] = useState<Customer[]>([]); 
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'dashboard' | 'reports' | 'frameworks' | 'playbooks' | 'upload' | 'billing'>('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Chat & Token State (Hoisted)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(1250);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]); 
  
  // Tour State
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    campaigns: [],
    status: 'active',
    stages: [],
    search: '',
    month: new Date()
  });

  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  // Initial Load
  useEffect(() => {
    setCustomers(generateMockCustomers(30));
  }, []);

  // Check for First Time User
  useEffect(() => {
    if (isAuthenticated) {
        const hasSeenTour = localStorage.getItem('hasSeenTour_v1');
        if (!hasSeenTour) {
            // Small delay to ensure UI renders
            setTimeout(() => setIsTourOpen(true), 1000);
        }
    }
  }, [isAuthenticated]);

  // Simulation Loop
  useEffect(() => {
    let intervalId: number;

    if (isSimulating) {
      intervalId = window.setInterval(() => {
        setCustomers(prevCustomers => {
          const { customers: nextCustomers, paidCustomers } = simulateMovement(prevCustomers);
          
          if (paidCustomers.length > 0) {
            setPaymentHistory(prev => {
              const newRecords = paidCustomers.map(c => ({
                id: Math.random().toString(36).substr(2, 9),
                customerName: c.name,
                avatarUrl: c.avatarUrl,
                date: new Date(),
                provider: c.provider
              }));
              return [...prev, ...newRecords];
            });
            setPaidCustomersList(prev => [...prev, ...paidCustomers]);
          }
          return nextCustomers;
        });
      }, 2000); 
    }

    return () => clearInterval(intervalId);
  }, [isSimulating]);

  const toggleSimulation = () => setIsSimulating(!isSimulating);
  
  const resetData = useCallback(() => {
    setCustomers(generateMockCustomers(30));
    setPaymentHistory([]);
    setPaidCustomersList([]);
    setIsSimulating(false);
    setFilters(prev => ({ ...prev, status: 'active', campaigns: [], stages: [] }));
  }, []);

  const handleTourComplete = () => {
      setIsTourOpen(false);
      localStorage.setItem('hasSeenTour_v1', 'true');
  };

  const startTourManually = () => {
      // Force reset view to dashboard to ensure elements exist
      setCurrentView('dashboard');
      setSelectedCustomer(null);
      setTimeout(() => setIsTourOpen(true), 100);
  };

  // Filtering Logic
  const filteredCustomers = useMemo(() => {
    let sourceData: Customer[] = [];
    if (filters.status === 'active') sourceData = customers;
    else if (filters.status === 'paid') sourceData = paidCustomersList;
    else sourceData = [...customers, ...paidCustomersList];

    return sourceData.filter(customer => {
        if (filters.campaigns.length > 0 && !filters.campaigns.includes(customer.campaign)) return false;
        if (filters.stages.length > 0 && !filters.stages.includes(customer.stage)) return false;
        if (filters.search) {
            const term = filters.search.toLowerCase();
            return customer.name.toLowerCase().includes(term) || customer.email.toLowerCase().includes(term);
        }
        return true;
    });
  }, [customers, paidCustomersList, filters]);

  const getBreadcrumbContext = () => {
     if (filters.search) return "Resultados de Búsqueda";
     if (filters.status === 'paid') return "Historial de Pagos";
     if (filters.status === 'all') return "Vista General";
     return "Mapa de Compromisos";
  };

  const getPageTitle = () => {
      switch(currentView) {
          case 'reports': return 'Reportes';
          case 'frameworks': return 'Playbooks (Táctico)';
          case 'playbooks': return 'Estrategias (Estratégico)';
          case 'upload': return 'Importar Datos';
          case 'billing': return 'Plan y Costos';
          default: return 'Mapa de Compromisos';
      }
  };

  // TOUR STEPS CONFIGURATION
  const TOUR_STEPS: TourStep[] = [
      {
          targetId: 'sidebar-nav',
          title: 'Navegación Principal',
          description: 'Accede a tus reportes, configura tus Playbooks de comunicación y gestiona tus Estrategias desde aquí.',
          position: 'right'
      },
      {
          targetId: 'timeline-area',
          title: 'Mapa de Compromisos',
          description: 'Visualiza a tus clientes moviéndose en tiempo real a través de las etapas de cobro, desde preventivo hasta recuperación.',
          position: 'center'
      },
      {
          targetId: 'simulation-controls',
          title: 'Motor de Simulación',
          description: 'Usa estos controles para simular el paso del tiempo y ver cómo reacciona tu cartera ante las estrategias configuradas.',
          position: 'bottom'
      },
      {
          targetId: 'upload-btn',
          title: 'Importar Datos',
          description: 'Carga nuevos lotes de clientes mediante Excel o CSV para asignarlos automáticamente a una campaña.',
          position: 'right'
      },
      {
          targetId: 'ai-chat-trigger',
          title: 'Tu Estratega IA',
          description: 'Haz clic aquí para pedir análisis predictivos, redactar emails o crear nuevas estrategias con lenguaje natural.',
          position: 'left'
      }
  ];

  // --- AUTH CHECK ---
  if (!isAuthenticated) {
      return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen w-screen flex bg-white text-slate-900 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR - Minimal & Dark/Sober Icons */}
      <aside id="sidebar-nav" className="w-16 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-6 z-30 flex-none">
        <div className="mb-8">
           <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              F
           </div>
        </div>
        
        <nav className="flex flex-col gap-6 w-full items-center">
            <SidebarIcon icon={<Inbox className="w-5 h-5" />} label="Inbox" active={currentView === 'dashboard'} onClick={() => { setCurrentView('dashboard'); setSelectedCustomer(null); }} />
            <div id="upload-btn">
                <SidebarIcon icon={<UploadCloud className="w-5 h-5" />} label="Importar" active={currentView === 'upload'} onClick={() => { setCurrentView('upload'); setSelectedCustomer(null); }} />
            </div>
            <div className="h-px w-8 bg-slate-200"></div>
            <SidebarIcon icon={<Workflow className="w-5 h-5" />} label="Playbooks" active={currentView === 'frameworks'} onClick={() => { setCurrentView('frameworks'); setSelectedCustomer(null); }} />
            <SidebarIcon icon={<BookOpen className="w-5 h-5" />} label="Estrategias" active={currentView === 'playbooks'} onClick={() => { setCurrentView('playbooks'); setSelectedCustomer(null); }} />
            <div className="h-px w-8 bg-slate-200"></div>
            <SidebarIcon icon={<BarChart2 className="w-5 h-5" />} label="Reportes" active={currentView === 'reports'} onClick={() => { setCurrentView('reports'); setSelectedCustomer(null); }} />
             <SidebarIcon icon={<CreditCard className="w-5 h-5" />} label="Plan y Costos" active={currentView === 'billing'} onClick={() => { setCurrentView('billing'); setSelectedCustomer(null); }} />
        </nav>

        <div className="mt-auto flex flex-col gap-6 w-full items-center">
            <SidebarIcon icon={<Command className="w-5 h-5" />} label="Comandos" />
            <div onClick={startTourManually}>
                <SidebarIcon icon={<HelpCircle className="w-5 h-5" />} label="Ayuda / Tour" />
            </div>
            <SidebarIcon icon={<Settings className="w-5 h-5" />} label="Configuración" />
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 cursor-pointer hover:ring-2 hover:ring-slate-300 transition-all" onClick={() => setIsAuthenticated(false)} title="Cerrar Sesión">
                <img src="https://picsum.photos/id/64/100/100" alt="Admin" className="w-full h-full object-cover" />
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
          
          {/* HEADER - Minimalist (Only show search/sim controls on Dashboard) */}
          {currentView === 'dashboard' ? (
              <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 flex-none bg-white">
                 <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        {getPageTitle()}
                    </h2>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-medium">
                        {filteredCustomers.length} activos
                    </span>
                 </div>

                 <div className="flex items-center gap-3">
                     <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            placeholder="Buscar..." 
                            className="pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:border-slate-400 focus:bg-white transition-all outline-none w-64"
                        />
                    </div>
                    <div className="h-4 w-px bg-slate-200 mx-1"></div>
                    
                    <div id="simulation-controls" className="flex items-center gap-2">
                        <button 
                            onClick={toggleSimulation}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors text-slate-600"
                        >
                            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            {isSimulating ? 'Pausar' : 'Simular'}
                        </button>
                        <button 
                            onClick={resetData}
                            className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                 </div>
              </header>
          ) : null}

          {/* FILTER BAR - Only Dashboard */}
          {!selectedCustomer && currentView === 'dashboard' && (
             <div className="flex-none">
                 <FilterBar filters={filters} onFilterChange={setFilters} />
             </div>
          )}

          {/* VIEW CONTENT */}
          <main className="flex-1 flex flex-col overflow-hidden relative w-full bg-white z-0">
            {selectedCustomer ? (
                <CustomerDetailModal 
                    customer={selectedCustomer} 
                    onClose={() => setSelectedCustomer(null)} 
                    breadcrumbContext={getBreadcrumbContext()}
                />
            ) : currentView === 'upload' ? (
                <DataUploadView onCancel={() => setCurrentView('dashboard')} />
            ) : currentView === 'reports' ? (
                <ReportsHub 
                    chatHistory={chatHistory} 
                    onOpenChat={() => setIsChatOpen(true)}
                />
            ) : currentView === 'frameworks' ? (
                <FrameworksManager />
            ) : currentView === 'playbooks' ? (
                <PlaybooksManager />
            ) : currentView === 'billing' ? (
                <PlanAndBilling />
            ) : (
                <div id="timeline-area" className="w-full h-full">
                    <Timeline 
                        customers={filteredCustomers} 
                        onCustomerClick={(c) => setSelectedCustomer(c)} 
                    />
                </div>
            )}
          </main>
      </div>

      {/* GLOBAL AI CHAT (Always rendered, controlled by visibility state) */}
      <GlobalAIChat 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(!isChatOpen)}
        tokenBalance={tokenBalance}
        onSpendTokens={(amt) => setTokenBalance(prev => prev - amt)}
        onNewMessage={(msg) => setChatHistory(prev => [...prev, msg])}
      />

      {/* Modals */}
      {showPaymentHistory && (
          <PaymentHistoryModal 
            history={paymentHistory} 
            onClose={() => setShowPaymentHistory(false)} 
          />
      )}

      {/* TOUR OVERLAY */}
      <AnimatePresence>
          {isTourOpen && (
              <AppTour 
                steps={TOUR_STEPS} 
                isOpen={isTourOpen} 
                onClose={() => setIsTourOpen(false)} 
                onComplete={handleTourComplete} 
              />
          )}
      </AnimatePresence>

    </div>
  );
};

const SidebarIcon: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active, onClick }) => (
    <div 
        onClick={onClick}
        className={`
            relative p-2.5 rounded-lg cursor-pointer transition-all group
            ${active ? 'bg-slate-200 text-black' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
        `}
    >
        {icon}
        {active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-black rounded-r-full -ml-[25px]"></div>
        )}
        {/* Tooltip */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
            {label}
        </div>
    </div>
);

export default App;
