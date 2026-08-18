# 📈 Prompt — Mapa Mental Interativo de Investimentos

Crie um site web educacional completo, moderno e responsivo para rodar localmente em `localhost`, funcionando como um **mapa mental interativo para estudar investimentos em ações**.

## 🎯 Objetivo

O site será meu ambiente pessoal de estudos sobre bolsa de valores.

A interface principal deve ser um **mapa mental visual**, com um nó central:

> 📈 **INVESTIMENTOS EM AÇÕES**

A partir dele devem surgir 10 grandes ramificações correspondentes às 10 aulas.

O usuário deve poder clicar em cada aula para expandi-la e visualizar seus conceitos, exemplos, explicações, fórmulas e subtemas.

A interface deve ter aparência de uma ferramenta profissional de estudo, semelhante a ferramentas como MindMeister ou Obsidian, mas com identidade visual própria.

---

# 🛠️ Tecnologia

Utilize:

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React para ícones
- Componentes reutilizáveis
- LocalStorage para salvar progresso
- Sem necessidade de backend
- Funcionamento completo em localhost

Para o mapa mental, pode utilizar uma biblioteca open source adequada, como **React Flow**.

---

# 🧠 Estrutura do mapa mental

## Nó central

> 📈 **INVESTIMENTOS EM AÇÕES**

## Ramificações

1. 📚 Aula 1 — O que é uma ação
2. 🔎 Aula 2 — Como analisar uma empresa
3. 💰 Aula 3 — Como descobrir se uma ação está cara ou barata
4. 💵 Aula 4 — Dividendos
5. 📊 Aula 5 — Como montar uma carteira com R$400/mês
6. 🌎 Aula 6 — ETFs
7. 🔬 Aula 7 — Como analisar uma ação brasileira de verdade
8. 🏦 Aula 8 — Como escolher entre setores
9. ⚠️ Aula 9 — Riscos e como não perder dinheiro
10. 🚀 Aula 10 — Montando sua primeira carteira

Cada aula deve ser um grande nó que pode ser expandido e recolhido.

---

# 📚 Aula 1 — O que é uma ação

## O que é uma ação?

Uma ação representa uma pequena participação em uma empresa.

### Exemplo

Uma empresa vale **R$1 bilhão** e divide seu capital em **100 milhões de ações**.

Cada ação representa uma pequena parcela da empresa.

Se o investidor comprar:

```text
100 ações × R$10 = R$1.000
```

Ele passa a possuir uma pequena participação naquela empresa.

---

## Por que empresas vendem ações?

As empresas podem captar dinheiro através da emissão de ações para financiar:

- Expansão
- Novas lojas
- Fábricas
- Aquisição de outras empresas
- Novos projetos
- Reorganização financeira

### Comparação

**Empréstimo:**

> A empresa recebe dinheiro e cria uma dívida.

**Emissão de ações:**

> A empresa recebe dinheiro e vende uma pequena participação.

---

## Como ganhar dinheiro com ações?

### 📈 Valorização

Exemplo:

```text
Compra:
100 ações × R$10 = R$1.000

Venda:
100 ações × R$15 = R$1.500

Lucro:
R$500
```

Explique que o ganho é realizado quando a posição é vendida.

### 💵 Dividendos

A empresa pode distribuir parte de seus lucros aos acionistas.

Exemplo:

```text
100 ações
Dividendo = R$0,50 por ação

100 × R$0,50 = R$50
```

---

## Por que uma ação sobe ou cai?

Principais fatores:

- Resultados da empresa
- Expectativas futuras
- Oferta e demanda
- Taxa de juros
- Economia
- Notícias
- Desempenho do setor
- Resultados trimestrais
- Percepção dos investidores

### ⚠️ Conceito importante

> **Preço da ação ≠ valor da empresa**

Uma ação de R$5 não necessariamente está barata.

Uma ação de R$500 não necessariamente está cara.

---

# 🔎 Aula 2 — Como analisar uma empresa

Objetivo: ensinar os fundamentos básicos da análise fundamentalista.

---

## Receita

