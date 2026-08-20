import type { Aula } from '../types'

export const aula10: Aula = {
  id: 'aula-10',
  number: 10,
  emoji: '🚀',
  title: 'Montando sua primeira carteira',
  shortTitle: 'Primeira carteira',
  objective: 'Aula prática: simular a construção de uma primeira carteira de investimentos.',
  color: 'brand-9',
  special: 'portfolio-builder',
  concepts: [
    {
      id: 'a10-intro',
      title: 'Simulação educacional',
      blocks: [
        { type: 'text', text: 'Informe seu aporte mensal, horizonte de investimento, tolerância ao risco, objetivo e patrimônio inicial no simulador abaixo para visualizar uma distribuição ilustrativa e a projeção de crescimento do patrimônio ao longo do tempo.' },
      ],
    },
    {
      id: 'a10-exemplo-equilibrado',
      title: 'Exemplo de perfil equilibrado',
      blocks: [
        { type: 'example', title: 'Aporte', code: 'R$400/mês' },
        { type: 'example', title: 'Distribuição ilustrativa', code: '40% → Renda fixa\n25% → ETFs\n20% → Ações\n15% → FIIs' },
        { type: 'example', title: 'Evolução', code: 'R$400/mês\n     ↓\nR$4.800/ano\n     ↓\nR$24.000 em 5 anos de aportes\n     ↓\nEfeito dos juros compostos' },
        { type: 'warning', text: 'Deixar extremamente claro: projeções são simulações e não garantias de retorno. Rentabilidade passada não garante rentabilidade futura.' },
      ],
    },
  ],
}
