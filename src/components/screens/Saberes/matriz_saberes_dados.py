import pandas as pd
import random

# Seed for reproducibility
random.seed(42)

# Pools of data for generation
componentes = ['Matemática', 'Língua Portuguesa', 'Ciências da Natureza']

dominios_cognitivos = ['Reconhecer', 'Compreender', 'Aplicar', 'Analisar', 'Avaliar', 'Criar', 'Raciocinar']

dominios_repertorio = {
    'Matemática': ['Aritmética', 'Álgebra e Funções', 'Geometria', 'Grandezas e Medidas', 'Probabilidade e Estatística'],
    'Língua Portuguesa': ['Leitura', 'Produção de Textos', 'Oralidade', 'Análise Linguística/Semiótica'],
    'Ciências da Natureza': ['Matéria e Energia', 'Vida e Evolução', 'Terra e Universo']
}

conhecimentos = {
    'Aritmética': ['Números Naturais', 'Frações', 'Decimais', 'Operações Básicas'],
    'Álgebra e Funções': ['Padrões Numéricos', 'Expressões Algébricas', 'Equações de 1º Grau', 'Funções Lineares'],
    'Geometria': ['Figuras Planas', 'Sólidos Geométricos', 'Plano Cartesiano', 'Transformações Geométricas'],
    'Grandezas e Medidas': ['Sistema Monetário', 'Tempo e Calendário', 'Comprimento, Massa e Capacidade', 'Área e Perímetro'],
    'Probabilidade e Estatística': ['Leitura de Gráficos', 'Cálculo de Probabilidade', 'Média, Moda e Mediana'],
    'Leitura': ['Compreensão de Textos Narrativos', 'Textos Jornalísticos', 'Poemas e Canções', 'Textos Argumentativos'],
    'Produção de Textos': ['Escrita de Contos', 'Redação de Notícias', 'Produção de Resenhas', 'Textos Dissertativos'],
    'Oralidade': ['Apresentação Oral', 'Debates', 'Declamação', 'Escuta Ativa'],
    'Análise Linguística/Semiótica': ['Ortografia', 'Morfologia', 'Sintaxe', 'Figuras de Linguagem'],
    'Matéria e Energia': ['Propriedades dos Materiais', 'Transformações Químicas', 'Circuitos Elétricos', 'Fontes de Energia'],
    'Vida e Evolução': ['Células', 'Corpo Humano', 'Ecossistemas', 'Evolução das Espécies'],
    'Terra e Universo': ['Sistema Solar', 'Estações do Ano', 'Rochas e Solo', 'Clima e Tempo']
}

verbos = {
    'Reconhecer': ['Identificar', 'Nomear', 'Listar', 'Reconhecer', 'Apontar'],
    'Compreender': ['Descrever', 'Explicar', 'Classificar', 'Interpretar', 'Discutir'],
    'Aplicar': ['Resolver', 'Calcular', 'Utilizar', 'Demonstrar', 'Aplicar'],
    'Analisar': ['Comparar', 'Diferenciar', 'Investigar', 'Analisar', 'Examinar'],
    'Avaliar': ['Julgar', 'Argumentar', 'Avaliar', 'Criticar', 'Justificar'],
    'Criar': ['Construir', 'Elaborar', 'Projetar', 'Criar', 'Inventar'],
    'Raciocinar': ['Deduzir', 'Concluir', 'Inferir', 'Esquematizar', 'Raciocinar']
}

data = []
all_codes = []

# Generate 150 rows of data
for i in range(1, 151):
    comp = random.choice(componentes)
    
    # Generate code like EF06MA15, EF08LP03...
    ano = random.randint(1, 9)
    comp_sigla = 'MA' if comp == 'Matemática' else 'LP' if comp == 'Língua Portuguesa' else 'CI'
    codigo = f"EF{ano:02d}{comp_sigla}{i:02d}"
    all_codes.append(codigo)
    
    dom_cog = random.choice(dominios_cognitivos)
    dom_rep = random.choice(dominios_repertorio[comp])
    conh = random.choice(conhecimentos[dom_rep])
    
    verbo = random.choice(verbos[dom_cog])
    descricao = f"{verbo} conceitos de {conh.lower()} em situações variadas, demonstrando proficiência no domínio de {dom_rep.lower()}."
    
    data.append({
        'Componente Curricular': comp,
        'Domínio/Processo Cognitivo': dom_cog,
        'Domínio de Repertório': dom_rep,
        'Conhecimento': conh,
        'Código da Habilidade': codigo,
        'Descrição da Habilidade': descricao,
        'Relações entre Habilidades': '' # Will fill later
    })

# Add some relationships
for row in data:
    if random.random() > 0.6: # 40% chance of having a relation
        num_rels = random.randint(1, 3)
        rels = random.sample(all_codes, num_rels)
        # Prevent self-reference
        if row['Código da Habilidade'] in rels:
            rels.remove(row['Código da Habilidade'])
        row['Relações entre Habilidades'] = ', '.join(rels)

df = pd.DataFrame(data)

# Sort logically by Component and then by Code
df = df.sort_values(by=['Componente Curricular', 'Código da Habilidade'])

# Export to CSV (Excel compatible)
filename = 'matriz_saberes_teste_sistema.csv'
df.to_csv(filename, index=False, encoding='utf-8-sig', sep=';')
print(f"Generated {len(df)} rows in {filename}")
df.head()