Receita é o dinheiro gerado pela empresa através de suas atividades.

### Exemplo

| Ano | Receita |
|---|---:|
| 2022 | R$1 bilhão |
| 2023 | R$1,2 bilhão |
| 2024 | R$1,5 bilhão |
| 2025 | R$1,8 bilhão |

Ensinar a identificar crescimento da receita.

---

## Lucro

Explicar a diferença entre receita e lucro.

Exemplo:

```text
Receita = R$1,8 bilhão
Lucro = R$220 milhões
```

A empresa faturou R$1,8 bilhão, mas depois dos custos, despesas, impostos etc., sobraram R$220 milhões.

---

## Margem líquida

### Fórmula

```text
Margem líquida = Lucro ÷ Receita × 100
```

### Exemplo

```text
R$220 milhões ÷ R$1,8 bilhão ≈ 12,2%
```

Interpretação:

> A cada R$100 de receita, aproximadamente R$12,20 viram lucro.

---

## Dívida

Explicar:

- Dívida bruta
- Caixa
- Dívida líquida
- Importância do endividamento

### Exemplo

**Empresa A**

```text
Lucro: R$500 milhões
Dívida líquida: R$200 milhões
```

**Empresa B**

```text
Lucro: R$500 milhões
Dívida líquida: R$4 bilhões
```

Explicar por que as duas empresas possuem situações financeiras diferentes.

---

## EBITDA

Explicar de forma simples:

> EBITDA é uma medida utilizada para analisar o desempenho operacional de uma empresa antes de determinados efeitos financeiros, contábeis e tributários.

### Dívida líquida / EBITDA

Exemplo:

```text
Dívida líquida = R$2 bilhões
EBITDA = R$1 bilhão

Dívida líquida / EBITDA = 2x
```

Explicar que o indicador deve ser comparado com empresas do mesmo setor.

---

## ROE

### Fórmula

```text
ROE = Lucro líquido ÷ Patrimônio líquido × 100
```

### Exemplo

```text
Patrimônio = R$1 bilhão
Lucro = R$200 milhões

ROE = 20%
```

Interpretação:

> A empresa gerou R$20 de lucro para cada R$100 de patrimônio.

Explicar que ROE alto não significa automaticamente que uma empresa seja excelente.

---

## P/L

### Fórmula

```text
P/L = Preço da ação ÷ Lucro por ação
```

### Exemplo

```text
Preço = R$30
Lucro por ação = R$3

P/L = 10
```

Explicar que:

- P/L baixo não significa automaticamente que a ação está barata.
- P/L alto não significa automaticamente que está cara.

É necessário analisar crescimento, qualidade e perspectivas.

---

## P/VP

### Fórmula

```text
P/VP = Preço da ação ÷ Valor patrimonial por ação
```

### Exemplo

```text
Valor patrimonial por ação = R$10
Preço = R$8

P/VP = 0,8
```

Explicar que P/VP abaixo de 1 não significa automaticamente oportunidade.

---

## Checklist de análise

Criar um checklist interativo:

- [ ] Eu entendo o negócio?
- [ ] A receita cresce?
- [ ] O lucro cresce?
- [ ] As margens são boas?
- [ ] A dívida está controlada?
- [ ] O ROE é consistente?
- [ ] A empresa gera caixa?
- [ ] O valuation é razoável?
- [ ] A perspectiva futura é boa?

---

# 💰 Aula 3 — Como descobrir se uma ação está cara ou barata

Objetivo: ensinar conceitos básicos de valuation.

## Conceito principal

> **Empresa boa ≠ investimento bom automaticamente.**

É preciso considerar o preço pago.

---

## P/L

Ensinar:

- Comparação histórica
- Comparação com empresas semelhantes
- Relação entre preço e lucro

---

## P/VP

Explicar:

- Valor patrimonial
- Preço de mercado
- Interpretação
- Limitações

---

## EV/EBITDA

Explicar:

- Enterprise Value
- EBITDA
- Relação entre valor da empresa e resultado operacional

---

## Dividend Yield

### Fórmula

