import type { Aula } from '../types'

export const aula5: Aula = {
  id: 'aula-5',
  number: 5,
  emoji: '📊',
  title: 'Como montar uma carteira com R$400/mês',
  shortTitle: 'Carteira com R$400/mês',
  objective: 'Ensinar como começar a investir com pouco dinheiro.',
  color: 'brand-5',
  concepts: [
    {
      id: 'a5-aporte-mensal',
      title: 'Aporte mensal',
      blocks: [
        { type: 'example', code: 'R$400 × 12 = R$4.800 por ano\n\nR$400 × 60 = R$24.000 em 5 anos' },
        { type: 'text', text: 'Aportar um valor fixo com constância é mais importante do que o tamanho do valor. Com o tempo, os juros compostos fazem o patrimônio crescer mais rápido do que apenas a soma dos aportes, pois os rendimentos passam a gerar novos rendimentos.' },
      ],
    },
    {
      id: 'a5-conservadora',
      title: 'Estratégia conservadora',
      blocks: [
        { type: 'example', title: 'Exemplo educacional', code: 'R$250 → Renda fixa\nR$100 → ETFs\nR$50 → Ações' },
      ],
    },
    {
      id: 'a5-equilibrada',
      title: 'Estratégia equilibrada',
      blocks: [
        { type: 'example', title: 'Exemplo educacional', code: 'R$150 → Renda fixa\nR$100 → ETFs\nR$100 → Ações\nR$50 → FIIs' },
      ],
    },
    {
      id: 'a5-agressiva',
      title: 'Estratégia mais agressiva',
      blocks: [
        { type: 'example', title: 'Exemplo educacional', code: 'R$100 → Renda fixa\nR$150 → ETFs\nR$150 → Ações' },
        { type: 'warning', text: 'Esses três modelos são exemplos educacionais e não recomendações personalizadas de investimento.' },
      ],
    },
    {
      id: 'a5-diversificacao',
      title: 'Diversificação',
      blocks: [
        { type: 'text', text: 'Diversificar significa distribuir os investimentos para reduzir a dependência de um único resultado. Vale a pena diversificar entre:' },
        { type: 'list', items: ['Empresas', 'Setores', 'Países', 'Classes de ativos'] },
      ],
    },
  ],
}
