import type { Aula } from '../types'

export const aula7: Aula = {
  id: 'aula-7',
  number: 7,
  emoji: '🔬',
  title: 'Como analisar uma ação brasileira de verdade',
  shortTitle: 'Analisando ações reais',
  objective: 'Aula prática: aplicar os conceitos das aulas anteriores em empresas brasileiras reais.',
  color: 'brand-7',
  special: 'company-analyzer',
  concepts: [
    {
      id: 'a7-estrutura',
      title: 'Estrutura da análise',
      blocks: [
        { type: 'text', text: 'Selecione uma empresa abaixo para ver um exemplo estruturado de análise, cobrindo o que a empresa faz, como ganha dinheiro, seus principais indicadores e um resumo de pontos positivos, atenção e riscos.' },
        {
          type: 'list',
          items: [
            'O que a empresa faz?',
            'Como ganha dinheiro?',
            'Receita',
            'Lucro',
            'Margem',
            'ROE',
            'Dívida',
            'Fluxo de caixa',
            'P/L',
            'P/VP',
            'Dividend Yield',
            'Crescimento',
            'Riscos',
            'Perspectivas',
            'Valuation',
          ],
        },
        { type: 'warning', text: 'Os dados apresentados são exemplos educacionais e não refletem cotações ou resultados financeiros em tempo real. Não devem ser usados como base para decisões de investimento.' },
      ],
    },
  ],
}
