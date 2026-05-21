export const mockAvaliacaoCultura = [
  {
    id: "T1",
    tarefa: "Tarefa 1: O Brasil no Dia a Dia: Cultura e Identidade",
    descricao: "O Brasil é marcado por uma grande diversidade cultural, visível nas festas populares, nos esportes, na música e nos hábitos cotidianos. Essas manifestações fazem parte da construção da identidade nacional e influenciam a forma como os brasileiros se relacionam entre si e com o espaço em que vivem. Compreender esses elementos é fundamental para reconhecer a pluralidade cultural do país.",
    itens: [
      {
        id: "item1",
        titulo: "Diversidade Cultural Brasileira",
        imagem: "/assets/RealizacaoDeTestes/pandeiroBrasil.jpg",
        descricao: "O Brasil é conhecido por sua diversidade cultural, resultado da mistura de povos indígenas, africanos, europeus e asiáticos. Essa diversidade aparece em festas, músicas, comidas e costumes regionais. Assinale a alternativa que melhor representa essa diversidade cultural:",
        tipo: "multipla_escolha_com_justificativa",
        alternativas: [
          { id: "A", texto: "Prática restrita a atletas profissionais" },
          { id: "B", texto: "Acesso facilitado e identificação popular" },
          { id: "C", texto: "Falta de outros esportes no país" },
          { id: "D", texto: "Proibição de práticas esportivas alternativas" },
          { id: "E", texto: "Acesso facilitado e identificação popular" }
        ],
        temJustificativa: true
      },
      {
        id: "item2",
        titulo: "Diversidade e Identidade Nacional",
        imagem: null,
        descricao: "Explique por que a diversidade cultural é considerada uma das principais características da identidade brasileira",
        tipo: "subjetiva",
        temJustificativa: false
      },
      {
        id: "item3",
        titulo: "Item 3: Futebol como Fenômeno Social",
        imagem: "/assets/RealizacaoDeTestes/bolaBrasil.jpg",
        descricao: "O futebol está presente em diferentes espaços da vida social brasileira, desde grandes eventos esportivos até brincadeiras de rua. O que ajuda a explicar essa popularidade? Após assinalar a alternativa, justifique sua escolha em até 3 linhas.",
        tipo: "multipla_escolha_com_justificativa",
        alternativas: [
          { id: "A", texto: "Prática restrita a atletas profissionais" },
          { id: "B", texto: "Acesso facilitado e identificação popular" },
          { id: "C", texto: "Falta de outros esportes no país" },
          { id: "D", texto: "Proibição de práticas esportivas alternativas" },
          { id: "E", texto: "Acesso facilitado e identificação popular" }
        ],
        temJustificativa: true
      },
      {
        id: "item4",
        titulo: "Futebol e Socialização",
        imagem: "/assets/RealizacaoDeTestes/meninosJogandoBola.jpg",
        descricao: "O futebol está presente em diferentes espaços da vida social brasileira, desde grandes eventos esportivos até brincadeiras de rua. O que ajuda a explicar essa popularidade? Após assinalar a alternativa, justifique sua escolha em até 3 linhas.",
        tipo: "subjetiva",
        temJustificativa: false
      }
    ]
  },
  {
    id: "T2",
    tarefa: "Tarefa 2: Meio Ambiente, Geografia e Sociedade",
    descricao: "O Brasil possui um território extenso e diverso, caracterizado por diferentes paisagens naturais, climas, biomas e formas de ocupação humana. Essas características influenciam diretamente os modos de vida da população, as práticas culturais, as atividades econômicas e a relação das pessoas com o meio ambiente. Compreender essa interação entre espaço geográfico, sociedade e natureza é essencial para desenvolver uma visão crítica sobre diversidade regional, qualidade de vida e sustentabilidade no país.",
    itens: [
      {
        id: "item5",
        titulo: "Item 5: Floresta Amazônica e Clima Global",
        imagem: "/assets/RealizacaoDeTestes/floresta.jpg",
        descricao: "A imagem representa a Floresta Amazônica, que:",
        tipo: "multipla_escolha",
        alternativas: [
          { id: "A", texto: "Possui baixa biodiversidade." },
          { id: "B", texto: "Influencia o clima do Brasil e de outros países." },
          { id: "C", texto: "Está localizada apenas no Sul do Brasil." },
          { id: "D", texto: "É um bioma desértico." },
          { id: "E", texto: "Está localizada apenas no Nordeste do Brasil." }
        ],
        temJustificativa: false
      },
      {
        id: "item6",
        titulo: "Importância Ambiental da Amazônia",
        descricao: "Explique por que a Floresta Amazônica é considerada importante para o equilíbrio ambiental.",
        tipo: "subjetiva",
        temJustificativa: false
      },
      {
        id: "item7",
        titulo: "Biomas Brasileiros",
        descricao: "Qual alternativa apresenta apenas biomas brasileiros?",
        tipo: "multipla_escolha",
        isBlockElement: true,
        blockContext: {
          image: "/assets/RealizacaoDeTestes/biomas.jpg",
          text: "O Brasil possui um território extenso e diverso, caracterizado por diferentes paisagens naturais, climas, biomas e formas de ocupação humana. Essas características influenciam diretamente os modos de vida da população, as práticas culturais, as atividades econômicas e a relação das pessoas com o meio ambiente. Compreender essa interação entre espaço geográfico, sociedade e natureza é essencial para desenvolver uma visão crítica sobre diversidade regional, qualidade de vida e sustentabilidade no país.",
        },
        alternativas: [
          { id: "A", texto: "Amazônia, Pantanal e Cerrado" },
          { id: "B", texto: "Deserto do Saara, Amazônia e Pampa" },
          { id: "C", texto: "Tundra, Pantanal e Cerrado" },
          { id: "D", texto: "Savana Africana, Caatinga e Floresta Boreal" },
          { id: "E", texto: "Mata Atlântica, Pampas e Pantanal" }
        ],
        temJustificativa: false
      },
      {
        id: "item8",
        titulo: "Relação Sociedade e Meio Ambiente",
        descricao: "A preservação dos biomas é importante porque:",
        tipo: "multipla_escolha",
        isBlockElement: true,
        blockContext: {
          image: "/assets/RealizacaoDeTestes/biomas.jpg",
          text: "O Brasil possui um território extenso e diverso, caracterizado por diferentes paisagens naturais, climas, biomas e formas de ocupação humana. Essas características influenciam diretamente os modos de vida da população, as práticas culturais, as atividades econômicas e a relação das pessoas com o meio ambiente. Compreender essa interação entre espaço geográfico, sociedade e natureza é essencial para desenvolver uma visão crítica sobre diversidade regional, qualidade de vida e sustentabilidade no país."
        },
        alternativas: [
          { id: "A", texto: "Dificulta a vida da população." },
          { id: "B", texto: "Garante recursos naturais para o futuro." },
          { id: "C", texto: "Impede o desenvolvimento humano." },
          { id: "D", texto: "Afeta apenas áreas rurais." },
          { id: "E", texto: "Impede o desenvolvimento humano." }
        ],
        temJustificativa: false
      }
    ]
  },
  {
    id: "T3",
    tarefa: "Tarefa 3: Curiosidades Históricas e Geográficas do Mundo",
    descricao: "Esta tarefa aborda conhecimentos gerais de história, geografia e cultura mundial, com ênfase em fatos curiosos que ajudam a desenvolver raciocínio histórico, cultural e geográfico. As questões incluem múltipla escolha, discursivas e híbridas, utilizando imagens, tabelas e vídeos para ampliar a compreensão. O objetivo é avaliar a capacidade do participante de interpretar informações, relacionar dados e justificar respostas.",
    itens: [
      {
        id: "item9",
        titulo: "Guerra dos Trinta Anos",
        descricao: "A Guerra dos Trinta Anos ocorreu na Europa Central entre 1618 e 1648. Observe a tabela com anos e identifique qual alternativa indica a duração correta:",
        tipo: "multipla_escolha_com_justificativa",
        table: {
          headers: ["Início", "Fim", "Duração Possível"],
          rows: [
            ["1618", "1643", "25 anos"],
            ["1618", "1648", "30 anos"],
            ["1617", "1648", "31 anos"],
            ["1617", "1648", "29 anos"]
          ]
        },
        alternativas: [
          { id: "A", texto: "25 anos" },
          { id: "B", texto: "30 anos" },
          { id: "C", texto: "31 anos" },
          { id: "D", texto: "29 anos" },
          { id: "E", texto: "27 anos" }
        ],
        temJustificativa: true
      },
      {
        id: "item10",
        titulo: "Origem do Chapéu do Panamá",
        imagem: "/assets/RealizacaoDeTestes/chapeu.jpg",
        descricao: "Apesar do nome, o tradicional Chapéu Panamá não é fabricado no Panamá. Ele é feito artesanalmente a partir da fibra de palmeira toquilla, conhecida por sua leveza e trama fina. Assinale a alternativa que indica corretamente o país de origem deste chapéu.",
        notice: {
          text: "O vídeo a seguir mostra o processo artesanal de produção do Chapéu Panamá:",
          videoUrl: "https://www.youtube.com/embed/lRQiW1J59-k"
        },
        tipo: "multipla_escolha_com_justificativa",
        alternativas: [
          { id: "A", texto: "Panamá" },
          { id: "B", texto: "Equador" },
          { id: "C", texto: "Colômbia" },
          { id: "D", texto: "Costa Rica" },
          { id: "E", texto: "Peru" }
        ],
        temJustificativa: true
      },
      {
        id: "item11",
        titulo: "Caixa Preta de Aviões",
        descricao: "A “Caixa Preta” é um equipamento essencial para registrar dados de voo e informações do piloto em aviões comerciais e militares. Apesar do nome popular, sua cor não é preta. Ela é feita para ser facilmente localizada após acidentes, mesmo em ambientes com fogo, lama ou destroços. Assinale a cor correta da Caixa Preta e explique, em até 2 linhas, por que essa cor é utilizada.",
        warningBox: "Observação: Pense no objetivo do equipamento, não apenas no nome popular.",
        tipo: "multipla_escolha_com_justificativa",
        alternativas: [
          { id: "A", texto: "Preta" },
          { id: "B", texto: "Branca" },
          { id: "C", texto: "Vermelha" },
          { id: "D", texto: "Laranja" },
          { id: "E", texto: "Verde" }
        ],
        temJustificativa: true
      },
      {
        id: "item12",
        titulo: "Escovas de Pelo de Camelo",
        imagem: "/assets/RealizacaoDeTestes/pincel.jpg",
        descricao: "As escovas de pelo de camelo são tradicionalmente utilizadas para pintura artística, maquiagem profissional e cuidados com tecidos delicados. O pelo utilizado é escolhido por sua suavidade, durabilidade e capacidade de não danificar superfícies. As escovas de pelo de camelo são tradicionalmente feitas com pelo de qual animal?",
        tipo: "multipla_escolha",
        alternativas: [
          { id: "A", texto: "Pelo de Cavalo (Pônei/Cabra)" },
          { id: "B", texto: "Pelo de Cachorro" },
          { id: "C", texto: "Pelo de Camelo" },
          { id: "D", texto: "Pelo de Camaleão" },
          { id: "E", texto: "Pelo de Crocodilo" }
        ],
        temJustificativa: false
      }
    ]
  }
];
