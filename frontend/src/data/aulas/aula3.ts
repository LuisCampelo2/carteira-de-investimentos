import type { Aula } from '../types'

export const aula3: Aula = {
  id: 'aula-3',
  number: 3,
  emoji: '💰',
  title: 'Como descobrir se uma ação está cara ou barata',
  shortTitle: 'Cara ou barata?',
  objective: 'Ensinar conceitos básicos de valuation.',
  color: 'brand-3',
  concepts: [
    {
      id: 'a3-conceito-principal',
      title: 'Conceito principal',
      blocks: [
        { type: 'warning', text: 'Empresa boa ≠ investimento bom automaticamente. É preciso considerar o preço pago pela ação, não apenas a qualidade da empresa.' },
      ],
    },
    {
      id: 'a3-pl',
      title: 'P/L',
      blocks: [
        {
          type: 'list',
          items: [
            'Comparação histórica: como o P/L atual se compara à média histórica da própria empresa.',
            'Comparação com empresas semelhantes: como o P/L se compara ao de concorrentes do mesmo setor.',
            'Relação entre preço e lucro: quanto tempo, em anos, o investidor levaria para reaver o valor investido via lucros, caso eles se mantivessem constantes.',
          ],
        },
      ],
    },
    {
      id: 'a3-pvp',
      title: 'P/VP',
      blocks: [
        {
          type: 'list',
          items: [
            'Valor patrimonial: o que a empresa possui, contabilmente, descontadas suas dívidas.',
            'Preço de mercado: quanto os investidores estão dispostos a pagar pela empresa hoje.',
            'Interpretação: compara o preço pago com o patrimônio contábil da empresa.',
            'Limitações: nem todo ativo relevante aparece de forma fiel no balanço contábil, então o indicador tem menos utilidade em setores intensivos em intangíveis.',
          ],
        },
      ],
    },
    {
      id: 'a3-ev-ebitda',
      title: 'EV/EBITDA',
      blocks: [
        {
          type: 'list',
          items: [
            'Enterprise Value (EV): valor total da empresa, somando valor de mercado das ações e dívida líquida.',
            'EBITDA: geração operacional de caixa antes de juros, impostos, depreciação e amortização.',
            'Relação entre valor da empresa e resultado operacional: mostra quantas vezes o EBITDA anual seria necessário para "pagar" a empresa inteira, incluindo sua dívida.',
          ],
        },
      ],
    },
    {
      id: 'a3-dividend-yield',
      title: 'Dividend Yield',
      blocks: [
        { type: 'formula', formula: 'Dividend Yield = Dividendos por ação ÷ Preço da ação × 100' },
        { type: 'example', code: 'Dividendos anuais = R$2\nPreço da ação = R$20\n\nDividend Yield = 10%' },
        { type: 'warning', text: 'Um Dividend Yield alto pode acontecer simplesmente porque o preço da ação caiu — não é necessariamente um sinal positivo.' },
      ],
    },
    {
      id: 'a3-crescimento',
      title: 'Crescimento',
      blocks: [
        { type: 'text', text: 'Uma empresa que cresce rapidamente pode justificar múltiplos maiores (P/L e P/VP mais altos), pois o mercado está precificando lucros futuros maiores, não apenas os atuais.' },
      ],
    },
    {
      id: 'a3-valuation',
      title: 'Valuation',
      blocks: [
        { type: 'quote', text: 'Preço de mercado ≠ valor intrínseco.' },
        {
          type: 'list',
          items: [
            'Fluxo de caixa futuro: o dinheiro que a empresa deve gerar ao longo dos próximos anos.',
            'Taxa de desconto: taxa usada para trazer esses valores futuros a valor presente, refletindo risco e custo de oportunidade.',
            'Valor presente: quanto os fluxos futuros valem hoje.',
            'Valor terminal: estimativa do valor da empresa após o período projetado.',
            'Margem de segurança: comprar com desconto em relação ao valor estimado, para se proteger de erros de estimativa.',
          ],
        },
      ],
    },
  ],
}
