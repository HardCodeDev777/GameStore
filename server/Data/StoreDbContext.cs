using GameStore.Models;
using GameStore.Users;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Data;

public class StoreDbContext : IdentityDbContext<StoreUser>
{
    public StoreDbContext(DbContextOptions<StoreDbContext> options) : base(options) { }
    
    public DbSet<Game> Games => Set<Game>();
    public DbSet<Genre> Genres => Set<Genre>();
}
