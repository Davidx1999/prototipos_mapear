import React, { useState, useMemo } from 'react';
import { Search, X, Check, BookOpen, Filter, ArrowRight } from 'lucide-react';
import { BNCC_SKILLS_DATABASE } from './mockAssessmentData';

const PedagogicalSkillSelectorModal = ({
  isOpen,
  onClose,
  onSelectSkill,
  selectedSkillId,
  isDarkMode = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('Todas');
  const [tempSelected, setTempSelected] = useState(selectedSkillId || null);

  const areas = ['Todas', 'Língua Portuguesa', 'Matemática', 'Ciências'];

  const filteredSkills = useMemo(() => {
    return BNCC_SKILLS_DATABASE.filter(skill => {
      const matchArea = selectedArea === 'Todas' || skill.area === selectedArea;
      const matchQuery =
        skill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.area.toLowerCase().includes(searchTerm.toLowerCase());
      return matchArea && matchQuery;
    });
  }, [searchTerm, selectedArea]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const found = BNCC_SKILLS_DATABASE.find(s => s.id === tempSelected);
    if (found) {
      onSelectSkill(found);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-['Montserrat',sans-serif]">
      <div
        className={`w-full max-w-2xl rounded-[8px] border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ${
          isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 px-6 border-b flex items-center justify-between shrink-0 ${
            isDarkMode ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-neutral-50/70'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#0078B0]/10 text-[#0078B0] flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold tracking-tight">
                Selecionar Habilidade BNCC
              </h2>
              <p className="text-[12px] text-neutral-500">
                Selecione a habilidade curricular associada a este Item de avaliação
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[4px] flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div
          className={`p-4 px-6 border-b flex flex-col gap-3 shrink-0 ${
            isDarkMode ? 'border-neutral-700 bg-neutral-800/60' : 'border-neutral-200 bg-white'
          }`}
        >
          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Buscar por código (ex: EF05LP03) ou palavra-chave..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 h-[40px] text-[13px] border rounded-[4px] outline-none transition-colors ${
                isDarkMode
                  ? 'bg-neutral-900 border-neutral-700 text-white focus:border-[#0078B0]'
                  : 'bg-white border-neutral-300 text-neutral-800 focus:border-[#0078B0]'
              }`}
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-neutral-500 font-medium shrink-0 flex items-center gap-1">
              <Filter size={12} /> Componente:
            </span>
            {areas.map(area => (
              <button
                key={area}
                type="button"
                onClick={() => setSelectedArea(area)}
                className={`px-2.5 py-1 rounded-[4px] font-medium transition-all ${
                  selectedArea === area
                    ? 'bg-[#0078B0] text-white'
                    : isDarkMode
                    ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Skills List */}
        <div className="flex-1 overflow-y-auto p-4 px-6 flex flex-col gap-2.5 divide-y divide-neutral-100 dark:divide-neutral-700/50">
          {filteredSkills.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-neutral-400">
              <BookOpen size={32} className="mb-2 opacity-40" />
              <p className="text-sm font-medium">Nenhuma habilidade encontrada para o termo digitado.</p>
              <p className="text-xs text-neutral-500 mt-1">Tente buscar por outro código ou componente curricular.</p>
            </div>
          ) : (
            filteredSkills.map(skill => {
              const isSelected = tempSelected === skill.id;
              return (
                <div
                  key={skill.id}
                  onClick={() => setTempSelected(skill.id)}
                  className={`pt-2.5 first:pt-0 pb-2.5 px-3 rounded-[4px] cursor-pointer transition-all border ${
                    isSelected
                      ? isDarkMode
                        ? 'border-[#0078B0] bg-[#0078B0]/15 shadow-xs'
                        : 'border-[#0078B0] bg-[#F2FAFE] shadow-xs'
                      : isDarkMode
                      ? 'border-transparent hover:bg-neutral-700/60'
                      : 'border-transparent hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`font-mono text-[12px] font-bold px-2 py-0.5 rounded-[4px] ${
                            isSelected
                              ? 'bg-[#0078B0] text-white'
                              : isDarkMode
                              ? 'bg-neutral-700 text-neutral-200'
                              : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                          }`}
                        >
                          {skill.id}
                        </span>
                        <span className="text-[11px] font-semibold text-neutral-500">
                          {skill.area} • {skill.ano}
                        </span>
                      </div>
                      <p className={`text-[13px] leading-relaxed ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>
                        {skill.desc}
                      </p>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#0078B0] border-[#0078B0] text-white'
                            : 'border-neutral-300 dark:border-neutral-600 bg-transparent'
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 px-6 border-t flex items-center justify-between shrink-0 ${
            isDarkMode ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-neutral-50/50'
          }`}
        >
          <span className="text-[12px] text-neutral-500">
            {filteredSkills.length} habilidades disponíveis
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-[13px] font-semibold rounded-[4px] border transition-colors ${
                isDarkMode
                  ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-700'
                  : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!tempSelected}
              className={`px-5 py-2 text-[13px] font-bold rounded-[4px] flex items-center gap-1.5 transition-all ${
                tempSelected
                  ? 'bg-[#0078B0] text-white hover:bg-[#006899] shadow-xs cursor-pointer'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
              }`}
            >
              Confirmar Habilidade
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedagogicalSkillSelectorModal;
