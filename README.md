# 🗺️ Protótipos MAPEAR

> Ambiente de prototipagem e desenvolvimento da interface do ecossistema **MAPEAR** (Plataforma de Avaliação, Gestão Curricular e Acompanhamento Educacional).

---

## 📌 Sumário

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Design System & Design Tokens](#-design-system--design-tokens)
- [Módulos & Funcionalidades](#-módulos--funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Execução Local](#-instalação-e-execução-local)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Deploy](#-deploy)
- [Convenções e Boas Práticas](#-convenções-e-boas-práticas)

---

## 🚀 Visão Geral

O projeto **Protótipos MAPEAR** é uma aplicação React desenvolvida para validar, prototipar e documentar interfaces, fluxos de usuário e componentes visuais do ecossistema educacional MAPEAR.

A aplicação conta com um fluxo integrado de **Design Tokens** (sincronizados a partir de definições do Figma em formato JSON) e uma arquitetura orientada a componentes que simula as jornadas completas de professores, gestores e estudantes.

---

## 🛠️ Tecnologias Utilizadas

- **Core:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) + CSS Custom Properties (Design Tokens)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Automação & Processamento de Tokens:** Node.js script (`scripts/build-tokens.cjs`)
- **Deploy:** GitHub Pages via `gh-pages`

---

## 🎨 Design System & Design Tokens

O projeto adota uma arquitetura em camadas de tokens alinhada ao Figma:

```
MAPEAR Raw (Tokens Primitivos) 
   └── MAPEAR Tokens (Tokens Semânticos / Contextuais)
         └── MAPEAR Components (Tokens a Nível de Componente)
               └── build-tokens.cjs ➔ src/styles/design-tokens.css
```

### Categorias de Tokens
- **Raw:** Cores primitivas, tipografia base, espaçamentos brutos.
- **Tokens Semânticos:** Cores de superfície, texto primário/secundário, estados interativos, feedback (sucesso, aviso, erro, informação).
- **Componentes:** Configurações específicas para inputs, botões, cards, tabelas e modais.

---

## 📦 Módulos & Funcionalidades

A plataforma cobre os principais fluxos do ciclo de avaliação e gestão escolar:

| Módulo | Descrição |
|---|---|
| **Dashboard** | Visão analítica geral, indicadores-chave, atalhos rápidos e notificações. |
| **Currículos** | Gestão de matrizes curriculares, competências, habilidades e diretrizes pedagógicas. |
| **Saberes** | Mapeamento e navegação de saberes, relações conceituais e grafos de dependência. |
| **Banco de Tarefas** | Repositório de itens de avaliação, filtros por habilidade/dificuldade e criação de questões. |
| **Avaliações** | Criação, parametrização, agendamento e gerenciamento de cadernos de prova. |
| **Realização de Testes** | Interface de aplicação de testes (online e presencial), controle de tempo e acessibilidade. |
| **Digitalização & Correção** | Leitura de folhas de resposta, correção assistida e validação de gabaritos. |
| **Devolutivas Pedagógicas** | Relatórios de desempenho, matrizes de acerto/erro, mapas de calor e diagnósticos por turma/aluno. |
| **Acompanhamento Escolar** | Monitoramento de frequência, engajamento e evolução contínua dos estudantes. |
| **Gestão de Usuários** | Perfis de acesso, turmas, escolas e permissões de gestores e docentes. |

---

## 📂 Estrutura do Projeto

```plaintext
prototipos_mapear/
├── .agents/                    # Customizações de agentes e diretrizes locais
├── MAPEAR Raw/                 # Definições JSON de tokens primitivos
├── MAPEAR Tokens/              # Definições JSON de tokens semânticos
├── MAPEAR Components/          # Definições JSON de tokens de componentes
├── public/                     # Ativos estáticos públicos
├── scripts/
│   └── build-tokens.cjs        # Script de build dos tokens para CSS
├── src/
│   ├── components/
│   │   ├── layout/             # Header, Footer, Navegação
│   │   ├── screens/            # Telas e fluxos dos módulos (Avaliações, Devolutivas, etc.)
│   │   ├── ui/                 # Componentes reutilizáveis de interface (botões, cards, modais)
│   │   └── variables_Figma/    # Mapeamento auxiliar de variáveis
│   ├── data/                   # Mocks, constantes e estruturas de dados de apoio
│   ├── styles/                 # Folhas de estilo e variáveis CSS geradas
│   ├── App.jsx                 # Roteamento e orquestração de estados da aplicação
│   ├── index.css               # Estilos globais e diretivas do Tailwind
│   └── main.jsx                # Ponto de entrada da aplicação
├── tailwind.config.js          # Configuração do Tailwind CSS integrado aos tokens
├── vite.config.js              # Configurações do Vite bundler
└── package.json                # Dependências e scripts do projeto
```

---

## 💻 Instalação e Execução Local

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/prototipos_mapear.git
   cd prototipos_mapear
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Gere os tokens de design:**
   ```bash
   npm run build:tokens
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento local no Vite. |
| `npm run build:tokens` | Executa o script de geração de variáveis CSS a partir dos arquivos JSON de tokens. |
| `npm run build` | Compila os tokens e realiza a build de produção na pasta `docs`. |
| `npm run preview` | Pré-visualiza localmente a build de produção. |
| `npm run deploy` | Executa a build e publica a pasta de distribuição no GitHub Pages via `gh-pages`. |

---

## 🌐 Deploy

O projeto está configurado para publicação automática no **GitHub Pages** utilizando a pasta de saída `docs/` ou a branch `gh-pages`:

```bash
npm run deploy
```

---

## 🎯 Convenções e Boas Práticas

- **Design System First:** Utilize sempre classes utilitárias do Tailwind e variáveis de tokens (`var(--token-...)`) em vez de valores "hardcoded" de cores ou medidas.
- **Acessibilidade:** Garanta contraste adequado (inclusive modo alto contraste) e suporte a navegação por teclado.
- **Simulação Fiel:** Mantenha dados de mock ricos e realistas para demonstrar o comportamento dos componentes sob diferentes volumes de dados.

---

<p align="center">
  Desenvolvido para o ecossistema educacional <b>MAPEAR</b>.
</p>
