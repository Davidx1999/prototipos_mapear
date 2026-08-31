/**
 * Mock data para o Editor de Avaliações do MAPEAR.
 * Segue estritamente a hierarquia: Avaliação -> Teste -> Tarefa -> Item (com suporte a Item Composto).
 * Preserva 100% dos dados pedagógicos exigidos (BNCC, Processos Cognitivos, Rubricas, Distratores).
 */

export const COGNITIVE_PROCESSES = [
  'Avaliar',
  'Classificar',
  'Compreender elementos',
  'Conectar',
  'Conjecturar / Inferir',
  'Determinar',
  'Diferenciar',
  'Distinguir',
  'Efetuar procedimentos',
  'Explicar',
  'Explicar / justificar',
  'Expressar-se e comunicar',
  'Formular estratégias',
  'Generalizar / abstrair',
  'Lembrar / Reconhecer',
  'Analisar',
  'Criar / Produzir'
];

export const RESPONSE_TYPES = [
  { id: 'multipla_escolha', label: 'Múltipla Escolha' },
  { id: 'resposta_construida', label: 'Resposta Construída' },
  { id: 'hibrida', label: 'Híbrida' }
];

export const BNCC_SKILLS_DATABASE = [
  // Língua Portuguesa
  { id: 'EF05LP01', area: 'Língua Portuguesa', ano: '5º Ano', desc: 'Grafar palavras utilizando regras de correspondência fonema-grafema regulares contextuais e morfológicas.' },
  { id: 'EF05LP02', area: 'Língua Portuguesa', ano: '5º Ano', desc: 'Identificar o caráter polissêmico das palavras (uma mesma palavra com diferentes significados) em contextos de leitura.' },
  { id: 'EF05LP03', area: 'Língua Portuguesa', ano: '5º Ano', desc: 'Localizar informações explícitas em textos de diferentes gêneros textuais.' },
  { id: 'EF05LP04', area: 'Língua Portuguesa', ano: '5º Ano', desc: 'Inferir o sentido de palavras ou expressões desconhecidas em textos, com base no contexto da frase ou do texto.' },
  { id: 'EF05LP05', area: 'Língua Portuguesa', ano: '5º Ano', desc: 'Inferir a intenção do autor com o uso de recursos persuasivos em textos argumentativos e publicitários.' },
  { id: 'EF05LP09', area: 'Língua Portuguesa', ano: '5º Ano', desc: 'Ler e compreender, com autonomia, textos instrucionais de regras de jogo e procedimentos cotidianos.' },
  { id: 'EF05LP10', area: 'Língua Portuguesa', ano: '5º Ano', desc: 'Inferir informações implícitas nos textos lidos (mensagens subentendidas, causa-consequência).' },
  { id: 'EF05LP11', area: 'Língua Portuguesa', ano: '5º Ano', desc: 'Identificar a ideia central do texto, demonstrando compreensão global do tema.' },
  { id: 'EF05LP12', area: 'Língua Portuguesa', ano: '5º Ano', desc: 'Produzir textos com coesão, coerência, progressão temática e adequada paragrafação.' },
  { id: 'EF05LP26', area: 'Língua Portuguesa', ano: '5º Ano', desc: 'Identificar e diferenciar classes de palavras: substantivos, adjetivos, verbos e pronomes.' },
  { id: 'EF05LP27', area: 'Língua Portuguesa', ano: '5º Ano', desc: 'Utilizar regras de concordância verbal e nominal adequadas à norma-padrão.' },

  // Matemática
  { id: 'EF05MA01', area: 'Matemática', ano: '5º Ano', desc: 'Ler, escrever e ordenar números naturais até a ordem das centenas de milhar.' },
  { id: 'EF05MA03', area: 'Matemática', ano: '5º Ano', desc: 'Identificar frações equivalentes em representações pictóricas e na reta numérica.' },
  { id: 'EF05MA07', area: 'Matemática', ano: '5º Ano', desc: 'Resolver problemas de adição e subtração com números naturais e racionais na forma decimal.' },
  { id: 'EF05MA08', area: 'Matemática', ano: '5º Ano', desc: 'Resolver problemas de multiplicação e divisão com números naturais envolvendo diferentes significados.' },
  { id: 'EF05MA24', area: 'Matemática', ano: '5º Ano', desc: 'Interpretar dados estatísticos apresentados em textos, tabelas simples e de dupla entrada e gráficos.' },

  // Ciências
  { id: 'EF05CI01', area: 'Ciências', ano: '5º Ano', desc: 'Explorar fenômenos da vida cotidiana que evidenciem propriedades físicas da matéria.' },
  { id: 'EF05CI02', area: 'Ciências', ano: '5º Ano', desc: 'Aplicar os conhecimentos sobre as mudanças de estado físico da água para explicar o ciclo hidrológico.' },
  { id: 'EF05CI04', area: 'Ciências', ano: '5º Ano', desc: 'Identificar os principais usos da água e propor formas sustentáveis de consumo consciente.' }
];

