import React from 'react';
import { X, User, FileText, Info, CircleCheck, CircleMinus, CircleX } from 'lucide-react';
import Button from '../../ui/Button';

export default function HeatmapModals({ modalData, setModalData }) {
  if (!modalData) return null;

  const { type, data } = modalData;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-slide">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            {type === 'student' ? <User size={24} className="text-[#008BC9]" /> : <FileText size={24} className="text-[#008BC9]" />}
            <h3 className="font-bold text-[18px] text-gray-800">
              Detalhes do {type === 'student' ? 'Aluno' : 'Item'}
            </h3>
          </div>
          <button 
            onClick={() => setModalData(null)} 
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
              {type === 'student' ? 'Nome do Aluno' : 'Identificação do Item'}
            </span>
            <span className="text-[20px] font-bold text-gray-900">{data}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Status Geral</span>
              <div className="flex items-center gap-2 text-green-600 font-bold">
                <CircleCheck size={18} />
                <span>Suficiente</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Desempenho</span>
              <span className="text-[18px] font-bold text-gray-900">85%</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Informações Complementares</span>
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3">
              <Info size={20} className="text-[#008BC9] shrink-0" />
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Este painel exibe um resumo das interações e resultados identificados para {type === 'student' ? 'este aluno' : 'este item'} no período selecionado.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <Button 
            variant="secondary" 
            appearance="outline" 
            onClick={() => setModalData(null)}
          >
            Fechar
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              // Placeholder para ação futura
              setModalData(null);
            }}
          >
            Ver Relatório Completo
          </Button>
        </div>
      </div>
    </div>
  );
}
