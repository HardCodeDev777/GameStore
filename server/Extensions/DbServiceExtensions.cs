using GameStore.Data;
using GameStore.Models;
using GameStore.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Extensions;

public static class DbServiceExtensions
{
    public static void AddGameStoreDb(this WebApplicationBuilder builder)
    {
        var connString = builder.Configuration.GetConnectionString("GameStoreDbSource");
        builder.Services.AddDbContext<StoreDbContext>(
            options => options.UseNpgsql(connString)
                .UseSeeding((context, _) =>
                {
                    if (!context.Set<Genre>().Any())
                    {
                        context.Set<Genre>().AddRange(
                            new Genre { Name = "Survival" },
                            new Genre { Name = "RPG" },
                            new Genre { Name = "Fiction" },
                            new Genre { Name = "Horror" },
                            new Genre { Name = "Shooter" }
                            );

                        context.SaveChanges();
                    }
                }),
            contextLifetime: ServiceLifetime.Scoped,
            optionsLifetime: ServiceLifetime.Scoped
            );

        builder.Services.AddIdentityCore<StoreUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<StoreDbContext>();
    }
}
