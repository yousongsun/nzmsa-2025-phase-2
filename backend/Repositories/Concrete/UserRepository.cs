using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using backend.Context;
using backend.Models;
using backend.Repositories.Abstract;

namespace backend.Repositories.Concrete
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(long id)
        {
            var user = await _context.Users.FindAsync(id) ?? throw new KeyNotFoundException($"User with ID {id} not found.");
            return user;
        }

        public async Task<User> GetUserByEmailPasswordAsync(string email, string password)
        {
            // Fetch the user by email
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);

            if (user != null)
            {
                var passwordHasher = new PasswordHasher<string>();
                if (!string.IsNullOrEmpty(user.Password))
                {
                    var passwordVerificationResult = passwordHasher.VerifyHashedPassword(string.Empty, user.Password, password);

                    if (passwordVerificationResult == PasswordVerificationResult.Success)
                    {
                        return user;
                    }
                }
            }

            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        public async Task<bool> EmailExists(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task AddUserAsync(User user)
        {
            // Hash the password before saving
            if (!string.IsNullOrEmpty(user.Password))
            {
                user.Password = HashPassword(user.Password);
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        private string HashPassword(string password)
        {
            var passwordHasher = new PasswordHasher<string>();
            return passwordHasher.HashPassword(string.Empty, password);
        }

        public async Task UpdateUserAsync(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(long id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> UserExistsAsync(long id)
        {
            return await _context.Users.AnyAsync(e => e.Id == id);
        }

        public async Task BulkAddUsersAsync(IEnumerable<User> users)
        {
            await _context.Users.AddRangeAsync(users);
            await _context.SaveChangesAsync();
        }
    }
}
