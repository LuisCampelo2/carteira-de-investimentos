import type { Quiz } from './types'

export const quizzes: Quiz[] = [
  {
    aulaId: 'aula-1',
    questions: [
      {
        question: 'Você comprou 100 ações por R$10 e vendeu por R$15. Qual foi o lucro bruto?',
        options: ['R$100', 'R$300', 'R$500', 'R$1.500'],
        correctIndex: 2,
        explanation: 'Compra: 100 × R$10 = R$1.000. Venda: 100 × R$15 = R$1.500. Lucro: R$1.500 − R$1.000 = R$500.',
      },
      {
        question: 'O que representa uma ação?',
        options: [
          'Um empréstimo feito à empresa',
          'Uma pequena participação (sociedade) na empresa',
          'Um título de dívida garantido pelo governo',
          'Um seguro contra a falência da empresa',
        ],
        correctIndex: 1,
        explanation: 'Uma ação representa uma pequena participação no capital da empresa — o investidor se torna sócio, não credor.',
      },
      {
        question: 'Qual afirmação está correta sobre o preço de uma ação?',
        options: [
          'Preço da ação sempre reflete o valor real da empresa',
          'Uma ação de R$500 é sempre mais cara que uma de R$5',
          'Preço da ação não é necessariamente igual ao valor da empresa',
          'O preço da ação nunca muda',
        ],
        correctIndex: 2,
        explanation: 'Preço da ação ≠ valor da empresa. O preço depende de quantas ações existem e de expectativas do mercado, não apenas do valor absoluto.',
      },
    ],
  },
  {
    aulaId: 'aula-2',
    questions: [
      {
        question: 'Uma empresa tem receita de R$1,8 bilhão e lucro de R$220 milhões. Qual é a margem líquida aproximada?',
        options: ['2,2%', '12,2%', '22%', '81,8%'],
        correctIndex: 1,
        explanation: 'Margem líquida = Lucro ÷ Receita × 100 = 220 ÷ 1.800 × 100 ≈ 12,2%.',
      },
      {
        question: 'O que o indicador Dívida líquida/EBITDA tenta mostrar?',
        options: [
          'A margem de lucro da empresa',
          'Aproximadamente quantos anos de geração operacional seriam necessários para quitar a dívida líquida',
          'O valor de mercado da empresa',
          'A quantidade de ações em circulação',
        ],
        correctIndex: 1,
        explanation: 'Dívida líquida/EBITDA indica, de forma aproximada, quantos anos de EBITDA a empresa levaria para pagar sua dívida líquida — e deve ser comparado com pares do setor.',
      },
      {
        question: 'Sobre o ROE, é correto afirmar que:',
        options: [
          'É a mesma coisa que o P/L',
          'Mede o lucro em relação ao patrimônio líquido, mas ROE alto não garante que a empresa seja excelente',
          'Sempre indica que a empresa está barata',
          'É calculado dividindo a receita pelo lucro',
        ],
        correctIndex: 1,
        explanation: 'ROE = Lucro líquido ÷ Patrimônio líquido × 100. Um ROE alto é positivo, mas precisa ser analisado junto com dívida e qualidade do lucro.',
      },
    ],
  },
  {
    aulaId: 'aula-3',
    questions: [
      {
        question: 'Um Dividend Yield muito alto pode significar que:',
        options: [
          'A empresa é obrigatoriamente uma ótima compra',
          'O preço da ação pode ter caído bastante',
          'A empresa nunca terá problemas financeiros',
          'O P/L da empresa é automaticamente baixo',
        ],
        correctIndex: 1,
        explanation: 'Como Dividend Yield = Dividendos ÷ Preço, uma queda no preço da ação eleva o yield mesmo sem mudança nos dividendos — por isso é preciso investigar a causa.',
      },
      {
        question: 'Qual das opções abaixo resume melhor o conceito de valuation?',
        options: [
          'Preço de mercado é sempre igual ao valor intrínseco',
          'Estimar o valor de uma empresa com base em seus fluxos de caixa futuros trazidos a valor presente',
          'Comparar apenas o preço histórico da ação',
          'Somar todos os ativos físicos da empresa',
        ],
        correctIndex: 1,
        explanation: 'Valuation busca estimar o valor intrínseco de uma empresa, geralmente via projeção de fluxos de caixa futuros descontados a valor presente.',
      },
      {
        question: 'Por que "empresa boa" não é sinônimo de "bom investimento"?',
        options: [
          'Porque empresas boas nunca dão lucro',
          'Porque o preço pago pela ação também importa',
          'Porque ações de empresas boas não pagam dividendos',
          'Porque isso nunca é verdade — empresa boa é sempre bom investimento',
        ],
        correctIndex: 1,
        explanation: 'Mesmo uma ótima empresa pode ser um mau investimento se o preço pago for exagerado em relação ao seu valor.',
      },
    ],
  },
  {
    aulaId: 'aula-4',
    questions: [
      {
        question: 'Você tem 100 ações e a empresa paga R$0,80 de dividendo por ação. Quanto você recebe?',
        options: ['R$8', 'R$80', 'R$800', 'R$8.000'],
        correctIndex: 1,
        explanation: '100 × R$0,80 = R$80.',
      },
      {
        question: 'O que costuma acontecer com o preço da ação na Data EX?',
        options: [
          'O preço sobe, refletindo o pagamento do dividendo',
          'O preço costuma ser ajustado para baixo, no valor aproximado do dividendo pago',
          'O preço nunca é afetado',
          'A ação para de ser negociada permanentemente',
        ],
        correctIndex: 1,
        explanation: 'Na Data EX, a ação passa a negociar sem o direito ao dividendo anunciado, e o preço costuma se ajustar para baixo no valor aproximado do provento.',
      },
      {
        question: 'Por que dividendos não são "dinheiro grátis"?',
        options: [
          'Porque são ilegais no Brasil',
          'Porque o valor pago sai do caixa da empresa e o preço da ação tende a se ajustar correspondentemente',
          'Porque apenas fundos podem recebê-los',
          'Porque são sempre reinvestidos automaticamente',
        ],
        correctIndex: 1,
        explanation: 'O dinheiro distribuído sai da empresa, então o preço da ação normalmente se ajusta para baixo — o dividendo não é um ganho "extra" isolado do preço.',
      },
    ],
  },
  {
    aulaId: 'aula-5',
    questions: [
      {
        question: 'Aportando R$400 por mês, quanto se acumula (sem contar rendimentos) em 5 anos?',
        options: ['R$4.800', 'R$12.000', 'R$24.000', 'R$48.000'],
        correctIndex: 2,
        explanation: 'R$400 × 60 meses = R$24.000.',
      },
      {
        question: 'O que caracteriza uma estratégia mais conservadora entre as apresentadas na aula?',
        options: [
          'Maior parte do aporte em ações',
          'Maior parte do aporte em renda fixa',
          'Aporte 100% em ETFs internacionais',
          'Ausência total de diversificação',
        ],
        correctIndex: 1,
        explanation: 'No exemplo educacional da aula, a estratégia conservadora concentra a maior parte do aporte em renda fixa (R$250 de R$400).',
      },
      {
        question: 'Diversificar entre empresas, setores, países e classes de ativos serve principalmente para:',
        options: [
          'Garantir retorno positivo todo mês',
          'Reduzir a dependência de um único resultado',
          'Eliminar completamente o risco',
          'Aumentar a complexidade sem nenhum benefício',
        ],
        correctIndex: 1,
        explanation: 'Diversificação reduz a dependência de um único ativo, setor ou país, mas não elimina o risco totalmente.',
      },
    ],
  },
  {
    aulaId: 'aula-6',
    questions: [
      {
        question: 'O que é um ETF?',
        options: [
          'Um tipo de ação de uma única empresa',
          'Um fundo negociado em bolsa que busca acompanhar um índice ou estratégia',
          'Um título público federal',
          'Um tipo de conta bancária',
        ],
        correctIndex: 1,
        explanation: 'ETF (Exchange Traded Fund) é um fundo negociado em bolsa que replica o desempenho de um índice ou estratégia.',
      },
      {
        question: 'Qual é uma desvantagem comum de investir via ETFs?',
        options: [
          'Impossibilidade de diversificação',
          'Taxa de administração e menor controle sobre as empresas individuais',
          'Não é possível negociar em bolsa',
          'Necessidade de analisar cada empresa individualmente',
        ],
        correctIndex: 1,
        explanation: 'ETFs cobram taxa de administração e dão menos controle sobre a escolha individual das empresas, já que seguem um índice ou estratégia.',
      },
      {
        question: 'Por que ETFs podem ser úteis para iniciantes?',
        options: [
          'Porque eliminam totalmente o risco de mercado',
          'Porque oferecem diversificação automática, exigindo menos análise individual de empresas',
          'Porque garantem rentabilidade fixa',
          'Porque não sofrem com quedas de mercado',
        ],
        correctIndex: 1,
        explanation: 'Ao replicar um índice inteiro, o ETF oferece diversificação instantânea, reduzindo a necessidade de escolher ações individualmente.',
      },
    ],
  },
  {
    aulaId: 'aula-7',
    questions: [
      {
        question: 'Ao analisar uma ação brasileira, por que é importante olhar dívida e fluxo de caixa além do lucro?',
        options: [
          'Porque o lucro contábil nunca é confiável',
          'Porque uma empresa pode ter lucro contábil mas enfrentar dificuldades financeiras reais',
          'Porque dívida e fluxo de caixa não têm relação com o risco da empresa',
          'Porque essas métricas substituem completamente o lucro',
        ],
        correctIndex: 1,
        explanation: 'Lucro contábil não conta toda a história — dívida elevada ou fraca geração de caixa podem indicar riscos que o lucro sozinho não revela.',
      },
      {
        question: 'Os dados apresentados nos exemplos de empresas desta aula devem ser tratados como:',
        options: [
          'Cotações em tempo real',
          'Recomendações de compra',
          'Exemplos educacionais, não dados financeiros em tempo real',
          'Garantias de rentabilidade futura',
        ],
        correctIndex: 2,
        explanation: 'Sem integração com dados financeiros em tempo real, os exemplos servem apenas para fins didáticos.',
      },
      {
        question: 'Ao montar o resumo de uma análise, em quais três categorias os pontos podem ser organizados?',
        options: [
          'Passado, presente e futuro',
          'Pontos positivos, pontos de atenção e riscos',
          'Compra, venda e manutenção',
          'Curto, médio e longo prazo',
        ],
        correctIndex: 1,
        explanation: 'O modelo de resumo da aula organiza a análise em pontos positivos (🟢), pontos de atenção (🟡) e riscos (🔴).',
      },
    ],
  },
  {
    aulaId: 'aula-8',
    questions: [
      {
        question: 'Ao analisar bancos, quais indicadores merecem atenção especial?',
        options: [
          'Preço do petróleo e câmbio',
          'ROE, inadimplência e margem financeira',
          'Preço de commodities agrícolas',
          'Regime de chuvas',
        ],
        correctIndex: 1,
        explanation: 'Bancos são analisados principalmente por ROE, inadimplência, margem financeira, eficiência e qualidade dos ativos.',
      },
      {
        question: 'Por que empresas de energia elétrica costumam ter receitas mais previsíveis?',
        options: [
          'Porque não têm concorrência',
          'Porque costumam operar com contratos de longo prazo e concessões reguladas',
          'Porque não pagam impostos',
          'Porque o preço da energia nunca muda',
        ],
        correctIndex: 1,
        explanation: 'Contratos de longo prazo e concessões reguladas dão maior previsibilidade de receita ao setor elétrico.',
      },
      {
        question: 'Qual afirmação sobre setores é a mais correta?',
        options: [
          'Existe sempre um setor permanentemente melhor que os outros',
          'Cada setor tem ciclos, oportunidades, riscos e características próprias',
          'Setores nunca enfrentam dificuldades coletivas',
          'É melhor investir sempre em um único setor',
        ],
        correctIndex: 1,
        explanation: 'Não existe um setor permanentemente superior — cada um tem seus próprios ciclos e riscos específicos.',
      },
    ],
  },
  {
    aulaId: 'aula-9',
    questions: [
      {
        question: 'O que é "risco de concentração"?',
        options: [
          'O risco de diversificar demais',
          'O risco de colocar todo o patrimônio em uma única empresa',
          'O risco de ter dinheiro em renda fixa',
          'O risco de usar corretoras diferentes',
        ],
        correctIndex: 1,
        explanation: 'Concentrar todo o patrimônio em uma única empresa amplia o impacto caso algo dê errado especificamente com ela.',
      },
      {
        question: 'Vender ações em pânico durante uma forte queda de mercado é um exemplo de qual tipo de risco?',
        options: ['Risco cambial', 'Risco emocional', 'Risco de dívida', 'Risco de setor'],
        correctIndex: 1,
        explanation: 'Decisões tomadas por medo ou pânico, sem base em análise, são exemplos de risco emocional.',
      },
      {
        question: 'Qual das regras abaixo é uma boa prática de segurança ao investir?',
        options: [
          'Investir com dinheiro emprestado para potencializar ganhos',
          'Ter uma reserva de emergência antes de investir em ações',
          'Seguir dicas de investimento sem verificar',
          'Colocar todo o patrimônio em uma única ação',
        ],
        correctIndex: 1,
        explanation: 'Ter uma reserva de emergência é uma das regras básicas de segurança antes de se expor à renda variável.',
      },
    ],
  },
  {
    aulaId: 'aula-10',
    questions: [
      {
        question: 'No exemplo de perfil equilibrado da aula, qual a distribuição ilustrativa da carteira?',
        options: [
          '100% em ações',
          '40% renda fixa, 25% ETFs, 20% ações, 15% FIIs',
          '50% em criptomoedas',
          '100% em renda fixa',
        ],
        correctIndex: 1,
        explanation: 'O exemplo educacional de perfil equilibrado distribui 40% em renda fixa, 25% em ETFs, 20% em ações e 15% em FIIs.',
      },
      {
        question: 'Por que é importante deixar claro que simulações de carteira não são garantias?',
        options: [
          'Porque projeções futuras envolvem incerteza e rentabilidade passada não garante rentabilidade futura',
          'Porque simulações são sempre erradas',
          'Porque juros compostos não existem na prática',
          'Porque simuladores não podem ser usados para nada',
        ],
        correctIndex: 0,
        explanation: 'Toda projeção é uma estimativa baseada em premissas — o resultado real pode ser diferente, para melhor ou para pior.',
      },
      {
        question: 'Quais informações o simulador de carteira pede ao usuário?',
        options: [
          'Apenas o CPF',
          'Aporte mensal, horizonte, tolerância ao risco, objetivo e patrimônio inicial',
          'Apenas o nome da corretora',
          'Apenas a idade',
        ],
        correctIndex: 1,
        explanation: 'O simulador educacional utiliza aporte mensal, horizonte de investimento, tolerância ao risco, objetivo e patrimônio inicial para gerar a simulação.',
      },
    ],
  },
]

export const getQuizByAulaId = (aulaId: string) => quizzes.find((q) => q.aulaId === aulaId)
