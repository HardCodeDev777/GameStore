using FluentValidation;
using GameStore.Dtos;

namespace GameStore.Validators;

public class UpdateGameDtoValidator : AbstractValidator<UpdateGameDto>
{
    public UpdateGameDtoValidator()
    {
        RuleFor(game => game.Name)
            .NotEmpty().WithMessage("Game name cannot be empty")
            .MaximumLength(15).WithMessage("Game name lenght cannot be more than 15 characters");

        RuleFor(game => game.GenreId)
            .GreaterThan(0).WithMessage("Incorrect genre");

        RuleFor(game => game.Price)
            .InclusiveBetween(1, 100000).WithMessage("Price must be between 1 and 100 000");
    }
}
