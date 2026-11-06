@echo off

start "Server (.NET)" cmd /k "cd server && dotnet run"
start "Frontend (NPM)" cmd /k "cd frontend\GameStoreSite && npm run dev"

pause