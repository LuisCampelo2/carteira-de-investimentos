import type { Aula } from '../types'

export const aula4: Aula = {
  id: 'aula-4',
  number: 4,
  emoji: '💵',
  title: 'Dividendos',
  shortTitle: 'Dividendos',
  color: 'brand-4',
  concepts: [
    {
      id: 'a4-o-que-sao',
      title: 'O que são dividendos?',
      blocks: [
        { type: 'text', text: 'Dividendos são a parte do lucro da empresa distribuída aos acionistas, geralmente em dinheiro, proporcional à quantidade de ações que cada um possui.' },
        { type: 'example', title: 'Exemplo', code: '100 ações\nDividendo = R$0,80 por ação\n\nRecebimento = R$80' },
      ],
    },
    {
      id: 'a4-dividend-yield',
      title: 'Dividend Yield',
      blocks: [
        { type: 'formula', formula: 'Dividend Yield = Dividendos por ação ÷ Preço da ação × 100' },
        { type: 'text', text: 'Mostra, em percentual, quanto a empresa pagou de dividendos em relação ao preço da ação. É útil para comparar o "retorno em proventos" entre diferentes ações, mas deve ser analisado junto com a saúde financeira da empresa (veja Aula 3).' },
      ],
    },
    {
      id: 'a4-data-com',
      title: 'Data COM',
      blocks: [
        { type: 'text', text: 'É a última data em que é preciso ter a ação em carteira para ter direito a receber o dividendo anunciado. Quem compra a ação até esse dia (inclusive) participa do pagamento.' },
      ],
    },
    {
      id: 'a4-data-ex',
      title: 'Data EX',
      blocks: [
        { type: 'text', text: 'É o primeiro dia em que a ação passa a ser negociada "sem" o direito ao dividendo anunciado. Quem compra a partir dessa data não recebe aquele provento específico, e o preço da ação normalmente é ajustado para baixo, refletindo o valor que saiu da empresa.' },
      ],
    },
    {
      id: 'a4-data-pagamento',
      title: 'Data de pagamento',
      blocks: [
        { type: 'text', text: 'É a data em que o valor do dividendo efetivamente cai na conta do investidor. Pode ocorrer semanas ou meses depois da Data COM.' },
      ],
    },
    {
      id: 'a4-nao-e-gratis',
      title: 'Dividendos não são dinheiro grátis',
      blocks: [
        { type: 'text', text: 'O pagamento de dividendos normalmente é acompanhado por um ajuste no preço da ação, no mesmo valor pago por ação — o dinheiro sai do caixa da empresa e vai para o bolso do acionista, então o valor da empresa (e, em geral, o preço da ação) diminui na mesma proporção.' },
        { type: 'warning', text: 'O investidor deve analisar a qualidade e a saúde financeira da empresa, não simplesmente buscar o maior Dividend Yield possível.' },
      ],
    },
    {
      id: 'a4-dividendos-vs-crescimento',
      title: 'Dividendos vs crescimento',
      blocks: [{ type: 'text', text: 'Empresas em estágios diferentes tendem a ter políticas de dividendos diferentes:' }],
      subConcepts: [
        {
          id: 'a4-empresa-madura',
          title: 'Empresa madura',
          blocks: [{ type: 'list', items: ['Crescimento menor', 'Maior distribuição de lucros'] }],
        },
        {
          id: 'a4-empresa-crescimento',
          title: 'Empresa de crescimento',
          blocks: [{ type: 'list', items: ['Pode reinvestir mais', 'Pode pagar menos dividendos', 'Pode apresentar maior potencial de crescimento'] }],
        },
      ],
    },
    {
      id: 'a4-reinvestimento',
      title: 'Reinvestimento',
      blocks: [
        { type: 'text', text: 'Reinvestir os dividendos recebidos — comprando mais ações com esse dinheiro — permite que o patrimônio cresça de forma acelerada ao longo do tempo, graças ao efeito dos juros compostos: os dividendos futuros passam a incidir sobre uma base maior de ações.' },
      ],
    },
  ],
}
