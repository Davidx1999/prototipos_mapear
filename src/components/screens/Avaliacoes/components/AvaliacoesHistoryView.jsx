import React, { useState } from 'react';
import { Archive, Copy, Calendar, Layers, Eye, Target, Search } from 'lucide-react';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';
import Input from '../../../ui/Input';
import { CONTENT_MAX_WIDTH_PERCENT } from '../AvaliacoesHubV2';

export default function AvaliacoesHistoryView({ 
  historicalAssessments, 
  onDuplicateToCurrentYear, 
  onSelectAssessment,
  yearFilter,
  isDarkMode 
}) {

  const filtered = historicalAssessments.filter(a => {
    if (yearFilter !== 'Todos os Anos Antigos' && a.schoolYear !== yearFilter) return false;
    return true;
  });

  return (
    <div className={`flex flex-col h-full font-['Montserrat',sans-serif] transition-colors ${isDarkMode ? 'bg-neutral-7' : 'bg-brand-50/30'}`}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto w-full space-y-4" style={{ maxWidth: `${CONTENT_MAX_WIDTH_PERCENT}%` }}>
          {filtered.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <Archive size={48} className="mx-auto mb-3 text-neutral-4" />
              <p className="text-sm font-bold text-neutral-6 dark:text-neutral-3">Nenhuma avaliação antiga encontrada.</p>
            </div>
          ) : (
            filtered.map(av => (
              <div 
                key={av.id} 
                className={`p-5 rounded-[8px] border flex items-center justify-between gap-6 transition-all ${
                  isDarkMode ? 'bg-neutral-6 border-neutral-5 hover:border-brand-500/50' : 'bg-white border-neutral-2 hover:border-brand-300 hover:shadow-md'
                }`}
              >
                {/* Meta Lateral */}
                <div className={`flex flex-col items-center justify-center p-3 rounded-[8px] border min-w-[90px] shrink-0 ${
                  isDarkMode ? 'bg-neutral-7 border-neutral-5' : 'bg-neutral-1 border-neutral-2'
                }`}>
                  <Calendar size={18} className="text-neutral-5 mb-1" />
                  <span className="text-sm font-bold text-neutral-8 dark:text-white">{av.schoolYear}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Chips label={av.code} status="storm" variant="dark" />
                    <Chips label="Arquivada" status="neutral" variant="stroked" iconLeft={<Archive size={12} />} />
                    <Chips label={av.type} status={av.type === 'Somativa' ? 'cherry' : 'oliva'} variant="light" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-8 dark:text-white truncate">{av.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-xs font-medium text-neutral-5 dark:text-neutral-4">
                    <span className="flex items-center gap-1.5"><Layers size={14} /> {av.testsCount} Cadernos</span>
                    <span className="flex items-center gap-1.5"><Target size={14} /> {av.itemsCount} Itens Avaliativos</span>
                    <span>•</span>
                    <span>{av.municipality} - {av.grade}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button 
                    variant="tertiary" 
                    appearance="solid" 
                    size="sm" 
                    iconLeft={<Eye size={16} />}
                    onClick={() => onSelectAssessment(av)}
                  >
                    Visualizar
                  </Button>
                  <Button 
                    variant="primary" 
                    appearance="solid" 
                    size="sm" 
                    iconLeft={<Copy size={16} />}
                    onClick={() => onDuplicateToCurrentYear(av)}
                  >
                    Clonar p/ Ano Atual
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
