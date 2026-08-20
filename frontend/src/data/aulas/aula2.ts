import type { Aula } from '../types'

export const aula2: Aula = {
  id: 'aula-2',
  number: 2,
  emoji: '🔎',
  title: 'Como analisar uma empresa',
  shortTitle: 'Analisar uma empresa',
  objective: 'Ensinar os fundamentos básicos da análise fundamentalista.',
  color: 'brand-2',
  concepts: [
    {
      id: 'a2-receita',
      title: 'Receita',
      blocks: [
        { type: 'text', text: 'Receita é o dinheiro gerado pela empresa através de suas atividades (vendas de produtos ou serviços), antes de descontar custos e despesas.' },
        {
          type: 'table',
          headers: ['Ano', 'Receita'],
          rows: [
            ['2022', 'R$1 bilhão'],
            ['2023', 'R$1,2 bilhão'],
            ['2024', 'R$1,5 bilhão'],
            ['2025', 'R$1,8 bilhão'],
          ],
        },
        { type: 'text', text: 'Ao analisar uma empresa, é importante identificar se a receita está crescendo de forma consistente ao longo dos anos, e não apenas em um ano isolado.' },
      ],
    },
    {
      id: 'a2-lucro',
      title: 'Lucro',
      blocks: [
        { type: 'text', text: 'Lucro é o que sobra da receita depois de descontados todos os custos, despesas, impostos e outras obrigações. É diferente de receita: uma empresa pode faturar muito e lucrar pouco.' },
        {
          type: 'example',
          code: 'Receita = R$1,8 bilhão\nLucro = R$220 milhões',
        },
        { type: 'text', text: 'A empresa faturou R$1,8 bilhão, mas depois dos custos, despesas, impostos etc., sobraram apenas R$220 milhões.' },
      ],
    },
    {
      id: 'a2-margem-liquida',
      title: 'Margem líquida',
      blocks: [
        { type: 'formula', formula: 'Margem líquida = Lucro ÷ Receita × 100' },
        { type: 'example', code: 'R$220 milhões ÷ R$1,8 bilhão ≈ 12,2%' },
        { type: 'quote', text: 'A cada R$100 de receita, aproximadamente R$12,20 viram lucro.' },
      ],
    },
    {
      id: 'a2-divida',
      title: 'Dívida',
      blocks: [
        {
          type: 'list',
          items: [
            'Dívida bruta: total de tudo que a empresa deve.',
            'Caixa: dinheiro e aplicações que a empresa tem disponível.',
            'Dívida líquida: dívida bruta menos o caixa disponível.',
            'Quanto mais endividada, mais vulnerável a empresa fica a juros altos e a momentos de crise.',
          ],
        },
        {
          type: 'compare',
          items: [
            { label: 'Empresa A', text: 'Lucro: R$500 milhões | Dívida líquida: R$200 milhões' },
            { label: 'Empresa B', text: 'Lucro: R$500 milhões | Dívida líquida: R$4 bilhões' },
          ],
        },
        { type: 'text', text: 'Apesar de terem o mesmo lucro, a Empresa B tem uma dívida líquida 20 vezes maior — ela precisaria de muito mais tempo (e está muito mais exposta a juros e riscos) para quitar suas obrigações do que a Empresa A.' },
      ],
    },
    {
      id: 'a2-ebitda',
      title: 'EBITDA',
      blocks: [
        { type: 'quote', text: 'EBITDA é uma medida utilizada para analisar o desempenho operacional de uma empresa antes de determinados efeitos financeiros, contábeis e tributários (juros, impostos, depreciação e amortização).' },
      ],
      subConcepts: [
        {
          id: 'a2-divida-liquida-ebitda',
          title: 'Dívida líquida / EBITDA',
          blocks: [
            { type: 'example', code: 'Dívida líquida = R$2 bilhões\nEBITDA = R$1 bilhão\n\nDívida líquida / EBITDA = 2x' },
            { type: 'text', text: 'Esse indicador mostra, aproximadamente, quantos anos de geração operacional a empresa levaria para quitar sua dívida líquida. Deve sempre ser comparado com empresas do mesmo setor, já que setores diferentes toleram níveis de endividamento diferentes.' },
          ],
        },
      ],
    },
    {
      id: 'a2-roe',
      title: 'ROE',
      blocks: [
        { type: 'formula', formula: 'ROE = Lucro líquido ÷ Patrimônio líquido × 100' },
        { type: 'example', code: 'Patrimônio = R$1 bilhão\nLucro = R$200 milhões\n\nROE = 20%' },
        { type: 'quote', text: 'A empresa gerou R$20 de lucro para cada R$100 de patrimônio.' },
        { type: 'warning', text: 'ROE alto não significa automaticamente que uma empresa seja excelente — é preciso entender também a qualidade do lucro e o nível de endividamento por trás dele.' },
      ],
    },
    {
      id: 'a2-pl',
      title: 'P/L',
      blocks: [
        { type: 'formula', formula: 'P/L = Preço da ação ÷ Lucro por ação' },
        { type: 'example', code: 'Preço = R$30\nLucro por ação = R$3\n\nP/L = 10' },
        {
          type: 'list',
          items: [
            'P/L baixo não significa automaticamente que a ação está barata.',
            'P/L alto não significa automaticamente que está cara.',
            'É necessário analisar crescimento, qualidade e perspectivas da empresa.',
          ],
        },
      ],
    },
    {
      id: 'a2-pvp',
      title: 'P/VP',
      blocks: [
        { type: 'formula', formula: 'P/VP = Preço da ação ÷ Valor patrimonial por ação' },
        { type: 'example', code: 'Valor patrimonial por ação = R$10\nPreço = R$8\n\nP/VP = 0,8' },
        { type: 'text', text: 'P/VP abaixo de 1 não significa automaticamente uma oportunidade — pode indicar que o mercado espera problemas futuros para a empresa.' },
      ],
    },
  ],
  checklist: [
    'Eu entendo o negócio?',
    'A receita cresce?',
    'O lucro cresce?',
    'As margens são boas?',
    'A dívida está controlada?',
    'O ROE é consistente?',
    'A empresa gera caixa?',
    'O valuation é razoável?',
    'A perspectiva futura é boa?',
  ],
}
