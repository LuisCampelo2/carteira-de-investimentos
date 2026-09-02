#!/bin/bash
set -euo pipefail

# Pede a senha do banco na hora — nunca fica gravada em nenhum arquivo do repo.
read -s -p "Senha para o usuário Postgres 'mapa_mental': " DB_PASSWORD
echo

# 1. Dependências do sistema
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs postgresql postgresql-contrib nginx git
npm install -g pm2

# 2. Banco Postgres (idempotente — seguro rodar de novo se já existir)
sudo -u postgres psql -c "DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'mapa_mental') THEN
    CREATE ROLE mapa_mental WITH LOGIN PASSWORD '${DB_PASSWORD}';
  ELSE
    ALTER ROLE mapa_mental WITH LOGIN PASSWORD '${DB_PASSWORD}';
  END IF;
END \$\$;"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'mapa_mental_investimento'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE mapa_mental_investimento OWNER mapa_mental;"

# 3. Clonar projeto (idempotente — se já existe, atualiza em vez de clonar)
mkdir -p /var/www
if [ -d /var/www/mapa-mental-investimento/.git ]; then
  cd /var/www/mapa-mental-investimento
  git pull
else
  git clone https://github.com/LuisCampelo2/carteira-de-investimentos.git /var/www/mapa-mental-investimento
  cd /var/www/mapa-mental-investimento
fi
# package-lock.json foi gerado no Windows do dev — reinstalar do zero aqui
# evita um bug do npm que resolve o binário nativo errado do Vite/Rolldown
# para linux-x64 (https://github.com/npm/cli/issues/4828).
rm -rf node_modules package-lock.json frontend/node_modules backend/node_modules
npm install

# 4. Configurar backend/.env
# A porta padrão 5432 pode já estar em uso (ex: um container Docker com
# outro Postgres) — nesse caso o apt aloca a próxima porta livre pro
# cluster que acabamos de criar. Detecta a porta real em vez de assumir 5432.
PG_PORT=$(pg_lsclusters -h | awk '{print $3}' | head -n1)
# Preserva um BRAPI_TOKEN já configurado manualmente num deploy anterior —
# sem isso, rodar o script de novo apagava o token e as ações/ETFs/FIIs
# paravam de atualizar preço até alguém notar e configurar tudo de novo.
EXISTING_BRAPI_TOKEN=""
if [ -f backend/.env ]; then
  EXISTING_BRAPI_TOKEN=$(grep '^BRAPI_TOKEN=' backend/.env | head -n1 | cut -d'=' -f2-)
fi
cat > backend/.env <<EOF
PGHOST=localhost
PGPORT=${PG_PORT}
PGUSER=mapa_mental
PGPASSWORD=${DB_PASSWORD}
PGDATABASE=mapa_mental_investimento
PORT=3002
BRAPI_TOKEN=${EXISTING_BRAPI_TOKEN}
EOF

# 5. Build
npm run build -w backend
VITE_API_URL='' npm run build -w frontend

# 6. Migrations + seed
npm run db:migrate
npm run db:seed

# 7. PM2 (idempotente — reinicia se já estiver rodando)
pm2 startOrRestart deploy/ecosystem.config.cjs
pm2 save

# 8. Nginx
cp deploy/nginx.conf.example /etc/nginx/sites-available/mapa-mental
ln -sf /etc/nginx/sites-available/mapa-mental /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "Pronto! Acesse http://2.24.108.221/"
echo "Rode 'pm2 startup' e execute o comando que ele imprimir para sobreviver a reboot."
