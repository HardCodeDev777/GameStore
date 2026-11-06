# GameStore

Pet project for learning backend with ASP.NET Core. The frontend was built with an AI agent.

## Tech Stack

- .NET 10, ASP.NET Core Minimal API
- PostgreSQL, Entity Framework Core
- ASP.NET Core Identity, JWT authentication
- FluentValidation, Swagger
- Docker Compose

## Features

- User registration and login
- Browse games and view game details
- Admin-only game management (create, update, delete)
- Game data includes name, genre, price, and release date

## Architecture

- Minimal API endpoints are separated from game operations through a service interface.
- DTOs define API request and response data; FluentValidation validates game input.
- EF Core manages persistence and database migrations.
- Role-based authorization restricts game management to administrators.

## Test Account

- Admin username: `admin`
- Admin password: `AdminPa$$w0rd1!`
- Frontend: `http://localhost:5173`
