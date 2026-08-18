import type { Aula } from '../types'

export const aula9: Aula = {
  id: 'aula-9',
  number: 9,
  emoji: '⚠️',
  title: 'Riscos e como não perder dinheiro',
  shortTitle: 'Riscos',
  color: 'brand-6',
  concepts: [
    {
      id: 'a9-mercado',
      title: 'Risco de mercado',
      blocks: [{ type: 'text', text: 'A ação pode cair de preço mesmo sem nenhum problema específico da empresa, simplesmente por conta de movimentos gerais do mercado.' }],
    },
    {
      id: 'a9-empresa',
      title: 'Risco da empresa',
      blocks: [
        { type: 'text', text: 'A empresa pode:' },
        { type: 'list', items: ['Perder competitividade', 'Perder mercado', 'Reduzir lucros', 'Ter problemas operacionais'] },
      ],
    },
    {
      id: 'a9-divida',
      title: 'Risco de dívida',
      blocks: [{ type: 'text', text: 'Juros e endividamento podem prejudicar a empresa, especialmente em cenários de juros altos ou queda de receita.' }],
    },
    {
      id: 'a9-politico',
      title: 'Risco político',
      blocks: [
        { type: 'text', text: 'Mais presente principalmente em:' },
        { type: 'list', items: ['Estatais', 'Setores regulados'] },
      ],
    },
    {
      id: 'a9-cambial',
      title: 'Risco cambial',
      blocks: [{ type: 'text', text: 'Empresas expostas ao dólar podem ser beneficiadas ou prejudicadas pelas variações cambiais, dependendo se são exportadoras, importadoras ou possuem dívida em moeda estrangeira.' }],
    },
    {
      id: 'a9-concentracao',
      title: 'Risco de concentração',
      blocks: [{ type: 'warning', text: 'Não colocar todo o patrimônio em uma única empresa. Se algo der errado com ela, o impacto na carteira toda pode ser severo.' }],
    },
    {
      id: 'a9-setor',
      title: 'Risco de setor',
      blocks: [{ type: 'text', text: 'Um setor inteiro pode enfrentar dificuldades ao mesmo tempo, afetando todas as empresas dele simultaneamente.' }],
    },
    {
      id: 'a9-valuation',
      title: 'Risco de valuation',
      blocks: [{ type: 'text', text: 'Comprar uma empresa excelente por um preço exageradamente alto também é um risco — mesmo bons negócios podem ser maus investimentos se o preço pago for caro demais.' }],
    },
    {
      id: 'a9-emocional',
      title: 'Risco emocional',
      blocks: [{ type: 'text', text: 'As decisões mais caras do investidor costumam vir da emoção, não da análise.' }],
      subConcepts: [
        { id: 'a9-medo', title: '😨 Medo', blocks: [{ type: 'text', text: 'Vender ativos bons apenas porque o mercado caiu, travando um prejuízo que talvez fosse temporário.' }] },
        { id: 'a9-ganancia', title: '🤑 Ganância', blocks: [{ type: 'text', text: 'Assumir riscos excessivos buscando ganhos rápidos, ignorando fundamentos.' }] },
        { id: 'a9-fomo', title: 'FOMO', blocks: [{ type: 'text', text: 'Comprar uma ação só porque ela está subindo muito e "todo mundo" está comprando, sem entender o negócio.' }] },
        { id: 'a9-panico', title: 'Vender no pânico', blocks: [{ type: 'text', text: 'Vender ativos durante quedas fortes, exatamente no pior momento, por impulso.' }] },
        { id: 'a9-manada', title: 'Comprar porque todo mundo está comprando', blocks: [{ type: 'text', text: 'Seguir a maioria sem análise própria costuma levar a comprar caro, no auge do otimismo.' }] },
        { id: 'a9-prever', title: 'Tentar prever o mercado', blocks: [{ type: 'text', text: 'Tentar acertar o momento exato de comprar no fundo e vender no topo raramente funciona de forma consistente, mesmo para profissionais.' }] },
      ],
    },
    {
      id: 'a9-regras-seguranca',
      title: 'Regras de segurança',
      blocks: [
        {
          type: 'list',
          items: [
            'Não investir dinheiro que será necessário imediatamente.',
            'Diversificar.',
            'Conhecer a empresa.',
            'Não seguir dicas cegamente.',
            'Não usar dinheiro emprestado para investir.',
            'Ter uma reserva de emergência.',
            'Pensar no longo prazo.',
            'Entender que perdas fazem parte da renda variável.',
          ],
        },
      ],
    },
  ],
}
