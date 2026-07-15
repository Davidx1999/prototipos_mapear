import React, { useState } from 'react';
import {
  ArrowLeft, FileText, BookOpen, Search, ChevronDown,
  Paperclip, Plus, Edit3, Trash2, Image as ImageIcon,
  CheckSquare, Check, BookMarked, PanelLeftClose, MoreHorizontal,
  Route, Square, Eye, Download, Bookmark, Database, Copy, Link
} from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

const AvaliacoesEditor = ({
  assessment,
  onBack,
  colors,
  isDarkMode
}) => {
  const primaryBase = colors.primary.base;
  const primaryExtraLight = colors.primary.extraLight || '#E8F4FD';

  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCards, setSelectedCards] = useState(new Set([1]));

  // Hierarchy State
  const [expandedNodes, setExpandedNodes] = useState(new Set([
    'teste1', 't1', 't1-b1', 't1-b2', 't3', 't3-b1'
  ]));
  const [selectedNodeId, setSelectedNodeId] = useState('t1-b1-i1');

  const toggleNode = (e, id) => {
    e.stopPropagation();
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const [treeItems, setTreeItems] = useState([
    {
      id: 'teste1', type: 'teste', title: 'Exame Textos Dona Vassoura e Cadê a Água', origin: 'custom',
      children: [
        {
          id: 't1', type: 'tarefa', title: 'Texto Em Busca da Água Pragmática', origin: 'original',
          children: [
            { id: 't1-b1', type: 'bloco', title: 'Bloco 1', origin: 'copy', children: [
              { id: 't1-b1-i1', type: 'item', title: 'Item de Bloco 1.1', origin: 'original' },
              { id: 't1-b1-i2', type: 'item', title: 'Item de Bloco 1.2', origin: 'copy' }
            ]},
            { id: 't1-b2', type: 'bloco', title: 'Bloco 2', origin: 'custom', children: [
              { id: 't1-b2-i1', type: 'item', title: 'Item de Bloco 2.1', origin: 'custom' },
              { id: 't1-b2-i2', type: 'item', title: 'Item de Bloco 2.2', origin: 'custom' }
            ]},
            { id: 't1-i1', type: 'item', title: 'Item Solto 1', origin: 'custom' },
            { id: 't1-i2', type: 'item', title: 'Item Solto 2', origin: 'original' },
            { id: 't1-i3', type: 'item', title: 'Item Solto 3', origin: 'copy' },
            { id: 't1-i4', type: 'item', title: 'Item Solto 4', origin: 'custom' },
            { id: 't1-i5', type: 'item', title: 'Item Solto 5', origin: 'original' },
            { id: 't1-i6', type: 'item', title: 'Item Solto 6', origin: 'custom' }
          ]
        },
        {
          id: 't2', type: 'tarefa', title: 'Texto Cadê a Água', origin: 'custom',
          children: []
        },
        {
          id: 't3', type: 'tarefa', title: 'Texto Dona Vassoura', origin: 'copy',
          children: [
            { id: 't3-b1', type: 'bloco', title: 'Bloco de Itens', origin: 'custom', children: [
              { id: 't3-b1-i1', type: 'item', title: 'Item Interno 1', origin: 'custom' },
              { id: 't3-b1-i2', type: 'item', title: 'Item Interno 2', origin: 'original' },
              { id: 't3-b1-i3', type: 'item', title: 'Item Interno 3', origin: 'copy' }
            ]},
            { id: 't3-i1', type: 'item', title: 'Item Avulso 1', origin: 'custom' },
            { id: 't3-i2', type: 'item', title: 'Item Avulso 2', origin: 'copy' },
            { id: 't3-i3', type: 'item', title: 'Item Avulso 3', origin: 'original' },
            { id: 't3-i4', type: 'item', title: 'Item Avulso 4', origin: 'custom' },
            { id: 't3-i5', type: 'item', title: 'Item Avulso 5', origin: 'custom' }
          ]
        }
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

  const handleDragEnd = (e) => {
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

    // Get source parent
    let sourceParent = newTree;
    for (let i = 0; i < draggedNode.path.length - 1; i++) {
      sourceParent = sourceParent[draggedNode.path[i]].children;
    }
    const sourceIndex = draggedNode.path[draggedNode.path.length - 1];
    
    // Remove from source
    const [removedNode] = sourceParent.splice(sourceIndex, 1);

    // Get target parent
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

  const toggleCard = (id) => {
    setSelectedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const hasSelection = selectedCards.size > 0;

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
          Math.max(200, Math.min(600, mouseMoveEvent.clientX))
        );
      }
    },
    [isResizing]
  );

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      // Change cursor for the entire document while resizing
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

  return (
    <div className="flex flex-col bg-neutral-0 flex-1 overflow-hidden min-h-0 w-full">
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* SIDEBAR ÁRVORE */}
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
            <div className={`p-4 border-b flex items-center justify-between group shrink-0 ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
              <div className={`flex items-center gap-2 font-medium text-[18px] min-w-0 flex-1 mr-2`}>
                <Bookmark size={20} className={`shrink-0 ${isDarkMode ? 'text-neutral-2' : 'text-neutral-7'}`} />
                <span className={`truncate ${isDarkMode ? 'text-white' : ''}`} style={!isDarkMode ? { color: primaryBase } : {}} title={assessment?.title || 'Aplicação Textos Dona Vassoura e Cadê a Água'}>
                  {assessment?.title || 'Aplicação Textos Dona Vassoura e Cadê a Água'}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                  <Button variant="tertiary" appearance="ghost" iconOnly iconLeft={<MoreHorizontal />} />
                </div>
                <Button
                  variant="tertiary"
                  appearance="ghost"
                  iconOnly
                  iconLeft={<PanelLeftClose />}
                  onClick={() => setIsSidebarOpen(false)}
                />
              </div>
            </div>

            {/* Conteúdos */}
            <div className={`flex items-center justify-between p-4 border-b shrink-0 ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : 'bg-neutral-0 border-neutral-2 text-neutral-7'}`}>
              <span className="font-medium text-[18px]">Conteúdos</span>
              <div className={`flex items-center gap-2`}>
                <Button variant="tertiary" appearance="ghost" iconOnly iconLeft={<MoreHorizontal />} />
                <Button variant="tertiary" appearance="ghost" iconOnly iconLeft={<Search />} />
                <Button variant="secondary" appearance="solid" iconOnly iconLeft={<Plus />} />
              </div>
            </div>

            <div className="flex-1 pb-4 flex flex-col gap-1 overflow-y-auto">
              {/* Tree View */}
              <div className={`flex flex-col gap-0 text-sm font-normal pt-4 ${isDarkMode ? 'text-neutral-2' : 'text-neutral-7'}`}>
                
                {(() => {
                  const renderTree = (nodes, currentPath = []) => {
                    return nodes.map((node, index) => {
                      const path = [...currentPath, index];
                      const isExpanded = expandedNodes.has(node.id);
                      const isSelected = selectedNodeId === node.id;
                      const isDragged = draggedNode?.path.join('-') === path.join('-');
                      const isDragOver = dragOverNode?.path.join('-') === path.join('-');
                      
                      let pl = 'pl-4';
                      if (path.length === 2) pl = 'pl-8';
                      if (path.length === 3) pl = 'pl-12';
                      if (path.length === 4) pl = 'pl-[4.5rem]';

                      let Icon = BookMarked;
                      if (node.type === 'tarefa') Icon = BookOpen;
                      if (node.type === 'bloco') Icon = Route;
                      if (node.type === 'item') Icon = Paperclip;

                      const canExpand = node.type !== 'item';
                      const bgClass = isDarkMode ? 'hover:bg-neutral-5' : 'hover:bg-neutral-1';
                      const activeBgClass = isSelected ? (isDarkMode ? '#003A79' : primaryExtraLight) : undefined;
                      const fontClass = isSelected ? 'font-medium' : 'font-normal';
                      
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
                            className={`flex items-center justify-between h-[36px] pr-4 ${pl} cursor-grab active:cursor-grabbing group ${bgClass} ${fontClass} ${isDarkMode ? 'text-neutral-2' : 'text-neutral-7'} ${isDragged ? 'opacity-50' : ''}`}
                            style={{
                              backgroundColor: activeBgClass,
                              ...(isDragOver ? { boxShadow: `inset 0 ${dragOverNode.position === 'top' ? '2px' : '-2px'} 0 0 ${primaryBase}` } : {})
                            }}
                          >
                            <div className="flex items-center gap-1 min-w-0 flex-1 mr-0 group-hover:mr-2">
                              {canExpand ? (
                                <ChevronDown 
                                  size={16} 
                                  className={`shrink-0 cursor-pointer text-neutral-5 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} 
                                  onClick={(e) => toggleNode(e, node.id)} 
                                />
                              ) : <div className="w-4 shrink-0" />}
                              <Icon size={20} className="shrink-0 mr-1" />
                              <span className="truncate" title={node.title}>{node.title}</span>
                              {node.origin === 'original' && (
                                <Database size={14} className="ml-1.5 shrink-0 text-brand-base opacity-70" />
                              )}
                              {node.origin === 'copy' && (
                                <Copy size={14} className="ml-1.5 shrink-0 text-neutral-5 opacity-70" />
                              )}
                            </div>
                            <div className={`${isSelected ? 'flex' : 'hidden group-hover:flex'} items-center gap-2 shrink-0`}>
                              <Button variant="tertiary" appearance="ghost" size="xs" iconOnly iconLeft={<MoreHorizontal />} />
                              {canExpand && <Button variant="tertiary" appearance="ghost" size="xs" iconOnly iconLeft={<Plus />} />}
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

        {/* ÁREA PRINCIPAL DO EDITOR */}
        <main className={`flex-1 flex flex-col min-h-0 relative overflow-hidden ${isDarkMode ? 'bg-neutral-7' : 'bg-neutral-1'}`}>

          {/* Header Principal (Full Width) */}
          <div className={`w-full px-8 py-4 border-b flex items-center justify-between shrink-0 ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
            <div className={`flex items-center gap-3`}>
              {!isSidebarOpen && (
                <div className="mr-2">
                  <Button
                    variant="tertiary"
                    appearance="solid"
                    iconOnly
                    iconLeft={<PanelLeftClose className="rotate-180" />}
                    onClick={() => setIsSidebarOpen(true)}
                    title="Abrir lateral"
                  />
                </div>
              )}
              <Button
                variant="tertiary"
                appearance="solid"
                iconOnly
                iconLeft={<ArrowLeft />}
                onClick={onBack}
              />
              <span className={`text-[12px] font-bold`} style={{ color: primaryBase }}>
                Tela Inicial / Avaliações / ... / Texto Cadê a Água / Experiências e Passos / <span className={isDarkMode ? 'text-neutral-4' : 'text-neutral-4'}>Item em Criação...</span>
              </span>
            </div>
          </div>

          {/* Título Principal (Full Width) */}
          <div className={`w-full px-8 py-[16px] border-b shrink-0 ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
            <h6 className={`text-[18px] font-medium ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>
              Carregando Item do Banco...
            </h6>
          </div>

          {/* Área com Scroll */}
          <div className="flex-1 overflow-y-auto">
            <div className="w-full px-[24px] pt-6 flex flex-col gap-6 pb-12">

              {/* Formulário: Detalhes do Item */}
              <div className={`border rounded overflow-hidden shadow-sm ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
                <div className={`px-5 py-4 border-b ${isDarkMode ? 'bg-neutral-5/50 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
                  <h3 className={`font-semibold text-[15px] ${isDarkMode ? 'text-white' : 'text-neutral-6'}`}>Detalhes do Item <span className="text-red-500">*</span></h3>
                </div>
                <div className="p-5 flex flex-col gap-5">
                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <label className={`text-[12px] font-bold ${isDarkMode ? 'text-neutral-3' : 'text-neutral-7'}`}>Código</label>
                      <Input
                        placeholder="Digite o código"
                        className={isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-neutral-0'}
                        height="40px"
                      />
                    </div>
                    <div className="flex-[2] flex flex-col gap-2">
                      <label className={`text-[12px] font-bold ${isDarkMode ? 'text-neutral-3' : 'text-neutral-7'}`}>Título</label>
                      <Input
                        placeholder="Digite o título"
                        className={isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-neutral-0'}
                        height="40px"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={`text-[12px] font-bold ${isDarkMode ? 'text-neutral-3' : 'text-neutral-7'}`}>Componente Curricular</label>
                    <div className="relative">
                      <select className={`w-full px-3 h-[40px] border rounded text-[14px] outline-none appearance-none cursor-pointer focus:border-brand-base transition-colors ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-neutral-0 border-neutral-2 text-neutral-6'}`}>
                        <option>Português</option>
                        <option>Matemática</option>
                        <option>Ciências</option>
                      </select>
                      <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-neutral-4' : 'text-neutral-5'}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Itens Encontrados */}
              <div className={`border rounded overflow-hidden shadow-sm ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
                <div className={`px-5 py-4 border-b ${isDarkMode ? 'bg-neutral-5/50 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
                  <h3 className={`font-semibold text-[15px] ${isDarkMode ? 'text-white' : 'text-neutral-6'}`}>Lista de Itens Encontrados (40)</h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* Card 1 */}
                    <div
                      onClick={() => toggleCard(1)}
                      className={`border-2 rounded-lg p-4 cursor-pointer relative flex flex-col justify-between transition-all ${selectedCards.has(1)
                        ? 'bg-brand-base/10'
                        : (isDarkMode ? 'border-neutral-5 bg-neutral-6' : 'border-neutral-2 bg-white hover:border-brand-base/50')
                        }`}
                      style={{
                        backgroundColor: !selectedCards.has(1) ? '' : (isDarkMode ? '' : '#E8F4FD'),
                        borderColor: selectedCards.has(1) ? primaryBase : ''
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex items-center justify-center text-neutral-4">
                          {selectedCards.has(1) ? (
                            <div className="w-5 h-5 rounded flex items-center justify-center text-white shrink-0" style={{ backgroundColor: primaryBase }}>
                              <Check size={14} strokeWidth={3} />
                            </div>
                          ) : (
                            <div className={`w-5 h-5 rounded border bg-white shrink-0 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-3'}`} />
                          )}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <span className="text-[12px] font-bold text-neutral-4">TAR-2031</span>
                          <span className={`font-bold text-[15px] ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>Interpretação textual: Dona Vassoura</span>
                          <span className="text-[13px] text-neutral-6 font-semibold">Português • Múltipla Escolha</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-4 bg-white text-neutral-6'}`}>Literatura Inf...</span>
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-4 bg-white text-neutral-6'}`}>Identificar a i...</span>
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-4 bg-white text-neutral-6'}`}>Ler</span>
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-4 bg-white text-neutral-6'}`}>4+</span>
                          </div>
                        </div>
                      </div>
                      <div className={`mt-4 pt-3 border-t flex justify-between items-center ${isDarkMode ? 'border-neutral-5/20' : 'border-neutral-2'}`}>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-semibold text-neutral-5">Avalições utilizando</span>
                          <span className={`font-bold text-[13px] ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>232</span>
                        </div>
                        <Button
                          variant="primary"
                          appearance="ghost"
                          size="sm"
                          iconRight={<Eye size={16} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Ver prévia card 1');
                          }}
                        >
                          VER PRÉVIA
                        </Button>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div
                      onClick={() => toggleCard(2)}
                      className={`border-2 rounded-lg p-4 cursor-pointer relative flex flex-col justify-between transition-all ${selectedCards.has(2)
                        ? 'bg-brand-base/10'
                        : (isDarkMode ? 'border-neutral-5 bg-neutral-6' : 'border-neutral-2 bg-white hover:border-brand-base/50')
                        }`}
                      style={{
                        backgroundColor: !selectedCards.has(2) ? '' : (isDarkMode ? '' : '#E8F4FD'),
                        borderColor: selectedCards.has(2) ? primaryBase : ''
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex items-center justify-center text-neutral-4">
                          {selectedCards.has(2) ? (
                            <div className="w-5 h-5 rounded flex items-center justify-center text-white shrink-0" style={{ backgroundColor: primaryBase }}>
                              <Check size={14} strokeWidth={3} />
                            </div>
                          ) : (
                            <div className={`w-5 h-5 rounded border bg-white shrink-0 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-3'}`} />
                          )}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <span className="text-[12px] font-bold text-neutral-4">TAR-2031</span>
                          <span className={`font-bold text-[15px] ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>Interpretação textual: Dona Vassoura</span>
                          <span className="text-[13px] text-neutral-6 font-semibold">Português • Múltipla Escolha</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>Literatura Inf...</span>
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>Identificar a i...</span>
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>Ler</span>
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>4+</span>
                          </div>
                        </div>
                      </div>
                      <div className={`mt-4 pt-3 border-t flex justify-between items-center ${isDarkMode ? 'border-neutral-5/20' : 'border-neutral-2'}`}>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-semibold text-neutral-5">Avalições utilizando</span>
                          <span className={`font-bold text-[13px] ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>4,5 mil</span>
                        </div>
                        <Button
                          variant="primary"
                          appearance="ghost"
                          size="sm"
                          iconRight={<Eye size={16} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Ver prévia card 2');
                          }}
                        >
                          VER PRÉVIA
                        </Button>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div
                      onClick={() => toggleCard(3)}
                      className={`border-2 rounded-lg p-4 cursor-pointer relative flex flex-col justify-between transition-all ${selectedCards.has(3)
                        ? 'bg-brand-base/10'
                        : (isDarkMode ? 'border-neutral-5 bg-neutral-6' : 'border-neutral-2 bg-white hover:border-brand-base/50')
                        }`}
                      style={{
                        backgroundColor: !selectedCards.has(3) ? '' : (isDarkMode ? '' : '#E8F4FD'),
                        borderColor: selectedCards.has(3) ? primaryBase : ''
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex items-center justify-center text-neutral-4">
                          {selectedCards.has(3) ? (
                            <div className="w-5 h-5 rounded flex items-center justify-center text-white shrink-0" style={{ backgroundColor: primaryBase }}>
                              <Check size={14} strokeWidth={3} />
                            </div>
                          ) : (
                            <div className={`w-5 h-5 rounded border bg-white shrink-0 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-3'}`} />
                          )}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <span className="text-[12px] font-bold text-neutral-4">TAR-2031</span>
                          <span className={`font-bold text-[15px] ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>Interpretação textual: Dona Vassoura</span>
                          <span className="text-[13px] text-neutral-6 font-semibold">Português • Múltipla Escolha</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>Literatura Inf...</span>
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>Identificar a i...</span>
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>Ler</span>
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>4+</span>
                          </div>
                        </div>
                      </div>
                      <div className={`mt-4 pt-3 border-t flex justify-between items-center ${isDarkMode ? 'border-neutral-5/20' : 'border-neutral-2'}`}>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-semibold text-neutral-5">Avalições utilizando</span>
                          <span className={`font-bold text-[13px] ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>23</span>
                        </div>
                        <Button
                          variant="primary"
                          appearance="ghost"
                          size="sm"
                          iconRight={<Eye size={16} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Ver prévia card 3');
                          }}
                        >
                          VER PRÉVIA
                        </Button>
                      </div>
                    </div>

                    {/* Card 4 */}
                    <div
                      onClick={() => toggleCard(4)}
                      className={`border-2 rounded-lg p-4 cursor-pointer relative flex flex-col justify-between transition-all ${selectedCards.has(4)
                        ? 'bg-brand-base/10'
                        : (isDarkMode ? 'border-neutral-5 bg-neutral-6' : 'border-neutral-2 bg-white hover:border-brand-base/50')
                        }`}
                      style={{
                        backgroundColor: !selectedCards.has(4) ? '' : (isDarkMode ? '' : '#E8F4FD'),
                        borderColor: selectedCards.has(4) ? primaryBase : ''
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex items-center justify-center text-neutral-4">
                          {selectedCards.has(4) ? (
                            <div className="w-5 h-5 rounded flex items-center justify-center text-white shrink-0" style={{ backgroundColor: primaryBase }}>
                              <Check size={14} strokeWidth={3} />
                            </div>
                          ) : (
                            <div className={`w-5 h-5 rounded border bg-white shrink-0 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-3'}`} />
                          )}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <span className="text-[12px] font-bold text-neutral-4">TAR-2031</span>
                          <span className={`font-bold text-[15px] ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>Interpretação textual: Dona Vassoura</span>
                          <span className="text-[13px] text-neutral-6 font-semibold">Português • Múltipla Escolha</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>Literatura Inf...</span>
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>Identificar a i...</span>
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>Ler</span>
                            <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold ${isDarkMode ? 'border-neutral-5 bg-neutral-7 text-neutral-3' : 'border-neutral-3 bg-white text-neutral-6'}`}>4+</span>
                          </div>
                        </div>
                      </div>
                      <div className={`mt-4 pt-3 border-t flex justify-between items-center ${isDarkMode ? 'border-neutral-5/20' : 'border-neutral-2'}`}>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-semibold text-neutral-5">Avalições utilizando</span>
                          <span className={`font-bold text-[13px] ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>0</span>
                        </div>
                        <Button
                          variant="primary"
                          appearance="ghost"
                          size="sm"
                          iconRight={<Eye size={16} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Ver prévia card 4');
                          }}
                        >
                          VER PRÉVIA
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTÃO FLUTUANTE DE AÇÃO (FIXO NO TODO) */}
          <div className={`border-t p-4 px-8 flex items-center justify-between z-10 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] shrink-0 ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
            <button
              onClick={onBack}
              className={`px-8 py-2.5 rounded font-bold text-[13px] border transition-colors ${isDarkMode ? 'border-neutral-5 text-neutral-2 hover:bg-neutral-5' : 'border-neutral-3 text-neutral-6 hover:bg-neutral-1'}`}
            >
              CANCELAR
            </button>

            <div className="flex gap-4">
              <button
                disabled={!hasSelection}
                className={`px-6 py-2.5 rounded font-bold text-[13px] flex items-center gap-2 transition-colors ${hasSelection
                  ? 'hover:brightness-95 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
                  }`}
                style={{
                  backgroundColor: isDarkMode ? '#003A79' : primaryExtraLight,
                  color: isDarkMode ? '#FFFFFF' : primaryBase
                }}
              >
                CRIAR VERSÃO EDITÁVEL <Plus size={16} />
              </button>
              <button
                disabled={!hasSelection}
                className={`px-6 py-2.5 rounded font-bold text-[13px] text-white flex items-center gap-2 transition-colors ${hasSelection
                  ? 'hover:brightness-110 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
                  }`}
                style={{
                  backgroundColor: hasSelection ? primaryBase : '#9CA3AF'
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
