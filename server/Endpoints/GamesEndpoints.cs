using FluentValidation;
using GameStore.Dtos;
using GameStore.Filters;
using GameStore.Services;

namespace GameStore.Endpoints;

public static class GamesEndpoints
{
    private const string _GetGameEndpointName = "GetGame";

    public static void MapGamesEndpoints(this WebApplication app)
    {
        // GET /
        // app.MapGet("/", () => Results.Redirect("/swagger"));

        var group = app.MapGroup("/games");

        // GET /games
        group.MapGet("/", async (IGameService gameService, CancellationToken ct) =>
            Results.Ok(await gameService.GetAllGamesAsync(ct))
        );

        // GET /games/1
        group.MapGet("/{id}", async (int id, IGameService gameService, CancellationToken ct) =>
        {
            var game = await gameService.GetGameAsync(id, ct);

            return game is null ? 
            Results.NotFound() : 
            Results.Ok(game);
        })
        .WithName(_GetGameEndpointName);

        // POST /games
        group.MapPost("/", async (CreateGameDto newGame, IGameService gameService,
            CancellationToken ct) =>
        {
            var createdGame = await gameService.CreateGameAsync(newGame, ct);

            return Results.CreatedAtRoute(_GetGameEndpointName,
                new { id = createdGame.Id }, createdGame);
        })
        .AddEndpointFilter<ValidationFilter<CreateGameDto>>()
        .RequireAuthorization(policy => policy.RequireRole("Admin"));

        // PUT /games/1
        group.MapPut("/{id}", async (int id, UpdateGameDto updatedGame, 
            IGameService gameService, CancellationToken ct) =>
        {
            var isUpdated = await gameService.UpdateGameAsync(id, updatedGame, ct);
            return isUpdated ? Results.NoContent() : Results.NotFound();
        })
        .RequireAuthorization(policy => policy.RequireRole("Admin")); ;

        // DELETE /games/1
        group.MapDelete("/{id}", async (int id, IGameService gameService, CancellationToken ct) =>
        {
            await gameService.DeleteGameAsync(id, ct);

            return Results.NoContent();
        })
        .RequireAuthorization(policy => policy.RequireRole("Admin")); ;
    }
}
