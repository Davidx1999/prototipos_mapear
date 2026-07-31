---
name: design-system
description: Diretrizes de construção, tokens de design (Raw, Tokens, Components), mapeamento Tailwind CSS, controle de temas e regras de nomenclatura/rótulos para o ecossistema MAPEAR.
---

# SKILL: MAPEAR Design System & Regras de Construção UI

Esta skill estabelece a arquitetura oficial, regras de nomenclatura, hierarquia de variáveis e diretrizes de desenvolvimento para a interface do ecossistema MAPEAR.

---

## 1. Regra Fundamental da Arquitetura de Variables

O Design System MAPEAR é estruturado em 3 camadas estritas:

```
[ MAPEAR Raw ]  ──►  [ MAPEAR Tokens ]  ──►  [ MAPEAR Components ]
(Fonte Primária)      (Semântica & Temas)    (Métricas & Dispositivos)
```

1. **`MAPEAR Raw` (Arquivo Primário)**:
   - Contém os valores hexadecimais puros, tamanhos numéricos em pixels (`unit/*`) e nomes de fontes (`typo/*`).
   - **REGRA**: É proibido alterar tokens semânticos sem antes validar ou adicionar o valor correspondente no `Raw`.
2. **`MAPEAR Tokens` (Camada Semântica & Temas)**:
   - Mapeia o uso funcional da interface (Background, Botões, Textos, Ícones, Bordas, Badges, Status).
   - Suporta os temas:
     - `FGV Light` (`data-theme="fgv-light"`)
     - `FGV Dark` (`data-theme="fgv-dark"`)
     - `FGV High Contrast` (`data-theme="fgv-high-contrast"`)
     - `CEnPE Light` (`data-theme="cenpe-light"`)
     - `CEnPE Dark` (`data-theme="cenpe-dark"`)
     - `CEnPE High Contrast` (`data-theme="cenpe-high-contrast"`)
3. **`MAPEAR Components` (Métricas de Dispositivos)**:
   - Define alturas, min-widths e tamanhos responsivos de componentes (`Desktop`, `Tablet`, `Mobile`).

---

## 2. Regras Estritas de Nomenclatura e Rótulos (Copywriting / UI Text)

Ao construir ou refatorar qualquer texto, componente, tabela, modal ou formulário na interface do MAPEAR, as seguintes regras de terminologia **DEVEM ser rigorosamente respeitadas**:

| Termo Proibido (Incorreto) | Termo Obrigatório (Correto) | Contexto / Exemplo |
| :--- | :--- | :--- |
| Cidade | **Município** | "Selecione o Município", "Filtro por Município" |
| Prova | **Avaliação** ou **Teste** | "Caderno de Avaliação", "Resultado do Teste" |
| Questão | **Item** | "Item 05", "Acertos por Item" |
| Aluno | **Estudante** | "Lista de Estudantes", "Desempenho do Estudante" |

> [!IMPORTANT]
> **Consistência de Rótulos**: Nunca utilize termos proibidos em placeholders, labels de inputs, cabeçalhos de tabelas, botões, modais ou mensagens de erro.

---

## 3. Mapeamento do Tailwind CSS & Variáveis CSS

Para garantir acessibilidade e suporte a múltiplos temas, **nunca utilize cores hexadecimais hardcoded** nos componentes (ex: `bg-[#0078B0]`). Utilize sempre as classes do Tailwind configuradas ou as variáveis CSS.

### Tabela de Classes Tailwind vs. Tokens Semânticos

