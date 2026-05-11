import React from 'react';
import { X, User, FileText, Info, CircleCheck, CircleMinus, CircleX } from 'lucide-react';
import Button from '../../ui/Button';

export default function HeatmapModals({ modalType, modalData, setModalType, statusColors, isDarkMode = false, colors }) {
  if (!modalType || !modalData) return null;
  const { type, data } = modalData;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-slide">
      <div className="rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border" style={{ backgroundColor: isDarkMode ? colors.neutral[6] : '#FFFFFF', borderColor: isDarkMode ? colors.neutral[5] : '#E5E7EB' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ backgroundColor: isDarkMode ? colors.neutral[7] : 'rgba(249, 250, 251, 0.5)', borderColor: isDarkMode ? colors.neutral[5] : '#F3F4F6' }}>
          <div className="flex items-center gap-3">
            {type === 'student' ? <User size={24} className="text-[#008BC9]" /> : <FileText size={24} className="text-[#008BC9]" />}
            <h3 className="font-bold text-[18px]" style={{ color: isDarkMode ? colors.neutral[0] : '#1F2937' }}>
              Detalhes do {type === 'student' ? 'Aluno' : 'Item'}
            </h3>
          </div>
          <button
            onClick={() => setModalType(null)}
            className="p-2 rounded-full transition-colors hover:opacity-80"
            style={{ color: isDarkMode ? colors.neutral[3] : '#6B7280' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: isDarkMode ? colors.neutral[4] : '#9CA3AF' }}>
              {type === 'student' ? 'Nome do Aluno' : 'Identificação do Item'}
            </span>
            <span className="text-[20px] font-bold" style={{ color: isDarkMode ? colors.neutral[0] : '#111827' }}>{data}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: isDarkMode ? colors.neutral[7] : '#F9FAFB', borderColor: isDarkMode ? colors.neutral[5] : '#F3F4F6' }}>
              <span className="text-[11px] font-bold uppercase block mb-1" style={{ color: isDarkMode ? colors.neutral[3] : '#6B7280' }}>Status Geral</span>
              <div className="flex items-center gap-2 font-bold" style={{ color: isDarkMode ? '#8CD47E' : '#16A34A' }}>
                <CircleCheck size={18} />
                <span>Suficiente</span>
              </div>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: isDarkMode ? colors.neutral[7] : '#F9FAFB', borderColor: isDarkMode ? colors.neutral[5] : '#F3F4F6' }}>
              <span className="text-[11px] font-bold uppercase block mb-1" style={{ color: isDarkMode ? colors.neutral[3] : '#6B7280' }}>Desempenho</span>
              <span className="text-[18px] font-bold" style={{ color: isDarkMode ? colors.neutral[0] : '#111827' }}>85%</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: isDarkMode ? colors.neutral[4] : '#9CA3AF' }}>Informações Complementares</span>
            <div className="p-4 rounded-xl border flex gap-3" style={{ backgroundColor: isDarkMode ? '#155274' : 'rgba(239, 246, 255, 0.5)', borderColor: isDarkMode ? '#155274' : '#DBEAFE' }}>
              <Info size={20} className="shrink-0" style={{ color: isDarkMode ? '#489EEA' : '#008BC9' }} />
              <p className="text-[14px] leading-relaxed" style={{ color: isDarkMode ? colors.neutral[1] : '#4B5563' }}>
                Este painel exibe um resumo das interações e resultados identificados para {type === 'student' ? 'este aluno' : 'este item'} no período selecionado.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ backgroundColor: isDarkMode ? colors.neutral[7] : '#F9FAFB', borderColor: isDarkMode ? colors.neutral[5] : '#F3F4F6' }}>
          <Button
            variant="secondary"
            showRing={true}
            appearance="outline"
            onClick={() => setModalType(null)}
          >
            Fechar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // Placeholder para ação futura
              setModalType(null);
            }}
          >
            Ver Relatório Completo
          </Button>
        </div>
      </div>
    </div>
  );
}
