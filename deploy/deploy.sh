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

# 2. Banco Postgres
sudo -u postgres psql -c "CREATE USER mapa_mental WITH PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "CREATE DATABASE mapa_mental_investimento OWNER mapa_mental;"

# 3. Clonar projeto
mkdir -p /var/www && cd /var/www
git clone https://github.com/LuisCampelo2/carteira-de-investimentos.git mapa-mental-investimento
cd /var/www/mapa-mental-investimento
npm install

# 4. Configurar backend/.env
cat > backend/.env <<EOF
PGHOST=localhost
PGPORT=5432
PGUSER=mapa_mental
PGPASSWORD=${DB_PASSWORD}
PGDATABASE=mapa_mental_investimento
PORT=3001
BRAPI_TOKEN=
EOF

# 5. Build
npm run build -w backend
VITE_API_URL='' npm run build -w frontend

# 6. Migrations + seed
npm run db:migrate
npm run db:seed

# 7. PM2
pm2 start deploy/ecosystem.config.cjs
pm2 save

# 8. Nginx
cp deploy/nginx.conf.example /etc/nginx/sites-available/mapa-mental
ln -sf /etc/nginx/sites-available/mapa-mental /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "Pronto! Acesse http://2.24.108.221/"
echo "Rode 'pm2 startup' e execute o comando que ele imprimir para sobreviver a reboot."
