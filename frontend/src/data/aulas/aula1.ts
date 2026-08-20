import type { Aula } from '../types'

export const aula1: Aula = {
  id: 'aula-1',
  number: 1,
  emoji: '📚',
  title: 'O que é uma ação',
  shortTitle: 'O que é uma ação',
  objective: 'Entender o que é uma ação, por que empresas as emitem e como o investidor pode ganhar dinheiro com elas.',
  color: 'brand-1',
  concepts: [
    {
      id: 'a1-o-que-e-acao',
      title: 'O que é uma ação?',
      blocks: [
        { type: 'text', text: 'Uma ação representa uma pequena participação em uma empresa. Ao comprar uma ação, o investidor passa a ser sócio (acionista) daquela empresa, na proporção de quantas ações possui.' },
        {
          type: 'example',
          title: 'Exemplo',
          code: 'Empresa vale R$1 bilhão\nDividida em 100 milhões de ações\n\n100 ações × R$10 = R$1.000',
        },
        { type: 'text', text: 'Ao comprar 100 ações, o investidor passa a possuir uma pequena parcela daquela empresa — proporcional ao total de ações emitidas.' },
      ],
    },
    {
      id: 'a1-por-que-vender-acoes',
      title: 'Por que empresas vendem ações?',
      blocks: [
        { type: 'text', text: 'As empresas emitem ações para captar dinheiro e financiar seus planos, sem precisar recorrer apenas a empréstimos.' },
        {
          type: 'list',
          items: ['Expansão', 'Novas lojas', 'Fábricas', 'Aquisição de outras empresas', 'Novos projetos', 'Reorganização financeira'],
        },
        {
          type: 'compare',
          items: [
            { label: 'Empréstimo', text: 'A empresa recebe dinheiro e cria uma dívida, que precisa devolver com juros.' },
            { label: 'Emissão de ações', text: 'A empresa recebe dinheiro e vende uma pequena participação, sem obrigação de devolver o valor.' },
          ],
        },
      ],
    },
    {
      id: 'a1-como-ganhar-dinheiro',
      title: 'Como ganhar dinheiro com ações?',
      blocks: [{ type: 'text', text: 'Existem duas formas principais de retorno para o acionista: a valorização do preço da ação e o recebimento de dividendos.' }],
      subConcepts: [
        {
          id: 'a1-valorizacao',
          title: '📈 Valorização',
          blocks: [
            {
              type: 'example',
              title: 'Exemplo',
              code: 'Compra:\n100 ações × R$10 = R$1.000\n\nVenda:\n100 ações × R$15 = R$1.500\n\nLucro:\nR$500',
            },
            { type: 'text', text: 'O ganho só é realizado (efetivado) quando a posição é vendida. Enquanto a ação não é vendida, a valorização é apenas um ganho no papel.' },
          ],
        },
        {
          id: 'a1-dividendos',
          title: '💵 Dividendos',
          blocks: [
            { type: 'text', text: 'A empresa pode distribuir parte de seus lucros aos acionistas, em dinheiro, periodicamente.' },
            {
              type: 'example',
              title: 'Exemplo',
              code: '100 ações\nDividendo = R$0,50 por ação\n\n100 × R$0,50 = R$50',
            },
          ],
        },
      ],
    },
    {
      id: 'a1-sobe-ou-cai',
      title: 'Por que uma ação sobe ou cai?',
      blocks: [
        { type: 'text', text: 'O preço de uma ação é definido pelo mercado, através da oferta e demanda por aquele papel. Diversos fatores influenciam essa negociação:' },
        {
          type: 'list',
          items: [
            'Resultados da empresa',
            'Expectativas futuras',
            'Oferta e demanda',
            'Taxa de juros',
            'Economia',
            'Notícias',
            'Desempenho do setor',
            'Resultados trimestrais',
            'Percepção dos investidores',
          ],
        },
        { type: 'warning', text: 'Conceito importante: Preço da ação ≠ valor da empresa. Uma ação de R$5 não necessariamente está barata. Uma ação de R$500 não necessariamente está cara. O que importa é o preço em relação ao que a empresa realmente vale.' },
      ],
    },
  ],
}
