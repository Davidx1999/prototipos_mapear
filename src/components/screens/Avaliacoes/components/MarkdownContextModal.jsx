import React, { useState } from 'react';
import { X, FileText, Eye, Edit3, Sparkles, Check, HelpCircle } from 'lucide-react';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';

/**
 * MarkdownContextModal — Editor/Visualizador de Suportes de Leitura e Contextos de Itens Compostos em Markdown.
 * 
 * Permite que coordenadores e criadores de conteúdo editem e visualizem o texto-base
 * que serve de suporte de leitura para as tarefas/itens.
 */

const TEMPLATES = [
  {
    title: 'Texto Narrativo / Conto',
    content: `# O Menino e o Rio

Era uma vez um menino que morava nas margens do **Rio Parnaíba**. Todos os dias, ao amanhecer, ele observava o movimento das águas e imaginava as histórias que o rio carregava.

> "A água que passa hoje nunca é a mesma que passou ontem." — *Provérbio popular*

## Perguntas de Reflexão
1. Qual era o hábito diário do menino?
2. Como a natureza influenciava sua imaginação?`
  },
  {
    title: 'Poema / Lírico',
    content: `# Canção do Vento

O vento canta na serra,  
Balança as folhas do chão,  
Traz o cheiro da terra  
E a chuva pro sertão.  

*Vem de longe, vai pra longe...*  
*Sem parar a sua canção.*`
  },
  {
    title: 'Artigo Informativo / Científico',
    content: `# A Importância da Preservação dos Biomas

O **Bioma Caatinga** é exclusivo do Brasil e abriga uma rica biodiversidade adaptada ao clima semiárido.

| Recurso | Disponibilidade | Impacto Ambiental |
|---|---|---|
| Água Subterrânea | Moderada | Baixo |
| Vegetação Nativa | Em Risco | Alto |

### Principais Desafios
* Redução do desmatamento ilegal
* Conservação dos açudes e nascentes
* Manejo sustentável do solo`
  }
];

// Simple Markdown Renderer helper for Preview mode
function renderMarkdownPreview(markdownText) {
  if (!markdownText) return <p className="text-neutral-4 italic">Nenhum conteúdo em Markdown inserido.</p>;

  const lines = markdownText.split('\n');
  return lines.map((line, idx) => {
    if (line.startsWith('# ')) {
      return <h1 key={idx} className="text-xl font-bold text-neutral-8 dark:text-white mt-3 mb-2 pb-1 border-b border-neutral-2 dark:border-neutral-5">{line.substring(2)}</h1>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={idx} className="text-lg font-bold text-neutral-8 dark:text-white mt-3 mb-1.5">{line.substring(3)}</h2>;
    }
    if (line.startsWith('### ')) {
      return <h3 key={idx} className="text-base font-bold text-neutral-7 dark:text-neutral-2 mt-2 mb-1">{line.substring(4)}</h3>;
    }
    if (line.startsWith('> ')) {
      return <blockquote key={idx} className="pl-3 border-l-4 border-extended-lavender-base italic text-neutral-6 dark:text-neutral-3 my-2 py-1 bg-extended-lavender-extraLight/20 rounded-r">{line.substring(2)}</blockquote>;
    }
    if (line.startsWith('* ') || line.startsWith('- ')) {
      return <li key={idx} className="ml-4 list-disc text-xs text-neutral-7 dark:text-neutral-2 my-0.5">{line.substring(2)}</li>;
    }
    if (line.trim() === '') {
      return <div key={idx} className="h-2" />;
    }
    return <p key={idx} className="text-xs text-neutral-7 dark:text-neutral-2 leading-relaxed my-1">{line}</p>;
  });
}

