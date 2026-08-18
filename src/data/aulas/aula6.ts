import type { Aula } from '../types'

export const aula6: Aula = {
  id: 'aula-6',
  number: 6,
  emoji: '🌎',
  title: 'ETFs',
  shortTitle: 'ETFs',
  color: 'brand-6',
  concepts: [
    {
      id: 'a6-o-que-e',
      title: 'O que é ETF?',
      blocks: [
        { type: 'text', text: 'ETF (Exchange Traded Fund) é um fundo negociado em bolsa que busca acompanhar determinado índice ou estratégia, replicando o desempenho de uma cesta de ativos.' },
      ],
    },
    {
      id: 'a6-exemplo',
      title: 'Exemplo',
      blocks: [
        { type: 'text', text: 'Um ETF pode acompanhar um índice de ações brasileiras (como o Ibovespa). Em vez de comprar diversas ações individualmente, o investidor compra uma única cota do ETF e passa a ter exposição a todas as empresas daquele índice de uma só vez.' },
      ],
    },
    {
      id: 'a6-vantagens',
      title: 'Vantagens',
      blocks: [
        { type: 'list', items: ['Diversificação', 'Praticidade', 'Menor necessidade de análise individual', 'Exposição a índices inteiros', 'Facilidade de aporte'] },
      ],
    },
    {
      id: 'a6-desvantagens',
      title: 'Desvantagens',
      blocks: [
        { type: 'list', items: ['Taxa de administração', 'Menor controle sobre as empresas que compõem a carteira', 'Pode cair junto com o mercado', 'Não elimina o risco do investimento'] },
      ],
    },
    {
      id: 'a6-br-vs-internacional',
      title: 'ETF brasileiro vs internacional',
      blocks: [
        { type: 'text', text: 'ETFs brasileiros seguem índices locais (como o Ibovespa) e têm exposição concentrada na economia e na moeda do Brasil. ETFs internacionais dão acesso a mercados e moedas de outros países, ajudando a diversificar geograficamente, mas trazem também exposição a variações cambiais.' },
      ],
    },
    {
      id: 'a6-para-iniciantes',
      title: 'ETFs para iniciantes',
      blocks: [
        { type: 'text', text: 'Por oferecerem diversificação automática, os ETFs podem ser úteis para quem ainda está aprendendo análise fundamentalista, permitindo começar a investir em ações com menor necessidade de escolher empresas individualmente.' },
      ],
    },
  ],
}
