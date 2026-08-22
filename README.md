# Mapa Mental Interativo de Investimentos

Monorepo com duas partes:

- `frontend/` — React + Vite + TypeScript (o mapa mental, aulas, simulador de carteira).
- `backend/` — Node + Express + PostgreSQL (persiste a Minha Carteira, o progresso das aulas, e os dados de investimentos/empresas).

## Pré-requisitos

- Node.js
- PostgreSQL rodando localmente (sem Docker)

## Configuração inicial

1. Instalar dependências (na raiz, cobre os dois workspaces):

   ```
   npm install
   ```

2. Criar o banco e copiar as variáveis de ambiente do backend:

   ```
   createdb mapa_mental_investimento
   cp backend/.env.example backend/.env
   ```

   Edite `backend/.env` com o usuário/senha do seu Postgres local.

3. Aplicar o schema e popular os dados de investimentos/empresas:

   ```
   npm run db:migrate
   npm run db:seed
   ```

   `db:seed` é idempotente (upsert por id) — pode rodar de novo sempre que os dados em `backend/src/db/seedData.ts` mudarem.

## Rodando em desenvolvimento

```
npm run dev
```

Sobe o frontend (`http://localhost:5173` por padrão) e o backend (`http://localhost:3001`) juntos. Para rodar cada um separado: `npm run dev:frontend` / `npm run dev:backend`.

## Build

```
npm run build
```
# carteira-de-investimentos
