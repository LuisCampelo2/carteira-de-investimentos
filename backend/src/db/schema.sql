CREATE TABLE IF NOT EXISTS carteira (
  id smallint PRIMARY KEY DEFAULT 1,
  items jsonb NOT NULL DEFAULT '[]',
  monthly_contribution numeric NOT NULL DEFAULT 0,
  initial_amount numeric NOT NULL DEFAULT 0,
  years integer NOT NULL DEFAULT 0,
  objective text NOT NULL DEFAULT '',
  risk text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT carteira_singleton CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS aula_progress (
  aula_id text PRIMARY KEY,
  status text NOT NULL DEFAULT 'not-started',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS investment_options (
  id text PRIMARY KEY,
  asset_class text NOT NULL,
  name text NOT NULL,
  ticker text,
  description text NOT NULL,
  market_info text,
  payout_frequency text
);

CREATE TABLE IF NOT EXISTS companies (
  id text PRIMARY KEY,
  name text NOT NULL,
  ticker text NOT NULL,
  sector text NOT NULL,
  what_it_does text NOT NULL,
  how_it_makes_money text NOT NULL,
  revenue text NOT NULL,
  profit text NOT NULL,
  margin text NOT NULL,
  roe text NOT NULL,
  debt text NOT NULL,
  cash_flow text NOT NULL,
  pl text NOT NULL,
  pvp text NOT NULL,
  dividend_yield text NOT NULL,
  growth text NOT NULL,
  risks jsonb NOT NULL DEFAULT '[]',
  outlook text NOT NULL,
  positives jsonb NOT NULL DEFAULT '[]',
  attention jsonb NOT NULL DEFAULT '[]',
  dangers jsonb NOT NULL DEFAULT '[]',
  quality_summary text NOT NULL,
  price_summary text NOT NULL,
  price_approx text,
  payout_frequency text
);

ALTER TABLE investment_options ADD COLUMN IF NOT EXISTS market_info text;
ALTER TABLE investment_options ADD COLUMN IF NOT EXISTS payout_frequency text;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS price_approx text;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS payout_frequency text;

-- Numeric price, in R$ per share, kept alongside price_approx (a formatted
-- display string like "R$ 38,35 (19/ago/2026)"). The portfolio simulator
-- needs the actual number to deduct the right amount when a stock is picked;
-- price_approx alone can't be parsed reliably for that.
ALTER TABLE companies ADD COLUMN IF NOT EXISTS price_value numeric;

-- Real payout data from brapi.dev (dividendYield + dividendsData modules),
-- only ever set from the live API — never hand-typed — since B3 doesn't
-- expose this for FIIs/ETFs on our plan and we don't want to guess it.
ALTER TABLE companies ADD COLUMN IF NOT EXISTS dividend_yield_value numeric;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS next_payment_date date;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS next_payment_amount numeric;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS next_payment_label text;
-- Mensal/Trimestral/Semestral/Anual, inferido dos intervalos reais entre os
-- pagamentos já anunciados (calculado no refresh, nunca digitado à mão).
ALTER TABLE companies ADD COLUMN IF NOT EXISTS payment_frequency text;

-- Same idea for investment_options: only set for classes with a real, whole
-- unit price a person actually buys (ETFs, FIIs) — left null for Renda
-- fixa/Multimercado/Previdência/Debêntures (amount-based, not unit-priced)
-- and for Criptomoedas (fractional by nature, doesn't fit a whole-unit
-- quantity stepper), which keep the equal-share fallback instead.
ALTER TABLE investment_options ADD COLUMN IF NOT EXISTS price_value numeric;

-- Rendimento mensal real dos FIIs, direto do Informe Mensal que os fundos
-- são obrigados a enviar à CVM (dados.cvm.gov.br) — só preenchido para os
-- FIIs mapeados em FII_CNPJ_BY_ID (src/db/cvmFii.ts), nunca digitado à mão.
ALTER TABLE investment_options ADD COLUMN IF NOT EXISTS dividend_yield_value numeric;
ALTER TABLE investment_options ADD COLUMN IF NOT EXISTS dividend_reference_month text;
