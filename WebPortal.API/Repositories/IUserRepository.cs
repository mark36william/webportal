using WebPortal.API.Models;

namespace WebPortal.API.Repositories;

public interface IUserRepository : IRepository<ApplicationUser, string>
{
    Task<ApplicationUser> GetByEmailAsync(string email);
    Task<ApplicationUser> GetByUsernameAsync(string username);
    Task<bool> UserExistsAsync(string email, string username);
}
