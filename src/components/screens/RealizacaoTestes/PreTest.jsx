import React from 'react';
import { ArrowLeft, BookMarked, CalendarClock, ListChecks, Timer, AlertTriangle } from 'lucide-react';
import Footer from '../../ui/Footer';
import Button from '../../ui/Button';

export default function PreTest({ colors, assessment, handleStartTest, setCurrentScreen }) {
  if (!assessment) return null;

  const av = assessment;
  let btnText = av.status === 'active' && av.progress > 0 ? 'CONTINUAR AVALIAÇÃO' : 'INICIAR AVALIAÇÃO';

  return (
    <div className="h-full w-full flex flex-col font-['Montserrat',sans-serif] text-[#1D2432] overflow-y-auto custom-scrollbar" style={{ backgroundColor: colors.neutral[0] }}>
      <main className="flex-1 max-w-[900px] w-full mx-auto p-4 md:p-10 pb-28 animate-fade-slide">
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="tertiary"
            appearance="solid"
            iconOnly={true}
            onClick={() => setCurrentScreen('dashboard')}
          >
            <ArrowLeft />
          </Button>
          <span className="text-[16px] leading-[24px] font-medium" style={{ color: colors.neutral[6] }}>
            Realizar Avaliação
          </span>
        </div>

        <div className="bg-[#001D31] rounded-lg p-6 shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none">
            <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full"><path d="M0,200 C100,100 200,0 500,0" fill="none" stroke="#FFFFFF" strokeWidth="2" /><path d="M40,200 C140,100 240,0 500,40" fill="none" stroke="#FFFFFF" strokeWidth="2" /></svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[14px] leading-[21px] font-medium mb-3" style={{ color: colors.neutral[2] }}>
              <BookMarked size={16} /> {av.id} • {av.subtitle}
            </div>
            <h6 className="text-[18px] leading-[26px] font-medium text-white w-full">
              {av.title}
            </h6>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-[14px] leading-[21px] font-semibold mb-1" style={{ color: colors.neutral[6] }}>Sobre a realização</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col gap-1.5 p-4 rounded-lg border" style={{ backgroundColor: colors.neutral[1], borderColor: colors.neutral[2] }}>
              <div className="flex items-center gap-2 text-[14px] leading-[21px] font-medium" style={{ color: colors.neutral[6] }}>
                <CalendarClock size={16} style={{ color: colors.neutral[5] }} /> Prazo para Entrega
              </div>
              <div className="font-bold text-[#1D2432] text-[15px]">{av.endDate}</div>
            </div>
            <div className="flex flex-col gap-1.5 p-4 rounded-lg border" style={{ backgroundColor: colors.neutral[1], borderColor: colors.neutral[2] }}>
              <div className="flex items-center gap-2 text-[14px] leading-[21px] font-medium" style={{ color: colors.neutral[6] }}>
                <ListChecks size={16} style={{ color: colors.neutral[5] }} /> Total de Itens
              </div>
              <div className="font-bold text-[#1D2432] text-[15px]">{av.totalItems} questões</div>
            </div>
            <div className="flex flex-col gap-1.5 p-4 rounded-lg border" style={{ backgroundColor: colors.neutral[1], borderColor: colors.neutral[2] }}>
              <div className="flex items-center gap-2 text-[14px] leading-[21px] font-medium" style={{ color: colors.neutral[6] }}>
                <Timer size={16} style={{ color: colors.neutral[5] }} /> Média de Tempo
              </div>
              <div className="font-bold text-[#1D2432] text-[15px]">{av.avgTime}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-bold text-[14px] uppercase tracking-wide mb-4" style={{ color: colors.primary.dark }}>
            <AlertTriangle size={18} /> LEIA COM ATENÇÃO ANTES DE COMEÇAR
          </div>

          <ul className="list-none flex flex-col gap-3 text-[14px] md:text-[15px] text-gray-700 leading-relaxed font-medium">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: colors.primary.dark }}></div>
              Você terá um limite para realização da prova.
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: colors.primary.dark }}></div>
              Você pode finalizar a avaliação mesmo com algumas questões incompletas.
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: colors.primary.dark }}></div>
              A avaliação possui questões abertas e de múltiplas escolhas.
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: colors.primary.dark }}></div>
              Responda a questão e clique em “Confirmar” para responder.
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: colors.primary.dark }}></div>
              Ao final da avaliação, clique em “Finalizar e Enviar” para terminar a prova caso você queira.
            </li>
          </ul>
        </div>

      </main>

      <Footer colors={colors} hasBorder={false}>
        <Button
          variant="primary"
          appearance="solid"
          size="md"
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