export default function MarkdownContextModal({
  isOpen,
  onClose,
  initialTitle = '',
  initialContent = '',
  onSave,
  isDarkMode
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview' | 'split'

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ title: title || 'Item Composto em Markdown', content });
    onClose();
  };

  const applyTemplate = (tplContent) => {
    setContent(tplContent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className={`w-full max-w-4xl max-h-[90vh] rounded-[8px] shadow-2xl border flex flex-col overflow-hidden ${
          isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-7'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 px-6 border-b flex items-center justify-between shrink-0 ${
          isDarkMode ? 'border-neutral-5 bg-neutral-7/40' : 'border-neutral-2 bg-neutral-1/40'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[8px] bg-extended-lavender-extraLight text-extended-lavender-dark">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-8 dark:text-white flex items-center gap-2">
                Editor de Contexto em Markdown (Item Composto)
                <Chips label="Suporte em Markdown" status="lavender" variant="dark" />
              </h3>
              <p className="text-xs text-neutral-4">
                Textos-base e suportes de leitura para os cadernos e tarefas do estudante.
              </p>
            </div>
          </div>

          <Button variant="tertiary" appearance="ghost" iconOnly iconLeft={<X size={18} />} onClick={onClose} />
        </div>

        {/* Templates Bar & Tab Selector */}
        <div className={`px-6 py-2.5 border-b flex items-center justify-between shrink-0 flex-wrap gap-2 ${
          isDarkMode ? 'border-neutral-5 bg-neutral-7/60' : 'border-neutral-2 bg-neutral-1/60'
        }`}>
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <span className="font-bold text-neutral-4 uppercase text-[10px]">Modelos Prontos:</span>
            {TEMPLATES.map((tpl, idx) => (
              <Button
                key={idx}
                variant="tertiary"
                appearance="solid"
                size="xs"
                iconLeft={<Sparkles size={11} />}
                onClick={() => applyTemplate(tpl.content)}
              >
                {tpl.title}
              </Button>
            ))}
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-neutral-2/60 dark:bg-neutral-5/40 rounded-[8px] text-xs font-bold">
            <Button
              variant={activeTab === 'editor' ? 'primary' : 'tertiary'}
              appearance={activeTab === 'editor' ? 'solid' : 'ghost'}
              size="xs"
              iconLeft={<Edit3 size={13} />}
              onClick={() => setActiveTab('editor')}
            >
              Código Markdown
            </Button>
            <Button
              variant={activeTab === 'preview' ? 'primary' : 'tertiary'}
              appearance={activeTab === 'preview' ? 'solid' : 'ghost'}
              size="xs"
              iconLeft={<Eye size={13} />}
              onClick={() => setActiveTab('preview')}
            >
              Visualizar Renderizado
            </Button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-7 dark:text-neutral-2 mb-1.5 block">
              Título do Suporte / Item Composto *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Texto 'O Menino e o Rio' — Leitura Principal"
              className={`w-full px-4 h-[42px] border rounded-[8px] text-sm outline-none font-semibold ${
                isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-white border-neutral-3 text-neutral-8'
              }`}
            />
          </div>

          {/* Editor Mode */}
          {activeTab === 'editor' && (
            <div>
              <label className="text-xs font-bold text-neutral-7 dark:text-neutral-2 mb-1.5 block flex items-center justify-between">
                <span>Conteúdo em Formato Markdown (.md) *</span>
                <span className="text-[10px] text-neutral-4 font-normal">Suporta # Título, **Negrito**, *Itálico*, &gt; Citações, Tabela</span>
              </label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={12}
                placeholder="# Digite seu título em Markdown aqui&#10;&#10;Escreva o texto de leitura ou cole o arquivo .md..."
                className={`w-full p-4 border rounded-[8px] font-mono text-xs outline-none leading-relaxed transition-all ${
                  isDarkMode
                    ? 'bg-neutral-7 border-neutral-5 text-white focus:border-extended-lavender-base'
                    : 'bg-neutral-1/50 border-neutral-3 text-neutral-8 focus:border-extended-lavender-base'
                }`}
              />
            </div>
          )}

          {/* Preview Mode */}
          {activeTab === 'preview' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-7 dark:text-neutral-2 block">
                Visualização de Leitura (Como o estudante/sistema verá)
              </label>
              <div className={`p-6 rounded-[8px] border min-h-[250px] ${
                isDarkMode ? 'bg-neutral-7 border-neutral-5' : 'bg-white border-neutral-2 shadow-inner'
              }`}>
                {renderMarkdownPreview(content)}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`p-4 px-6 border-t flex items-center justify-between ${
          isDarkMode ? 'border-neutral-5 bg-neutral-7/40' : 'border-neutral-2 bg-neutral-1/40'
        }`}>
          <Button variant="tertiary" appearance="solid" size="md" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            appearance="solid"
            size="md"
            iconLeft={<Check size={16} />}
            onClick={handleSave}
          >
            Salvar Suporte Markdown
          </Button>
        </div>
      </div>
    </div>
  );
}
