import React from 'react';
import { X, Printer, Download, BookOpen } from 'lucide-react';
import Button from '../../../ui/Button';

/**
 * Modal de Preview e Geração de PDF (Formato de Prova/Caderno)
 * Layout voltado para o estudante, pronto para impressão.
 */
export default function AssessmentPdfModal({ assessment, onClose, isDarkMode, allItems, allTasks }) {
  const handlePrint = () => {
    window.print();
  };

  if (!assessment) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col font-['Montserrat',sans-serif] bg-black/60 backdrop-blur-sm print:bg-white print:backdrop-blur-none">
      
      {/* ─── TOOLBAR SUPERIOR (NÃO APARECE NA IMPRESSÃO) ─── */}
      <div className={`print:hidden p-4 border-b flex items-center justify-between shadow-md shrink-0 ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-8'}`}>
        <div>
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Printer size={20} className="text-brand-500" />
            Visualização de Impressão (Caderno de Prova)
          </h2>
          <p className="text-xs text-neutral-5 dark:text-neutral-4 mt-0.5">O documento impresso terá formatação otimizada para o estudante.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="tertiary" appearance="ghost" onClick={onClose} iconLeft={<X size={16} />}>Fechar</Button>
          <Button variant="primary" appearance="solid" iconLeft={<Download size={16} />} onClick={handlePrint}>
            Imprimir Prova
          </Button>
        </div>
      </div>

      {/* ─── ÁREA DE PRÉ-VISUALIZAÇÃO E IMPRESSÃO ─── */}
      <div className="flex-1 overflow-y-auto p-8 bg-neutral-2 dark:bg-neutral-8 print:p-0 print:bg-white print:overflow-visible">
        
        <div className="max-w-[210mm] mx-auto bg-white text-black print:shadow-none shadow-xl border border-neutral-3 print:border-none rounded-sm min-h-[297mm] print:min-h-0 relative">
          
          <div className="p-12 print:p-0">
            
            {/* CABEÇALHO DA PROVA */}
            <div className="border-2 border-black p-4 mb-8 rounded-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight">{assessment.title}</h1>
                  <p className="text-sm font-bold uppercase mt-1">Secretaria de Educação - {assessment.municipality}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-bold border border-black px-2 py-1 inline-block">{assessment.code}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t-2 border-black pt-4">
                <div className="border-b border-black pb-1 flex items-end">
                  <span className="text-xs font-bold uppercase w-24 shrink-0">Estudante:</span>
                  <span className="flex-1"></span>
                </div>
                <div className="border-b border-black pb-1 flex items-end">
                  <span className="text-xs font-bold uppercase w-16 shrink-0">Turma:</span>
                  <span className="flex-1"></span>
                </div>
                <div className="border-b border-black pb-1 flex items-end">
                  <span className="text-xs font-bold uppercase w-16 shrink-0">Escola:</span>
                  <span className="flex-1"></span>
                </div>
                <div className="border-b border-black pb-1 flex items-end">
                  <span className="text-xs font-bold uppercase w-12 shrink-0">Data:</span>
                  <span className="flex-1"></span>
                </div>
              </div>
            </div>

            {/* CONTEÚDO DOS CADERNOS */}
            <div className="space-y-12">
              {assessment.testsTree?.map((test, idx) => (
                <div key={idx} className="print-section">
                  <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b-2 border-black pb-2">
                    <BookOpen size={24} /> {test.title}
                  </h2>

                  <div className="space-y-8">
                    {test.tasks?.map((task, tidx) => (
                      <div key={tidx}>
                        {task.hasItemComposto && (
                          <div className="mb-6 p-5 border border-neutral-300 rounded-sm bg-neutral-50 text-justify leading-relaxed">
                            <h3 className="font-bold text-sm uppercase mb-2 border-b border-neutral-300 pb-1 text-center">Texto Base para Resolução</h3>
                            <div className="prose prose-sm max-w-none prose-p:my-2" dangerouslySetInnerHTML={{ __html: (task.itemCompostoMarkdown || '').replace(/\n/g, '<br/>') }} />
                          </div>
                        )}

                        <div className="space-y-8">
                          {(task.items || []).map((item, iidx) => (
                            <div key={iidx} className="border-l-4 border-black pl-4 py-1">
                              <h4 className="font-bold text-lg mb-4">{item.title}</h4>
                              <p className="text-sm mb-4">Leia atentamente as informações e assinale a alternativa correta.</p>
                              
                              <div className="space-y-3">
                                {['(A)', '(B)', '(C)', '(D)'].map(opt => (
                                  <div key={opt} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">{opt.replace(/[()]/g, '')}</div>
                                    <div className="border-b border-dashed border-neutral-400 flex-1 pt-4"></div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
      
      {/* ─── ESTILOS ESPECÍFICOS PARA IMPRESSÃO ─── */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .fixed.inset-0.z-\\[100\\] {
            position: absolute; left: 0; top: 0; margin: 0; padding: 0;
            width: 100%; height: auto; visibility: visible; background: white;
          }
          .fixed.inset-0.z-\\[100\\] * { visibility: visible; }
          .print\\:hidden, .print\\:hidden * { display: none !important; }
          @page { margin: 15mm; size: A4; }
          .print-section { page-break-inside: avoid; }
        }
      `}} />
    </div>
  );
}
