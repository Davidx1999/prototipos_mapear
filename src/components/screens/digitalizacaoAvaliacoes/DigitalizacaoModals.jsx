import React from 'react';
import { createPortal } from 'react-dom';
import {
  Camera, FileUp, CheckCircle2, AlertCircle, FileText, X, AlertTriangle,
  Trash2, Image, LogOut
} from 'lucide-react';
import Button from '../../ui/Button';

export default function DigitalizacaoModals({
  showUploadOptionsModal,
  setShowUploadOptionsModal,
  activeStudent,
  handleChooseScannerEditor,
  handleDirectPdfUpload,
  
  showConcluidoHelpModal,
  setShowConcluidoHelpModal,
  
  showErroHelpModal,
  setShowErroHelpModal,
  handleOpenUploadOptions,
  
  showPdfViewerModal,
  setShowPdfViewerModal,
  
  showScannerTutorialModal,
  setShowScannerTutorialModal,
  hideTutorial,
  setHideTutorial,
  setStep,
  
  showDeletePageModal,
  setShowDeletePageModal,
  scannerPages,
  setScannerPages,
  activePageIndex,
  setActivePageIndex,
  setToast,
  
  showMissingPagesModal,
  setShowMissingPagesModal,
  hasConfirmedMissingPages,
  setHasConfirmedMissingPages,
  handleFinishScannerUpload,
  
  showAddPageModal,
  setShowAddPageModal,
  
  isProfileDrawerOpen,
  setIsProfileDrawerOpen,
  isDarkMode,
  setIsDarkMode,
  selectedSchool,
  selectedClass
}) {
  return (
    <>
      {/* MODAL 1: COMO ENVIAR A AVALIAÇÃO? */}
      {showUploadOptionsModal && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
          onClick={() => setShowUploadOptionsModal(false)}
        >
          <div
            className="bg-white rounded-[8px] shadow-2xl pt-[4px] px-6 pb-6 w-full max-w-sm border border-neutral-200 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div 
              className="flex justify-center w-full mb-4 cursor-pointer sm:hidden"
              onClick={() => setShowUploadOptionsModal(false)}
            >
              <div className="w-[36px] h-[4px] bg-neutral-300 rounded-full"></div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-[18px] font-black text-neutral-800">
                Como enviar a avaliação?
              </h3>
              <p className="text-[12px] text-neutral-5 mt-1">
                Selecione como deseja digitalizar o teste de {activeStudent?.name.split(' ')[0]}
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {/* Option 1: Abrir Editor de Páginas */}
              <button
                onClick={handleChooseScannerEditor}
                className="p-4 rounded-xl border border-primary-base bg-white active:bg-primary-extraLight flex items-start gap-4 text-left transition-all group"
              >
                <div className="w-[42px] h-[42px] rounded-lg border border-neutral-200 bg-neutral-50/50 text-primary-base flex items-center justify-center shrink-0 shadow-sm group-active:scale-95 transition-transform">
                  <Camera size={22} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-primary-dark group-active:text-primary-extraDark">
                    Abrir Editor de Páginas
                  </h4>
                  <p className="text-[11px] text-neutral-800 mt-0.5 leading-snug">
                    Tire fotos ou selecione imagens para preparar o PDF da avaliação.
                  </p>
                </div>
              </button>

              {/* Option 2: Enviar PDF Pronto */}
              <button
                onClick={handleDirectPdfUpload}
                className="p-4 rounded-xl border border-primary-base bg-white active:bg-primary-extraLight flex items-start gap-4 text-left transition-all group"
              >
                <div className="w-[42px] h-[42px] rounded-lg border border-neutral-200 bg-neutral-50/50 text-primary-base flex items-center justify-center shrink-0 shadow-sm group-active:scale-95 transition-transform">
                  <FileUp size={22} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-primary-dark group-active:text-primary-extraDark">
                    Enviar PDF Pronto
                  </h4>
                  <p className="text-[11px] text-neutral-800 mt-0.5 leading-snug">
                    Use quando o PDF da avaliação já estiver preparado no seu celular.
                  </p>
                </div>
              </button>
            </div>

            <div className="border-t border-neutral-200 pt-4 -mx-6 px-6 pb-2">
              <Button
                variant="tertiary"
                appearance="solid"
                size="lg"
                className="w-full font-bold uppercase !text-neutral-800 !h-[56px]"
                onClick={() => setShowUploadOptionsModal(false)}
              >
                CANCELAR
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: AJUDA / MOTIVO STATUS CONCLUÍDO */}
      {showConcluidoHelpModal && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowConcluidoHelpModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-neutral-200 text-center animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-[52px] h-[52px] rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 size={28} />
            </div>

            <h3 className="text-[17px] font-black text-neutral-800 mb-2">
              Teste com Status Concluído
            </h3>

            <p className="text-[13px] text-neutral-6 leading-relaxed mb-6">
              A avaliação de <strong>{activeStudent?.name}</strong> já foi totalmente processada e finalizada pelo sistema Mapear.
              <br /><br />
              <span className="text-[12px] text-neutral-5 bg-neutral-100 p-2.5 rounded-lg block font-medium">
                🔒 Por motivos de integridade e segurança dos dados, o status <strong>Concluído</strong> proíbe o envio ou substituição do PDF novamente.
              </span>
            </p>

            <Button
              variant="primary"
              size="md"
              className="w-full font-bold uppercase"
              onClick={() => setShowConcluidoHelpModal(false)}
            >
              ENTENDI
            </Button>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 3: AJUDA / MOTIVO STATUS ERRO */}
      {showErroHelpModal && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowErroHelpModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-neutral-200 animate-scale-up text-left"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[44px] h-[44px] rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                <AlertCircle size={24} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block font-black">Informações do Erro</span>
                <h3 className="text-[16px] font-black text-neutral-800 leading-tight">Falha na Leitura do Teste</h3>
              </div>
            </div>

            <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl mb-4 text-[12px] text-red-900 leading-relaxed font-medium">
              {activeStudent?.errorDetails || 'Página ilegível / Folha cortada. Recomendamos refazer a captura.'}
            </div>

            <p className="text-[12px] text-neutral-6 leading-relaxed mb-6">
              Para corrigir este problema, utilize o botão <strong>ENVIAR NOVAMENTE</strong> na lista de estudantes para refazer as fotos ou anexar um arquivo PDF válido.
            </p>

            <div className="flex gap-2">
              <Button
                variant="tertiary"
                size="md"
                className="flex-1 font-bold"
                onClick={() => setShowErroHelpModal(false)}
              >
                FECHAR
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1 font-bold bg-red-600 hover:bg-red-700"
                onClick={() => {
                  setShowErroHelpModal(false);
                  handleOpenUploadOptions(activeStudent);
                }}
              >
                ENVIAR NOVAMENTE
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 4: VISUALIZADOR DE PDF */}
      {showPdfViewerModal && createPortal(
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex flex-col animate-fade-in"
          onClick={() => setShowPdfViewerModal(false)}
        >
          <div
            className="h-[56px] bg-neutral-900 text-white flex items-center justify-between px-4 shrink-0 border-b border-neutral-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 truncate">
              <FileText size={18} className="text-[#008BC9]" />
              <span className="text-[14px] font-bold truncate">
                {activeStudent?.file || 'avaliacao.pdf'}
              </span>
            </div>
            <button
              onClick={() => setShowPdfViewerModal(false)}
              className="p-1 rounded-full hover:bg-neutral-800 text-white/80"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center gap-4 bg-neutral-950"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full max-w-sm aspect-[1/1.4] bg-white rounded-lg p-6 shadow-2xl border border-neutral-700 flex flex-col justify-between text-neutral-800">
              <div className="border-b pb-2 flex justify-between text-[11px] font-bold">
                <span>AVALIAÇÃO DE PORTUGUÊS</span>
                <span>PÁGINA 1 DE 2</span>
              </div>

              <div className="py-4 space-y-3">
                <div className="h-2 bg-neutral-200 rounded w-full"></div>
                <div className="h-2 bg-neutral-200 rounded w-3/4"></div>
                <div className="p-3 bg-[#FAF7F2] border border-[#E9E3D5] rounded text-[12px] italic font-serif text-sky-900">
                  {activeStudent?.name} - Resposta enviada com sucesso ao banco de dados Mapear.
                </div>
                <div className="h-2 bg-neutral-200 rounded w-5/6"></div>
              </div>

              <div className="border-t pt-2 text-[10px] text-neutral-400 font-mono flex justify-between">
                <span>DOCUMENTO VERIFICADO</span>
                <span>OK</span>
              </div>
            </div>
          </div>

          <div
            className="p-4 bg-neutral-900 border-t border-neutral-800 flex justify-center gap-3 shrink-0"
            onClick={e => e.stopPropagation()}
          >
            <Button
              variant="tertiary"
              size="md"
              className="!text-white font-bold"
              onClick={() => setShowPdfViewerModal(false)}
            >
              FECHAR VISUALIZADOR
            </Button>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 5: DICAS DE ESCANEAMENTO (TUTORIAL SCANNER) */}
      {showScannerTutorialModal && createPortal(
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
          onClick={() => setShowScannerTutorialModal(false)}
        >
          <div
            className="bg-white rounded-t-[16px] sm:rounded-[8px] shadow-2xl pt-[4px] px-6 pb-6 w-full sm:max-w-sm border border-neutral-200 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div 
              className="flex justify-center w-full mb-4 cursor-pointer sm:hidden"
              onClick={() => setShowScannerTutorialModal(false)}
            >
              <div className="w-[36px] h-[4px] bg-neutral-300 rounded-full"></div>
            </div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[11px] font-bold text-primary-base uppercase tracking-wider block font-black">Escaneamento</span>
                <h3 className="text-[18px] font-black text-neutral-800 mt-0.5">Dicas Recomendáveis para Escanear</h3>
              </div>
              <button
                onClick={() => setShowScannerTutorialModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-6 text-[12px] text-neutral-7">
              <div className="flex gap-3 items-start p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="w-5 h-5 rounded-full bg-primary-base text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p>Retire objetos como grampos e clipes do papel. Isso ajuda o nosso sistema a encontrar as bordas bem rapidinho!</p>
              </div>

              <div className="flex gap-3 items-start p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="w-5 h-5 rounded-full bg-primary-base text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p>Apoie o papel em uma superfície plana e iluminada. Evite fundos da mesma cor da folha.</p>
              </div>

              <div className="flex gap-3 items-start p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="w-5 h-5 rounded-full bg-primary-base text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p>Garanta que as 4 pontas da folha apareçam na tela, mas fique perto o suficiente para o texto continuar bem legível.</p>
              </div>

              <div className="flex gap-3 items-start p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="w-5 h-5 rounded-full bg-primary-base text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                <p>Toque em Nova foto para abrir a câmera ou escolha um arquivo direto da sua Galeria.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 text-[12px] text-neutral-6">
              <input
                type="checkbox"
                id="hideTutorialCheck"
                checked={hideTutorial}
                onChange={(e) => setHideTutorial(e.target.checked)}
                className="w-4 h-4 rounded text-primary-base"
              />
              <label htmlFor="hideTutorialCheck" className="cursor-pointer font-medium">
                Desativar Tutorial
              </label>
            </div>

            <div className="flex flex-col gap-2 relative">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setShowScannerTutorialModal(false);
                    setStep('scanner');
                  }
                }}
              />
              <Button
                variant="primary"
                appearance="solid"
                size="lg"
                className="w-full font-bold uppercase flex items-center justify-center gap-2 !h-[56px]"
              >
                <Camera size={20} />
                <span>NOVA FOTO</span>
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 6: EXCLUIR PÁGINA */}
      {showDeletePageModal && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowDeletePageModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs border border-neutral-200 text-center animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-[48px] h-[48px] rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 size={24} />
            </div>

            <h3 className="text-[17px] font-black text-neutral-800 mb-1">Excluir página?</h3>
            <p className="text-[12px] text-neutral-5 leading-relaxed mb-6">
              Deseja remover esta foto do ajuste de páginas? Essa ação não pode ser desfeita, mas você sempre pode tirar uma nova foto.
            </p>

            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold bg-red-600 hover:bg-red-700"
                onClick={() => {
                  if (scannerPages.length > 1) {
                    setScannerPages(prev => prev.filter((_, idx) => idx !== activePageIndex));
                    setActivePageIndex(0);
                    setToast("Página removida");
                  } else {
                    setToast("Não é possível remover a única página");
                  }
                  setShowDeletePageModal(false);
                }}
              >
                APAGAR
              </Button>
              <Button
                variant="tertiary"
                appearance="ghost"
                size="md"
                className="w-full font-bold text-neutral-5"
                onClick={() => setShowDeletePageModal(false)}
              >
                CANCELAR
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 7: ATENÇÃO PÁGINAS FALTANDO */}
      {showMissingPagesModal && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowMissingPagesModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-neutral-200 text-center animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-[52px] h-[52px] rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
              <AlertTriangle size={28} />
            </div>

            <h3 className="text-[17px] font-black text-neutral-800 mb-2">Atenção: Páginas Faltando</h3>
            <p className="text-[12px] text-neutral-6 leading-relaxed mb-4">
              Você está prestes a enviar o teste com menos páginas do que o esperado. Isso pode afetar a correção e o resultado final do estudante. Deseja continuar mesmo assim?
            </p>

            <div className="flex items-start gap-2 mb-6 text-left p-3 bg-neutral-50 border rounded-xl">
              <input
                type="checkbox"
                id="missingCheck"
                checked={hasConfirmedMissingPages}
                onChange={(e) => setHasConfirmedMissingPages(e.target.checked)}
                className="w-4 h-4 rounded text-[#008BC9] mt-0.5"
              />
              <label htmlFor="missingCheck" className="text-[11px] font-medium text-neutral-7 cursor-pointer leading-snug">
                Compreendo que o envio incompleto pode impactar a correção do teste.
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                disabled={!hasConfirmedMissingPages}
                className="w-full font-bold uppercase"
                onClick={() => {
                  setShowMissingPagesModal(false);
                  handleFinishScannerUpload();
                }}
              >
                ENVIAR MESMO ASSIM
              </Button>
              <Button
                variant="tertiary"
                appearance="ghost"
                size="md"
                className="w-full font-bold text-neutral-5"
                onClick={() => setShowMissingPagesModal(false)}
              >
                CANCELAR
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 8: ADICIONAR PÁGINA */}
      {showAddPageModal && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
          onClick={() => setShowAddPageModal(false)}
        >
          <div
            className="bg-white rounded-t-[24px] sm:rounded-2xl shadow-2xl p-6 w-full max-w-xs border border-neutral-200 text-center animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-[16px] font-black text-neutral-800 mb-4">Adicionar página</h3>

            <div className="flex flex-col gap-3 mb-4">
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold flex items-center justify-center gap-2"
                onClick={() => {
                  setShowAddPageModal(false);
                  setScannerPages(prev => [...prev, { id: prev.length + 1, isIllegible: false }]);
                  setActivePageIndex(scannerPages.length);
                  setToast("Nova foto tirada!");
                }}
              >
                <Camera size={16} />
                <span>NOVA FOTO</span>
              </Button>

              <Button
                variant="tertiary"
                appearance="outlined"
                size="md"
                className="w-full font-bold flex items-center justify-center gap-2"
                onClick={() => {
                  setShowAddPageModal(false);
                  setScannerPages(prev => [...prev, { id: prev.length + 1, isIllegible: false }]);
                  setActivePageIndex(scannerPages.length);
                  setToast("Imagem da galeria carregada!");
                }}
              >
                <Image size={16} />
                <span>SELECIONE NA GALERIA</span>
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 9: DRAWER / MENU PERFIL DO USUÁRIO */}
      {isProfileDrawerOpen && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex justify-end animate-fade-in"
          onClick={() => setIsProfileDrawerOpen(false)}
        >
          <div
            className="w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-slide-left border-l border-neutral-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-start border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 text-white font-bold text-[16px] flex items-center justify-center shadow">
                    JD
                  </div>
                  <div>
                    <h3 className="text-[15px] font-black text-neutral-800">David Salviano</h3>
                    <p className="text-[11px] font-bold text-[#008BC9]">Gestor Educacional</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsProfileDrawerOpen(false)}
                  className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-[13px]">
                <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl">
                  <span className="font-semibold text-neutral-7">Modo Escuro</span>
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={(e) => setIsDarkMode(e.target.checked)}
                    className="w-4 h-4 text-[#008BC9] rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl">
                  <span className="font-semibold text-neutral-7">Ocultar Tutorial</span>
                  <input
                    type="checkbox"
                    checked={hideTutorial}
                    onChange={(e) => setHideTutorial(e.target.checked)}
                    className="w-4 h-4 text-[#008BC9] rounded"
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-[12px] text-neutral-6">
                <span className="font-bold text-neutral-4 uppercase text-[10px] tracking-wider block">Contexto Atual</span>
                <p><strong>Escola:</strong> {selectedSchool}</p>
                <p><strong>Turma:</strong> {selectedClass}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <Button
                variant="tertiary"
                appearance="outlined"
                size="md"
                className="w-full font-bold text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center gap-2"
                onClick={() => {
                  setIsProfileDrawerOpen(false);
                  setToast("Sessão encerrada");
                }}
              >
                <LogOut size={16} />
                <span>Sair da Conta</span>
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
