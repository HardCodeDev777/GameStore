using FluentValidation;
using GameStore.Endpoints;
using GameStore.Extensions;
using GameStore.Infrastructure;
using GameStore.Middleware;
using GameStore.Services;

var builder = WebApplication.CreateBuilder();

// Exceptions
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Validation
builder.Services.AddValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Auth
builder.AddAuthWithJwt();

// Endpoints
builder.Services.AddEndpointsApiExplorer();
builder.AddSwaggerWithJwt();

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Main services
builder.AddGameStoreDb();
builder.Services.AddScoped<IGameService, GameService>();

var app = builder.Build();
app.UseExceptionHandler();

await app.MigrateDb();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseAuthentication(); 
app.UseAuthorization(); 

app.MapGamesEndpoints();
app.MapAuthEndpoints();

app.Run();