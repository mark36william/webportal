using Microsoft.EntityFrameworkCore;
using WebPortal.API.Data;
using WebPortal.API.Models;

namespace WebPortal.API.Repositories;

public class UserRepository : Repository<ApplicationUser, string>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<ApplicationUser> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<ApplicationUser> GetByUsernameAsync(string username)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.UserName == username);
    }

    public async Task<bool> UserExistsAsync(string email, string username)
    {
        return await _dbSet.AnyAsync(u => u.Email == email || u.UserName == username);
    }
}
