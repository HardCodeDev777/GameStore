using GameStore.Dtos;
using GameStore.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GameStore.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/auth");

        group.MapPost("/register", async (RegisterDto dto, UserManager<StoreUser> userManager) =>
        {
            var user = new StoreUser { UserName = dto.Username, Name = dto.Username };
            var result = await userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => new[] { e.Description });
                return Results.ValidationProblem(errors);
            }
            else
            {
                await userManager.AddToRoleAsync(user, "User");
            }

            return Results.Ok();
        });

        group.MapPost("/login", async (LoginDto dto, UserManager<StoreUser> userManager, 
            IConfiguration config) =>
        {
            var user = await userManager.FindByNameAsync(dto.Username);

            if (user is null || !await userManager.CheckPasswordAsync(user, dto.Password))
                return Results.Unauthorized();

            var roles = await userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Name, user.UserName!)
            };

            foreach (var role in roles)
                claims.Add(new(ClaimTypes.Role, role));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = config["Jwt:Issuer"],
                Audience = config["Jwt:Audience"],
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Results.Ok(new {Token = tokenString});
        });
    }
}
