import type { Aula } from '../types'

export const aula8: Aula = {
  id: 'aula-8',
  number: 8,
  emoji: '🏦',
  title: 'Como escolher entre setores',
  shortTitle: 'Escolhendo setores',
  color: 'brand-8',
  concepts: [
    {
      id: 'a8-bancos',
      title: 'Bancos',
      blocks: [
        { type: 'text', text: 'Exemplos: Itaú, Bradesco, Banco do Brasil.' },
        { type: 'list', items: ['ROE', 'Inadimplência', 'Margem financeira', 'Eficiência', 'Crescimento da carteira de crédito', 'Qualidade dos ativos'] },
      ],
    },
    {
      id: 'a8-petroleo',
      title: 'Petróleo',
      blocks: [
        { type: 'text', text: 'Exemplo: Petrobras.' },
        { type: 'list', items: ['Preço do petróleo', 'Produção', 'Reservas', 'Custos', 'Dividendos', 'Política de preços', 'Riscos políticos'] },
      ],
    },
    {
      id: 'a8-mineracao',
      title: 'Mineração',
      blocks: [
        { type: 'text', text: 'Exemplo: Vale.' },
        { type: 'list', items: ['Minério de ferro', 'Preço das commodities', 'Produção', 'Custos', 'China (principal comprador)', 'Dividendos'] },
      ],
    },
    {
      id: 'a8-energia',
      title: 'Energia elétrica',
      blocks: [
        { type: 'list', items: ['Receitas previsíveis', 'Contratos de longo prazo', 'Dívida', 'Concessões', 'Dividendos', 'Regulação'] },
      ],
    },
    {
      id: 'a8-varejo',
      title: 'Varejo',
      blocks: [
        { type: 'list', items: ['Crescimento das vendas', 'Margem', 'Endividamento', 'Consumo', 'Juros', 'Concorrência'] },
      ],
    },
    {
      id: 'a8-tecnologia',
      title: 'Tecnologia',
      blocks: [
        { type: 'list', items: ['Crescimento', 'Margem', 'Inovação', 'Vantagem competitiva', 'Valuation'] },
      ],
    },
    {
      id: 'a8-conceito-importante',
      title: 'Conceito importante',
      blocks: [
        { type: 'quote', text: 'Não existe um setor que seja permanentemente o melhor.' },
        { type: 'list', items: ['Ciclos', 'Oportunidades', 'Riscos', 'Características próprias'] },
      ],
    },
  ],
}
