import React, { useState, useEffect } from 'react';
import { Search, Plus, Copy, Eye, Sliders, FileText, CornerDownLeft, HelpCircle, BookOpen, Puzzle, PenLine, Link2, ExternalLink } from 'lucide-react';
import Chips from '../../../ui/Chips';
import Input from '../../../ui/Input';

const TYPE_CHIP_MAP = {
  'Somativa':    'cherry',
  'Diagnóstica': 'oliva',
  'Formativa':   'storm',
};

const STATUS_CHIP_MAP = {
  'Em edição':    'orange',
  'Programada':   'storm',
  'Em aplicação': 'primary',
  'Em correção':  'lavender',
  'Concluída':    'success',
};

export default function CommandPaletteModal({
  isOpen,
  onClose,
  assessments = [],
  onSelectAssessment,
  onCreateNew,
  onDuplicate,
  onSwitchView,
  isDarkMode
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssessments = assessments.filter(a =>
    a.code?.toLowerCase().includes(query.toLowerCase()) ||
    a.title?.toLowerCase().includes(query.toLowerCase()) ||
    a.municipality?.toLowerCase().includes(query.toLowerCase()) ||
    a.subject?.toLowerCase().includes(query.toLowerCase())
  );

  const actions = [
    { id: 'new', label: 'Criar Nova Avaliação (Tela Própria)', shortcut: 'Alt+N', icon: <Plus size={16} />, color: 'text-brand-500', perform: onCreateNew },
    { id: 'view-queue', label: 'Mudar para Visão Fila de Foco', shortcut: 'Ctrl+1', icon: <Eye size={16} />, color: 'text-extended-orange-base', perform: () => onSwitchView('queue') },
    { id: 'view-kanban', label: 'Mudar para Visão Kanban de Ciclo', shortcut: 'Ctrl+2', icon: <Sliders size={16} />, color: 'text-extended-aqua-base', perform: () => onSwitchView('kanban') },
    { id: 'view-tree', label: 'Mudar para Visão Tree Explorer', shortcut: 'Ctrl+3', icon: <FileText size={16} />, color: 'text-extended-lavender-base', perform: () => onSwitchView('tree') }
  ];

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-[800px] rounded-[8px] shadow-2xl border overflow-hidden transition-all transform ${
          isDarkMode ? 'bg-[#222222] border-neutral-6 text-white' : 'bg-white border-neutral-2 text-neutral-8'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header (Input, Tabs, Chips) */}
        <div className={`px-4 pt-4 ${isDarkMode ? 'bg-[#1C1C1C]' : 'bg-neutral-0'}`}>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                autoFocus
                placeholder="Pesquise, execute um comando ou faça uma pergunta..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                iconLeft={<Search />}
                height="40px"
              />
            </div>
            <button className={`shrink-0 flex items-center gap-1.5 px-3 h-[40px] rounded-[8px] border font-bold text-xs transition-colors ${
              isDarkMode 
                ? 'bg-[#1C1C1C] border-neutral-6 text-neutral-2 hover:border-brand-500' 
                : 'bg-white border-neutral-3 text-neutral-8 hover:border-brand-500'
            }`}>
              Pergunte à IA <span className="text-sm">🌸</span>
            </button>
          </div>

          {/* Tabs */}
          <div className={`flex items-center gap-6 mt-4 text-[13px] font-bold border-b overflow-x-auto hide-scrollbar ${isDarkMode ? 'border-neutral-6' : 'border-neutral-2'}`}>
            <button className={`pb-2 border-b-2 ${isDarkMode ? 'text-white border-brand-500' : 'text-brand-500 border-brand-500'}`}>Todos</button>
            <button className={`pb-2 border-b-2 border-transparent flex items-center gap-1.5 ${isDarkMode ? 'text-neutral-4 hover:text-neutral-2' : 'text-neutral-5 hover:text-neutral-7'}`}>
              <BookOpen size={14} className="text-[#FF5B5B]" /> Avaliações
            </button>
            <button className={`pb-2 border-b-2 border-transparent flex items-center gap-1.5 ${isDarkMode ? 'text-neutral-4 hover:text-neutral-2' : 'text-neutral-5 hover:text-neutral-7'}`}>
              <Puzzle size={14} className="text-[#00C2FF]" /> Itens
            </button>
            <button className={`pb-2 border-b-2 border-transparent flex items-center gap-1.5 ${isDarkMode ? 'text-neutral-4 hover:text-neutral-2' : 'text-neutral-5 hover:text-neutral-7'}`}>
              <FileText size={14} className="text-[#4F5BFF]" /> Cadernos
            </button>
          </div>
          
          {/* Filters Line */}
          <div className={`flex items-center gap-2 py-3 border-b overflow-x-auto hide-scrollbar ${isDarkMode ? 'border-neutral-6' : 'border-neutral-2'}`}>
            <Chips label="Ativas" status="storm" variant="dark" />
            <Chips label="Histórico" status="neutral" variant="dark" />
            <Chips label="Agentes" status="primary" variant="dark" />
            <Chips label="Canais" status="lavender" variant="dark" />
            <div className={`h-4 w-px mx-1 ${isDarkMode ? 'bg-neutral-6' : 'bg-neutral-3'}`}></div>
            <button className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-[4px] transition-colors ${
              isDarkMode ? 'text-neutral-4 hover:text-white bg-neutral-7' : 'text-neutral-6 hover:text-neutral-8 bg-neutral-2'
            }`}>
              <Sliders size={12}/> Filtro
            </button>
            <button className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-[4px] transition-colors ${
              isDarkMode ? 'text-neutral-4 hover:text-white bg-neutral-7' : 'text-neutral-6 hover:text-neutral-8 bg-neutral-2'
            }`}>
              Classificar
            </button>
          </div>
        </div>

        {/* Results Body */}
        <div className={`max-h-[60vh] overflow-y-auto p-2 space-y-1 ${isDarkMode ? 'bg-[#222222]' : 'bg-neutral-0'}`}>
          <div className="px-3 pt-3 pb-1 text-[11px] font-bold text-neutral-5 dark:text-neutral-4">
            Resultados
          </div>

          {/* Quick Actions (Always shown or shown when query matches) */}
          {!query && (
            <div className="space-y-1 mb-4">
              {actions.map((act) => (
                <button
                  key={act.id}
                  onClick={() => {
                    act.perform();
                    onClose();
                  }}
                  className={`group w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-left transition-all outline-none ${
                    isDarkMode ? 'hover:bg-neutral-6 focus:bg-neutral-6 text-neutral-3' : 'hover:bg-neutral-2 focus:bg-neutral-2 text-neutral-6'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="shrink-0 text-brand-500">
                      {act.icon}
                    </div>
                    <div className="flex items-baseline gap-2 truncate">
                      <span className={`text-[13px] font-semibold truncate ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                        {act.label}
                      </span>
                      <span className="text-[11px] text-neutral-4 shrink-0">em Comandos Rápidos</span>
                    </div>
                  </div>
                  
                  {/* Actions on hover */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 shrink-0 ml-4 transition-opacity">
                    <kbd className={`text-[10px] font-mono px-2 py-0.5 rounded-[4px] border font-bold mr-2 ${isDarkMode ? 'border-neutral-5 text-neutral-4' : 'border-neutral-3 text-neutral-5'}`}>
                      {act.shortcut}
                    </kbd>
                    <div className="w-6 h-6 flex items-center justify-center bg-[#FF4564] text-white rounded-md">
                      <CornerDownLeft size={12} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Assessments List */}
          {filteredAssessments.length > 0 && (
            <div className="space-y-1">
              {filteredAssessments.map((av) => (
                <button
                  key={av.id}
                  onClick={() => {
                    onSelectAssessment(av);
                    onClose();
                  }}
                  className={`group w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-left transition-all outline-none ${
                    isDarkMode ? 'hover:bg-neutral-6 focus:bg-neutral-6 text-neutral-3' : 'hover:bg-neutral-2 focus:bg-neutral-2 text-neutral-6'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`shrink-0 w-3 h-3 rounded-full border-[2.5px] ${
                      av.status === 'Em edição' ? 'border-[#FFB020]' :
                      av.status === 'Concluída' ? 'border-[#14B8A6]' :
                      av.status === 'Em aplicação' ? 'border-[#4F5BFF]' : 
                      av.status === 'Arquivada' ? 'border-[#8F9BBA]' : 'border-[#9155FD]'
                    }`} />
                    
                    <div className="flex items-baseline gap-2 truncate">
                      <span className={`text-[13px] font-semibold truncate ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                        {av.title}
                      </span>
                      <span className="text-[11px] text-neutral-4 shrink-0">em {av.municipality} ({av.schoolYear}) • {av.status}</span>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 shrink-0 ml-4 transition-opacity">
                    <div className={`px-2 py-1 text-[10px] font-bold border rounded-md flex items-center gap-1 transition-colors ${
                      isDarkMode ? 'bg-[#1C1C1C] border-neutral-6 text-white hover:border-brand-500' : 'bg-white border-neutral-3 text-neutral-7 hover:border-brand-500'
                    }`}>
                      Pergunte à IA <span className="text-[10px]">🌸</span>
                    </div>
                    <div className={`w-6 h-6 flex items-center justify-center border rounded-md transition-colors ${
                      isDarkMode ? 'bg-[#1C1C1C] border-neutral-6 text-neutral-4 hover:border-brand-500 hover:text-white' : 'bg-white border-neutral-3 text-neutral-5 hover:border-brand-500 hover:text-brand-600'
                    }`}>
                      <ExternalLink size={12} />
                    </div>
                    <div 
                      className={`w-6 h-6 flex items-center justify-center border rounded-md transition-colors ${
                        isDarkMode ? 'bg-[#1C1C1C] border-neutral-6 text-neutral-4 hover:border-brand-500 hover:text-white' : 'bg-white border-neutral-3 text-neutral-5 hover:border-brand-500 hover:text-brand-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(av);
                        onClose();
                      }}
                      title="Duplicar Avaliação"
                    >
                      <Copy size={12} />
                    </div>
                    <div className="w-6 h-6 flex items-center justify-center bg-[#FF4564] text-white rounded-md">
                      <CornerDownLeft size={12} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {query && filteredAssessments.length === 0 && (
            <div className="p-6 text-center text-[13px] text-neutral-4 font-medium">
              Nenhuma avaliação encontrada para "<span className="font-semibold text-brand-500">{query}</span>"
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className={`px-4 py-2 border-t text-[11px] flex items-center justify-between font-medium ${
          isDarkMode ? 'border-neutral-6 bg-[#1C1C1C] text-neutral-4' : 'border-neutral-2 bg-neutral-0 text-neutral-5'
        }`}>
          <div className="flex items-center gap-2">
            <span>&lt; &gt;</span>
            <span>Pressione <kbd className="font-mono bg-neutral-6/30 px-1 rounded-[4px]">Ctrl+K</kbd> para fechar, pressione <kbd className="font-mono bg-neutral-6/30 px-1 rounded-[4px]">Tab</kbd> para ver ações adicionais</span>
          </div>
          <span className="font-bold opacity-30"><HelpCircle size={14}/></span>
        </div>
      </div>
    </div>
  );
}