export const INITIAL_ASSESSMENT_DATA = {
  id: 'AV-SOB-2026-0042',
  code: 'AV-SOB-2026-0042',
  title: 'Avaliação Somativa de Língua Portuguesa - 5º Ano',
  schoolYear: '2026',
  municipality: 'Sobral',
  grade: '5º Ano - Ensino Fundamental',
  subject: 'Língua Portuguesa',
  type: 'Somativa',
  correctionMethod: 'Correção com IA (HTR)',
  applicationMode: 'Impressa',
  status: 'Em edição',
  owner: 'Coordenação Pedagógica - SEDUC',
  lastModified: '2026-08-25T09:45:00',
  tests: [
    {
      id: 'teste-1',
      code: 'CAD-01',
      title: 'Caderno 01 - Leitura e Interpretação Textual',
      tasks: [
        {
          id: 'tar-1',
          code: 'TAR-01',
          title: 'Tarefa 01: Compreensão Leitora de Texto Narrativo',
          knowledgeArea: 'Leitura e Interpretação',
          hasItemComposto: true,
          itemComposto: {
            title: 'Texto Base: "O Menino e o Rio"',
            author: 'Autoria Coletiva Mapear',
            genre: 'Conto Narrativo',
            content: `### O Menino e o Rio\n\nEra uma vez um menino chamado Lucas que morava às margens do **Rio Acaraú**. Todas as tardes, após a escola, ele caminhava até a velha ponte de madeira para observar o movimento das águas e os pássaros que pousavam nos galhos dos ingazeiros.\n\nCerto dia, percebeu que o espelho d'água refletia uma coloração diferente, e que pequenos barquinhos de papel desciam a correnteza trazendo mensagens misteriosas dobradas com cuidado. Curioso, esticou uma longa vara de bambu e conseguiu resgatar o primeiro bilhete molhado. Nele estava escrito com tinta azul: *"O segredo da nascente só se revela para quem sabe escutar o silêncio da mata."*`
          },
          items: [
            {
              id: 'it-01',
              code: 'Item 01',
              title: 'Item 01 - Localização de Informação Explícita',
              type: 'multipla_escolha',
              status: 'completo',
              // 1. Conteúdo
              enunciado: 'De acordo com o texto *"O Menino e o Rio"*, para onde Lucas costumava caminhar todas as tardes após as aulas?',
              contexto: 'Texto base "O Menino e o Rio" (apresentado no início da Tarefa 01).',
              respostaEsperada: 'Para a velha ponte de madeira às margens do Rio Acaraú.',
              alternativas: [
                {
                  id: 'alt-a',
                  letra: 'A',
                  texto: 'Para o centro da cidade em busca de barquinhos de papel.',
                  isCorreta: false,
                  analiseDistrator: 'Distrator: Confunde a ação posterior de encontrar os barquinhos com o destino rotineiro do personagem.'
                },
                {
                  id: 'alt-b',
                  letra: 'B',
                  texto: 'Para a velha ponte de madeira às margens do rio.',
                  isCorreta: true,
                  analiseDistrator: 'Gabarito Oficial: O estudante localiza a informação explícita no primeiro parágrafo do texto.'
                },
                {
                  id: 'alt-c',
                  letra: 'C',
                  texto: 'Para a nascente do rio no meio da floresta fechada.',
                  isCorreta: false,
                  analiseDistrator: 'Distrator: Associa erroneamente a menção à nascente presente no bilhete com o local da caminhada.'
                },
                {
                  id: 'alt-d',
                  letra: 'D',
                  texto: 'Para a casa de amigos após a saída da escola.',
                  isCorreta: false,
                  analiseDistrator: 'Distrator: Extrapolação plausível da vida cotidiana do estudante sem respaldo no texto narrativo.'
                }
              ],
              // 2. Classificação Pedagógica
              habilidadeBNCC: {
                id: 'EF05LP03',
                desc: 'Localizar informações explícitas em textos de diferentes gêneros textuais.'
              },
              sentencaDescritora: 'Localizar e recuperar informações explícitas em texto narrativo ficcional, identificando personagens, tempo, espaço e ações descritas de forma literal no enredo.',
              processosCognitivosSentenca: ['Lembrar', 'Compreender'],
              areaConhecimento: 'Leitura e Interpretação',
              // 3. Critérios de Avaliação
              rubricas: {
                insuficiente: 'O estudante seleciona distratores que indicam leitura desatenta ou não localiza a informação no primeiro parágrafo.',
                parcial: 'Não se aplica diretamente a item de múltipla escolha com escolha única.',
                suficiente: 'O estudante identifica corretamente a alternativa B, demonstrando domínio pleno da habilidade de localização explícita.'
              },
              gabarito: 'B',
              orientacaoCorrecao: 'Item objetivo de escolha única. Pontuação binária (1,0 ou 0,0 ponto).'
            },
            {
              id: 'it-02',
              code: 'Item 02',
              title: 'Item 02 - Inferência de Sentido e Vocabulário',
              type: 'multipla_escolha',
              status: 'completo',
              // 1. Conteúdo
              enunciado: 'No trecho: *"Certo dia, percebeu que o **espelho d\'água** refletia uma coloração diferente..."*, a expressão em destaque refere-se:',
              contexto: 'Texto base "O Menino e o Rio" - Segundo parágrafo.',
              respostaEsperada: 'À superfície calma e brilhante da água do rio.',
              alternativas: [
                {
                  id: 'alt-a',
                  letra: 'A',
                  texto: 'A um objeto de vidro colocado no fundo do leito do rio.',
                  isCorreta: false,
                  analiseDistrator: 'Distrator: Interpretação literal e ingênua da palavra "espelho".'
                },
                {
                  id: 'alt-b',
                  letra: 'B',
                  texto: 'À superfície lisa e calma da água que reflete a luz.',
                  isCorreta: true,
                  analiseDistrator: 'Gabarito Oficial: O estudante compreende a metáfora poética usual na língua portuguesa.'
                },
                {
                  id: 'alt-c',
                  letra: 'C',
                  texto: 'Ao reflexo dos ingazeiros quando o sol está se pondo.',
                  isCorreta: false,
                  analiseDistrator: 'Distrator: Confunde o elemento causador do reflexo com o próprio meio aquático.'
                },
                {
                  id: 'alt-d',
                  letra: 'D',
                  texto: 'A uma poça de água formada pelas chuvas recentes na ponte.',
                  isCorreta: false,
                  analiseDistrator: 'Distrator: Suposição incorreta desconectada do contexto do rio principal.'
                }
              ],
              // 2. Classificação Pedagógica
              habilidadeBNCC: {
                id: 'EF05LP04',
                desc: 'Inferir o sentido de palavras ou expressões desconhecidas em textos.'
              },
              sentencaDescritora: 'Inferir o sentido de palavras ou expressões figuradas em textos literários, estabelecendo relações semânticas e contextuais a partir das pistas fornecidas pela narrativa.',
              processosCognitivosSentenca: ['Compreender', 'Analisar'],
              areaConhecimento: 'Linguagem e Metáfora',
              // 3. Critérios de Avaliação
              rubricas: {
                insuficiente: 'Interpretação estritamente literal do termo "espelho".',
                parcial: 'Reconhece o reflexo mas não identifica o elemento água.',
                suficiente: 'Compreende a linguagem figurada associando o espelho d\'água à superfície do rio.'
              },
              gabarito: 'B',
              orientacaoCorrecao: 'Item objetivo. Chave B.'
            },
            {
              id: 'it-03',
              code: 'Item 03',
              title: 'Item 03 - Resposta Construída sobre Causa e Efeito',
              type: 'resposta_construida',
              status: 'completo',
              // 1. Conteúdo
              enunciado: 'Explique por que Lucas utilizou uma vara de bambu e qual foi o resultado dessa ação segundo a narrativa.',
              contexto: 'Texto base "O Menino e o Rio" - Segundo parágrafo.',
              respostaEsperada: 'Lucas utilizou a vara de bambu para alcançar e resgatar o barquinho de papel que descia pela correnteza do rio, conseguindo ler o bilhete misterioso.',
              alternativas: [],
              // 2. Classificação Pedagógica
              habilidadeBNCC: {
                id: 'EF05LP10',
                desc: 'Inferir informações implícitas nos textos lidos.'
              },
              sentencaDescritora: 'Estabelecer relações de causa, efeito e finalidade entre os fatos e as ações dos personagens em uma narrativa contínua, redigindo resposta coerente com base em evidências textuais.',
              processosCognitivosSentenca: ['Analisar', 'Avaliar'],
              areaConhecimento: 'Compreensão Narrativa e Coesão',
              // 3. Critérios de Avaliação
              rubricas: {
                insuficiente: 'Não identifica o motivo da ação de Lucas ou apenas repete que ele usou uma vara sem explicar a finalidade.',
                parcial: 'Explica que ele usou para pegar o barquinho, mas omite o resgate do bilhete ou a consequência na narrativa.',
                suficiente: 'Articula claramente o motivo (alcançar o barquinho na correnteza) e o resultado obtido (ler a mensagem misteriosa).'
              },
              gabarito: 'Resposta discursiva com rubrica de 3 níveis (0, 1, 2 pontos).',
              orientacaoCorrecao: 'Correção assistida por IA (HTR) com validação de termos-chave: "barco/barquinho", "água/correnteza", "resgatar/pegar", "mensagem/bilhete".'
            }
          ]
        },
        {
          id: 'tar-2',
          code: 'TAR-02',
          title: 'Tarefa 02: Interpretação de Poema e Recursos Sonoros',
          knowledgeArea: 'Poesia e Estilo',
          hasItemComposto: false,
          items: [
            {
              id: 'it-04',
              code: 'Item 04',
              title: 'Item 04 - Identificação de Rimas e Recursos Poéticos',
              type: 'multipla_escolha',
              status: 'completo',
              enunciado: 'Leia os versos abaixo:\n\n*"A água que corre cantando na pedra,*\n*É chuva que cai e a terra que medra."*\n\nA palavra **"medra"** nos versos tem o sentido de:',
              contexto: 'Poema "Canto da Chuva".',
              respostaEsperada: 'Crescer, florescer ou desenvolver-se.',
              alternativas: [
                { id: 'alt-a', letra: 'A', texto: 'Secar com o calor intenso do sol.', isCorreta: false, analiseDistrator: 'Distrator: Sentido oposto ao contexto de fertilidade da chuva.' },
                { id: 'alt-b', letra: 'B', texto: 'Crescer, desenvolver-se e produzir vida.', isCorreta: true, analiseDistrator: 'Gabarito Oficial: O estudante infere pelo contexto de chuva na terra.' },
                { id: 'alt-c', letra: 'C', texto: 'Ficar alagada e estragar as plantações.', isCorreta: false, analiseDistrator: 'Distrator: Associação negativa infundada.' },
                { id: 'alt-d', letra: 'D', texto: 'Congelar durante o inverno rigoroso.', isCorreta: false, analiseDistrator: 'Distrator: Fora de contexto climático regional.' }
              ],
              habilidadeBNCC: {
                id: 'EF05LP04',
                desc: 'Inferir o sentido de palavras ou expressões desconhecidas em textos.'
              },
              sentencaDescritora: 'Inferir o significado de termos poéticos e arcaicos a partir da composição rítmica e do campo temático de fertilidade da natureza apresentado nos versos.',
              processosCognitivosSentenca: ['Compreender'],
              areaConhecimento: 'Vocabulário e Poesia',
              rubricas: {
                insuficiente: 'Não compreende o vocábulo arcaico ou poético.',
                parcial: 'Não se aplica a item objetivo.',
                suficiente: 'Identifica o significado correto a partir do contexto lírico.'
              },
              gabarito: 'B',
              orientacaoCorrecao: 'Item de escolha única.'
            }
          ]
        }
      ]
    },
    {
      id: 'teste-2',
      code: 'CAD-02',
      title: 'Caderno 02 - Gramática Aplicada e Sintaxe',
      tasks: [
        {
          id: 'tar-3',
          code: 'TAR-03',
          title: 'Tarefa 03: Concordância Verbal e Classes de Palavras',
          knowledgeArea: 'Gramática e Análise Linguística',
          hasItemComposto: false,
          items: [
            {
              id: 'it-05',
              code: 'Item 05',
              title: 'Item 05 - Concordância Sujeito e Verbo',
              type: 'multipla_escolha',
              status: 'completo',
              enunciado: 'Assinale a alternativa em que a frase apresenta a concordância verbal correta de acordo com a norma-padrão da língua portuguesa:',
              contexto: 'Frases isoladas para análise sintática.',
              respostaEsperada: 'Os estudantes e os professores organizaram a feira de ciências.',
              alternativas: [
                { id: 'alt-a', letra: 'A', texto: 'Os estudante chegou atrasados para a aula.', isCorreta: false, analiseDistrator: 'Distrator: Erro de plural no sujeito e no verbo.' },
                { id: 'alt-b', letra: 'B', texto: 'Os estudantes e os professores organizaram a feira.', isCorreta: true, analiseDistrator: 'Gabarito Oficial: Sujeito composto no plural concorda com o verbo no plural.' },
                { id: 'alt-c', letra: 'C', texto: 'Fazem dois anos que a escola foi reformada.', isCorreta: false, analiseDistrator: 'Distrator: Erro no verbo fazer indicando tempo decorrido (impessoal).' },
                { id: 'alt-d', letra: 'D', texto: 'Houveram muitos problemas durante o evento.', isCorreta: false, analiseDistrator: 'Distrator: Erro no verbo haver no sentido de existir (impessoal).' }
              ],
              habilidadeBNCC: {
                id: 'EF05LP27',
                desc: 'Utilizar regras de concordância verbal e nominal adequadas à norma-padrão.'
              },
              sentencaDescritora: 'Reconhecer e aplicar regras de concordância verbal da norma-padrão com sujeito composto e verbos impessoais em situações formais de escrita.',
              processosCognitivosSentenca: ['Aplicar', 'Analisar'],
              areaConhecimento: 'Sintaxe e Concordância',
              rubricas: {
                insuficiente: 'Não reconhece desvios de concordância verbal elementares.',
                parcial: 'Não se aplica a item objetivo.',
                suficiente: 'Identifica com precisão a oração em conformidade com a norma-padrão.'
              },
              gabarito: 'B',
              orientacaoCorrecao: 'Item objetivo.'
            },
            {
              id: 'it-06',
              code: 'Item 06',
              title: 'Item 06 - Híbrida: Classificação e Justificativa Gramatical',
              type: 'hibrida',
              status: 'completo',
              enunciado: '1. Identifique a classe gramatical da palavra destacada na frase: *"Lucas caminhava **vagarosamente** pela margem do rio."*\n\n2. Em seguida, reescreva a oração substituindo o termo destacado por uma locução com o mesmo sentido.',
              contexto: 'Análise morfológica e paráfrase.',
              respostaEsperada: '1. Advérbio de modo. 2. "Lucas caminhava com calma / com lentidão / sem pressa pela margem do rio."',
              alternativas: [
                { id: 'alt-a', letra: 'A', texto: 'Adjetivo de intensidade', isCorreta: false, analiseDistrator: 'Distrator: Confunde advérbio com adjetivo qualificativo.' },
                { id: 'alt-b', letra: 'B', texto: 'Advérbio de modo', isCorreta: true, analiseDistrator: 'Gabarito da parte objetiva.' },
                { id: 'alt-c', letra: 'C', texto: 'Substantivo abstrato', isCorreta: false, analiseDistrator: 'Distrator: Erro de identificação morfológica.' },
                { id: 'alt-d', letra: 'D', texto: 'Pronome demonstrativo', isCorreta: false, analiseDistrator: 'Distrator: Erro categórico de classe.' }
              ],
              habilidadeBNCC: {
                id: 'EF05LP26',
                desc: 'Identificar e diferenciar classes de palavras: substantivos, adjetivos, verbos e pronomes.'
              },
              sentencaDescritora: 'Diferenciar classes gramaticais invariáveis (advérbios) e produzir paráfrases morfossintáticas equivalentes mantendo o sentido original da oração.',
              processosCognitivosSentenca: ['Analisar', 'Criar'],
              areaConhecimento: 'Morfologia e Reescrita',
              rubricas: {
                insuficiente: 'Erra a identificação da classe gramatical e a substituição.',
                parcial: 'Acerta a identificação (advérbio) mas não formula a locução adverbial corretamente.',
                suficiente: 'Acerta a classe gramatical e reescreve a frase com locução adverbial equivalente (ex: "com lentidão").'
              },
              gabarito: 'Parte 1: B (Advérbio). Parte 2: Locução adverbial correspondente.',
              orientacaoCorrecao: 'Item híbrido (0,5 ponto para a alternativa correta + 0,5 ponto para a reescrita).'
            }
          ]
        }
      ]
    }
  ]
};
