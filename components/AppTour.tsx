
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface Props {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const AppTour: React.FC<Props> = ({ steps, isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Reset step when opening
  useEffect(() => {
    if (isOpen) {
        setCurrentStep(0);
    }
  }, [isOpen]);

  // Calculate position of the target element
  useLayoutEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const step = steps[currentStep];
      const element = document.getElementById(step.targetId);
      
      if (element) {
        // Scroll element into view if needed
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTargetRect(element.getBoundingClientRect());
      } else {
        // If element not found, create a dummy rect in center (fallback)
        setTargetRect(null);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    // Slight delay to allow UI to settle (e.g. if switching views)
    const timer = setTimeout(updatePosition, 100);

    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(timer);
    };
  }, [isOpen, currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  // Calculate Tooltip Coords based on preferred position
  const getTooltipStyles = () => {
    if (!targetRect) return { top: '50%', left: '50%', x: '-50%', y: '-50%' };

    const gap = 12;
    const pos = step.position || 'bottom';

    switch (pos) {
      case 'top':
        return { top: targetRect.top - gap, left: targetRect.left + targetRect.width / 2, x: '-50%', y: '-100%' };
      case 'bottom':
        return { top: targetRect.bottom + gap, left: targetRect.left + targetRect.width / 2, x: '-50%', y: '0%' };
      case 'left':
        return { top: targetRect.top + targetRect.height / 2, left: targetRect.left - gap, x: '-100%', y: '-50%' };
      case 'right':
        return { top: targetRect.top + targetRect.height / 2, left: targetRect.right + gap, x: '0%', y: '-50%' };
      case 'center':
        return { top: targetRect.top + targetRect.height / 2, left: targetRect.left + targetRect.width / 2, x: '-50%', y: '-50%' };
      default:
        return { top: targetRect.bottom + gap, left: targetRect.left, x: '0%', y: '0%' };
    }
  };

  const tooltipStyle = getTooltipStyles();

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      
      {/* 1. Spotlight / Backdrop */}
      {/* We use a mixed-blend-mode or explicit SVG path clip in complex apps. 
          Here, for simplicity and performance, we use a semi-transparent overlay 
          and a high-index highlight box. */}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 pointer-events-auto"
        // onClick={onClose} // Optional: Close on backdrop click
      />

      {/* 2. Target Highlight Box */}
      {targetRect && (
        <motion.div
          layoutId="tour-highlight"
          className="absolute border-2 border-white rounded-lg shadow-[0_0_0_9999px_rgba(15,23,42,0.6)] pointer-events-none transition-all duration-300 ease-in-out"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            borderRadius: 8 // Adjust if target is round
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Pulsing effect */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
        </motion.div>
      )}

      {/* 3. The Tooltip Card */}
      <motion.div
        className="absolute pointer-events-auto w-80 bg-white rounded-xl shadow-2xl p-5 border border-slate-100 flex flex-col gap-3"
        style={{
            top: tooltipStyle.top,
            left: tooltipStyle.left,
            translateX: tooltipStyle.x,
            translateY: tooltipStyle.y,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        key={currentStep} // Re-animate content on step change
        transition={{ duration: 0.3 }}
      >
          <div className="flex justify-between items-start">
             <div className="bg-indigo-50 text-indigo-600 font-bold text-[10px] px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wide">
                Paso {currentStep + 1} de {steps.length}
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
             </button>
          </div>

          <div>
             <h3 className="text-base font-bold text-slate-900 mb-1">{step.title}</h3>
             <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
          </div>

          <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-100">
             <button 
                onClick={handlePrev} 
                disabled={currentStep === 0}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
             >
                <ChevronLeft className="w-3 h-3" /> Anterior
             </button>

             <button 
                onClick={handleNext}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all shadow-md shadow-slate-200"
             >
                {currentStep === steps.length - 1 ? (
                    <>Finalizar <Check className="w-3 h-3" /></>
                ) : (
                    <>Siguiente <ChevronRight className="w-3 h-3" /></>
                )}
             </button>
          </div>

          {/* Arrow visual (simplified) */}
          {step.position !== 'center' && (
            <div 
                className="absolute w-3 h-3 bg-white transform rotate-45 border-l border-t border-slate-100"
                style={{
                    left: '50%',
                    marginLeft: '-6px',
                    ...(step.position === 'top' ? { bottom: '-6px', borderTop: '0', borderLeft: '0', borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' } : {}),
                    ...(step.position === 'bottom' ? { top: '-6px' } : {}),
                    ...(step.position === 'left' ? { right: '-6px', top: '50%', marginTop: '-6px', borderLeft: '0', borderBottom: '0', borderRight: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0' } : {}),
                    ...(step.position === 'right' ? { left: '-6px', top: '50%', marginTop: '-6px', borderRight: '0', borderTop: '0', borderLeft: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' } : {}),
                }}
            ></div>
          )}

      </motion.div>

    </div>
  );
};
