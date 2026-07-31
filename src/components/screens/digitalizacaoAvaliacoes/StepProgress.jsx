import React from 'react';

export default function StepProgress({ currentStep, setStep }) {
  const stepTarget = {
    1: 'avaliacoes',
    2: 'testes',
    3: 'turmas',
    4: 'estudantes'
  };

  return (
    <div className="flex items-center gap-[8px] px-[16px] pt-[6px] pb-[10px] bg-white shrink-0 select-none">
      {[1, 2, 3, 4].map((stepNum) => {
        if (stepNum === currentStep) {
          return (
            <div
              key={stepNum}
              className="w-[32px] h-[6px] rounded-full bg-[#003A79] transition-all duration-200"
              title={`Passo ${stepNum} (Atual)`}
            />
          );
        } else if (stepNum < currentStep) {
          return (
            <div
              key={stepNum}
              onClick={() => setStep(stepTarget[stepNum])}
              className="w-[9px] h-[9px] rounded-full bg-[#008BC9] hover:bg-[#003A79] hover:scale-125 transition-all duration-200 cursor-pointer"
              title={`Voltar para o Passo ${stepNum}`}
            />
          );
        } else {
          return (
            <div
              key={stepNum}
              className="w-[9px] h-[9px] rounded-full border-2 border-neutral-400 bg-white transition-all duration-200"
              title={`Passo ${stepNum}`}
            />
          );
        }
      })}
    </div>
  );
}
