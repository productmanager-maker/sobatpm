#!/bin/bash
set -e
SERVER="ichan@10.122.169.101"
REMOTE="/home/ichan/sales-bot"

echo "==> Buat direktori di server..."
ssh $SERVER "mkdir -p $REMOTE"

echo "==> Upload files..."
scp app.py sales_agent.py service-account.json .env \
    requirements.txt Dockerfile docker-compose.yml \
    $SERVER:$REMOTE/

echo "==> Build & jalankan container..."
ssh $SERVER "
  cd $REMOTE
  docker compose down --remove-orphans 2>/dev/null || true
  docker compose build --pull=never 2>/dev/null || docker compose build
  docker compose up -d
  sleep 3
  docker compose ps
  docker compose logs --tail=20
"

echo ""
echo "==> Deploy selesai!"
echo "    Live log : ssh $SERVER 'docker compose -C $REMOTE logs -f'"
echo "    Stop     : ssh $SERVER 'docker compose -C $REMOTE down'"