```text
Dividend Yield =
Dividendos por ação ÷ Preço da ação × 100
```

### Exemplo

```text
Dividendos anuais = R$2
Preço da ação = R$20

Dividend Yield = 10%
```

⚠️ Explicar que um Dividend Yield alto pode acontecer simplesmente porque o preço da ação caiu.

---

## Crescimento

Explicar que uma empresa que cresce rapidamente pode justificar múltiplos maiores.

---

## Valuation

Explicar:

> **Preço de mercado ≠ valor intrínseco**

Introduzir:

- Fluxo de caixa futuro
- Taxa de desconto
- Valor presente
- Valor terminal
- Margem de segurança

---

# 💵 Aula 4 — Dividendos

## O que são dividendos?

Parte do lucro da empresa distribuída aos acionistas.

---

## Exemplo

```text
100 ações
Dividendo = R$0,80 por ação

Recebimento = R$80
```

---

## Dividend Yield

Explicar fórmula e interpretação.

---

## Data COM

Explicar o conceito.

---

## Data EX

Explicar o conceito.

---

## Data de pagamento

Explicar o conceito.

---

## Dividendos não são dinheiro grátis

Explicar que o pagamento de dividendos normalmente é acompanhado por um ajuste no preço da ação.

O investidor deve analisar a empresa, não simplesmente buscar o maior Dividend Yield.

---

## Dividendos vs crescimento

### Empresa madura

- Crescimento menor
- Maior distribuição de lucros

### Empresa de crescimento

- Pode reinvestir mais
- Pode pagar menos dividendos
- Pode apresentar maior potencial de crescimento

---

## Reinvestimento

Ensinar como reinvestir dividendos pode contribuir para o crescimento do patrimônio através dos juros compostos.

---

# 📊 Aula 5 — Como montar uma carteira com R$400/mês

Objetivo: ensinar como começar com pouco dinheiro.

---

## Aporte mensal

```text
R$400 × 12 = R$4.800 por ano

R$400 × 60 = R$24.000 em 5 anos
```

Explicar juros compostos.

---

## Estratégia conservadora — exemplo educacional

```text
R$250 → Renda fixa
R$100 → ETFs
R$50 → Ações
```

---

## Estratégia equilibrada — exemplo educacional

```text
R$150 → Renda fixa
R$100 → ETFs
R$100 → Ações
R$50 → FIIs
```

---

## Estratégia mais agressiva — exemplo educacional

```text
R$100 → Renda fixa
R$150 → ETFs
R$150 → Ações
```

⚠️ Deixar claro que são exemplos educacionais e não recomendações personalizadas.

---

## Diversificação

Ensinar diversificação entre:

- Empresas
- Setores
- Países
- Classes de ativos

---

# 🌎 Aula 6 — ETFs

## O que é ETF?

ETF é um fundo negociado em bolsa que busca acompanhar determinado índice ou estratégia.

---

## Exemplo

Um ETF pode acompanhar um índice de ações brasileiras.

Em vez de comprar diversas ações individualmente, o investidor compra uma cota do ETF.

---

## Vantagens

- Diversificação
- Praticidade
- Menor necessidade de análise individual
- Exposição a índices
- Facilidade de aporte

---

## Desvantagens

- Taxa de administração
- Menor controle sobre as empresas
- Pode cair junto com o mercado
- Não elimina risco

---

## ETF brasileiro vs internacional

Explicar as diferenças.

---

## ETFs para iniciantes

Explicar por que a diversificação pode ser útil para quem ainda está aprendendo análise fundamentalista.

---

# 🔬 Aula 7 — Como analisar uma ação brasileira de verdade

Esta deve ser uma aula prática.

Criar uma interface onde o usuário possa selecionar uma empresa brasileira.

### Exemplos

- Itaú
- Petrobras
- Vale
- WEG
- Banco do Brasil
- Engie
- Taesa
- Localiza
- B3

---

## Estrutura da análise

Para cada empresa mostrar:

