using GameStore.Dtos;

namespace GameStore.Services;

public interface IGameService
{
    Task<IEnumerable<GameDto>> GetAllGamesAsync(CancellationToken ct);
    Task<ClientGameDetailsDto?> GetGameAsync(int id, CancellationToken ct);
    Task<ClientGameDetailsDto> CreateGameAsync(CreateGameDto newGame, CancellationToken ct);
    Task<bool> UpdateGameAsync(int id, UpdateGameDto updatedGame, CancellationToken ct);
    Task<bool> DeleteGameAsync(int id, CancellationToken ct);
}
