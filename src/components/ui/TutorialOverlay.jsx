import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

/**
 * TutorialOverlay Component
 * Creates a dark backdrop with a spotlight effect on a target element.
 * Provides step-by-step navigation.
 */
export default function TutorialOverlay({ steps = [], onFinish }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const step = steps[currentStep];

  const updateTarget = () => {
    if (!step?.selector) return;
    const element = document.querySelector(step.selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      // Opcional: Scroll suave até o elemento se ele estiver fora da visão
      // element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setTargetRect(null);
    }
  };

  useEffect(() => {
    updateTarget();
    setIsVisible(true);
    window.addEventListener('resize', updateTarget);
    window.addEventListener('scroll', updateTarget, true);
    return () => {
      window.removeEventListener('resize', updateTarget);
      window.removeEventListener('scroll', updateTarget, true);
    };
  }, [currentStep, step?.selector]);

  if (!step || !isVisible) return null;

  // Cálculo da posição do tooltip de conteúdo
  const getTooltipPosition = () => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const margin = 20;
    const tooltipWidth = 320;
    const tooltipHeight = 200; // Estimativa

    let top = targetRect.bottom + margin;
    let left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);

    // Ajustes para não sair da tela
    if (left < 20) left = 20;
    if (left + tooltipWidth > window.innerWidth - 20) left = window.innerWidth - tooltipWidth - 20;

    // Se não couber embaixo, coloca em cima
    if (top + tooltipHeight > window.innerHeight - 20) {
      top = targetRect.top - tooltipHeight - margin;
    }

    return { top, left };
  };

  const pos = getTooltipPosition();

  return createPortal(
    <div className="fixed inset-0 z-[10000] pointer-events-none select-none">
      {/* Spotlight Backdrop (SVG Mask) */}
      <svg className="absolute inset-0 w-full h-full transition-all duration-500">
        <defs>
          <mask id="tutorial-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="12"
                fill="black"
                className="transition-all duration-500"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#tutorial-spotlight-mask)"
          className="transition-all duration-500 pointer-events-auto"
        />
      </svg>

      {/* Tooltip Content */}
      <div
        className="absolute bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-gray-100 p-6 w-[320px] pointer-events-auto transition-all duration-500 animate-fade-slide"
        style={pos}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-[#008BC9] uppercase tracking-widest mb-1">Passo {currentStep + 1} de {steps.length}</span>
            <h3 className="font-bold text-[18px] text-gray-900 leading-tight">{step.title}</h3>
          </div>
          <button
            onClick={onFinish}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-[14px] text-gray-600 mb-8 leading-relaxed">
          {step.content}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-[#008BC9]' : 'w-1.5 bg-gray-200'}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="text-[14px] font-bold text-gray-400 hover:text-gray-700 transition-colors"
              >
                Voltar
              </button>
            )}

            <button
              onClick={() => {
                if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
                else onFinish();
              }}
              className="bg-[#008BC9] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] hover:bg-[#003A79] transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              {currentStep < steps.length - 1 ? (
                <>Próximo <ChevronRight size={18} /></>
              ) : (
                <>Finalizar <Check size={18} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