1. O que a empresa faz?
2. Como ganha dinheiro?
3. Receita
4. Lucro
5. Margem
6. ROE
7. Dívida
8. Fluxo de caixa
9. P/L
10. P/VP
11. Dividend Yield
12. Crescimento
13. Riscos
14. Perspectivas
15. Valuation

---

## Resumo

Criar três categorias:

### 🟢 Pontos positivos

### 🟡 Pontos de atenção

### 🔴 Riscos

E um resumo:

- Empresa de qualidade?
- Preço parece razoável?
- Quais são os principais riscos?

Os dados devem ser tratados como exemplos educacionais caso não exista integração com dados financeiros em tempo real.

---

# 🏦 Aula 8 — Como escolher entre setores

## Bancos

Exemplos:

- Itaú
- Bradesco
- Banco do Brasil

Analisar:

- ROE
- Inadimplência
- Margem financeira
- Eficiência
- Crescimento da carteira
- Qualidade dos ativos

---

## Petróleo

Exemplo:

**Petrobras**

Analisar:

- Preço do petróleo
- Produção
- Reservas
- Custos
- Dividendos
- Política de preços
- Riscos políticos

---

## Mineração

Exemplo:

**Vale**

Analisar:

- Minério de ferro
- Preço das commodities
- Produção
- Custos
- China
- Dividendos

---

## Energia elétrica

Analisar:

- Receitas previsíveis
- Contratos
- Dívida
- Concessões
- Dividendos
- Regulação

---

## Varejo

Analisar:

- Crescimento das vendas
- Margem
- Endividamento
- Consumo
- Juros
- Concorrência

---

## Tecnologia

Analisar:

- Crescimento
- Margem
- Inovação
- Vantagem competitiva
- Valuation

---

## Conceito importante

> Não existe um setor que seja permanentemente o melhor.

Cada setor possui:

- Ciclos
- Oportunidades
- Riscos
- Características próprias

---

# ⚠️ Aula 9 — Riscos e como não perder dinheiro

Esta aula deve ter bastante destaque visual.

## Risco de mercado

A ação pode cair.

---

## Risco da empresa

A empresa pode:

- Perder competitividade
- Perder mercado
- Reduzir lucros
- Ter problemas operacionais

---

## Risco de dívida

Juros e endividamento podem prejudicar a empresa.

---

## Risco político

Principalmente em:

- Estatais
- Setores regulados

---

## Risco cambial

Empresas expostas ao dólar podem ser beneficiadas ou prejudicadas pelas variações cambiais.

---

## Risco de concentração

Não colocar todo o patrimônio em uma única empresa.

---

## Risco de setor

Um setor inteiro pode enfrentar dificuldades.

---

## Risco de valuation

Comprar uma empresa excelente por um preço exageradamente alto.

---

## Risco emocional

Criar nós especiais:

- 😨 Medo
- 🤑 Ganância
- FOMO
- Vender no pânico
- Comprar porque todo mundo está comprando
- Tentar prever o mercado

---

## Regras de segurança

1. Não investir dinheiro que será necessário imediatamente.
2. Diversificar.
3. Conhecer a empresa.
4. Não seguir dicas cegamente.
5. Não usar dinheiro emprestado para investir.
6. Ter uma reserva de emergência.
7. Pensar no longo prazo.
8. Entender que perdas fazem parte da renda variável.

---

# 🚀 Aula 10 — Montando sua primeira carteira

Criar uma aula prática e interativa.

O usuário informa:

- Aporte mensal
- Horizonte de investimento
- Tolerância ao risco
- Objetivo
- Patrimônio inicial

O sistema pode mostrar uma **simulação educacional**.

---

## Exemplo de perfil equilibrado

Aporte:

```text
R$400/mês
```

Distribuição ilustrativa:

```text
40% → Renda fixa
25% → ETFs
20% → Ações
15% → FIIs
```

Mostrar:

```text
R$400/mês
     ↓
R$4.800/ano
     ↓
R$24.000 em 5 anos de aportes
     ↓
Efeito dos juros compostos
```

⚠️ Deixar extremamente claro que projeções são simulações e não garantias de retorno.

---

# ⚙️ Funcionalidades do site

