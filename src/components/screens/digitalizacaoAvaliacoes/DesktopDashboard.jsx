import React from 'react';
import { Camera, CheckCircle2, Loader2, AlertCircle, Upload, FileText, XCircle } from 'lucide-react';
import Button from '../../ui/Button';
import Chips from '../../ui/Chips';
import CascadeSelector from '../../ui/CascadeSelector';

export default function DesktopDashboard({
  themeColors,
  setIsSimulatedMobile,
  setStep,
  desktopUploads,
  isDesktopUploading,
  setActiveErrorBatch,
  classSelections,
  setClassSelections,
  cascadeDb,
  handleSimulateDesktopUpload
}) {
  const totalProcessed = desktopUploads.reduce((acc, u) => acc + (u.status === 'Concluído' ? u.successSheets : 0), 0);
  const totalProcessing = desktopUploads.filter(u => u.status === 'Processando').length;
  const totalWithErrors = desktopUploads.filter(u => u.status === 'Erro').length;
  const isContextReady = classSelections[3] && classSelections[3].length > 0;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6 flex flex-col gap-6 animate-fade-slide">
      
      {/* Desktop Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E6F6FC] rounded-xl border border-[#B3E6F5] shrink-0">
              <img src="assets/fgv_logo.png" alt="FGV Logo" className="h-[32px] object-contain" />
            </div>
            <div>
              <h1
                className="text-[24px] font-black tracking-tight text-neutral-800"
                style={{ color: themeColors?.neutral?.[7] || '#0f172a' }}
              >
                Digitalização de Avaliações Mapear
              </h1>
              <p className="text-[13px] text-neutral-5 font-semibold">
                Módulo de carregamento em lote ou individual via scanner móvel.
              </p>
            </div>
          </div>
        </div>
        
        <Button
          variant="primary"
          appearance="solid"
          size="md"
          onClick={() => {
            setIsSimulatedMobile(true);
            setStep('escolas');
          }}
          iconLeft={<Camera size={18} />}
        >
          ABRIR SCANNER MOBILE
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="bg-white p-5 rounded-2xl border flex items-center justify-between shadow-sm"
          style={{ borderColor: themeColors?.neutral?.[2] || '#f1f5f9' }}
        >
          <div>
            <span className="text-[12px] font-bold text-neutral-4 uppercase tracking-wider block">Total Digitalizado</span>
            <span
              className="text-[28px] font-black text-neutral-800 block mt-1"
              style={{ color: themeColors?.neutral?.[7] || '#0f172a' }}
            >
              {totalProcessed}
            </span>
            <span className="text-[12px] text-neutral-5 block mt-1">Provas importadas com sucesso</span>
          </div>
          <div className="w-[48px] h-[48px] rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-200">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div
          className="bg-white p-5 rounded-2xl border flex items-center justify-between shadow-sm"
          style={{ borderColor: themeColors?.neutral?.[2] || '#f1f5f9' }}
        >
          <div>
            <span className="text-[12px] font-bold text-neutral-4 uppercase tracking-wider block">Em Processamento</span>
            <span
              className="text-[28px] font-black text-neutral-800 block mt-1"
              style={{ color: themeColors?.neutral?.[7] || '#0f172a' }}
            >
              {totalProcessing}
            </span>
            <span className="text-[12px] text-neutral-5 block mt-1">Lotes na fila de HTR automático</span>
          </div>
          <div className={`w-[48px] h-[48px] rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 ${totalProcessing > 0 ? 'animate-pulse' : ''}`}>
            <Loader2 size={24} className={totalProcessing > 0 ? 'animate-spin' : ''} />
          </div>
        </div>

        <div
          className="bg-white p-5 rounded-2xl border flex items-center justify-between shadow-sm"
          style={{ borderColor: themeColors?.neutral?.[2] || '#f1f5f9' }}
        >
          <div>
            <span className="text-[12px] font-bold text-neutral-4 uppercase tracking-wider block">Arquivos com Erro</span>
            <span className="text-[28px] font-black text-red-600 block mt-1">
              {totalWithErrors}
            </span>
            <span className="text-[12px] text-neutral-5 block mt-1">Lotes necessitando ajuste manual</span>
          </div>
          <div className="w-[48px] h-[48px] rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      {/* Content Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Context Card */}
        <div
          className="lg:col-span-4 bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-4"
          style={{ borderColor: themeColors?.neutral?.[2] || '#f1f5f9' }}
        >
          <div>
            <h2
              className="text-[18px] font-bold text-neutral-800"
              style={{ color: themeColors?.neutral?.[7] || '#0f172a' }}
            >
              1. Contexto Escolar
            </h2>
            <p className="text-[13px] text-neutral-5 mt-1">
              Selecione o nível e a turma para carregar os lotes de arquivos correspondentes.
            </p>
          </div>

          <div className="w-full">
            <CascadeSelector
              colors={themeColors}
              levels={[
                { id: 'regional', title: 'Regional' },
                { id: 'municipio', title: 'Município' },
                { id: 'escola', title: 'Escola' },
                { id: 'turma', title: 'Turma' }
              ]}
              db={cascadeDb}
              onConfirm={(selections) => {
                setClassSelections(selections);
              }}
              initialSelections={classSelections}
            />
          </div>

          {classSelections.length > 0 && (
            <div className="p-4 bg-[#E6F6FC]/25 rounded-xl border border-[#B3E6F5] flex flex-col gap-2 mt-2">
              <span className="text-[11px] font-bold text-[#008BC9] uppercase tracking-wider block font-black">Contexto Ativo</span>
              <div className="text-[13px] text-neutral-7 space-y-1">
                <p><strong>Regional:</strong> {classSelections[0]}</p>
                {classSelections[1] && <p><strong>Município:</strong> {classSelections[1]}</p>}
                {classSelections[2] && <p><strong>Escola:</strong> {classSelections[2]}</p>}
                {classSelections[3] && classSelections[3].length > 0 && (
                  <p><strong>Turma(s):</strong> {classSelections[3].join(", ")}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Upload batches card */}
        <div
          className="lg:col-span-8 bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-6"
          style={{ borderColor: themeColors?.neutral?.[2] || '#f1f5f9' }}
        >
          <div>
            <h2
              className="text-[18px] font-bold text-neutral-800"
              style={{ color: themeColors?.neutral?.[7] || '#0f172a' }}
            >
              2. Carregamento em Lote (PDF)
            </h2>
            <p className="text-[13px] text-neutral-5 mt-1">
              Envie o arquivo PDF com as provas escaneadas da turma selecionada. O processador HTR do Mapear fará a indexação automática dos alunos.
            </p>
          </div>

          {/* Dashed Dropzone Simulation */}
          <div
            onClick={isContextReady ? handleSimulateDesktopUpload : undefined}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
              isContextReady
                ? 'border-brand-base hover:bg-[#E6F6FC]/10 cursor-pointer bg-neutral-0 active:scale-[0.99]'
                : 'border-neutral-300 bg-neutral-50 text-neutral-400 cursor-not-allowed opacity-60'
            }`}
            style={{
              borderColor: isContextReady ? (themeColors?.primary?.base || '#008BC9') : (themeColors?.neutral?.[3] || '#e2e8f0')
            }}
          >
            <div
              className={`w-[56px] h-[56px] rounded-full flex items-center justify-center mb-3 ${
                isContextReady ? 'bg-brand-light text-brand-base' : 'bg-neutral-2 text-neutral-4'
              }`}
              style={{
                backgroundColor: isContextReady ? (themeColors?.primary?.light || '#E6F6FC') : (themeColors?.neutral?.[2] || '#f1f5f9'),
                color: isContextReady ? (themeColors?.primary?.base || '#008BC9') : (themeColors?.neutral?.[4] || '#94a3b8')
              }}
            >
              {isDesktopUploading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <Upload size={24} />
              )}
            </div>
            
            {isContextReady ? (
              <>
                <h4
                  className="text-[15px] font-bold text-neutral-800"
                  style={{ color: themeColors?.neutral?.[7] || '#0f172a' }}
                >
                  {isDesktopUploading ? 'Processando arquivo...' : 'Arraste e solte o arquivo PDF aqui ou clique para procurar'}
                </h4>
                <p className="text-[12px] text-neutral-5 mt-1 max-w-sm mx-auto">
                  Suporta arquivos PDF de até 50MB. Certifique-se de que a resolução das páginas seja de pelo menos 150 DPI.
                </p>
              </>
            ) : (
              <>
                <h4 className="text-[15px] font-bold text-neutral-4">
                  Envio de Arquivos Desabilitado
                </h4>
                <p className="text-[12px] text-neutral-4 mt-1 max-w-sm mx-auto">
                  Por favor, selecione um contexto escolar válido no painel ao lado.
                </p>
              </>
            )}
          </div>

          {/* List of processed/uploaded batches */}
          <div className="flex flex-col gap-3">
            <h3
              className="text-[14px] font-bold text-neutral-800"
              style={{ color: themeColors?.neutral?.[7] || '#0f172a' }}
            >
              Histórico de Envio da Turma
            </h3>

            <div
              className="border rounded-xl overflow-hidden bg-white"
              style={{ borderColor: themeColors?.neutral?.[2] || '#f1f5f9' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr
                      className="bg-neutral-50 text-[11px] font-bold text-neutral-5 uppercase tracking-wider border-b"
                      style={{
                        borderColor: themeColors?.neutral?.[2] || '#f1f5f9',
                        backgroundColor: themeColors?.neutral?.[1] || '#f8fafc'
                      }}
                    >
                      <th className="px-6 py-3.5">Arquivo</th>
                      <th className="px-6 py-3.5">Páginas/Lote</th>
                      <th className="px-6 py-3.5">Enviado em</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: themeColors?.neutral?.[2] || '#f1f5f9' }}>
                    {desktopUploads.map((row) => {
                      return (
                        <tr key={row.id} className="hover:bg-neutral-50/50 transition-colors text-[13px]">
                          <td
                            className="px-6 py-4 font-semibold text-neutral-7 truncate max-w-[200px]"
                            style={{ color: themeColors?.neutral?.[7] || '#0f172a' }}
                          >
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-brand-base shrink-0" style={{ color: themeColors?.primary?.base || '#008BC9' }} />
                              <span className="truncate" title={row.name}>{row.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-neutral-6">
                            {row.status === 'Processando' ? (
                              <span className="text-neutral-4 italic">Indexando...</span>
                            ) : (
                              <span>{row.successSheets} de {row.totalSheets}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-neutral-5">
                            {row.date}
                          </td>
                          <td className="px-6 py-4">
                            {row.status === 'Concluído' ? (
                              <Chips label="Concluído" status="success" variant="light" iconLeft={<CheckCircle2 size={12} />} />
                            ) : row.status === 'Processando' ? (
                              <Chips label="Processando" status="primary" variant="light" iconLeft={<Loader2 size={12} className="animate-spin" />} />
                            ) : (
                              <Chips label="Erro Leitura" status="error" variant="light" iconLeft={<XCircle size={12} />} />
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {row.status === 'Erro' ? (
                              <Button
                                variant="tertiary"
                                size="sm"
                                className="!px-3 !h-[28px] !text-[12px] font-bold"
                                onClick={() => setActiveErrorBatch(row)}
                              >
                                VER ERROS
                              </Button>
                            ) : row.status === 'Concluído' ? (
                              <span className="text-[12px] font-semibold text-green-600">Importado</span>
                            ) : (
                              <span className="text-[12px] font-semibold text-neutral-4">Aguarde...</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
