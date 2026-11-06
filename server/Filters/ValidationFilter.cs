using FluentValidation;

namespace GameStore.Filters;

public class ValidationFilter<T> : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync
        (EndpointFilterInvocationContext context, 
        EndpointFilterDelegate next)
    {
        var dto = context.Arguments.OfType<T>().FirstOrDefault();

        if (dto is not null)
        {
            var validator = context.HttpContext.RequestServices.GetService<IValidator<T>>();

            if (validator is not null)
            {
                var validationResult = await validator.ValidateAsync(dto, 
                    context.HttpContext.RequestAborted);
                if (!validationResult.IsValid)
                    return Results.ValidationProblem(validationResult.ToDictionary());
            }
        }

        return await next(context);
    }
}
