
export const defaultColors = {
  primary: { ultraDark: '#001D31', extraDark: '#003A79', dark: '#0C63AA', base: '#008BC9', light: '#94CFEF', extraLight: '#D9F0FC' },
  neutral: { 7: '#0F1113', 6: '#1D2432', 5: '#677080', 4: '#969DA9', 3: '#CACDD5', 2: '#DEE1E8', 1: '#F7F8FA', 0: '#FFFFFF' },
  secondary: { dark: '#760A51', base: '#DC189B', light: '#F0A8DE', extraLight: '#FEEBF9' },
  semantic: {
    error: { dark: '#613037', base: '#E00120', light: '#FFACB7', extraLight: '#FEE4E2' },
    success: { dark: '#267326', base: '#3FCC33', light: '#B8EBAD', extraLight: '#EBFFE6' },
    warning: { dark: '#DC9403', base: '#FFD352', light: '#FEF0C7', extraLight: '#FFFAEB' },
    info: { dark: '#155274', base: '#489EEA', light: '#B3E6F5', extraLight: '#DFF8FF' }
  },
  extended: {
    lavender: { dark: "#5B358A", base: "#B070F0", light: "#D9BBFF", extraLight: "#EEE0FF" },
    orange: { dark: "#96580D", base: "#E17A00", light: "#FBBE77", extraLight: "#FFE3C2" },
    oliva: { dark: "#52712A", base: "#88A94A", light: "#ADCE6D", extraLight: "#CDED90" },
    terracota: { dark: "#8B6245", base: "#AC7F5E", light: "#CFA88A", extraLight: "#E7CBB3" },
    wine: { dark: "#6E1836", base: "#A41450", light: "#CE7E8F", extraLight: "#F49EB0" },
    cherry: { dark: "#95102B", base: "#D9265C", light: "#F5A3BC" },
    clay: { dark: "#992400", base: "#FF6333", light: "#FAB49E", extraLight: "#FFE0D7" },
    wheat: { dark: "#915208", base: "#F2890D", light: "#F7C8A1" },
    aqua: { dark: "#0B645F", base: "#259E96", light: "#7ED4CD", extraLight: "#D1FBF9" },
    storm: { dark: "#16449C", base: "#0D5BF2", light: "#9EC4FA" },
    purple: { dark: "#7B387A", base: "#9F579E", light: "#C693C2", extraLight: "#EEE0FF" },
    yellowAlt: { dark: "#C2A32E", base: "#FFD744", light: "#FFE596" }
  },
  graph: {
    positive: "#8CD47E",
    neutral: "#F8D66D",
    negative: "#FF6961"
  }
};

export const highContrastColors = {
  primary: { ultraDark: '#000000', extraDark: '#000000', dark: '#111111', base: '#FACC15', light: '#FDE047', extraLight: '#333333' },
  neutral: { 7: '#FFFFFF', 6: '#F7F8FA', 5: '#E5E7EB', 4: '#D1D5DB', 3: '#6B7280', 2: '#374151', 1: '#1F2937', 0: '#000000' }
};

import React from 'react';
import {
  Library, BookOpen, FileEdit, PenTool, Users, Database, CheckSquare,
  TrendingUp, UploadCloud, BarChart2, LineChart, LayoutDashboard,
  GraduationCap, UserCog, Building2, Grid, BookCheck, Edit3, PieChart, ClipboardList
} from 'lucide-react';

