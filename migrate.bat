@echo off

cd server

set /p migrationName="Migration Name: "

dotnet ef database drop
dotnet ef migrations add %migrationName% --output-dir Migrations
dotnet ef database update

echo Done.
pause