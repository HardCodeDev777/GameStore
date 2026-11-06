using GameStore.Data;
using GameStore.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Middleware;

public static class DbMiddlewareExtensions
{
    public static async Task MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;

        var dbContext = services.GetRequiredService<StoreDbContext>();
        dbContext.Database.Migrate();

        await SeedWithRoles(services);
    }

    private static async Task SeedWithRoles(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<StoreUser>>();

        const string adminRole = "Admin";
        const string userRole = "User";
        if (!await roleManager.RoleExistsAsync(adminRole))
            await roleManager.CreateAsync(new IdentityRole(adminRole));
        if (!await roleManager.RoleExistsAsync(userRole))
            await roleManager.CreateAsync(new IdentityRole(userRole));

        var adminUserName = "admin";
        var adminUser = await userManager.FindByNameAsync(adminUserName);

        if (adminUser is null)
        {
            adminUser = new StoreUser
            {
                UserName = adminUserName,
                Name = "System Administrator"
            };

            var createdResult = await userManager.CreateAsync(adminUser, "AdminPa$$w0rd1!"); // Pet project
            if (createdResult.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, adminRole);
            }
        }
    }
}
