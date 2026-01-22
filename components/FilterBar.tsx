import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Calendar, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { CAMPAIGNS, STAGES } from '../constants';
import { FilterState, StageId } from '../types';

interface Props {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
}

export const FilterBar: React.FC<Props> = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCampaignOpen, setIsCampaignOpen] = useState(false);

  const toggleCampaign = (campaign: string) => {
    const current = filters.campaigns;
    const isSelected = current.includes(campaign);
    const newCampaigns = isSelected 
      ? current.filter(c => c !== campaign)
      : [...current, campaign];
    
    onFilterChange({ ...filters, campaigns: newCampaigns });
  };

  const toggleStage = (stageId: StageId) => {
    const current = filters.stages;
    const isSelected = current.includes(stageId);
    const newStages = isSelected
      ? current.filter(s => s !== stageId)
      : [...current, stageId];
      
    onFilterChange({ ...filters, stages: newStages });
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(filters.month);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    onFilterChange({ ...filters, month: newDate });
  };

  const clearFilters = () => {
    onFilterChange({
      campaigns: [],
      status: 'active',
      stages: [],
      search: filters.search,
      month: new Date()
    });
  };

  const activeFiltersCount = filters.campaigns.length + filters.stages.length;

  return (
    <div className="bg-white border-b border-slate-200 z-30 relative transition-all duration-300">
      {/* Primary Filters Row */}
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-4 flex-1">
            {/* Campaign Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => setIsCampaignOpen(!isCampaignOpen)}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors
                        ${filters.campaigns.length > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                    `}
                >
                    <span className="truncate max-w-[120px]">
                        {filters.campaigns.length === 0 ? 'Todas las Campañas' : 
                         filters.campaigns.length === 1 ? filters.campaigns[0] : 
                         `${filters.campaigns.length} Campañas`}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </button>

                {isCampaignOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsCampaignOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-20"
                        >
                            {CAMPAIGNS.map(campaign => (
                                <div 
                                    key={campaign}
                                    onClick={() => toggleCampaign(campaign)}
                                    className="px-3 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 cursor-pointer text-slate-700"
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.campaigns.includes(campaign) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                                        {filters.campaigns.includes(campaign) && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    {campaign}
                                </div>
                            ))}
                        </motion.div>
                    </>
                )}
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            {/* Month Picker */}
            <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-0.5">
                <button onClick={() => handleMonthChange('prev')} className="p-1 hover:bg-white rounded text-slate-500 hover:text-indigo-600 transition-all hover:shadow-sm">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="px-3 text-sm font-semibold text-slate-700 min-w-[100px] text-center flex items-center justify-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {filters.month.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={() => handleMonthChange('next')} className="p-1 hover:bg-white rounded text-slate-500 hover:text-indigo-600 transition-all hover:shadow-sm">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>

        <div className="flex items-center gap-4">
            {/* Status Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {(['active', 'paid', 'all'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => onFilterChange({ ...filters, status })}
                        className={`
                            px-3 py-1 rounded-md text-xs font-semibold transition-all capitalize
                            ${filters.status === status 
                                ? 'bg-white text-slate-900 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'}
                        `}
                    >
                        {status === 'active' ? 'Activos' : status === 'paid' ? 'Pagados' : 'Todos'}
                    </button>
                ))}
            </div>

            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border
                    ${isExpanded || filters.stages.length > 0 
                        ? 'bg-slate-50 border-slate-300 text-slate-800' 
                        : 'bg-white border-transparent text-slate-500 hover:bg-slate-50'}
                `}
            >
                <Filter className="w-3.5 h-3.5" />
                Filtros
                {activeFiltersCount > 0 && (
                    <span className="ml-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 rounded-full">
                        {activeFiltersCount}
                    </span>
                )}
            </button>
        </div>
      </div>

      {/* Secondary Filters (Collapsible) */}
      <AnimatePresence>
        {isExpanded && (
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-slate-50 border-t border-slate-200/60 shadow-inner"
            >
                <div className="px-6 py-4 grid grid-cols-12 gap-8">
                    
                    {/* Stage Filter */}
                    <div className="col-span-8">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Etapa del Framework</label>
                        <div className="flex flex-wrap gap-2">
                            {STAGES.map(stage => (
                                <button
                                    key={stage.id}
                                    onClick={() => toggleStage(stage.id)}
                                    className={`
                                        px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5
                                        ${filters.stages.includes(stage.id)
                                            ? `bg-${stage.colorTheme}-50 border-${stage.colorTheme}-200 text-${stage.colorTheme}-700 ring-1 ring-${stage.colorTheme}-200`
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                                    `}
                                >
                                    {filters.stages.includes(stage.id) && <Check className="w-3 h-3" />}
                                    {stage.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reset Actions */}
                    <div className="col-span-4 flex items-end justify-end">
                        {activeFiltersCount > 0 && (
                            <button 
                                onClick={clearFilters}
                                className="text-sm text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50"
                            >
                                <X className="w-3.5 h-3.5" />
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};