| Categoria | Classe Tailwind | Variável CSS Subjacente | Descrição |
| :--- | :--- | :--- | :--- |
| **Background Layout** | `bg-bg-layout` | `--color-backgrounds-color-bg-layout` | Fundo principal da página |
| **Background Container** | `bg-bg-container` | `--color-backgrounds-color-bg-container` | Cards, painéis e contêineres |
| **Background Elevado** | `bg-bg-elevated` | `--color-backgrounds-color-bg-elevated` | Modais, dropdowns e popovers |
| **Texto Título** | `text-textIcon-heading` | `--color-text-icon-color-text-heading` | Cabeçalhos e títulos |
| **Texto Corpo** | `text-textIcon-main` | `--color-text-icon-color-text` | Texto padrão |
| **Texto Descrição** | `text-textIcon-description` | `--color-text-icon-color-text-description` | Subtítulos e legendas |
| **Botão Primário BG** | `bg-button-primary-bg` | `--color-button-solid-primary-color-primary-bg` | Cor de fundo do botão primário |
| **Botão Primário Hover** | `hover:bg-button-primary-hover` | `--color-button-solid-primary-color-primary-bg-hover` | Estado hover |
| **Botão Primário Texto** | `text-button-primary-text` | `--color-button-solid-primary-color-primary-text-button` | Cor de texto do botão primário |
| **Borda Padrão** | `border-border` | `--color-border-color-border` | Bordas de cards e divisores |
| **Borda Destaque** | `border-border-accent` | `--color-border-color-border-accent` | Bordas ativas ou selecionadas |
| **Raio de Borda (MD)** | `rounded-md` | `--border-radius-md` | Arredondamento secundário |
| **Raio de Borda (8px)** | `rounded-lg` / `rounded-[8px]` | `--border-radius-lg` | Arredondamento obrigatório de 8px para cards, painéis, inputs, dropdowns e contêineres que não sejam botões |

> [!IMPORTANT]
> **Regra de Border Radius**: Sempre utilize 8px de border radius (`rounded-lg` ou `rounded-[8px]`) em elementos estruturais que **não sejam botões** (cards, painéis, inputs, selects, contêineres, avisos e modais). Botões devem manter suas classes de arredondamento específicas do design system.

---

## 4. Template de Referência de Regras Baseado no Raw

O arquivo `MAPEAR Raw/font-family.tokens.json` é a base primária. A estrutura de referência para consulta e expansão de tokens é:

```json
{
  "color": {
    "primary": {
      "fgv": { "50": "#F2FAFE", "500": "#008BC9", "600": "#0078B0", "900": "#002C5E" },
      "cenpe": { "50": "#F2F5FF", "500": "#365BDC", "600": "#284AC2", "900": "#002C5E" }
    },
    "neutral": {
      "0-000": "#FFFFFF",
      "1-050": "#F7F8FA",
      "2-200": "#DEE1E8",
      "3-300": "#CACDD5",
      "4-500": "#969DA9",
      "5-700": "#677080",
      "6-900": "#1D2432",
      "7-950": "#0F1113"
    },
    "semantic": {
      "warning": { "base": "#E00120", "light": "#FFACB7" },
      "success": { "base": "#34C759", "light": "#B8EBAD" },
      "caution": { "base": "#FFD352", "light": "#FEF0C7" },
      "info": { "base": "#489EEA", "light": "#B3E6F5" }
    }
  },
  "unit": {
    "00": 0,
    "10": 4,
    "20": 8,
    "30": 12,
    "40": 16,
    "50": 20,
    "60": 24,
    "80": 32,
    "100": 40,
    "120": 48,
    "140": 56,
    "half-05": 2,
    "full": 9999
  },
  "typo": {
    "fgvFontFamily": "Montserrat",
    "cenpeFontFamily": "Montserrat"
  }
}
```

---

## 5. Diretrizes para a IA na Criação de Componentes UI

Ao responder solicitações do usuário ou implementar novos componentes:
1. **Verificação de Tokens**: Verifique se o componente consome `--color-*`, `--border-*` ou `--padding-*`.
2. **Nomenclatura**: Substitua automaticamente termos legados no código ou em textos gerados (`Cidade` -> `Município`, `Prova` -> `Avaliação/Teste`, `Questão` -> `Item`, `Aluno` -> `Estudante`).
3. **Temas**: Garanta que o componente responda ao seletor `data-theme` ou à classe `dark`.
4. **Build dos Tokens**: Sempre que novos tokens JSON forem adicionados ao repositório, execute `npm run build:tokens`.