## 1. Mapa mental

O mapa deve permitir:

- Zoom
- Arrastar
- Expandir nós
- Recolher nós
- Clicar em conceitos
- Reorganizar visualmente
- Voltar ao centro
- Expandir tudo
- Recolher tudo

---

## 2. Progresso

Cada aula deve possuir três estados:

- ⭕ Não iniciada
- 🟡 Em andamento
- 🟢 Concluída

Mostrar:

```text
Progresso: 0/10 aulas
```

Salvar o progresso no `localStorage`.

---

# 🔎 3. Pesquisa

Adicionar busca global.

Exemplo:

Usuário pesquisa:

```text
P/L
```

O sistema deve encontrar:

```text
Aula 2 → P/L
Aula 3 → P/L
```

---

# 📖 4. Glossário

Criar uma seção com:

- Ação
- Acionista
- B3
- Dividendos
- Dividend Yield
- P/L
- P/VP
- ROE
- EBITDA
- Receita
- Lucro
- Margem
- Valuation
- ETF
- FII
- IPO
- Selic
- CDI

Cada termo deve possuir uma explicação simples.

---

# 🧠 5. Quiz

Ao final de cada aula criar de **3 a 5 perguntas**.

### Exemplo

> Você comprou 100 ações por R$10 e vendeu por R$15. Qual foi o lucro bruto?

- A) R$100
- B) R$300
- C) R$500
- D) R$1.500

### Resposta

**C) R$500**

Mostrar uma explicação após a resposta.

---

# 🌙 6. Modo escuro

A interface deve ser principalmente dark mode.

Visual:

- Fundo escuro
- Cards modernos
- Bordas suaves
- Sombras discretas
- Animações suaves
- Tipografia limpa
- Ícones Lucide
- Cores diferentes para cada categoria

---

# 📱 7. Responsividade

O site deve funcionar em:

- Desktop
- Notebook
- Tablet
- Celular

### Desktop

Priorizar o mapa mental.

### Mobile

Transformar o mapa em uma estrutura hierárquica navegável.

---

# 🎨 Design

Quero um visual moderno de uma plataforma financeira/educacional.

A interface deve parecer uma mistura de:

> **Mapa mental + plataforma de estudos + aplicativo financeiro**

Evitar aparência de dashboard empresarial tradicional.

---

# 🏠 Página inicial

No topo:

# 📈 Investimentos em Ações

### Do zero à sua primeira carteira

Mostrar:

```text
10 aulas

Progresso: 0/10

Aporte estudado: R$400/mês
```

Abaixo, colocar o mapa mental ocupando a maior parte da tela.

---

# ⚠️ Importante

O conteúdo é **educacional**.

Não apresentar nenhuma ação como:

- Compra garantida
- Investimento sem risco
- Retorno garantido

Sempre diferenciar:

- Fato
- Exemplo
- Estimativa
- Opinião
- Recomendação

Quando houver cálculos de rentabilidade:

> Deixar claro que são simulações e que rentabilidade passada não garante rentabilidade futura.

---

# 🗂️ Arquitetura de dados

O conteúdo das aulas, conceitos, fórmulas e quizzes deve ficar estruturado em arquivos/dados separados, para facilitar a expansão futura.

Exemplo conceitual:

```text
src/
├── components/
├── pages/
├── data/
│   ├── aulas.ts
│   ├── conceitos.ts
│   ├── glossario.ts
│   └── quizzes.ts
├── hooks/
├── utils/
└── App.tsx
```

O sistema deve permitir adicionar facilmente:

- Aula 11
- Aula 12
- Novos conceitos
- Novos quizzes
- Novas empresas
- Novos setores

sem precisar reconstruir o mapa mental.

---

# 🚀 Resultado esperado

Quero receber um projeto **completo e funcional**, não apenas um mockup.

O site deve iniciar com:

```bash
npm install
```

e depois:

```bash
npm run dev
```

O resultado final deve ser uma plataforma pessoal de estudos onde eu consiga aprender sobre ações desde o nível iniciante até conseguir montar minha primeira carteira de investimentos.