export const sidebarMenus = [
  {
    id: 'curriculos',
    label: 'Matrizes e Conteúdos',
    shortDesc: 'Configure as matrizes e conteúdos',
    icon: <Library size={24} />,
    cards: [
      { id: 'card-saberes', title: 'Matriz de Saberes', route: 'saberes', keywords: ['habilidades', 'saberes', 'domínios', 'cognitivos', 'competências'], desc: 'Organize matrizes, relacione domínios e hierarquize habilidades cognitivas essenciais para a rede.', icon: <Grid size={20} /> },
      { id: 'card-curriculos', title: 'Matrizes Curriculares', route: 'curriculos', keywords: ['bncc', 'saeb', 'currículo', 'habilidades', 'nacional'], desc: 'Estruture habilidades educacionais com base em referenciais nacionais padronizados, como BNCC e SAEB.', icon: <BookOpen size={20} /> },
      { id: 'card-conteudos', title: 'Edição de Conteúdos', keywords: ['material', 'didático', 'aula', 'alunos', 'estudantes', 'publicar'], desc: 'Crie, publique e disponibilize materiais didáticos acessíveis e bem estruturados para os estudantes.', icon: <FileEdit size={20} /> }
    ]
  },
  {
    id: 'avaliacoes',
    label: 'Gestão de Avaliações',
    shortDesc: 'Ciclo completo de avaliações',
    icon: <Edit3 size={24} />, // Note: Edit3 was in the original imports but might need checking
    cards: [
      { id: 'card-editor-av', title: 'Editor de Avaliações', route: 'avaliacoes', keywords: ['prova', 'teste', 'exame', 'criar', 'caderno'], desc: 'Estruture cadernos, blocos de itens e defina todos os parâmetros para aplicação de novas provas.', icon: <PenTool size={20} /> },
      { id: 'card-banco', title: 'Banco de Tarefas', keywords: ['questões', 'itens', 'perguntas', 'banco', 'repositório'], desc: 'Acesse e colabore em tarefas educacionais mantendo uma curadoria técnica de excelência pedagógica.', icon: <Database size={20} /> },
      { id: 'card-alocacao', title: 'Alocação de Avaliações', keywords: ['alunos', 'professores', 'turmas', 'enviar prova', 'distribuir'], desc: 'Distribua as provas criadas associando os testes a turmas ou grupos específicos de estudantes.', icon: <Users size={20} /> },
      { id: 'card-correcao', title: 'Correção de Avaliações', keywords: ['corrigir', 'ia', 'respostas', 'alunos', 'inteligência artificial'], desc: 'Utilize inteligência artificial para agrupar respostas e otimizar a velocidade de correção manual.', icon: <CheckSquare size={20} /> },
      { id: 'card-metricas', title: 'Métricas', keywords: ['desempenho', 'notas', 'alunos', 'escolas', 'indicadores'], desc: 'Acompanhe métricas gerais de correção e tenha a visão do status atual de estudantes e turmas.', icon: <TrendingUp size={20} /> },
      { id: 'card-upload', title: 'Carregamento de Provas', route: 'carregamento-provas', keywords: ['upload', 'pdf', 'scanner', 'digitalizar', 'alunos', 'htr'], desc: 'Faça upload de provas físicas e valide a leitura de respostas manuscritas via tecnologia HTR.', icon: <UploadCloud size={20} /> }
    ]
  },
  {
    id: 'analise',
    label: 'Resultados & Indicadores',
    shortDesc: 'Análise de relatórios e psicométricos',
    icon: <PieChart size={24} />,
    cards: [
      { id: 'card-relatorios', title: 'Relatórios', keywords: ['notas', 'alunos', 'resultados', 'ranking', 'boletim'], desc: 'Acesse análises e rankings com indicadores consolidados de proficiência de toda a rede de ensino.', icon: <BarChart2 size={20} /> },
      { id: 'card-psico', title: 'Psicométricos', keywords: ['tri', 'alunos', 'itens', 'validade', 'curva', 'estatística'], desc: 'Avalie a curva de aprendizado e o comportamento em itens com validação estatística avançada (TRI).', icon: <LineChart size={20} /> },
      { id: 'card-devolutivas', title: 'Devolutivas', route: 'devolutivas', keywords: ['alunos', 'notas', 'gabarito', 'mapa de calor', 'individual'], desc: 'Explore mapas de calor e visualize o desempenho detalhado de estudantes individualmente por turma.', icon: <LayoutDashboard size={20} /> },
      { id: 'card-acompanhamento', title: 'Acompanhamento Escolar', route: 'acompanhamento', keywords: ['alunos', 'escolas', 'evolução', 'histórico', 'longitudinal'], desc: 'Monitore a evolução longitudinal por áreas de conhecimento das escolas e habilidades cognitivas.', icon: <TrendingUp size={20} /> }
    ]
  },
  {
    id: 'realizacao',
    label: 'Ambiente do Estudante',
    shortDesc: 'Ambiente dedicado aos estudantes',
    icon: <GraduationCap size={24} />,
    cards: [
      { id: 'card-realizacao', title: 'Realização de Testes', keywords: ['alunos', 'estudantes', 'fazer prova', 'responder', 'teste'], desc: 'Acesse o ambiente exclusivo de estudantes para a resolution segura de testes e simulados.', icon: <GraduationCap size={20} /> },
      { id: 'card-presenca', title: 'Registro de Presença', route: 'registro-presenca', keywords: ['chamada', 'faltas', 'presença', 'alunos', 'aplicação'], desc: 'Realize o registro de presença dos alunos para as avaliações alocadas em cada turma.', icon: <CheckSquare size={20} /> }
    ]
  },
  {
    id: 'administracao',
    label: 'Controle Institucional',
    shortDesc: 'Usuários, escolas e turmas',
    icon: <UserCog size={24} />,
    cards: [
      { id: 'card-usuarios', title: 'Usuários', route: 'usuarios', keywords: ['acesso', 'professores', 'diretores', 'senha', 'perfil', 'cargo'], desc: 'Adicione perfis e gerencie as permissões de acesso baseadas nos cargos das entidades escolares.', icon: <UserCog size={20} /> },
      { id: 'card-escolas', title: 'Escolas', keywords: ['colégios', 'instituições', 'rede', 'município', 'dados'], desc: 'Atualize cadastros institucionais e administre as informações da rede de escolas ativas.', icon: <Building2 size={20} /> },
      { id: 'card-turmas', title: 'Turmas', keywords: ['alunos', 'classes', 'estudantes', 'agrupamento', 'transferência'], desc: 'Organize o ensalamento, realize remanejamentos de alunos e vincule turmas às avaliações.', icon: <Users size={20} /> }
    ]
  }
];

export const launcherApps = [
  { id: 'app-saberes', route: 'saberes', label: 'Matriz de Saberes', icon: <Grid size={24} /> },
  { id: 'app-avaliacoes', route: 'avaliacoes', label: 'Edição de Avaliações', icon: <PenTool size={24} /> },
  { id: 'app-correcao', label: 'Correção de Avaliações', icon: <CheckSquare size={24} /> },
  { id: 'app-conteudos', label: 'Edição de Conteúdos', icon: <FileEdit size={24} /> },
  { id: 'app-admin', route: 'usuarios', label: 'Controle Institucional de Turmas', icon: <UserCog size={24} /> },
  { id: 'app-relatorios', route: 'acompanhamento', label: 'Relatórios e Devolutivas', icon: <LayoutDashboard size={24} /> },
  { id: 'app-realizacao', label: 'Realização de Avaliações', icon: <BookCheck size={24} /> }
];
