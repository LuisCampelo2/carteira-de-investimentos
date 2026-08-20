export interface SeedInvestmentOption {
  id: string
  assetClass: string
  name: string
  ticker?: string
  description: string
  marketInfo?: string
  payoutFrequency?: string
}

// Dados de mercado pesquisados em 20/08/2026. São aproximados, mudam diariamente
// e não são garantia de rentabilidade futura — apenas referência educacional.
export const investmentOptions: SeedInvestmentOption[] = [
  // ETFs
  {
    id: 'bova11', assetClass: 'ETFs', name: 'BOVA11', ticker: 'BOVA11',
    description: 'ETF que busca acompanhar o Ibovespa, principal índice da bolsa brasileira.',
    marketInfo: 'Ibovespa acumula ≈ +23% em 12 meses (ago/2026).',
    payoutFrequency: 'Não distribui — dividendos das empresas da carteira são reinvestidos na cota.',
  },
  {
    id: 'ivvb11', assetClass: 'ETFs', name: 'IVVB11', ticker: 'IVVB11',
    description: 'ETF que busca acompanhar o S&P 500, principal índice de ações dos EUA.',
    marketInfo: 'S&P 500 subiu ≈ +10% só no 1º semestre de 2026 (retorno total).',
    payoutFrequency: 'Não distribui — dividendos das empresas da carteira são reinvestidos na cota.',
  },
  {
    id: 'smal11', assetClass: 'ETFs', name: 'SMAL11', ticker: 'SMAL11',
    description: 'ETF que acompanha um índice de empresas brasileiras de menor capitalização (small caps).',
    marketInfo: 'Índice Small Caps acumula ≈ -3,3% em 12 meses (ago/2026) — mais volátil que o Ibovespa.',
    payoutFrequency: 'Não distribui — dividendos das empresas da carteira são reinvestidos na cota.',
  },
  {
    id: 'divo11', assetClass: 'ETFs', name: 'DIVO11', ticker: 'DIVO11',
    description: 'ETF que acompanha um índice de empresas boas pagadoras de dividendos na B3.',
    marketInfo: 'Índice de Dividendos acumula ≈ +22% em 12 meses (ago/2026).',
    payoutFrequency: 'Não distribui — dividendos das empresas da carteira são reinvestidos na cota.',
  },

  // Renda fixa
  {
    id: 'tesouro-selic', assetClass: 'Renda fixa', name: 'Tesouro Selic',
    description: 'Título público pós-fixado atrelado à Selic, indicado para reserva de emergência pela alta liquidez.',
    marketInfo: 'Selic atual: 14,00% a.a. (Copom, ago/2026).',
    payoutFrequency: 'Sem pagamento periódico — rende diariamente e só é recebido no resgate ou vencimento.',
  },
  {
    id: 'tesouro-ipca', assetClass: 'Renda fixa', name: 'Tesouro IPCA+',
    description: 'Título público que paga inflação (IPCA) mais uma taxa fixa, indicado para objetivos de longo prazo.',
    marketInfo: 'IPCA acumulado 12 meses: ≈ 4,44% (jul/2026), mais a taxa fixa do título.',
    payoutFrequency: 'Sem pagamento periódico (salvo a versão "com juros semestrais") — geralmente recebido só no vencimento.',
  },
  {
    id: 'cdb', assetClass: 'Renda fixa', name: 'CDB',
    description: 'Certificado de Depósito Bancário, título privado de bancos, geralmente atrelado a um percentual do CDI.',
    marketInfo: 'CDI atual ≈ 13,90% a.a.; CDBs de bancos médios oferecem ≈ 100% a 120% do CDI (ago/2026).',
    payoutFrequency: 'Sem pagamento periódico na maioria dos casos — rende no período e é recebido no vencimento ou resgate.',
  },
  {
    id: 'lci-lca', assetClass: 'Renda fixa', name: 'LCI/LCA',
    description: 'Letras de crédito imobiliário/agrícola, isentas de Imposto de Renda para pessoa física.',
    marketInfo: 'Costumam pagar 85% a 95% do CDI (≈13,90% a.a.), mas isentas de IR — rendimento líquido pode superar CDB.',
    payoutFrequency: 'Sem pagamento periódico — rendimento é recebido no vencimento ou resgate.',
  },

  // FIIs
  {
    id: 'hglg11', assetClass: 'FIIs', name: 'HGLG11', ticker: 'HGLG11',
    description: 'Fundo imobiliário de galpões logísticos.',
    marketInfo: 'Dividend yield ≈ 8,4% em 12 meses (ago/2026).',
    payoutFrequency: 'Mensal (como a maioria dos FIIs).',
  },
  {
    id: 'knri11', assetClass: 'FIIs', name: 'KNRI11', ticker: 'KNRI11',
    description: 'Fundo imobiliário híbrido, com imóveis corporativos e logísticos.',
    marketInfo: 'Dividend yield ≈ 7,4% em 12 meses (ago/2026).',
    payoutFrequency: 'Mensal (como a maioria dos FIIs).',
  },
  {
    id: 'mxrf11', assetClass: 'FIIs', name: 'MXRF11', ticker: 'MXRF11',
    description: 'Fundo imobiliário de recebíveis (papel), focado em títulos ligados ao mercado imobiliário.',
    marketInfo: 'Dividend yield ≈ 12,3% em 12 meses (ago/2026) — mais alto, mas fundo de papel tende a ser mais sensível a juros.',
    payoutFrequency: 'Mensal (como a maioria dos FIIs).',
  },

  // Fundos Multimercado
  {
    id: 'multi-macro', assetClass: 'Fundos Multimercado', name: 'Fundo Multimercado Macro',
    description: 'Aposta em cenários econômicos amplos, combinando juros, câmbio e bolsa.',
    marketInfo: 'Retorno varia muito de fundo para fundo — não há uma taxa de mercado única para comparar.',
    payoutFrequency: 'Geralmente não distribui — ganho vem da valorização da cota (fundo de acumulação).',
  },
  {
    id: 'multi-long-short', assetClass: 'Fundos Multimercado', name: 'Fundo Multimercado Long Short',
    description: 'Compra e vende ações simultaneamente buscando lucrar com a diferença entre elas, com menor exposição ao mercado.',
    marketInfo: 'Retorno varia muito de fundo para fundo — não há uma taxa de mercado única para comparar.',
    payoutFrequency: 'Geralmente não distribui — ganho vem da valorização da cota (fundo de acumulação).',
  },
  {
    id: 'multi-livre', assetClass: 'Fundos Multimercado', name: 'Fundo Multimercado Livre',
    description: 'Liberdade para alocar em diversas classes de ativos conforme a visão do gestor.',
    marketInfo: 'Retorno varia muito de fundo para fundo — não há uma taxa de mercado única para comparar.',
    payoutFrequency: 'Geralmente não distribui — ganho vem da valorização da cota (fundo de acumulação).',
  },

  // Previdência Privada
  {
    id: 'pgbl', assetClass: 'Previdência Privada', name: 'PGBL',
    description: 'Plano de previdência indicado para quem declara Imposto de Renda completo, permite deduzir até 12% da renda tributável.',
    marketInfo: 'Rentabilidade depende do fundo escolhido dentro do plano — varia como um fundo comum.',
    payoutFrequency: 'Não distribui na fase de acumulação — só é recebido no resgate ou na aposentadoria.',
  },
  {
    id: 'vgbl', assetClass: 'Previdência Privada', name: 'VGBL',
    description: 'Plano de previdência indicado para quem declara IR simplificado ou é isento, sem benefício de dedução.',
    marketInfo: 'Rentabilidade depende do fundo escolhido dentro do plano — varia como um fundo comum.',
    payoutFrequency: 'Não distribui na fase de acumulação — só é recebido no resgate ou na aposentadoria.',
  },

  // Debêntures
  {
    id: 'debenture-incentivada', assetClass: 'Debêntures', name: 'Debênture Incentivada',
    description: 'Título de dívida privada isento de Imposto de Renda para pessoa física, usado para financiar projetos de infraestrutura.',
    marketInfo: 'Costumam pagar IPCA + 6% a 8% a.a. isento de IR (ago/2026).',
    payoutFrequency: 'Varia por emissão — comumente semestral, podendo ser mensal, trimestral ou só no vencimento.',
  },
  {
    id: 'debenture-comum', assetClass: 'Debêntures', name: 'Debênture Comum',
    description: 'Título de dívida emitido por empresas para captar recursos, com tributação regressiva de Imposto de Renda.',
    marketInfo: 'Costumam pagar CDI + 1,5% a 3% a.a., com IR regressivo sobre o rendimento.',
    payoutFrequency: 'Varia por emissão — comumente semestral, podendo ser mensal, trimestral ou só no vencimento.',
  },

  // Criptomoedas
  {
    id: 'bitcoin', assetClass: 'Criptomoedas', name: 'Bitcoin', ticker: 'BTC',
    description: 'Criptomoeda pioneira e mais valorizada do mercado, usada como reserva de valor digital.',
    marketInfo: '≈ US$ 64.900 (19/ago/2026), em mercado de baixa desde fev/2026 — alta volatilidade.',
    payoutFrequency: 'Não paga nada — ganho vem só da valorização (ou desvalorização) do preço.',
  },
  {
    id: 'ethereum', assetClass: 'Criptomoedas', name: 'Ethereum', ticker: 'ETH',
    description: 'Segunda maior criptomoeda, base de contratos inteligentes e aplicações descentralizadas.',
    marketInfo: '≈ US$ 1.936 (19/ago/2026), também em mercado de baixa — alta volatilidade.',
    payoutFrequency: 'Não paga nada por padrão — ganho vem da valorização (staking é uma exceção não coberta aqui).',
  },
  {
    id: 'stablecoin', assetClass: 'Criptomoedas', name: 'Stablecoin (USDT/USDC)',
    description: 'Criptomoedas atreladas ao dólar, usadas para reduzir a volatilidade dentro do mercado cripto.',
    marketInfo: '≈ US$ 1,00 por definição (paridade com o dólar) — não é feita para valorizar.',
    payoutFrequency: 'Não paga nada — não é feita para gerar renda, só para preservar valor em dólar.',
  },
]

