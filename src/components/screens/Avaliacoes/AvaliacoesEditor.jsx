import React, { useState } from 'react';
import {
  ArrowLeft, FileText, BookOpen, Search, ChevronDown,
  Paperclip, Plus, Edit3, Trash2, Image as ImageIcon,
  CheckSquare, Check, BookMarked, PanelLeftClose, MoreHorizontal,
  Route, Square, Eye, Download, Bookmark, Database, Copy, Link,
  AlertCircle, HelpCircle, Maximize2, Lock, Sliders, Edit, RotateCcw,
  X, ChevronUp, Layers, UserCheck
} from 'lucide-react';
import Button from '../../ui/Button';

const MOCK_BANK_TASKS = [
  {
    id: 'bt1',
    code: 'TAR-2031',
    title: 'História do Satélite Voyager após o Sistema Sol...',
    fullTitle: 'História do Satélite Voyager após o Sistema Solar: exploração espacial e análise documental',
    snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore m...',
    responseType: 'Múltipla Escolha',
    area: 'Ciências',
    usageCount: 232,
    items: [
      { id: 'i1', title: 'Exploração espacial e trajetórias orbitais', type: 'Item Objetiva - Escolha Única' },
      { id: 'i2', title: 'Transmissão de dados a longas distâncias', type: 'Item Objetiva - Escolha Única' }
    ]
  },
  {
    id: 'bt2',
    code: 'TAR-2032',
    title: 'Cadê a Água',
    fullTitle: 'Cadê a Água? Análise sobre escassez e recursos hídricos',
    snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore m...',
    responseType: 'Resposta Híbrida',
    area: 'Português',
    usageCount: 4500,
    items: [
      { id: 'i3', title: 'Identificação Literária: Cadê a água?', type: 'Item Objetiva - Escolha Única' },
      { id: 'i4', title: 'Interpretação de poema e prosa', type: 'Item Discursiva' }
    ]
  },
  {
    id: 'bt3',
    code: 'TAR-2033',
    title: 'Cadê a Vassoura?',
    fullTitle: 'Cadê a Vassoura? Interpretação de texto infantil',
    snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore m...',
    responseType: 'Resposta Híbrida',
    area: 'Português',
    usageCount: 23,
    items: [
      { id: 'i5', title: 'Personagens principais e conflito central', type: 'Item Objetiva - Escolha Única' }
    ]
  },
  {
    id: 'bt4',
    code: 'TAR-2034',
    title: 'Cadê a Água',
    fullTitle: 'Cadê a Água: Estudo de caso sobre o ciclo da água',
    snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore m...',
    responseType: 'Múltipla Escolha',
    area: 'Geografia',
    usageCount: 150,
    items: [
      { id: 'i6', title: 'Etapas do ciclo hidrológico', type: 'Item Objetiva - Escolha Única' }
    ]
  },
  {
    id: 'bt5',
    code: 'TAR-2035',
    title: 'Cadê a Vassoura?',
    fullTitle: 'Cadê a Vassoura? Elementos da narrativa e coesão',
    snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore m...',
    responseType: 'Resposta Construída',
    area: 'Português',
    usageCount: 88,
    items: [
      { id: 'i7', title: 'Análise de metáforas no texto', type: 'Item Discursiva' }
    ]
  },
  {
    id: 'bt6',
    code: 'TAR-2036',
    title: 'Auditoria urgente e análise detalhada sob...',
    fullTitle: 'Auditoria urgente e análise detalhada sobre o desabastecimento crônico na rede de distribuição local para identificar falhas estruturais, vazamentos ocultos e interrupções no fornecimento público, consolidando soluções no plano Cadê a água de vez.',
    snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore m...',
    responseType: 'Resposta Construída',
    area: 'Português',
    usageCount: 310,
    items: [
      { id: 'i8', title: 'Diversidade Cultural Brasileira', type: 'Item Objetiva - Escolha Única' },
      { id: 'i9', title: 'Biomas Brasileiros e Relação Sociedade-Natureza', type: 'Item Objetiva - Escolha Única', itemCount: 23 },
      { id: 'i10', title: 'Diversidade e Identidade Nacional', type: 'Item Discursiva' }
    ]
  }
];

const RESPONSE_TYPES = ['Resposta Híbrida', 'Múltipla Escolha', 'Resposta Construída'];

