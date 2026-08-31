import React from 'react';
import { ArrowLeft, BookMarked, CalendarClock, ListChecks, Timer, AlertTriangle } from 'lucide-react';
import Footer from '../../ui/Footer';
import Button from '../../ui/Button';

export default function PreTest({ colors, assessment, handleStartTest, setCurrentScreen }) {
  if (!assessment) return null;

  const av = assessment;
  const isStarted = av.status === 'active' && av.progress > 0;
  const btnText = isStarted ? 'Continuar avaliação' : 'Iniciar avaliação';

  return (
    <div className="h-full w-full flex flex-col font-montserrat text-textIcon-main bg-bg-layout overflow-y-auto custom-scrollbar">
      <main className="flex-1 max-w-[900px] w-full mx-auto p-4 md:p-10 pb-28 animate-fade-slide">
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="tertiary"
            appearance="solid"
            iconOnly={true}
            onClick={() => setCurrentScreen('dashboard')}
            title="Voltar"
          >
            <ArrowLeft />
          </Button>
          <span className="text-[16px] leading-[24px] font-semibold text-textIcon-heading">
            Realizar Avaliação
          </span>
        </div>

        <div className="bg-brand-950 rounded-lg p-6 shadow-md mb-8 relative overflow-hidden text-white">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none">
            <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,200 C100,100 200,0 500,0" fill="none" stroke="#FFFFFF" strokeWidth="2" />
              <path d="M40,200 C140,100 240,0 500,40" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[14px] leading-[21px] font-medium mb-3 text-brand-200">
              <BookMarked size={16} /> {av.id} • {av.subtitle}
            </div>
            <h2 className="text-[18px] md:text-[20px] leading-[28px] font-bold text-white w-full">
              {av.title}
            </h2>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-[14px] leading-[21px] font-semibold mb-4 text-textIcon-heading">
            Sobre a realização
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col gap-1.5 p-4 rounded-lg border bg-bg-container border-border">
              <div className="flex items-center gap-2 text-[14px] leading-[21px] font-medium text-textIcon-description">
                <CalendarClock size={16} className="text-textIcon-description" /> Prazo para Entrega
              </div>
              <div className="font-bold text-textIcon-heading text-[15px]">{av.endDate}</div>
            </div>
            <div className="flex flex-col gap-1.5 p-4 rounded-lg border bg-bg-container border-border">
              <div className="flex items-center gap-2 text-[14px] leading-[21px] font-medium text-textIcon-description">
                <ListChecks size={16} className="text-textIcon-description" /> Total de Itens
              </div>
              <div className="font-bold text-textIcon-heading text-[15px]">{av.totalItems} itens</div>
            </div>
            <div className="flex flex-col gap-1.5 p-4 rounded-lg border bg-bg-container border-border">
              <div className="flex items-center gap-2 text-[14px] leading-[21px] font-medium text-textIcon-description">
                <Timer size={16} className="text-textIcon-description" /> Média de Tempo
              </div>
              <div className="font-bold text-textIcon-heading text-[15px]">{av.avgTime}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-bold text-[14px] tracking-wide mb-4 text-brand-700 dark:text-brand-300">
            <AlertTriangle size={18} /> LEIA COM ATENÇÃO ANTES DE COMEÇAR
          </div>

          <ul className="list-none flex flex-col gap-3 text-[14px] md:text-[15px] text-textIcon-main leading-relaxed font-medium">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-brand-500"></div>
              <span>Você terá um tempo limite para a realização desta avaliação.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-brand-500"></div>
              <span>A avaliação é composta por itens de múltipla escolha e itens descritivos.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-brand-500"></div>
              <span><strong>As respostas são salvas automaticamente</strong> durante a realização da avaliação.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-brand-500"></div>
              <span>Você poderá navegar livremente entre os itens e cadernos antes da entrega final.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-brand-500"></div>
              <span>Ao concluir, clique em <strong>“Entregar avaliação”</strong> no rodapé da página para finalizar.</span>
            </li>
          </ul>
        </div>

      </main>

      <Footer colors={colors} hasBorder={false}>
        <Button
          variant="primary"
          appearance="solid"
          size="md"
          uppercase={false}
          onClick={handleStartTest}
          disabled={av.status !== 'active'}
          className="w-[400px] max-w-[calc(100%-32px)]"
        >
          {btnText}
        </Button>
      </Footer>
    </div>
  );
}