export interface SeedCompany {
  id: string
  name: string
  ticker: string
  sector: string
  whatItDoes: string
  howItMakesMoney: string
  revenue: string
  profit: string
  margin: string
  roe: string
  debt: string
  cashFlow: string
  pl: string
  pvp: string
  dividendYield: string
  growth: string
  risks: string[]
  outlook: string
  positives: string[]
  attention: string[]
  dangers: string[]
  qualitySummary: string
  priceSummary: string
  priceApprox?: string
  payoutFrequency?: string
}

// Preço e dividend yield pesquisados em 19-21/ago/2026. São aproximados, mudam
// diariamente e rentabilidade passada não garante rentabilidade futura.
export const companies: SeedCompany[] = [
  {
    id: 'itau',
    name: 'Itaú Unibanco',
    ticker: 'ITUB4',
    sector: 'Bancos',
    whatItDoes: 'Maior banco privado da América Latina, oferecendo crédito, cartões, seguros, investimentos e serviços financeiros para pessoas físicas e empresas.',
    howItMakesMoney: 'Cobra juros sobre empréstimos e financiamentos, tarifas de serviços, e ganha com a diferença entre o que paga para captar dinheiro e o que cobra para emprestá-lo (spread bancário).',
    revenue: 'Receita de serviços e margem financeira em crescimento consistente nos últimos anos (exemplo educacional).',
    profit: 'Lucro líquido recorrente na casa de dezenas de bilhões de reais por ano (exemplo educacional).',
    margin: 'Margem financeira historicamente saudável para o setor bancário (exemplo educacional).',
    roe: 'ROE historicamente próximo de 20%, um dos mais altos entre bancos brasileiros (exemplo educacional).',
    debt: 'Estrutura de capital regulada pelo Banco Central; não se analisa dívida como em empresas comuns, e sim índices de capital e inadimplência.',
    cashFlow: 'Geração de caixa operacional robusta, típica de bancos de grande porte (exemplo educacional).',
    pl: 'P/L historicamente na faixa de 7x a 10x (exemplo educacional).',
    pvp: 'P/VP historicamente próximo de 1,5x a 2x (exemplo educacional).',
    dividendYield: 'Dividend Yield ≈ 8,3% ao ano nos últimos 12 meses (pesquisado em ago/2026).',
    priceApprox: 'R$ 38,35 (19/ago/2026)',
    payoutFrequency: 'Mensal — um dos poucos bancos que pagam todo mês, com complementos semestrais.',
    growth: 'Crescimento moderado, puxado por expansão da carteira de crédito e serviços digitais.',
    risks: ['Inadimplência em cenários de juros altos', 'Concorrência de bancos digitais', 'Regulação do setor financeiro', 'Ciclos econômicos'],
    outlook: 'Perspectivas ligadas ao crescimento do crédito no Brasil e à digitalização dos serviços financeiros.',
    positives: ['Rentabilidade historicamente alta (ROE)', 'Marca consolidada e grande base de clientes', 'Diversificação de receitas'],
    attention: ['Sensível ao ciclo de juros e crédito', 'Múltiplos podem variar bastante com o humor do mercado'],
    dangers: ['Forte concorrência de fintechs e bancos digitais', 'Inadimplência em cenários de recessão'],
    qualitySummary: 'Empresa historicamente considerada de alta qualidade dentro do setor bancário, com rentabilidade consistente.',
    priceSummary: 'O preço deve ser avaliado em relação ao ROE entregue e ao ciclo de crédito e juros do momento.',
  },
  {
    id: 'petrobras',
    name: 'Petrobras',
    ticker: 'PETR4',
    sector: 'Petróleo e gás',
    whatItDoes: 'Estatal brasileira que atua na exploração, produção, refino e distribuição de petróleo, gás natural e derivados.',
    howItMakesMoney: 'Vende petróleo, gás e derivados (como gasolina e diesel) no mercado interno e externo, com receita fortemente ligada ao preço internacional do petróleo.',
    revenue: 'Receita altamente sensível ao preço do barril de petróleo e à taxa de câmbio (exemplo educacional).',
    profit: 'Lucro historicamente volátil, acompanhando o ciclo de preços das commodities (exemplo educacional).',
    margin: 'Margens historicamente elevadas em ciclos de petróleo em alta, e comprimidas em ciclos de baixa.',
    roe: 'ROE historicamente volátil, variando fortemente entre ciclos de commodities (exemplo educacional).',
    debt: 'Endividamento historicamente elevado, com esforço de redução de dívida líquida/EBITDA nos últimos anos (exemplo educacional).',
    cashFlow: 'Forte geração de caixa operacional em ciclos de petróleo em alta.',
    pl: 'P/L historicamente baixo em comparação a outros setores, refletindo o risco político e a volatilidade do setor (exemplo educacional).',
    pvp: 'P/VP historicamente abaixo de 1,5x (exemplo educacional).',
    dividendYield: 'Dividend Yield ≈ 7,3% ao ano nos últimos 12 meses (pesquisado em jul/2026), historicamente entre os mais altos da bolsa.',
    priceApprox: 'R$ 41,65 (21/jul/2026)',
    payoutFrequency: 'Trimestral (política da empresa), podendo ter distribuições extras em anos de caixa forte.',
    growth: 'Crescimento ligado a novos poços do pré-sal e à evolução da produção, mais do que à expansão de mercado.',
    risks: ['Risco político (empresa estatal)', 'Volatilidade do preço do petróleo', 'Câmbio', 'Mudanças na política de preços e dividendos'],
    outlook: 'Perspectivas ligadas à produção do pré-sal, preço internacional do petróleo e transição energética de longo prazo.',
    positives: ['Grandes reservas no pré-sal', 'Custo de extração competitivo em parte dos ativos', 'Histórico de bons dividendos em ciclos de alta'],
    attention: ['Política de preços pode mudar por decisão do governo', 'Alta volatilidade de resultados'],
    dangers: ['Interferência política em decisões estratégicas', 'Dependência do preço internacional do petróleo', 'Transição energética de longo prazo'],
    qualitySummary: 'Ativos de classe mundial no pré-sal, mas com risco de governança por ser uma estatal.',
    priceSummary: 'Costuma negociar com desconto em relação a pares privados, refletindo o risco político.',
  },
  {
    id: 'vale',
    name: 'Vale',
    ticker: 'VALE3',
    sector: 'Mineração',
    whatItDoes: 'Uma das maiores mineradoras do mundo, com foco na extração e venda de minério de ferro, além de níquel e cobre.',
    howItMakesMoney: 'Vende minério de ferro e outros metais principalmente para siderúrgicas globais, com forte dependência da demanda chinesa.',
    revenue: 'Receita fortemente correlacionada ao preço internacional do minério de ferro (exemplo educacional).',
    profit: 'Lucro historicamente volátil, seguindo o ciclo de preços das commodities (exemplo educacional).',
    margin: 'Margens historicamente elevadas por ter custo de produção competitivo globalmente.',
    roe: 'ROE historicamente volátil, atingindo picos altos em ciclos de minério em alta (exemplo educacional).',
    debt: 'Dívida líquida historicamente controlada, com política de disciplina de capital nos últimos anos (exemplo educacional).',
    cashFlow: 'Forte geração de caixa em ciclos de minério em alta, usada para dividendos e recompras.',
    pl: 'P/L ≈ 29,3 (pesquisado em ago/2026) — acima da média histórica, também reflete a forte alta da cotação em 12 meses (≈+41%).',
    pvp: 'P/VP historicamente moderado (exemplo educacional).',
    dividendYield: 'Dividend Yield ≈ 7,8% ao ano nos últimos 12 meses (pesquisado em ago/2026).',
    priceApprox: 'R$ 71,55 (ago/2026)',
    payoutFrequency: 'Semestral (pagamentos regulares em março e setembro), mais eventuais extraordinários.',
    growth: 'Crescimento ligado a expansão de produção e não necessariamente a novos mercados.',
    risks: ['Preço do minério de ferro', 'Dependência da economia chinesa', 'Riscos ambientais e de segurança operacional', 'Custos regulatórios após acidentes passados'],
    outlook: 'Perspectivas ligadas à demanda global por aço, infraestrutura chinesa e transição para minérios de maior qualidade.',
    positives: ['Baixo custo de produção global', 'Grandes reservas de minério de alta qualidade', 'Forte geração de caixa em ciclos favoráveis'],
    attention: ['Forte dependência de um único comprador relevante (China)', 'Resultados cíclicos e voláteis'],
    dangers: ['Riscos ambientais e de segurança em operações de mineração', 'Desaceleração da economia chinesa'],
    qualitySummary: 'Ativo de baixo custo e classe mundial, mas com resultados historicamente cíclicos.',
    priceSummary: 'Múltiplos tendem a parecer baratos no topo do ciclo e caros no fundo do ciclo — é preciso olhar além do P/L momentâneo.',
  },
  {
    id: 'weg',
    name: 'WEG',
    ticker: 'WEGE3',
    sector: 'Bens de capital / Indústria',
    whatItDoes: 'Fabricante brasileira de motores elétricos, geradores, transformadores e equipamentos industriais, com forte presença internacional.',
    howItMakesMoney: 'Vende produtos industriais e soluções de energia para clientes no Brasil e no exterior, incluindo mercados de energia renovável.',
    revenue: 'Histórico de crescimento consistente de receita, impulsionado por exportações e diversificação de produtos (exemplo educacional).',
    profit: 'Lucro em crescimento consistente ao longo dos anos (exemplo educacional).',
    margin: 'Margens historicamente elevadas e estáveis para o setor industrial (exemplo educacional).',
    roe: 'ROE historicamente elevado e consistente, um destaque entre empresas industriais brasileiras (exemplo educacional).',
    debt: 'Endividamento historicamente baixo e controlado (exemplo educacional).',
    cashFlow: 'Boa geração de caixa operacional, sustentando investimentos e dividendos.',
    pl: 'P/L historicamente elevado em relação à média do mercado, refletindo a percepção de qualidade da empresa (exemplo educacional).',
    pvp: 'P/VP historicamente alto, também refletindo o prêmio de qualidade (exemplo educacional).',
    dividendYield: 'Dividend Yield ≈ 4,1% ao ano nos últimos 12 meses (pesquisado em ago/2026) — moderado, coerente com reinvestimento em crescimento.',
    priceApprox: 'R$ 48,44 (ago/2026)',
    payoutFrequency: 'Semestral (historicamente em março e agosto), com eventuais pagamentos extras.',
    growth: 'Crescimento consistente ao longo de décadas, com forte disciplina de execução.',
    risks: ['Múltiplos historicamente elevados (valuation exigente)', 'Câmbio (parte relevante da receita vem de exportação)', 'Ciclo industrial global'],
    outlook: 'Perspectivas ligadas à eletrificação industrial, energia renovável e expansão internacional.',
    positives: ['Histórico consistente de crescimento e execução', 'Alta rentabilidade (ROE)', 'Baixo endividamento'],
    attention: ['Valuation historicamente exigente (P/L e P/VP altos)', 'Parte relevante do resultado depende do câmbio'],
    dangers: ['Pagar caro demais por uma empresa boa é, ainda assim, um risco de valuation'],
    qualitySummary: 'Uma das empresas industriais mais bem avaliadas da bolsa brasileira, com histórico consistente de qualidade.',
    priceSummary: 'Costuma negociar com múltiplos mais altos que a média do mercado, refletindo a qualidade percebida do negócio.',
  },
  {
    id: 'bb',
    name: 'Banco do Brasil',
    ticker: 'BBAS3',
    sector: 'Bancos',
    whatItDoes: 'Banco público federal, um dos maiores do país, com forte atuação em crédito rural e correspondente bancário do governo.',
    howItMakesMoney: 'Assim como outros bancos, ganha com juros sobre crédito, tarifas de serviços e spread bancário — com forte exposição ao agronegócio.',
    revenue: 'Receita de serviços e margem financeira ligadas fortemente ao crédito rural e ao varejo bancário (exemplo educacional).',
    profit: 'Lucro historicamente robusto, mas historicamente com múltiplos mais baixos que bancos privados por ser estatal (exemplo educacional).',
    margin: 'Margem financeira em linha com a média do setor bancário.',
    roe: 'ROE historicamente competitivo com bancos privados em anos recentes (exemplo educacional).',
    debt: 'Estrutura de capital regulada pelo Banco Central, como os demais bancos.',
    cashFlow: 'Geração de caixa operacional robusta, típica de bancos de grande porte.',
    pl: 'P/L ≈ 8,55 (pesquisado em ago/2026), descontado frente aos bancos privados.',
    pvp: 'P/VP historicamente abaixo de 1x em vários períodos (exemplo educacional).',
    dividendYield: 'Dividend Yield ≈ 3,1% ao ano nos últimos 12 meses (ago/2026) — caiu de patamares mais altos após corte no payout.',
    priceApprox: 'R$ 18,12 (ago/2026)',
    payoutFrequency: 'Trimestral (JCP antecipado por trimestre) mais complemento no fim do ano.',
    growth: 'Crescimento ligado à expansão do crédito, especialmente rural e para pequenas empresas.',
    risks: ['Risco político (empresa estatal)', 'Exposição concentrada ao agronegócio', 'Inadimplência em cenários de juros altos'],
    outlook: 'Perspectivas ligadas ao crédito rural, à digitalização e à política de dividendos do governo.',
    positives: ['Dividend Yield historicamente atrativo', 'Forte presença no agronegócio', 'Múltiplos historicamente descontados frente a pares privados'],
    attention: ['Decisões podem sofrer influência política', 'Depende fortemente da saúde do agronegócio'],
    dangers: ['Interferência do governo em decisões estratégicas ou de dividendos'],
    qualitySummary: 'Banco sólido, mas historicamente negociado com desconto frente a bancos privados por conta do risco de governança estatal.',
    priceSummary: 'Costuma negociar com múltiplos mais baixos que bancos privados equivalentes.',
  },
  {
    id: 'engie',
    name: 'Engie Brasil',
    ticker: 'EGIE3',
    sector: 'Energia elétrica',
    whatItDoes: 'Geradora de energia elétrica no Brasil, com forte presença em fontes renováveis como hidrelétricas, eólicas e solares.',
    howItMakesMoney: 'Vende energia elétrica através de contratos de longo prazo com distribuidoras e grandes consumidores.',
    revenue: 'Receita previsível, sustentada por contratos de venda de energia de longo prazo (exemplo educacional).',
    profit: 'Lucro estável e previsível, típico de empresas do setor elétrico (exemplo educacional).',
    margin: 'Margens historicamente elevadas e estáveis (exemplo educacional).',
    roe: 'ROE historicamente sólido para o setor de utilities (exemplo educacional).',
    debt: 'Endividamento moderado, usado para financiar expansão de capacidade de geração (exemplo educacional).',
    cashFlow: 'Geração de caixa previsível, sustentando uma política de dividendos consistente.',
    pl: 'P/L historicamente moderado, condizente com um setor de baixo crescimento e alta previsibilidade (exemplo educacional).',
    pvp: 'P/VP historicamente moderado (exemplo educacional).',
    dividendYield: 'Dividend Yield ≈ 5% a 8% ao ano nos últimos 12 meses, conforme a fonte (pesquisado em ago/2026).',
    priceApprox: 'R$ 27,61 (ago/2026)',
    payoutFrequency: 'Cerca de 3x ao ano (historicamente fevereiro, maio e dezembro).',
    growth: 'Crescimento moderado, ligado a novos projetos de geração e leilões de energia.',
    risks: ['Regulação do setor elétrico', 'Renovação de concessões', 'Condições hidrológicas (regime de chuvas)'],
    outlook: 'Perspectivas ligadas à expansão de energias renováveis e à demanda futura de energia no Brasil.',
    positives: ['Receita previsível via contratos de longo prazo', 'Bom histórico de dividendos', 'Matriz predominantemente renovável'],
    attention: ['Crescimento historicamente mais lento que setores cíclicos', 'Depende de leilões e renovação de concessões'],
    dangers: ['Mudanças regulatórias podem afetar contratos e tarifas'],
    qualitySummary: 'Empresa historicamente considerada defensiva, com receitas previsíveis e bons dividendos.',
    priceSummary: 'Costuma ser avaliada mais pelo Dividend Yield e previsibilidade do que por potencial de crescimento acelerado.',
  },
  {
    id: 'taesa',
    name: 'Taesa',
    ticker: 'TAEE11',
    sector: 'Energia elétrica (transmissão)',
    whatItDoes: 'Empresa de transmissão de energia elétrica, responsável por transportar energia entre geradoras e distribuidoras através de linhas de alta tensão.',
    howItMakesMoney: 'Recebe uma receita fixa anual (RAP — Receita Anual Permitida), definida em contratos regulados, pela disponibilização das linhas de transmissão.',
    revenue: 'Receita previsível e contratada, reajustada anualmente por índices de inflação (exemplo educacional).',
    profit: 'Lucro estável, refletindo a natureza regulada e previsível do negócio (exemplo educacional).',
    margin: 'Margens historicamente muito elevadas, típicas de negócios de transmissão de energia (exemplo educacional).',
    roe: 'ROE historicamente elevado dentro do setor de utilities (exemplo educacional).',
    debt: 'Endividamento moderado a alto, comum no setor por ser intensivo em capital, mas com receita previsível para sustentá-lo (exemplo educacional).',
    cashFlow: 'Geração de caixa previsível, sustentando uma das maiores políticas de distribuição de dividendos da bolsa.',
    pl: 'P/L historicamente moderado (exemplo educacional).',
    pvp: 'P/VP historicamente moderado a elevado (exemplo educacional).',
    dividendYield: 'Dividend Yield ≈ 8,2% ao ano nos últimos 12 meses (ago/2026), dentro da faixa histórica de 8% a 12%.',
    priceApprox: 'R$ 37,30 (ago/2026)',
    payoutFrequency: 'Cerca de 4x ao ano (historicamente janeiro, maio, agosto e novembro).',
    growth: 'Crescimento ligado à conquista de novos leilões de linhas de transmissão.',
    risks: ['Regulação do setor elétrico', 'Dependência de novos leilões para crescer', 'Endividamento para financiar novos ativos'],
    outlook: 'Perspectivas ligadas a novos leilões de transmissão e à expansão da malha elétrica brasileira.',
    positives: ['Receita altamente previsível e contratada', 'Histórico consistente de dividendos elevados', 'Margens muito altas'],
    attention: ['Crescimento depende de vencer novos leilões', 'Uso de dívida para financiar expansão'],
    dangers: ['Mudanças regulatórias no setor de transmissão'],
    qualitySummary: 'Negócio previsível e defensivo, com uma das maiores distribuições de dividendos da bolsa.',
    priceSummary: 'Costuma ser avaliada principalmente pelo Dividend Yield frente a outras opções de renda.',
  },
  {
    id: 'localiza',
    name: 'Localiza',
    ticker: 'RENT3',
    sector: 'Aluguel de veículos',
    whatItDoes: 'Maior empresa de aluguel de carros e gestão de frotas da América Latina.',
    howItMakesMoney: 'Compra veículos, aluga para pessoas físicas e empresas, e depois revende os carros usados de sua frota, lucrando com aluguel e com a diferença de compra e venda.',
    revenue: 'Receita em crescimento consistente, impulsionada pela expansão da frota e de novas unidades (exemplo educacional).',
    profit: 'Lucro sensível ao custo dos veículos e às taxas de juros usadas para financiar a frota (exemplo educacional).',
    margin: 'Margens historicamente saudáveis, mas sensíveis ao preço de compra e revenda de veículos.',
    roe: 'ROE historicamente elevado em períodos favoráveis do ciclo de crédito e preço de carros (exemplo educacional).',
    debt: 'Endividamento historicamente elevado, natural do modelo de negócio intensivo em capital (financiamento da frota) (exemplo educacional).',
    cashFlow: 'Fluxo de caixa fortemente influenciado pelo ciclo de compra e venda de veículos.',
    pl: 'P/L ≈ 19,4 (pesquisado em ago/2026), refletindo a expectativa de crescimento do setor.',
    pvp: 'P/VP historicamente elevado (exemplo educacional).',
    dividendYield: 'Dividend Yield ≈ 6,1% ao ano nos últimos 12 meses (ago/2026).',
    priceApprox: 'R$ 33,40 (ago/2026)',
    payoutFrequency: 'Cerca de 4x ao ano (aproximadamente trimestral, via JCP).',
    growth: 'Crescimento historicamente forte, com expansão de frota e consolidação do setor.',
    risks: ['Alto endividamento para financiar a frota', 'Sensibilidade a juros', 'Preço de veículos novos e usados'],
    outlook: 'Perspectivas ligadas à penetração de aluguel de carros e gestão de frotas no Brasil.',
    positives: ['Líder de mercado com escala relevante', 'Histórico de crescimento consistente', 'Modelo de negócio testado ao longo de décadas'],
    attention: ['Alto endividamento é inerente ao modelo de negócio', 'Sensível ao custo de capital (juros)'],
    dangers: ['Ciclos de juros altos encarecem o financiamento da frota', 'Queda no valor de revenda dos veículos usados'],
    qualitySummary: 'Líder consolidado em um setor de barreiras de entrada relevantes, mas com uso intenso de dívida.',
    priceSummary: 'Historicamente negociada com múltiplos mais altos, refletindo a expectativa de crescimento.',
  },
  {
    id: 'b3',
    name: 'B3',
    ticker: 'B3SA3',
    sector: 'Infraestrutura de mercado financeiro',
    whatItDoes: 'Administra a bolsa de valores brasileira e a infraestrutura de negociação, compensação e liquidação de ativos financeiros no Brasil.',
    howItMakesMoney: 'Cobra taxas sobre negociação, listagem e liquidação de ações, derivativos e outros ativos financeiros negociados na bolsa.',
    revenue: 'Receita ligada ao volume de negociação na bolsa brasileira, com boa diversificação entre renda variável e outros produtos (exemplo educacional).',
    profit: 'Lucro historicamente elevado, com margens muito altas por ser um negócio de infraestrutura com pouca necessidade de capital físico adicional (exemplo educacional).',
    margin: 'Margens historicamente entre as mais altas da bolsa brasileira (exemplo educacional).',
    roe: 'ROE historicamente elevado (exemplo educacional).',
    debt: 'Endividamento historicamente baixo a moderado (exemplo educacional).',
    cashFlow: 'Forte geração de caixa, típica de negócios de infraestrutura de mercado com baixa necessidade de reinvestimento.',
    pl: 'P/L ≈ 15,55 (pesquisado em ago/2026), refletindo a qualidade do negócio.',
    pvp: 'P/VP historicamente elevado (exemplo educacional).',
    dividendYield: 'Dividend Yield ≈ 4,0% ao ano nos últimos 12 meses (ago/2026), combinado com recompras de ações.',
    priceApprox: 'R$ 14,95 (ago/2026)',
    payoutFrequency: 'Trimestral (janeiro, abril, julho e outubro, aproximadamente).',
    growth: 'Crescimento ligado ao aumento do volume negociado na bolsa e à entrada de novos investidores no mercado de capitais brasileiro.',
    risks: ['Depende do volume de negociação do mercado', 'Concorrência de novas infraestruturas de negociação', 'Regulação do mercado de capitais'],
    outlook: 'Perspectivas ligadas ao crescimento do número de investidores pessoa física e ao desenvolvimento do mercado de capitais brasileiro.',
    positives: ['Negócio de infraestrutura com poucas alternativas concorrentes', 'Margens muito altas', 'Baixa necessidade de capital para crescer'],
    attention: ['Receita varia com o volume de negociação, que é cíclico', 'Sensível ao humor do mercado acionário como um todo'],
    dangers: ['Mudanças regulatórias que aumentem a concorrência na infraestrutura de negociação'],
    qualitySummary: 'Negócio de alta qualidade, com características de monopólio natural na infraestrutura de negociação brasileira.',
    priceSummary: 'Tende a ser avaliada pela qualidade do negócio e pelo potencial de crescimento do mercado de capitais no Brasil.',
  },
]
