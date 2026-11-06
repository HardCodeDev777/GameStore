using Microsoft.AspNetCore.Identity;

namespace GameStore.Users;

public class StoreUser : IdentityUser
{
    public string? Name { get; set; }
    public string? Password { get; set;  }
}
