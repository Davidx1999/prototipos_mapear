import React from 'react';
import { Search, X, CheckCircle2, Check, AlertCircle, Upload, FileText, HelpCircle } from 'lucide-react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import MobileNavigationHeader from './MobileNavigationHeader';
import StepProgress from './StepProgress';
import CascadeBreadcrumb from './CascadeBreadcrumb';

export default function StepEstudantes({
  themeColors,
  selectedTest,
  selectedClass,
  studentSearch,
  setStudentSearch,
  onlyPendingFilter,
  setOnlyPendingFilter,
  students,
  setStep,
  handleOpenUploadOptions,
  handleOpenConcluidoHelp,
  handleOpenErroHelp,
  handleOpenPdfViewer,
  handleMobileScroll,
  isHeaderHidden
}) {
  const totalCount = students.length;
  const sentCount = students.filter(s => s.status === 'enviado' || s.status === 'concluído').length;
  const progressPercent = Math.round((sentCount / totalCount) * 100);

  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.username.toLowerCase().includes(studentSearch.toLowerCase());
    if (onlyPendingFilter) {
      return matchesSearch && (s.status === 'sem anexo' || s.status === 'erro');
    }
    return matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-slide">
      {/* Fixed Navigation Top Block */}
      <div className={`sticky top-0 z-30 shrink-0 bg-white shadow-xs border-b border-neutral-100 transition-all duration-300 ${isHeaderHidden ? 'pt-0' : 'pt-0'}`}>
        <MobileNavigationHeader
          title="Estudantes"
          onBack={() => setStep('turmas')}
          iconType="graduation"
          isHeaderHidden={isHeaderHidden}
          themeColors={themeColors}
        />
        <StepProgress currentStep={4} setStep={setStep} />
        <CascadeBreadcrumb
          leftText={selectedTest}
          rightText={selectedClass}
          onLeftClick={() => setStep('testes')}
          onRightClick={() => setStep('turmas')}
        />

        <div className="px-[16px] pb-[12px] bg-white">
          <Input
            placeholder="Buscar..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            iconLeft={<Search size={16} />}
            iconRight={studentSearch ? <X size={16} onClick={() => setStudentSearch('')} /> : null}
            height="40px"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-[16px] flex flex-col gap-[14px]">
          {/* Progress Section */}
          <div
            className="bg-white border rounded-[12px] p-[14px] flex flex-col gap-[8px]"
            style={{ borderColor: themeColors?.neutral?.[2] || '#f1f5f9' }}
          >
            <div className="flex justify-between items-center text-[12px] font-bold text-neutral-7">
              <span>{sentCount} de {totalCount} enviados</span>
              <span className="text-[#008BC9] font-black">{progressPercent}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-[8px] overflow-hidden">
              <div
                className="bg-[#008BC9] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between px-[4px] py-[2px]">
            <span className="text-[13px] font-semibold text-neutral-7">
              Visualizar apenas estudantes pendentes
            </span>
            <button
              onClick={() => setOnlyPendingFilter(!onlyPendingFilter)}
              className={`w-[44px] h-[24px] rounded-full p-[2px] transition-colors relative flex items-center ${
                onlyPendingFilter ? 'bg-[#008BC9]' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-[20px] h-[20px] rounded-full bg-white shadow-md transform transition-transform ${
                  onlyPendingFilter ? 'translate-x-[20px]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Title */}
          <span className="text-[14px] font-bold text-neutral-800 mt-[2px]">
            Lista de Estudantes
          </span>

          {/* Student Cards List */}
          <div className="flex flex-col gap-[12px]">
            {filteredStudents.map(student => {
              const isErrorStatus = student.status === 'erro';

              return (
                <div
                  key={student.id}
                  className={`bg-white border rounded-[14px] p-[16px] flex flex-col gap-[12px] transition-all shadow-sm ${
                    isErrorStatus ? 'border-red-300 bg-red-50/20' : ''
                  }`}
                  style={{ borderColor: isErrorStatus ? '#FCA5A5' : (themeColors?.neutral?.[2] || '#f1f5f9') }}
                >
                  {/* Top line: Username and Status Badge */}
                  <div className="flex items-center justify-between gap-[8px]">
                    <span className="text-[12px] font-medium text-sky-700 font-mono">
                      {student.username}
                    </span>

                    {/* STATUS BADGES */}
                    {student.status === 'sem anexo' && (
                      <span className="px-[10px] py-[3px] rounded-full bg-neutral-200 text-neutral-700 text-[11px] font-bold">
                        Sem Anexo
                      </span>
                    )}

                    {student.status === 'enviado' && (
                      <span className="px-[10px] py-[3px] rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-[4px]">
                        Enviado <CheckCircle2 size={12} />
                      </span>
                    )}

                    {student.status === 'concluído' && (
                      <span className="px-[10px] py-[3px] rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-[4px]">
                        Concluído <Check size={12} />
                      </span>
                    )}

                    {student.status === 'erro' && (
                      <span className="px-[10px] py-[3px] rounded-full bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold flex items-center gap-[4px]">
                        Erro <AlertCircle size={12} />
                      </span>
                    )}
                  </div>

                  {/* Student Name */}
                  <h4
                    className="text-[15px] font-bold text-neutral-800 leading-snug"
                    style={{ color: themeColors?.neutral?.[7] || '#0f172a' }}
                  >
                    {student.name}
                  </h4>

                  {/* BUTTON ACTIONS ACCORDING TO 4 STATUS RULES */}
                  <div className="pt-[4px] w-full">
                    {/* STATUS 1: SEM ANEXO */}
                    {student.status === 'sem anexo' && (
                      <Button
                        variant="primary"
                        appearance="solid"
                        size="md"
                        className="w-full font-bold text-[13px] flex items-center justify-center gap-[8px]"
                        iconRight={<Upload size={16} />}
                        onClick={() => handleOpenUploadOptions(student)}
                      >
                        Enviar
                      </Button>
                    )}

                    {/* STATUS 2: ENVIADO */}
                    {student.status === 'enviado' && (
                      <div className="grid grid-cols-2 gap-[8px] w-full">
                        <Button
                          variant="primary"
                          appearance="ghost"
                          size="md"
                          className="w-full font-bold text-[13px] flex items-center justify-center gap-[6px]"
                          iconRight={<FileText size={16} />}
                          onClick={() => handleOpenPdfViewer(student)}
                        >
                          Ver PDF
                        </Button>

                        <Button
                          variant="secondary"
                          appearance="solid"
                          size="md"
                          className="w-full font-bold text-[13px] flex items-center justify-center gap-[6px]"
                          iconRight={<Upload size={16} />}
                          onClick={() => handleOpenUploadOptions(student)}
                        >
                          Substituir
                        </Button>
                      </div>
                    )}

                    {/* STATUS 3: CONCLUÍDO */}
                    {student.status === 'concluído' && (
                      <div className="flex items-center gap-[8px] w-full">
                        <Button
                          variant="tertiary"
                          appearance="ghost"
                          size="md"
                          iconOnly
                          iconLeft={<HelpCircle size={20} />}
                          onClick={() => handleOpenConcluidoHelp(student)}
                          title="Saber por que não pode enviar PDF"
                        />

                        <Button
                          variant="tertiary"
                          appearance="solid"
                          size="md"
                          className="flex-1 w-full font-bold text-[13px] flex items-center justify-center gap-[6px]"
                          iconRight={<FileText size={16} />}
                          onClick={() => handleOpenPdfViewer(student)}
                        >
                          Ver PDF
                        </Button>
                      </div>
                    )}

                    {/* STATUS 4: ERRO */}
                    {student.status === 'erro' && (
                      <div className="flex items-center gap-[8px] w-full">
                        <Button
                          variant="tertiary"
                          appearance="ghost"
                          size="md"
                          iconOnly
                          iconLeft={<HelpCircle size={20} />}
                          onClick={() => handleOpenErroHelp(student)}
                          title="Informações do Erro"
                        />

                        <Button
                          variant="primary"
                          appearance="solid"
                          size="md"
                          className="flex-1 w-full font-bold text-[13px] flex items-center justify-center gap-[8px]"
                          iconRight={<Upload size={16} />}
                          onClick={() => handleOpenUploadOptions(student)}
                        >
                          Enviar Novamente
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
