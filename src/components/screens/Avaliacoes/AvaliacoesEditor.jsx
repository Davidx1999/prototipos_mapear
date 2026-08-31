import React, { useState, useMemo, useCallback } from 'react';
import {
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import ContextualBreadcrumb from './components/editor/ContextualBreadcrumb';
import AssessmentOverviewLevel from './components/editor/AssessmentOverviewLevel';
import TestOverviewLevel from './components/editor/TestOverviewLevel';
import TaskOverviewLevel from './components/editor/TaskOverviewLevel';
import FocusedItemEditor from './components/editor/FocusedItemEditor';
import ItemPreviewModal from './components/editor/ItemPreviewModal';
import AssessmentReviewModal from './components/editor/AssessmentReviewModal';
import { INITIAL_ASSESSMENT_DATA } from './components/editor/mockAssessmentData';

const AvaliacoesEditor = ({
  assessment: initialAssessment,
  onBack,
  onSaveAssessment,
  colors,
  isDarkMode = false
}) => {
  // Assessment Master State
  const [assessment, setAssessment] = useState(() => {
    if (initialAssessment && initialAssessment.title) {
      return {
        ...INITIAL_ASSESSMENT_DATA,
        ...initialAssessment,
        tests: initialAssessment.tests || INITIAL_ASSESSMENT_DATA.tests
      };
    }
    return INITIAL_ASSESSMENT_DATA;
  });

  // Drill-down Context State: Avaliação -> Teste -> Tarefa -> Item
  const [context, setContext] = useState(() => {
    const firstTest = assessment.tests?.[0];
    const firstTask = firstTest?.tasks?.[0];
    const firstItem = firstTask?.items?.[0];

    return {
      level: 'assessment', // Inicia no nível da Avaliação (Visão geral com Cadernos e Configurações)
      testId: firstTest?.id || 'teste-1',
      taskId: firstTask?.id || 'tar-1',
      itemId: firstItem?.id || 'it-01'
    };
  });

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(null);

  // Compute active nodes in hierarchy
  const currentTest = useMemo(() => {
    return assessment.tests?.find(t => t.id === context.testId) || assessment.tests?.[0] || null;
  }, [assessment.tests, context.testId]);

  const currentTask = useMemo(() => {
    return currentTest?.tasks?.find(tk => tk.id === context.taskId) || currentTest?.tasks?.[0] || null;
  }, [currentTest, context.taskId]);

  const currentItem = useMemo(() => {
    return currentTask?.items?.find(it => it.id === context.itemId) || currentTask?.items?.[0] || null;
  }, [currentTask, context.itemId]);

  // ─── DIAGNÓSTICO GLOBAL DE PENDÊNCIAS EM TEMPO REAL (Nielsen #1, #5, #9) ───
  const pendencies = useMemo(() => {
    const list = [];
    const testsList = assessment.tests || [];

    if (testsList.length === 0) {
      list.push({
        id: 'no-tests',
        message: 'Nenhum Caderno de Teste cadastrado na avaliação.',
        location: 'Avaliação Geral',
        itemTarget: null
      });
      return list;
    }

    testsList.forEach((test, tIdx) => {
      const testName = test.title || `Caderno 0${tIdx + 1}`;
      const tasksList = test.tasks || [];

      if (tasksList.length === 0) {
        list.push({
          id: `no-tasks-${test.id}`,
          message: `O ${testName} não possui tarefas cadastradas.`,
          location: testName,
          itemTarget: { testId: test.id, taskId: '', itemId: '' }
        });
      }

      tasksList.forEach((task, tkIdx) => {
        const taskName = task.title || `Tarefa 0${tkIdx + 1}`;
        const itemsList = task.items || [];

        if (itemsList.length === 0) {
          list.push({
            id: `no-items-${task.id}`,
            message: `A tarefa "${taskName}" não possui itens associados.`,
            location: `${testName} › ${taskName}`,
            itemTarget: { testId: test.id, taskId: task.id, itemId: '' }
          });
        }

        itemsList.forEach((item, itIdx) => {
          const itemCode = item.code || `Item 0${itIdx + 1}`;
          const itemLocation = `${testName} › ${taskName} › ${itemCode}`;
          const target = { testId: test.id, taskId: task.id, itemId: item.id };

          // Verificação de Enunciado
          if (!item.enunciado || item.enunciado.trim() === '') {
            list.push({
              id: `enunciado-${item.id}`,
              message: `${itemCode}: Enunciado não preenchido.`,
              location: itemLocation,
              itemTarget: target
            });
          }

          // Verificação de Habilidade BNCC
          if (!item.habilidadeBNCC?.id) {
            list.push({
              id: `skill-${item.id}`,
              message: `${itemCode}: Sem habilidade BNCC associada.`,
              location: itemLocation,
              itemTarget: target
            });
          }

          // Verificação de Gabarito / Resposta
          if (item.type === 'multipla_escolha' && !item.gabarito) {
            list.push({
              id: `gabarito-${item.id}`,
              message: `${itemCode}: Gabarito de alternativa não definido.`,
              location: itemLocation,
              itemTarget: target
            });
          }

          if (item.type === 'resposta_construida' && (!item.respostaEsperada || item.respostaEsperada.trim() === '')) {
            list.push({
              id: `resposta-${item.id}`,
              message: `${itemCode}: Resposta esperada ou critérios de correção ausentes.`,
              location: itemLocation,
              itemTarget: target
            });
          }
        });
      });
    });

    return list;
  }, [assessment]);

  // Context Drill-down Navigator
  const handleNavigateLevel = useCallback((targetLevel, targetIds = {}) => {
    setContext(prev => {
      const newTestId = targetIds.testId || prev.testId;
      const newTaskId = targetIds.taskId || prev.taskId;
      const newItemId = targetIds.itemId || prev.itemId;

      return {
        level: targetLevel,
        testId: newTestId,
        taskId: newTaskId,
        itemId: newItemId
      };
    });
  }, []);

  // Quick select other item in current task
  const handleSelectOtherItemInTask = useCallback((targetItemId) => {
    setContext(prev => ({
      ...prev,
      level: 'item',
      itemId: targetItemId
    }));
  }, []);

  // Item Update Handler (Immutable deep update)
  const handleUpdateItem = useCallback((updatedFields) => {
    if (!currentItem) return;

    setAssessment(prev => {
      const newTests = (prev.tests || []).map(t => {
        if (t.id !== context.testId) return t;

        const newTasks = (t.tasks || []).map(tk => {
          if (tk.id !== context.taskId) return tk;

          const newItems = (tk.items || []).map(it => {
            if (it.id !== currentItem.id) return it;
            return {
              ...it,
              ...updatedFields
            };
          });

          return { ...tk, items: newItems };
        });

        return { ...t, tasks: newTasks };
      });

      const updated = { ...prev, tests: newTests };
      onSaveAssessment?.(updated);
      return updated;
    });
  }, [currentItem, context.testId, context.taskId, onSaveAssessment]);

  // Add Item to Current Task
  const handleAddItem = useCallback(() => {
    const activeTest = currentTest;
    const activeTask = currentTask;
    if (!activeTest || !activeTask) return;

    const itemsCount = activeTask.items?.length || 0;
    const newItemNumber = String(itemsCount + 1).padStart(2, '0');
    const newItemId = `it-${Date.now()}`;

    const newItem = {
      id: newItemId,
      code: `Item ${newItemNumber}`,
      title: `Item ${newItemNumber} - Novo Item`,
      type: 'multipla_escolha',
      status: 'pendente',
      enunciado: '',
      contexto: '',
      respostaEsperada: '',
      alternativas: [
        { id: `alt-a-${Date.now()}`, letra: 'A', texto: '', isCorreta: true, analiseDistrator: '' },
        { id: `alt-b-${Date.now()}`, letra: 'B', texto: '', isCorreta: false, analiseDistrator: '' },
        { id: `alt-c-${Date.now()}`, letra: 'C', texto: '', isCorreta: false, analiseDistrator: '' },
        { id: `alt-d-${Date.now()}`, letra: 'D', texto: '', isCorreta: false, analiseDistrator: '' }
      ],
      habilidadeBNCC: null,
      sentencaDescritora: '',
      processosCognitivosSentenca: ['Compreender'],
      rubricas: {
        insuficiente: '',
        parcial: '',
        suficiente: ''
      },
      gabarito: 'A',
      orientacaoCorrecao: ''
    };

    setAssessment(prev => {
      const newTests = (prev.tests || []).map(t => {
        if (t.id !== activeTest.id) return t;

        const newTasks = (t.tasks || []).map(tk => {
          if (tk.id !== activeTask.id) return tk;
          return {
            ...tk,
            items: [...(tk.items || []), newItem]
          };
        });

        return { ...t, tasks: newTasks };
      });

      const updated = { ...prev, tests: newTests };
      onSaveAssessment?.(updated);
      return updated;
    });

    // Drill down directly to the new item
    setContext({
      level: 'item',
      testId: activeTest.id,
      taskId: activeTask.id,
      itemId: newItemId
    });

    setSaveToast(`Novo Item ${newItemNumber} criado com sucesso.`);
    setTimeout(() => setSaveToast(null), 3000);
  }, [currentTest, currentTask, onSaveAssessment]);

  // Duplicate Item
  const handleDuplicateItem = useCallback((itemIdToDup) => {
    const activeTest = currentTest;
    const activeTask = currentTask;
    if (!activeTest || !activeTask) return;

    const sourceItem = activeTask.items?.find(i => i.id === itemIdToDup) || currentItem;
    if (!sourceItem) return;

    const itemsCount = activeTask.items?.length || 0;
    const newItemNumber = String(itemsCount + 1).padStart(2, '0');
    const newItemId = `it-${Date.now()}`;

    const duplicatedItem = {
      ...sourceItem,
      id: newItemId,
      code: `Item ${newItemNumber}`,
      title: `${sourceItem.title} (Cópia)`,
      alternativas: (sourceItem.alternativas || []).map(a => ({
        ...a,
        id: `alt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
      }))
    };

    setAssessment(prev => {
      const newTests = (prev.tests || []).map(t => {
        if (t.id !== activeTest.id) return t;

        const newTasks = (t.tasks || []).map(tk => {
          if (tk.id !== activeTask.id) return tk;
          return {
            ...tk,
            items: [...(tk.items || []), duplicatedItem]
          };
        });

        return { ...t, tasks: newTasks };
      });

      const updated = { ...prev, tests: newTests };
      onSaveAssessment?.(updated);
      return updated;
    });

    setContext({
      level: 'item',
      testId: activeTest.id,
      taskId: activeTask.id,
      itemId: newItemId
    });

    setSaveToast(`Item duplicado como Item ${newItemNumber}.`);
    setTimeout(() => setSaveToast(null), 3000);
  }, [currentTest, currentTask, currentItem, onSaveAssessment]);

  // Delete Item
  const handleDeleteItem = useCallback((itemIdToDelete) => {
    const activeTest = currentTest;
    const activeTask = currentTask;
    if (!activeTest || !activeTask) return;

    if ((activeTask.items || []).length <= 1) {
      setSaveToast('A tarefa precisa ter pelo menos 1 item cadastrado.');
      setTimeout(() => setSaveToast(null), 3000);
      return;
    }

    setAssessment(prev => {
      const newTests = (prev.tests || []).map(t => {
        if (t.id !== activeTest.id) return t;

        const newTasks = (t.tasks || []).map(tk => {
          if (tk.id !== activeTask.id) return tk;
          const filtered = (tk.items || []).filter(it => it.id !== itemIdToDelete);
          return { ...tk, items: filtered };
        });

        return { ...t, tasks: newTasks };
      });

      const updated = { ...prev, tests: newTests };
      onSaveAssessment?.(updated);
      return updated;
    });

    // Switch focus to another remaining item
    const remainingItems = activeTask.items.filter(i => i.id !== itemIdToDelete);
    if (remainingItems.length > 0) {
      setContext(prev => ({
        ...prev,
        itemId: remainingItems[0].id
      }));
    }

    setSaveToast('Item removido com sucesso.');
    setTimeout(() => setSaveToast(null), 3000);
  }, [currentTest, currentTask, onSaveAssessment]);

  // Add Task to Current Test
  const handleAddTask = useCallback(() => {
    const activeTest = currentTest;
    if (!activeTest) return;

    const taskCount = activeTest.tasks?.length || 0;
    const newTaskNumber = String(taskCount + 1).padStart(2, '0');
    const newTaskId = `tar-${Date.now()}`;
    const initialItemId = `it-${Date.now()}`;

    const newTask = {
      id: newTaskId,
      code: `TAR-${newTaskNumber}`,
      title: `Tarefa ${newTaskNumber}: Nova Tarefa de Avaliação`,
      knowledgeArea: 'Geral',
      hasItemComposto: false,
      items: [
        {
          id: initialItemId,
          code: 'Item 01',
          title: 'Item 01',
          type: 'multipla_escolha',
          status: 'pendente',
          enunciado: '',
          contexto: '',
          respostaEsperada: '',
          alternativas: [
            { id: `alt-a-${Date.now()}`, letra: 'A', texto: '', isCorreta: true, analiseDistrator: '' },
            { id: `alt-b-${Date.now()}`, letra: 'B', texto: '', isCorreta: false, analiseDistrator: '' }
          ],
          habilidadeBNCC: null,
          sentencaDescritora: '',
          processosCognitivosSentenca: ['Compreender'],
          rubricas: { insuficiente: '', parcial: '', suficiente: '' },
          gabarito: 'A'
        }
      ]
    };

    setAssessment(prev => {
      const newTests = (prev.tests || []).map(t => {
        if (t.id !== activeTest.id) return t;
        return {
          ...t,
          tasks: [...(t.tasks || []), newTask]
        };
      });
      const updated = { ...prev, tests: newTests };
      onSaveAssessment?.(updated);
      return updated;
    });

    setContext({
      level: 'task',
      testId: activeTest.id,
      taskId: newTaskId,
      itemId: initialItemId
    });

    setSaveToast(`Nova Tarefa ${newTaskNumber} criada.`);
    setTimeout(() => setSaveToast(null), 3000);
  }, [currentTest, onSaveAssessment]);

  // Delete Task
  const handleDeleteTask = useCallback((taskIdToDelete) => {
    const activeTest = currentTest;
    if (!activeTest) return;

    if ((activeTest.tasks || []).length <= 1) {
      setSaveToast('O caderno precisa ter pelo menos 1 tarefa cadastrada.');
      setTimeout(() => setSaveToast(null), 3000);
      return;
    }

    setAssessment(prev => {
      const newTests = (prev.tests || []).map(t => {
        if (t.id !== activeTest.id) return t;
        return {
          ...t,
          tasks: (t.tasks || []).filter(tk => tk.id !== taskIdToDelete)
        };
      });
      const updated = { ...prev, tests: newTests };
      onSaveAssessment?.(updated);
      return updated;
    });

    const remainingTasks = activeTest.tasks.filter(t => t.id !== taskIdToDelete);
    if (remainingTasks.length > 0) {
      setContext({
        level: 'test',
        testId: activeTest.id,
        taskId: remainingTasks[0].id,
        itemId: remainingTasks[0].items?.[0]?.id || ''
      });
    }

    setSaveToast('Tarefa removida.');
    setTimeout(() => setSaveToast(null), 3000);
  }, [currentTest, onSaveAssessment]);

  // Add Test
  const handleAddTest = useCallback(() => {
    const testsCount = assessment.tests?.length || 0;
    const newTestNumber = String(testsCount + 1).padStart(2, '0');
    const newTestId = `teste-${Date.now()}`;
    const initialTaskId = `tar-${Date.now()}`;
    const initialItemId = `it-${Date.now()}`;

    const newTest = {
      id: newTestId,
      code: `CAD-${newTestNumber}`,
      title: `Caderno ${newTestNumber} - Novo Caderno de Teste`,
      tasks: [
        {
          id: initialTaskId,
          code: 'TAR-01',
          title: 'Tarefa 01',
          hasItemComposto: false,
          items: [
            {
              id: initialItemId,
              code: 'Item 01',
              title: 'Item 01',
              type: 'multipla_escolha',
              status: 'pendente',
              enunciado: '',
              contexto: '',
              alternativas: [
                { id: `alt-a-${Date.now()}`, letra: 'A', texto: '', isCorreta: true, analiseDistrator: '' },
                { id: `alt-b-${Date.now()}`, letra: 'B', texto: '', isCorreta: false, analiseDistrator: '' }
              ],
              sentencaDescritora: '',
              processosCognitivosSentenca: ['Compreender'],
              rubricas: { insuficiente: '', parcial: '', suficiente: '' },
              gabarito: 'A'
            }
          ]
        }
      ]
    };

    setAssessment(prev => {
      const updated = {
        ...prev,
        tests: [...(prev.tests || []), newTest]
      };
      onSaveAssessment?.(updated);
      return updated;
    });

    setContext({
      level: 'test',
      testId: newTestId,
      taskId: initialTaskId,
      itemId: initialItemId
    });

    setSaveToast(`Novo Caderno ${newTestNumber} adicionado à avaliação.`);
    setTimeout(() => setSaveToast(null), 3000);
  }, [assessment.tests, onSaveAssessment]);

  // Delete Test
  const handleDeleteTest = useCallback((testIdToDelete) => {
    if ((assessment.tests || []).length <= 1) {
      setSaveToast('A avaliação precisa ter pelo menos 1 caderno de teste.');
      setTimeout(() => setSaveToast(null), 3000);
      return;
    }

    setAssessment(prev => {
      const updated = {
        ...prev,
        tests: (prev.tests || []).filter(t => t.id !== testIdToDelete)
      };
      onSaveAssessment?.(updated);
      return updated;
    });

    const remainingTests = assessment.tests.filter(t => t.id !== testIdToDelete);
    if (remainingTests.length > 0) {
      const first = remainingTests[0];
      setContext({
        level: 'assessment',
        testId: first.id,
        taskId: first.tasks?.[0]?.id || '',
        itemId: first.tasks?.[0]?.items?.[0]?.id || ''
      });
    }

    setSaveToast('Caderno de teste removido.');
    setTimeout(() => setSaveToast(null), 3000);
  }, [assessment.tests, onSaveAssessment]);

  // Complete Assessment Editing Action
  const handleCompleteAssessment = () => {
    const finalAssessment = {
      ...assessment,
      status: 'Programada'
    };
    onSaveAssessment?.(finalAssessment);
    setSaveToast('Avaliação concluída e marcada como Programada com sucesso!');
    setTimeout(() => {
      onBack?.();
    }, 1200);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-['Montserrat',sans-serif] ${
        isDarkMode ? 'bg-neutral-900 text-white' : 'bg-[#F8FAFC] text-neutral-900'
      }`}
    >
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-4 right-4 z-[9999] animate-fade-in-down">
          <div className="bg-[#0078B0] text-white px-5 py-3 rounded-[6px] shadow-xl font-semibold text-xs flex items-center gap-2.5 border border-brand-300">
            <CheckCircle2 size={16} />
            <span>{saveToast}</span>
          </div>
        </div>
      )}

      {/* ─── CABEÇALHO DO WORKSPACE DA AVALIAÇÃO ─── */}
      <ContextualBreadcrumb
        context={context}
        assessment={assessment}
        currentTest={currentTest}
        currentTask={currentTask}
        currentItem={currentItem}
        pendencies={pendencies}
        onNavigateLevel={handleNavigateLevel}
        onOpenPreview={() => setIsPreviewModalOpen(true)}
        onOpenReview={() => setIsReviewModalOpen(true)}
        onUpdateAssessmentTitle={(newTitle) => {
          setAssessment(prev => {
            const updated = { ...prev, title: newTitle };
            onSaveAssessment?.(updated);
            return updated;
          });
        }}
        onBackToHub={onBack}
        isDarkMode={isDarkMode}
      />

      {/* ─── CORPO PRINCIPAL DO WORKSPACE (DRILL-DOWN PROGRESSIVO) ─── */}
      <main className="flex-1 overflow-y-auto pb-16">
        {/* Contexto 1: Visão da Avaliação (Cadernos e Configurações) */}
        {context.level === 'assessment' && (
          <AssessmentOverviewLevel
            assessment={assessment}
            onOpenTest={(testId) => handleNavigateLevel('test', { testId })}
            onAddTest={handleAddTest}
            onDeleteTest={handleDeleteTest}
            onUpdateAssessmentMeta={(fields) => {
              setAssessment(prev => {
                const updated = { ...prev, ...fields };
                onSaveAssessment?.(updated);
                return updated;
              });
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Contexto 2: Visão do Teste / Caderno */}
        {context.level === 'test' && currentTest && (
          <TestOverviewLevel
            test={currentTest}
            assessment={assessment}
            onOpenTask={(taskId) => handleNavigateLevel('task', { testId: currentTest.id, taskId })}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTestTitle={(title) => {
              setAssessment(prev => {
                const updated = {
                  ...prev,
                  tests: (prev.tests || []).map(t => t.id === currentTest.id ? { ...t, title } : t)
                };
                onSaveAssessment?.(updated);
                return updated;
              });
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Contexto 3: Visão da Tarefa */}
        {context.level === 'task' && currentTask && (
          <TaskOverviewLevel
            task={currentTask}
            test={currentTest}
            assessment={assessment}
            onOpenItem={(itemId) => handleNavigateLevel('item', { testId: currentTest.id, taskId: currentTask.id, itemId })}
            onAddItem={handleAddItem}
            onDuplicateItem={handleDuplicateItem}
            onDeleteItem={handleDeleteItem}
            onUpdateTask={(updatedTask) => {
              setAssessment(prev => {
                const updated = {
                  ...prev,
                  tests: (prev.tests || []).map(t => {
                    if (t.id !== currentTest.id) return t;
                    return {
                      ...t,
                      tasks: (t.tasks || []).map(tk => tk.id === currentTask.id ? { ...tk, ...updatedTask } : tk)
                    };
                  })
                };
                onSaveAssessment?.(updated);
                return updated;
              });
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Contexto 4: Edição Focada do Item */}
        {context.level === 'item' && currentItem && (
          <FocusedItemEditor
            item={currentItem}
            task={currentTask}
            test={currentTest}
            assessment={assessment}
            onUpdateItem={handleUpdateItem}
            onDuplicateItem={handleDuplicateItem}
            onDeleteItem={handleDeleteItem}
            onAddItemToTask={handleAddItem}
            onSelectOtherItem={handleSelectOtherItemInTask}
            onOpenPreview={() => setIsPreviewModalOpen(true)}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* Modal de Prévia do Item / Instrumento */}
      <ItemPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        item={currentItem}
        taskContext={{
          hasItemComposto: currentTask?.hasItemComposto,
          itemComposto: currentTask?.itemComposto
        }}
        assessmentMeta={{
          title: assessment.title,
          grade: assessment.grade,
          subject: assessment.subject
        }}
        isDarkMode={isDarkMode}
      />

      {/* Modal de Revisão da Avaliação sob Demanda */}
      <AssessmentReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        assessment={assessment}
        pendencies={pendencies}
        onNavigateToItem={(target) => handleNavigateLevel('item', target)}
        onCompleteAssessment={handleCompleteAssessment}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default AvaliacoesEditor;
