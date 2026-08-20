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
  description text NOT NULL
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
  price_summary text NOT NULL
);
