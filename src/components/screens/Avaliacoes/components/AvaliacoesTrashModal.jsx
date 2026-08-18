import React, { useState } from 'react';
import { X, Trash2, RefreshCw, AlertTriangle, Calendar, Layers, ArrowLeft, Search } from 'lucide-react';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';
import Input from '../../../ui/Input';

export default function AvaliacoesTrashModal({
  isOpen,
  onClose,
  trashAssessments,
  onRestore,
  onPermanentDelete,
  onEmptyTrash,
  isDarkMode
}) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredTrashAssessments = trashAssessments.filter(av => 
    av.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    av.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calcula dias restantes considerando 90 dias de retenção
  const getDaysLeft = (deletedAt) => {
    if (!deletedAt) return 90;
    const deletionDate = new Date(deletedAt);
    const expireDate = new Date(deletionDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className={`flex flex-col w-full h-full animate-fadeIn flex-1 min-h-0 overflow-hidden ${
      isDarkMode ? 'bg-neutral-7 text-white' : 'bg-neutral-1 text-neutral-8'
    }`}>
        {/* Header Tela Cheia */}
        <div className={`flex items-center justify-between p-6 border-b shrink-0 ${
          isDarkMode ? 'border-neutral-5 bg-neutral-6' : 'border-neutral-2 bg-white shadow-sm'
        }`}>
          <div className="flex items-center gap-4">
            <Button 
              variant="tertiary" 
              appearance="solid" 
              size="sm" 
              iconLeft={<ArrowLeft size={18} />} 
              onClick={onClose}
            >
              Voltar ao Editor
            </Button>
            <div className="h-6 w-px bg-neutral-3 dark:bg-neutral-5" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[8px] bg-semantic-error-extraLight/50 text-semantic-error-base dark:bg-semantic-error-dark/20">
                <Trash2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-8 dark:text-white flex items-center gap-2">
                  Lixeira de Avaliações
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-semantic-error-extraLight text-semantic-error-dark font-mono font-bold">
                    {trashAssessments.length} {trashAssessments.length === 1 ? 'item' : 'itens'}
                  </span>
                </h2>
                <p className="text-xs text-neutral-5 dark:text-neutral-4 font-medium mt-0.5">
                  Avaliações excluídas são mantidas aqui por até <strong className="text-semantic-error-base">90 dias</strong> antes da exclusão definitiva.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {trashAssessments.length > 0 && (
              <>
                <div className="w-64">
                  <Input 
                    type="text" 
                    placeholder="Buscar na lixeira..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    iconLeft={<Search size={16} />}
                  />
                </div>
                <Button 
                  variant="tertiary" 
                  appearance="solid" 
                  size="sm" 
                  iconLeft={<AlertTriangle size={14} />} 
                  onClick={onEmptyTrash} 
                  className="text-semantic-error-base border-semantic-error-light hover:bg-semantic-error-extraLight dark:hover:bg-semantic-error-dark/20"
                >
                  Esvaziar Lixeira
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Body Tela Cheia */}
        <div className={`flex-1 overflow-y-auto p-8 max-w-[72%] w-full mx-auto ${isDarkMode ? 'bg-neutral-7' : 'bg-neutral-1'}`}>
          {filteredTrashAssessments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center space-y-4 opacity-70">
              <div className="p-5 rounded-full bg-neutral-2 dark:bg-neutral-6">
                <Trash2 size={56} className="text-neutral-4" />
              </div>
              <div>
                <div className="text-base font-bold text-neutral-7 dark:text-neutral-2">
                  {searchQuery ? 'Nenhuma avaliação encontrada' : 'A lixeira está vazia'}
                </div>
                <div className="text-xs text-neutral-5 mt-1">
                  {searchQuery ? 'Tente buscar por outros termos.' : 'Nenhuma avaliação excluída recentemente.'}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrashAssessments.map(av => {
                const daysLeft = getDaysLeft(av.deletedAt);
                const isExpiringSoon = daysLeft <= 15;

                return (
                  <div 
                    key={av.id} 
                    className={`p-5 rounded-[8px] border flex items-center justify-between gap-6 transition-all ${
                      isDarkMode ? 'bg-neutral-6 border-neutral-5 hover:border-neutral-4' : 'bg-white border-neutral-2 hover:border-brand-300 shadow-sm'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Chips label={av.code} status="storm" variant="light" />
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-wider ${
                          isExpiringSoon ? 'bg-semantic-error-extraLight text-semantic-error-dark dark:bg-semantic-error-dark/20' : 'bg-neutral-2 text-neutral-6 dark:bg-neutral-5 dark:text-neutral-3'
                        }`}>
                          Exclui em {daysLeft} dias
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-neutral-8 dark:text-white truncate">{av.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-neutral-5 dark:text-neutral-4">
                        <span className="flex items-center gap-1.5 font-medium"><Layers size={14} /> {av.testsCount} Caderno(s)</span>
                        <span className="flex items-center gap-1.5 font-medium"><Calendar size={14} /> Ano: {av.schoolYear}</span>
                        <span>•</span>
                        <span>Excluída em: {new Date(av.deletedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Button variant="secondary" appearance="solid" size="md" iconLeft={<RefreshCw size={15} />} onClick={() => onRestore(av.id)}>
                        Restaurar
                      </Button>
                      <Button variant="tertiary" appearance="ghost" size="md" iconOnly iconLeft={<Trash2 size={18} />} className="text-semantic-error-base hover:bg-semantic-error-extraLight" onClick={() => onPermanentDelete(av.id)} title="Excluir Definitivamente" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
  );
}
