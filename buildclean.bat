@echo off
docker compose down -v
docker compose build --no-cache
docker compose up -d --force-recreate
pause