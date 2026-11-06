using GameStore.Models;

namespace GameStore.Dtos;

public record GameDto(int Id, string Name, string Genre, 
    decimal Price, DateOnly ReleaseDate);

public record CreateGameDto(string Name,int GenreId,
    decimal Price, DateOnly ReleaseDate);

public record UpdateGameDto(string Name, int GenreId,
    decimal Price, DateOnly ReleaseDate);

public record ClientGameDetailsDto(int Id, string Name, int GenreId, 
    decimal Price, DateOnly ReleaseDate)
{
    public static explicit operator ClientGameDetailsDto(Game game)
    {
        if (game is null) throw new ArgumentNullException();

        return new(game.Id, game.Name, game.GenreId, game.Price, game.ReleaseDate);
    }
}