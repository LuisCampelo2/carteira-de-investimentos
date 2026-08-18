export interface InvestmentOption {
  id: string
  name: string
  ticker?: string
  description: string
}

export const etfOptions: InvestmentOption[] = [
  { id: 'bova11', name: 'BOVA11', ticker: 'BOVA11', description: 'ETF que busca acompanhar o Ibovespa, principal índice da bolsa brasileira.' },
  { id: 'ivvb11', name: 'IVVB11', ticker: 'IVVB11', description: 'ETF que busca acompanhar o S&P 500, principal índice de ações dos EUA.' },
  { id: 'smal11', name: 'SMAL11', ticker: 'SMAL11', description: 'ETF que acompanha um índice de empresas brasileiras de menor capitalização (small caps).' },
  { id: 'divo11', name: 'DIVO11', ticker: 'DIVO11', description: 'ETF que acompanha um índice de empresas boas pagadoras de dividendos na B3.' },
]

export const rendaFixaOptions: InvestmentOption[] = [
  { id: 'tesouro-selic', name: 'Tesouro Selic', description: 'Título público pós-fixado atrelado à Selic, indicado para reserva de emergência pela alta liquidez.' },
  { id: 'tesouro-ipca', name: 'Tesouro IPCA+', description: 'Título público que paga inflação (IPCA) mais uma taxa fixa, indicado para objetivos de longo prazo.' },
  { id: 'cdb', name: 'CDB', description: 'Certificado de Depósito Bancário, título privado de bancos, geralmente atrelado a um percentual do CDI.' },
  { id: 'lci-lca', name: 'LCI/LCA', description: 'Letras de crédito imobiliário/agrícola, isentas de Imposto de Renda para pessoa física.' },
]

export const fiiOptions: InvestmentOption[] = [
  { id: 'hglg11', name: 'HGLG11', ticker: 'HGLG11', description: 'Fundo imobiliário de galpões logísticos.' },
  { id: 'knri11', name: 'KNRI11', ticker: 'KNRI11', description: 'Fundo imobiliário híbrido, com imóveis corporativos e logísticos.' },
  { id: 'mxrf11', name: 'MXRF11', ticker: 'MXRF11', description: 'Fundo imobiliário de recebíveis (papel), focado em títulos ligados ao mercado imobiliário.' },
]
