using GameStore.Data;
using GameStore.Dtos;
using GameStore.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Services;

public class GameService(StoreDbContext dbContext) : IGameService
{
    public async Task<ClientGameDetailsDto> CreateGameAsync(CreateGameDto newGame, CancellationToken ct)
    {
        var genreExists = await dbContext.Genres.AnyAsync(g => g.Id == newGame.GenreId, ct);
        if (!genreExists)
            throw new ArgumentException($"Genre with {newGame.GenreId} id not found");

        Game game = new()
        {
            Name = newGame.Name,
            GenreId = newGame.GenreId,
            Price = newGame.Price,
            ReleaseDate = newGame.ReleaseDate
        };

        dbContext.Games.Add(game);
        await dbContext.SaveChangesAsync(ct);

        return (ClientGameDetailsDto)game;
    }

    public async Task<bool> DeleteGameAsync(int id, CancellationToken ct)
    {
        var deletedCount = await dbContext.Games
            .Where(game => game.Id == id)
            .ExecuteDeleteAsync(ct);

        return deletedCount > 0;
    }

    public async Task<IEnumerable<GameDto>> GetAllGamesAsync(CancellationToken ct)
    {
        return await dbContext.Games
            .Include(game => game.Genre)
            .Select(game => new GameDto(
                game.Id,
                game.Name,
                game.Genre!.Name,
                game.Price,
                game.ReleaseDate))
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<ClientGameDetailsDto?> GetGameAsync(int id, CancellationToken ct)
    {
        var game = await dbContext.Games.FindAsync([id], ct);

        return game is null ? null : (ClientGameDetailsDto)game;
    }

    public async Task<bool> UpdateGameAsync(int id, UpdateGameDto updatedGame, CancellationToken ct)
    {
        var existingGame = await dbContext.Games.FindAsync([id], ct);

        if (existingGame is null) return false;

        existingGame.Name = updatedGame.Name;
        existingGame.GenreId = updatedGame.GenreId;
        existingGame.Price = updatedGame.Price;
        existingGame.ReleaseDate = updatedGame.ReleaseDate;

        await dbContext.SaveChangesAsync();

        return true;
    }
}