const AvaliacoesEditor = ({
  assessment,
  onBack,
  colors,
  isDarkMode
}) => {
  const primaryBase = colors?.primary?.base || '#0078B0';
  const primaryExtraLight = colors?.primary?.extraLight || '#E8F4FD';
  const primary800 = colors?.primary?.[800] || '#002C5E';

  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  // Screen View States: 'list' | 'task-detail' | 'item-detail' | 'form-view'
  const [viewState, setViewState] = useState('list');
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filters State
  const [activeResponseFilters, setActiveResponseFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Task IDs (added temporarily to treeview)
  const [addedTaskIds, setAddedTaskIds] = useState(new Set(['bt1', 'bt2', 'bt6']));

  // Hierarchy State for Treeview
  const [expandedNodes, setExpandedNodes] = useState(new Set(['teste1', 'bank-section']));
  const [selectedNodeId, setSelectedNodeId] = useState('t1');

  // Form State
  const [taskCode, setTaskCode] = useState('temp2');
  const [taskTitle, setTaskTitle] = useState('Cadê o copo?');
  const [knowledgeArea, setKnowledgeArea] = useState('Português');

  const toggleResponseFilter = (type) => {
    setActiveResponseFilters(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const toggleTaskSelection = (taskId) => {
    setAddedTaskIds(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const toggleNode = (e, id) => {
    e.stopPropagation();
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter Tasks based on 3 Toggles logic & Search input
  const filteredTasks = MOCK_BANK_TASKS.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.area.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter Logic for 3 Toggles:
    // If 0 active OR all 3 active -> show all
    if (activeResponseFilters.length === 0 || activeResponseFilters.length === 3) {
      return true;
    }
    // Otherwise show task if its responseType is in activeResponseFilters
    return activeResponseFilters.includes(task.responseType);
  });

  const [treeItems, setTreeItems] = useState([
    {
      id: 'teste1',
      type: 'teste',
      title: 'Exame Textos Dona Vassoura e Cadê a Água',
      isBank: false,
      children: [
        { id: 't1', type: 'tarefa', title: 'Cadê o copo?', isBank: true, origin: 'bank' },
        { id: 't2', type: 'tarefa', title: 'Criação do Satélite Voyager nos anos de 1970...', isBank: true, origin: 'bank' },
        { id: 't5', type: 'tarefa', title: 'Auditoria urgente e análise detalhada sobre o...', isBank: true, origin: 'bank' },
        { id: 't6', type: 'tarefa', title: 'Lorem ipsum dolor sit amet, consectetur adipi...', isBank: true, origin: 'bank' }
      ]
    }
  ]);

  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOverNode, setDragOverNode] = useState(null);

  const handleDragStart = (e, path, type) => {
    setDraggedNode({ path, type });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', path.join('-'));
  };

  const handleDragOver = (e, path, type) => {
    e.preventDefault();
    if (!draggedNode) return;
    
    let allowed = false;
    const dragType = draggedNode.type;
    
    if (dragType === 'teste' && type === 'teste') allowed = true;
    if (dragType === 'tarefa' && type === 'tarefa') allowed = true;
    if (dragType === 'bloco' && (type === 'bloco' || type === 'item') && path.length === 3) allowed = true;
    if (dragType === 'item') {
      if ((type === 'bloco' || type === 'item') && path.length === 3) allowed = true;
      if (type === 'item' && path.length === 4) allowed = true;
    }

    if (allowed) {
      e.dataTransfer.dropEffect = 'move';
      const isSamePath = draggedNode.path.join('-') === path.join('-');
      if (!isSamePath) {
        const rect = e.currentTarget.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const position = e.clientY < midY ? 'top' : 'bottom';
        
        setDragOverNode(prev => {
          if (prev && prev.path.join('-') === path.join('-') && prev.type === type && prev.position === position) return prev;
          return { path, type, position };
        });
      } else {
        setDragOverNode(null);
      }
    } else {
      e.dataTransfer.dropEffect = 'none';
      setDragOverNode(null);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverNode(null);
  };

  const handleDragEnd = () => {
    setDraggedNode(null);
    setDragOverNode(null);
  };

  const handleDrop = (e, targetPath, type) => {
    e.preventDefault();
    const position = dragOverNode?.position || 'top';
    setDragOverNode(null);
    
    if (!draggedNode) return;
    if (draggedNode.path.join('-') === targetPath.join('-')) return;

    let allowed = false;
    const dragType = draggedNode.type;
    if (dragType === 'teste' && type === 'teste') allowed = true;
    if (dragType === 'tarefa' && type === 'tarefa') allowed = true;
    if (dragType === 'bloco' && (type === 'bloco' || type === 'item') && targetPath.length === 3) allowed = true;
    if (dragType === 'item') {
      if ((type === 'bloco' || type === 'item') && targetPath.length === 3) allowed = true;
      if (type === 'item' && targetPath.length === 4) allowed = true;
    }
    
    if (!allowed) return;

    const newTree = JSON.parse(JSON.stringify(treeItems));

    let sourceParent = newTree;
    for (let i = 0; i < draggedNode.path.length - 1; i++) {
      sourceParent = sourceParent[draggedNode.path[i]].children;
    }
    const sourceIndex = draggedNode.path[draggedNode.path.length - 1];
    const [removedNode] = sourceParent.splice(sourceIndex, 1);

    let targetParent = newTree;
    for (let i = 0; i < targetPath.length - 1; i++) {
      targetParent = targetParent[targetPath[i]].children;
    }
    let targetIndex = targetPath[targetPath.length - 1];

    const isSameParent = draggedNode.path.slice(0, -1).join('-') === targetPath.slice(0, -1).join('-');
    
    if (position === 'bottom') targetIndex += 1;
    if (isSameParent && sourceIndex < targetIndex) {
      targetIndex -= 1;
    }

    targetParent.splice(targetIndex, 0, removedNode);
    setTreeItems(newTree);
    setDraggedNode(null);
  };

  const startResizing = React.useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback(
    (mouseMoveEvent) => {
      if (isResizing) {
        setSidebarWidth(
          Math.max(240, Math.min(600, mouseMoveEvent.clientX))
        );
      }
    },
    [isResizing]
  );

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resize, stopResizing]);

  const handleOpenTaskDetail = (e, task) => {
    e.stopPropagation();
    setSelectedTask(task);
    setViewState('task-detail');
  };

  const handleOpenItemDetail = (item) => {
    setSelectedItem(item);
    setViewState('item-detail');
  };

  const handleCreateEditableVersion = () => {
    setIsEditable(true);
    setViewState('form-view');
  };

  return (
    <div className="flex flex-col bg-neutral-0 flex-1 overflow-hidden min-h-0 w-full font-['Montserrat',sans-serif]">
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* SIDEBAR ÁRVORE DE CONTEÚDOS */}
        {isSidebarOpen && (
          <aside
            style={{ width: sidebarWidth }}
            className={`border-r flex flex-col shrink-0 relative ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}
          >
            {/* Resizer Handle */}
            <div
              className="absolute top-0 right-[-3px] w-[6px] h-full cursor-col-resize z-50 group"
              onMouseDown={startResizing}
            >
              <div className={`w-[2px] h-full mx-auto transition-all duration-200 group-hover:bg-brand-base group-hover:ring-4 group-hover:ring-brand-base/20 ${isResizing ? 'bg-brand-base ring-4 ring-brand-base/20' : 'bg-transparent'}`} />
            </div>

            {/* Header Sidebar */}
            <div className={`p-3.5 px-4 border-b flex items-center justify-between group shrink-0 ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
              <div className={`flex items-center gap-2 font-medium text-[15px] min-w-0 flex-1 mr-2`}>
                <Bookmark size={18} className={`shrink-0 ${isDarkMode ? 'text-neutral-2' : 'text-brand-base'}`} />
                <span className={`truncate text-[14px] font-bold ${isDarkMode ? 'text-white' : 'text-brand-base'}`} title={assessment?.title || 'Aplicação Textos Dona Vassoura e Cadê a Ág...'}>
                  {assessment?.title || 'Aplicação Textos Dona Vassoura e Cadê a Ág...'}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="tertiary"
                  appearance="ghost"
                  iconOnly
                  iconLeft={<PanelLeftClose size={18} />}
                  onClick={() => setIsSidebarOpen(false)}
                />
              </div>
            </div>

            {/* Subheader Conteúdos */}
            <div className={`flex items-center justify-between p-3.5 px-4 border-b shrink-0 ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : 'bg-neutral-0 border-neutral-2 text-neutral-7'}`}>
              <span className="font-semibold text-[15px]">Conteúdos</span>
              <div className={`flex items-center gap-1.5`}>
                <Button variant="tertiary" appearance="ghost" iconOnly iconLeft={<MoreHorizontal size={18} />} />
                <Button variant="tertiary" appearance="ghost" iconOnly iconLeft={<Search size={18} />} />
                <Button variant="secondary" appearance="solid" iconOnly iconLeft={<Plus size={18} />} />
              </div>
            </div>

            {/* Subnode: Carregando nova tarefa... / Adicionando do Banco de Tarefas (rounded-[8px]) */}
            <div className={`p-3 px-4 border-b flex flex-col gap-1 shrink-0 ${isDarkMode ? 'bg-neutral-7/60 border-neutral-5' : 'bg-slate-50 border-neutral-2'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-neutral-7">
                  <BookOpen size={16} className="text-neutral-6" />
                  <span>Carregando nova tarefa...</span>
                </div>
              </div>

              {/* Seção Adicionando do Banco de Tarefas */}
              <div className="mt-2 pl-3 flex items-center justify-between text-[11px] text-[#0078B0] font-bold">
                <span>Adicionando do Banco de Tarefas...</span>
                <div className="flex items-center gap-1.5 text-neutral-5">
                  <HelpCircle size={14} className="cursor-pointer hover:text-neutral-7" />
                  <Trash2 size={14} className="cursor-pointer hover:text-red-500" onClick={() => setAddedTaskIds(new Set())} />
                </div>
              </div>
            </div>

            {/* Lista Árvore */}
            <div className="flex-1 pb-4 flex flex-col gap-1 overflow-y-auto">
              <div className={`flex flex-col gap-0 text-sm font-normal pt-1 ${isDarkMode ? 'text-neutral-2' : 'text-neutral-7'}`}>
                {(() => {
                  const renderTree = (nodes, currentPath = []) => {
                    return nodes.map((node, index) => {
                      const path = [...currentPath, index];
                      const isExpanded = expandedNodes.has(node.id);
                      const isSelected = selectedNodeId === node.id;
                      const isDragged = draggedNode?.path.join('-') === path.join('-');
                      const isDragOver = dragOverNode?.path.join('-') === path.join('-');
                      
                      let pl = 'pl-4';
                      if (path.length === 2) pl = 'pl-7';
                      if (path.length === 3) pl = 'pl-11';
                      if (path.length === 4) pl = 'pl-[4rem]';

                      let Icon = BookMarked;
                      if (node.type === 'tarefa') Icon = BookOpen;
                      if (node.type === 'bloco') Icon = Route;
                      if (node.type === 'item') Icon = Paperclip;

                      const canExpand = node.type !== 'item';
                      const bgClass = isDarkMode ? 'hover:bg-neutral-5' : 'hover:bg-neutral-1';
                      const activeBgClass = isSelected ? (isDarkMode ? '#003A79' : primaryExtraLight) : undefined;
                      const fontClass = isSelected ? 'font-medium' : 'font-normal';
                      const isBankItem = node.isBank || node.origin === 'bank' || node.origin === 'original';

                      return (
                        <React.Fragment key={node.id}>
                          <div
                            draggable
                            onClick={() => setSelectedNodeId(node.id)}
                            onDragStart={(e) => handleDragStart(e, path, node.type)}
                            onDragOver={(e) => handleDragOver(e, path, node.type)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, path, node.type)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center justify-between h-[36px] pr-3 ${pl} cursor-grab active:cursor-grabbing group ${bgClass} ${fontClass} ${isDarkMode ? 'text-neutral-2' : 'text-neutral-7'} ${isDragged ? 'opacity-50' : ''}`}
                            style={{
                              backgroundColor: activeBgClass,
                              ...(isDragOver ? { boxShadow: `inset 0 ${dragOverNode.position === 'top' ? '2px' : '-2px'} 0 0 ${primaryBase}` } : {})
                            }}
                          >
                            <div className="flex items-center gap-1 min-w-0 flex-1 mr-0">
                              {canExpand ? (
                                <ChevronDown 
                                  size={16} 
                                  className={`shrink-0 cursor-pointer text-neutral-5 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} 
                                  onClick={(e) => toggleNode(e, node.id)} 
                                />
                              ) : <div className="w-4 shrink-0" />}
                              <Icon size={18} className="shrink-0 mr-1 text-neutral-6" />
                              <span className="truncate flex items-center" title={node.title}>
                                {isBankItem && (
                                  <span
                                    className="font-bold mr-1 shrink-0 select-none text-[13px]"
                                    style={{ color: isDarkMode ? '#38BDF8' : primary800 }}
                                  >
                                    [B]
                                  </span>
                                )}
                                <span className={isBankItem && isSelected ? 'font-semibold' : ''}>
                                  {node.title}
                                </span>
                              </span>
                            </div>
                          </div>
                          
                          {canExpand && isExpanded && node.children && (
                            <div className="flex flex-col gap-0">
                              {renderTree(node.children, path)}
                            </div>
                          )}
                        </React.Fragment>
                      );
                    });
                  };
                  return renderTree(treeItems);
                })()}
              </div>
            </div>
          </aside>
        )}

        {/* ÁREA PRINCIPAL DO EDITOR / SELETOR DE TAREFAS */}
        <main className={`flex-1 flex flex-col min-h-0 relative overflow-hidden ${isDarkMode ? 'bg-neutral-7' : 'bg-[#F8FAFC]'}`}>

          {/* Top Bar Navigation Breadcrumbs */}
          <div className={`w-full px-6 py-3 border-b flex items-center justify-between shrink-0 ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`}>
            <div className={`flex items-center gap-2.5 min-w-0 flex-1 mr-4`}>
              {!isSidebarOpen && (
                <div className="mr-1 shrink-0">
                  <Button
                    variant="tertiary"
                    appearance="solid"
                    iconOnly
                    iconLeft={<PanelLeftClose className="rotate-180" size={18} />}
                    onClick={() => setIsSidebarOpen(true)}
                    title="Abrir lateral"
                  />
                </div>
              )}
              <button
                onClick={onBack}
                className="w-7 h-7 rounded-[8px] border border-neutral-3 flex items-center justify-center text-neutral-6 hover:bg-neutral-1 transition-colors shrink-0"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="text-[12px] font-bold text-[#0078B0] truncate">
                Tela Inicial / Avaliações / Exame Textos Dona Vas... / <span className="text-neutral-4 font-normal">Carregando Tarefas</span>
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-3 py-1 rounded-[8px] border text-[12px] font-semibold flex items-center gap-1.5 ${isDarkMode ? 'border-neutral-5 bg-neutral-6 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>
                <Edit size={14} /> Em Edição
              </span>
            </div>
          </div>

          {/* ÁREA DE CONTEÚDO SCROLLÁVEL */}
          <div className="flex-1 overflow-y-auto">
            <div className="w-full px-6 pt-5 flex flex-col gap-6 pb-24 max-w-[1400px] mx-auto">

              {/* PAINEL SUPERIOR: O QUE DESEJA TRABALHAR HOJE? (Filtros com 8px border radius estrito) */}
              <div className={`border rounded-[8px] p-5 flex flex-col gap-4 shadow-sm ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                <h2 className={`text-[16px] font-bold ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                  O que deseja trabalhar hoje?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select 1: Matrizes (EXACT 8px BORDER RADIUS) */}
                  <div className="relative">
                    <div className={`w-full px-3.5 h-[42px] border rounded-[8px] flex items-center justify-between text-[13px] cursor-pointer ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-6'}`}>
                      <div className="flex items-center gap-2 truncate">
                        <Layers size={16} className="text-neutral-4 shrink-0" />
                        <span>Todas as matrizes</span>
                      </div>
                      <ChevronDown size={16} className="text-neutral-4 shrink-0" />
                    </div>
                  </div>

                  {/* Select 2: Componente Curricular */}
                  <div className="relative">
                    <div className={`w-full px-3.5 h-[42px] border rounded-[8px] flex items-center justify-between text-[13px] cursor-pointer ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-4'}`}>
                      <div className="flex items-center gap-2 truncate">
                        <BookOpen size={16} className="text-neutral-4 shrink-0" />
                        <span>Selecione componente curricular...</span>
                      </div>
                      <ChevronDown size={16} className="text-neutral-4 shrink-0" />
                    </div>
                  </div>

                  {/* Select 3: Domínio Repertório */}
                  <div className="relative">
                    <div className={`w-full px-3.5 h-[42px] border rounded-[8px] flex items-center justify-between text-[13px] cursor-pointer ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-4'}`}>
                      <div className="flex items-center gap-2 truncate">
                        <Sliders size={16} className="text-neutral-4 shrink-0" />
                        <span>Selecione domínio de repertório...</span>
                      </div>
                      <ChevronDown size={16} className="text-neutral-4 shrink-0" />
                    </div>
                  </div>

                  {/* Select 4: Conhecimento */}
                  <div className="relative">
                    <div className={`w-full px-3.5 h-[42px] border rounded-[8px] flex items-center justify-between text-[13px] cursor-pointer ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-4'}`}>
                      <div className="flex items-center gap-2 truncate">
                        <HelpCircle size={16} className="text-neutral-4 shrink-0" />
                        <span>Selecione conhecimento...</span>
                      </div>
                      <ChevronDown size={16} className="text-neutral-4 shrink-0" />
                    </div>
                  </div>

                  {/* Select 5: Domínio Cognitivo */}
                  <div className="relative">
                    <div className={`w-full px-3.5 h-[42px] border rounded-[8px] flex items-center justify-between text-[13px] cursor-pointer ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-4'}`}>
                      <div className="flex items-center gap-2 truncate">
                        <Route size={16} className="text-neutral-4 shrink-0" />
                        <span>Selecione domínio cognitivo...</span>
                      </div>
                      <ChevronDown size={16} className="text-neutral-4 shrink-0" />
                    </div>
                  </div>

                  {/* Select 6: Habilidade */}
                  <div className="relative">
                    <div className={`w-full px-3.5 h-[42px] border rounded-[8px] flex items-center justify-between text-[13px] cursor-pointer ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-4'}`}>
                      <div className="flex items-center gap-2 truncate">
                        <FileText size={16} className="text-neutral-4 shrink-0" />
                        <span>Selecione habilidade...</span>
                      </div>
                      <ChevronDown size={16} className="text-neutral-4 shrink-0" />
                    </div>
                  </div>
                </div>
              </div>

              {/* RENDERIZAÇÃO CONFORME O ESTADO DA TELA */}

              {/* 1. MODO LISTA (GRID DE TAREFAS + 3 TOGGLES) */}
              {viewState === 'list' && (
                <div className="flex flex-col gap-4">
                  {/* Cabeçalho da Lista: Título, Pesquisa & Toggles */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className={`text-[16px] font-bold ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                      Lista de Tarefas
                    </h3>

                    {/* Campo de Pesquisa (EXACT 8px BORDER RADIUS) */}
                    <div className="relative w-full md:w-[320px]">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-4" />
                      <input
                        type="text"
                        placeholder="Pesquisa"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-9 pr-3 h-[38px] border rounded-[8px] text-[13px] outline-none transition-colors ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white focus:border-brand-base' : 'bg-white border-neutral-2 text-neutral-7 focus:border-[#0078B0]'}`}
                      />
                    </div>
                  </div>

                  {/* Linha dos 3 Toggles de Filtro por Tipo de Resposta (EXACT 8px BORDER RADIUS) */}
                  <div className="flex items-center gap-3 pt-1 pb-2 flex-wrap">
                    <span className={`text-[13px] font-bold ${isDarkMode ? 'text-neutral-3' : 'text-neutral-7'}`}>
                      Filtra Tipo de Resposta:
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">
                      {RESPONSE_TYPES.map(type => {
                        const isActive = activeResponseFilters.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleResponseFilter(type)}
                            className={`transition-all duration-150 cursor-pointer ${isActive
                              ? 'bg-[#0078B0] text-white px-3.5 py-1.5 rounded-[8px] text-[12px] font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#00608F]'
                              : 'bg-transparent text-neutral-6 hover:text-neutral-9 hover:bg-neutral-1 px-3.5 py-1.5 rounded-[8px] text-[12px] font-medium border border-transparent'
                              }`}
                          >
                            <span>{type}</span>
                            {isActive && <X size={13} className="shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grid de Cards de Tarefas (2 Colunas, EXACT 8px BORDER RADIUS) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTasks.map(task => {
                      const isAdded = addedTaskIds.has(task.id);
                      return (
                        <div
                          key={task.id}
                          onClick={() => toggleTaskSelection(task.id)}
                          className={`border-2 rounded-[8px] p-4 cursor-pointer relative flex flex-col justify-between transition-all duration-200 group ${isAdded
                            ? 'bg-[#E8F4FD] border-[#0078B0] shadow-sm'
                            : (isDarkMode ? 'border-neutral-5 bg-neutral-6 hover:border-neutral-4' : 'border-neutral-2 bg-white hover:border-[#0078B0]/50 hover:shadow-sm')
                            }`}
                        >
                          <div className="flex flex-col gap-2">
                            {/* Card Header: Título & Ações no Canto Direito */}
                            <div className="flex items-start justify-between gap-3">
                              <h4 className={`font-bold text-[15px] leading-snug flex-1 ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                                {task.title}
                              </h4>

                              <div className="flex items-center gap-1.5 shrink-0 text-neutral-5">
                                {/* Olho (Ver Tarefa Detalhada - EXACT 8px) */}
                                <button
                                  type="button"
                                  onClick={(e) => handleOpenTaskDetail(e, task)}
                                  className="w-7 h-7 rounded-[8px] border border-neutral-2 flex items-center justify-center hover:text-[#0078B0] hover:border-[#0078B0] hover:bg-white transition-colors"
                                  title="Ver tarefa detalhada"
                                >
                                  <Eye size={15} />
                                </button>

                                {/* Plus / Check Icon (EXACT 8px or Circular) */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTaskSelection(task.id);
                                  }}
                                  className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${isAdded
                                    ? 'bg-[#0078B0] text-white border-[#0078B0]'
                                    : 'border-neutral-2 text-neutral-5 hover:text-[#0078B0] hover:border-[#0078B0] hover:bg-white'
                                    }`}
                                  title={isAdded ? 'Remover seleção' : 'Adicionar tarefa'}
                                >
                                  {isAdded ? <Check size={14} strokeWidth={2.5} /> : <Plus size={14} />}
                                </button>
                              </div>
                            </div>

                            {/* Snippet Descritivo */}
                            <p className={`text-[12px] leading-relaxed line-clamp-2 ${isDarkMode ? 'text-neutral-4' : 'text-neutral-5'}`}>
                              {task.snippet}
                            </p>
                          </div>

                          {/* Card Footer Tag Pill (EXACT 8px BORDER RADIUS) */}
                          <div className="mt-4 pt-2 flex items-center">
                            <span className={`px-3 py-1 rounded-[8px] text-[11px] font-semibold border ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>
                              {task.responseType}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. MODO DETALHES DA TAREFA (`task-detail`) */}
              {viewState === 'task-detail' && selectedTask && (
                <div className="flex flex-col gap-5">
                  {/* Task Detail Header */}
                  <div className={`border rounded-[8px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-[#0078B0] shrink-0" />
                        <h2 className={`text-[16px] font-bold ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                          Tarefa
                        </h2>
                        <span className="text-[12px] text-neutral-4 font-medium">
                          {selectedTask.code} - {selectedTask.area.toLowerCase()}
                        </span>
                      </div>

                      <p className={`text-[13px] leading-relaxed font-semibold ${isDarkMode ? 'text-neutral-2' : 'text-neutral-7'}`}>
                        {selectedTask.fullTitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <Button
                        variant="primary"
                        appearance="solid"
                        size="sm"
                        iconLeft={<Plus size={16} />}
                        onClick={() => toggleTaskSelection(selectedTask.id)}
                      >
                        ADICIONAR TAREFA
                      </Button>

                      <button
                        onClick={() => setViewState('list')}
                        className="px-3.5 py-1.5 rounded-[8px] border border-neutral-3 text-[12px] font-bold text-neutral-7 hover:bg-neutral-1 flex items-center gap-1.5 transition-colors"
                      >
                        <ArrowLeft size={14} /> Voltar para lista
                      </button>
                    </div>
                  </div>

                  {/* Grid 2 Colunas: Contexto & Expectativa de Desempenho (EXACT 8px BORDER RADIUS) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Contexto */}
                    <div className={`border rounded-[8px] overflow-hidden shadow-sm flex flex-col ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                      <div className={`px-5 py-3 border-b flex items-center justify-between ${isDarkMode ? 'bg-neutral-5/40 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                        <div className="flex items-center gap-1.5">
                          <h3 className={`font-semibold text-[14px] ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>
                            Contexto
                          </h3>
                          <HelpCircle size={14} className="text-neutral-4 cursor-pointer" />
                        </div>
                        <button className="text-neutral-5 hover:text-neutral-7">
                          <Maximize2 size={15} />
                        </button>
                      </div>

                      <div className="p-5 flex flex-col gap-3">
                        <h4 className={`font-bold text-[14px] ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                          Cadê a água?
                        </h4>
                        <div className="rounded-[8px] overflow-hidden border border-neutral-2 bg-slate-50 flex items-center justify-center p-4">
                          <div className="w-44 h-44 rounded-[8px] bg-gradient-to-b from-sky-100 to-sky-200 flex flex-col items-center justify-center p-3 relative shadow-inner overflow-hidden">
                            <div className="w-20 h-20 rounded-full bg-amber-200 flex items-center justify-center relative border-2 border-amber-400">
                              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 absolute top-6 left-5" />
                              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 absolute top-6 right-5" />
                              <div className="w-4 h-1.5 rounded-full border-b-2 border-neutral-800 absolute bottom-5" />
                            </div>
                            <div className="mt-2 bg-white/80 backdrop-blur-sm px-2.5 py-0.5 rounded-[8px] text-[11px] font-bold text-sky-800 shadow-sm">
                              💧 Cadê a água?
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expectativa de Desempenho */}
                    <div className={`border rounded-[8px] overflow-hidden shadow-sm flex flex-col ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                      <div className={`px-5 py-3 border-b flex items-center justify-between ${isDarkMode ? 'bg-neutral-5/40 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                        <div className="flex items-center gap-1.5">
                          <h3 className={`font-semibold text-[14px] ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>
                            Expectativa de Desempenho
                          </h3>
                          <HelpCircle size={14} className="text-neutral-4 cursor-pointer" />
                        </div>
                        <button className="text-neutral-5 hover:text-neutral-7">
                          <Maximize2 size={15} />
                        </button>
                      </div>

                      <div className="p-6 flex-1 flex flex-col items-center justify-center text-center min-h-[220px]">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-3 relative">
                          <div className="w-12 h-14 bg-white border-2 border-slate-300 rounded-[8px] flex flex-col p-1.5 gap-1">
                            <div className="w-full h-1 bg-slate-200 rounded-[4px]" />
                            <div className="w-3/4 h-1 bg-slate-200 rounded-[4px]" />
                            <div className="w-full h-1 bg-slate-200 rounded-[4px]" />
                          </div>
                          <div className="w-8 h-8 rounded-full bg-[#0078B0] text-white flex items-center justify-center absolute -bottom-1 -right-1 shadow-md border-2 border-white">
                            <Search size={14} />
                          </div>
                        </div>
                        <p className={`text-[12px] max-w-xs leading-relaxed ${isDarkMode ? 'text-neutral-4' : 'text-neutral-5'}`}>
                          Hmm, parece esta tarefa não possui expectativa de desempenho.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seção Itens na Tarefa (EXACT 8px BORDER RADIUS) */}
                  <div className={`border rounded-[8px] overflow-hidden shadow-sm flex flex-col ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                    <div className={`px-5 py-3 border-b ${isDarkMode ? 'bg-neutral-5/40 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                      <h3 className={`font-bold text-[14px] ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                        Itens na Tarefa
                      </h3>
                    </div>

                    <div className="p-3 flex flex-col gap-2">
                      {selectedTask.items.map(item => (
                        <div
                          key={item.id}
                          onClick={() => handleOpenItemDetail(item)}
                          className={`p-3.5 rounded-[8px] border flex items-center justify-between cursor-pointer transition-colors ${item.itemCount
                            ? 'bg-[#E8F4FD] border-[#0078B0]'
                            : (isDarkMode ? 'border-neutral-5 bg-neutral-7 hover:bg-neutral-6' : 'border-neutral-2 bg-slate-50 hover:bg-white')
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Paperclip size={16} className="text-neutral-6 shrink-0" />
                            <span className={`text-[13px] font-semibold ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                              {item.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.itemCount && (
                              <span className="px-2.5 py-0.5 rounded-[8px] text-[11px] font-bold bg-[#B3E6F5] text-[#0078B0]">
                                {item.itemCount} itens
                              </span>
                            )}
                            <button className="w-7 h-7 rounded-[8px] bg-[#0078B0] text-white flex items-center justify-center">
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. MODO DETALHES DO ITEM (`item-detail`) */}
              {viewState === 'item-detail' && (
                <div className="flex flex-col gap-5">
                  {/* Item Detail Header */}
                  <div className={`border rounded-[8px] p-4 px-5 flex items-center justify-between shadow-sm ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                    <div className="flex items-center gap-2">
                      <Paperclip size={18} className="text-[#0078B0]" />
                      <h2 className={`text-[16px] font-bold ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                        Item da Tarefa
                      </h2>
                    </div>

                    <button
                      onClick={() => setViewState(selectedTask ? 'task-detail' : 'list')}
                      className="px-3.5 py-1.5 rounded-[8px] border border-neutral-3 text-[12px] font-bold text-neutral-7 hover:bg-neutral-1 flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft size={14} /> Voltar para Tarefa
                    </button>
                  </div>

                  <h3 className={`text-[15px] font-bold ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                    Identificação Literária
                  </h3>

                  {/* Grid 2 Colunas: Contexto & Expectativa de Desempenho */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Contexto */}
                    <div className={`border rounded-[8px] overflow-hidden shadow-sm flex flex-col ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                      <div className={`px-5 py-3 border-b flex items-center justify-between ${isDarkMode ? 'bg-neutral-5/40 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                        <div className="flex items-center gap-1.5">
                          <h4 className={`font-semibold text-[14px] ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>
                            Contexto
                          </h4>
                          <HelpCircle size={14} className="text-neutral-4" />
                        </div>
                        <Maximize2 size={15} className="text-neutral-4" />
                      </div>

                      <div className="p-5 flex flex-col gap-2">
                        <h5 className={`font-bold text-[14px] ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                          Cadê a água?
                        </h5>
                        <div className="rounded-[8px] border bg-slate-50 p-4 flex justify-center">
                          <div className="w-40 h-40 rounded-[8px] bg-gradient-to-b from-sky-100 to-sky-200 flex flex-col items-center justify-center p-3">
                            <div className="w-18 h-18 rounded-full bg-amber-200 border-2 border-amber-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expectativa */}
                    <div className={`border rounded-[8px] overflow-hidden shadow-sm flex flex-col ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                      <div className={`px-5 py-3 border-b flex items-center justify-between ${isDarkMode ? 'bg-neutral-5/40 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                        <div className="flex items-center gap-1.5">
                          <h4 className={`font-semibold text-[14px] ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>
                            Expectativa de Desempenho
                          </h4>
                          <HelpCircle size={14} className="text-neutral-4" />
                        </div>
                        <Maximize2 size={15} className="text-neutral-4" />
                      </div>

                      <div className="p-6 flex-1 flex flex-col items-center justify-center text-center min-h-[200px]">
                        <p className={`text-[12px] ${isDarkMode ? 'text-neutral-4' : 'text-neutral-5'}`}>
                          Hmm, parece esta tarefa não possui expectativa de desempenho.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seção Resposta */}
                  <div className={`border rounded-[8px] overflow-hidden shadow-sm flex flex-col ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                    <div className={`px-5 py-3 border-b flex items-center gap-1.5 ${isDarkMode ? 'bg-neutral-5/40 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                      <h4 className={`font-bold text-[14px] ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                        Resposta
                      </h4>
                      <HelpCircle size={14} className="text-neutral-4" />
                    </div>

                    <div className="p-5 flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5 max-w-md">
                        <label className={`text-[12px] font-bold ${isDarkMode ? 'text-neutral-3' : 'text-neutral-7'}`}>
                          Tipo do Item
                        </label>
                        <div className="relative">
                          <select className={`w-full px-3 h-[40px] border rounded-[8px] text-[13px] outline-none appearance-none ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-7'}`}>
                            <option>Item Objetiva - Escolha Única</option>
                            <option>Item Discursiva</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-4" />
                        </div>
                      </div>

                      {/* Tabela de Alternativas (Substituindo 'aluno' por 'estudante') */}
                      <div className="border rounded-[8px] overflow-hidden">
                        <div className="p-3.5 bg-slate-50 border-b flex items-center justify-between text-[12px] font-bold text-neutral-6">
                          <span>Alternativa A</span>
                          <span>Resposta de Alternativa</span>
                        </div>

                        <div className="p-4 flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-[#0078B0] flex items-center justify-center shrink-0">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#0078B0]" />
                            </div>
                            <span className="text-[13px] text-neutral-7 flex-1">
                              Corrigiu parte das concordâncias, mas manteve "d...
                            </span>
                            <Maximize2 size={15} className="text-neutral-4" />
                          </div>

                          <div className="pl-8 flex flex-col gap-1">
                            <span className="text-[11px] font-bold text-neutral-4 uppercase">Análise</span>
                            <p className="text-[12px] text-neutral-6 leading-relaxed">
                              Possível solução alcançada pelo <strong>estudante</strong> para ter escolhido esta alternativa...
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. MODO FORMULÁRIO ORIGINAL DA TAREFA (`form-view`) */}
              {viewState === 'form-view' && (
                <div className="flex flex-col gap-5">
                  {/* Card Aviso Azul: Modo de Edição Desativado ou Ativado */}
                  {!isEditable ? (
                    <div className={`border rounded-[8px] p-4 flex items-start gap-4 ${isDarkMode ? 'bg-sky-950/40 border-sky-800 text-sky-200' : 'bg-[#EBF7FF] border-[#B3E6F5] text-neutral-7'}`}>
                      <div className="w-9 h-9 rounded-full bg-[#B3E6F5]/50 flex items-center justify-center text-[#0078B0] shrink-0 mt-0.5">
                        <Edit3 size={18} className="rotate-45" />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <h3 className={`font-bold text-[15px] ${isDarkMode ? 'text-sky-100' : 'text-neutral-7'}`}>
                          Modo de Edição Desativado
                        </h3>
                        <p className={`text-[13px] leading-relaxed ${isDarkMode ? 'text-sky-200/80' : 'text-neutral-6'}`}>
                          Esta <strong>tarefa</strong> é pública e pertence ao <strong>Banco de Tarefas & Itens</strong> do Mapear. Para realizar alterações, crie uma cópia editável. Uma réplica da <strong>tarefa original</strong> será gerada, mas a cópia começará com o histórico de respostas zeradas.
                        </p>
                        <button
                          onClick={handleCreateEditableVersion}
                          className="mt-2 text-[12px] font-bold text-[#0078B0] hover:underline self-start uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          CRIAR CÓPIA EDITÁVEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`border rounded-[8px] p-4 flex items-start gap-4 ${isDarkMode ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                        <Check size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <h3 className="font-bold text-[15px]">
                          Modo de Edição Ativado (Cópia Gerada)
                        </h3>
                        <p className="text-[13px] leading-relaxed text-emerald-800">
                          Uma réplica editável desta tarefa foi criada com sucesso na avaliação. As edições e ajustes foram habilitados.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Form: Detalhes da Tarefa * (rounded-[8px]) */}
                  <div className={`border rounded-[8px] overflow-hidden shadow-sm ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                    <div className={`px-5 py-3.5 border-b ${isDarkMode ? 'bg-neutral-5/40 border-neutral-5' : 'bg-white border-neutral-2'}`}>
                      <h2 className={`font-semibold text-[15px] ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>
                        Detalhes da Tarefa <span className="text-red-500">*</span>
                      </h2>
                    </div>

                    <div className="p-5 flex flex-col gap-4">
                      {/* Row 1: Código + Toggle Público */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 max-w-[500px] flex flex-col gap-1.5">
                          <label className={`text-[12px] font-bold ${isDarkMode ? 'text-neutral-3' : 'text-neutral-7'}`}>
                            Código
                          </label>
                          <input
                            type="text"
                            disabled={!isEditable}
                            value={taskCode}
                            onChange={(e) => setTaskCode(e.target.value)}
                            className={`w-full px-3 h-[40px] border rounded-[8px] text-[14px] outline-none transition-colors ${!isEditable ? 'bg-slate-100 text-neutral-5 cursor-not-allowed' : ''} ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white focus:border-brand-base' : 'bg-white border-neutral-2 text-neutral-7 focus:border-[#0078B0]'}`}
                          />
                        </div>

                        <div className="flex items-center gap-2 self-end mb-1">
                          <span className={`text-[12px] font-bold ${isDarkMode ? 'text-neutral-3' : 'text-neutral-7'}`}>
                            Público
                          </span>
                          <button
                            type="button"
                            disabled={!isEditable}
                            onClick={() => setIsPublic(!isPublic)}
                            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${!isEditable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${isPublic ? 'bg-[#0078B0]' : 'bg-neutral-3'}`}
                          >
                            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>

                      {/* Row 2: Título */}
                      <div className="flex flex-col gap-1.5">
                        <label className={`text-[12px] font-bold ${isDarkMode ? 'text-neutral-3' : 'text-neutral-7'}`}>
                          Título
                        </label>
                        <input
                          type="text"
                          disabled={!isEditable}
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          className={`w-full px-3 h-[40px] border rounded-[8px] text-[14px] outline-none transition-colors ${!isEditable ? 'bg-slate-100 text-neutral-5 cursor-not-allowed' : ''} ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white focus:border-brand-base' : 'bg-white border-neutral-2 text-neutral-7 focus:border-[#0078B0]'}`}
                        />
                      </div>

                      {/* Row 3: Área de Conhecimento */}
                      <div className="flex flex-col gap-1.5">
                        <label className={`text-[12px] font-bold ${isDarkMode ? 'text-neutral-3' : 'text-neutral-7'}`}>
                          Área de Conhecimento
                        </label>
                        <div className="relative">
                          <select
                            disabled={!isEditable}
                            value={knowledgeArea}
                            onChange={(e) => setKnowledgeArea(e.target.value)}
                            className={`w-full px-3 h-[40px] border rounded-[8px] text-[14px] outline-none appearance-none transition-colors ${!isEditable ? 'bg-slate-100 text-neutral-5 cursor-not-allowed' : 'cursor-pointer'} ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white focus:border-brand-base' : 'bg-white border-neutral-2 text-neutral-7 focus:border-[#0078B0]'}`}
                          >
                            <option>Português</option>
                            <option>Matemática</option>
                            <option>Ciências</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RODAPÉ FLUTUANTE PERSISTENTE (BOTOES COM EXACT 8px OU ARREDONDADOS COESO) */}
          <div className={`border-t p-4 px-8 flex items-center justify-between z-20 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] shrink-0 ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`}>
            <button
              onClick={() => {
                setAddedTaskIds(new Set());
                onBack();
              }}
              className={`px-8 py-2.5 rounded-[8px] font-bold text-[13px] border transition-colors ${isDarkMode ? 'border-neutral-5 text-neutral-2 hover:bg-neutral-5' : 'border-neutral-3 text-neutral-6 hover:bg-neutral-1'}`}
            >
              CANCELAR
            </button>

            <div className="flex gap-4">
              <button
                onClick={handleCreateEditableVersion}
                className={`px-6 py-2.5 rounded-[8px] font-bold text-[13px] flex items-center gap-2 transition-colors cursor-pointer`}
                style={{
                  backgroundColor: isDarkMode ? '#003A79' : primaryExtraLight,
                  color: isDarkMode ? '#FFFFFF' : primaryBase
                }}
              >
                CRIAR VERSÃO EDITÁVEL <Plus size={16} />
              </button>

              <button
                onClick={() => {
                  setViewState('form-view');
                }}
                className={`px-6 py-2.5 rounded-[8px] font-bold text-[13px] text-white flex items-center gap-2 transition-colors cursor-pointer`}
                style={{
                  backgroundColor: primaryBase
                }}
              >
                UTILIZAR ITEM ORIGINAL <Download size={16} />
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AvaliacoesEditor;
