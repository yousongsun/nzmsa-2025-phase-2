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
                    var verification = passwordHasher.VerifyHashedPassword(string.Empty, user.Password, password);

                    if (verification == PasswordVerificationResult.Success)
                    {
                        return user;
                    }

                    if (user.Password == password)
                    {
                        // migrate plain-text password to hashed version
                        user.Password = passwordHasher.HashPassword(string.Empty, password);
                        await _context.SaveChangesAsync();
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

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
            return user;
        }

        public async Task AddUserAsync(User user)
        {
            if (user.Email != null && await EmailExists(user.Email))
            {
                throw new InvalidOperationException($"A user with email '{user.Email}' already exists.");
            }

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
            if (!string.IsNullOrEmpty(user.Password))
            {
                user.Password = HashPassword(user.Password);
            }

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
            return await _context.Users.AnyAsync(e => e.UserId == id);
        }

        public async Task BulkAddUsersAsync(IEnumerable<User> users)
        {
            var userList = users.ToList();

            // check for duplicate emails in provided list
            var duplicateEmails = userList
                .Where(u => u.Email != null)
                .GroupBy(u => u.Email!.ToLowerInvariant())
                .Where(g => g.Count() > 1)
                .Select(g => g.Key)
                .ToList();

            if (duplicateEmails.Any())
            {
                throw new InvalidOperationException($"Duplicate emails provided: {string.Join(", ", duplicateEmails)}");
            }

            // check for existing emails in DB
            var emails = userList.Where(u => u.Email != null)
                                 .Select(u => u.Email)
                                 .ToList();

            var existingEmails = await _context.Users
                .Where(u => emails.Contains(u.Email))
                .Select(u => u.Email)
                .ToListAsync();

            if (existingEmails.Any())
            {
                throw new InvalidOperationException($"Users with emails already exist: {string.Join(", ", existingEmails)}");
            }

            // hash passwords
            foreach (var user in userList)
            {
                if (!string.IsNullOrEmpty(user.Password))
                {
                    user.Password = HashPassword(user.Password);
                }
            }

            await _context.Users.AddRangeAsync(userList);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<User>> SearchUsersAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<User>();
            }

            query = query.ToLowerInvariant();

            return await _context.Users
                .Where(u =>
                    (!string.IsNullOrEmpty(u.FirstName) && u.FirstName.ToLower().Contains(query)) ||
                    (!string.IsNullOrEmpty(u.LastName) && u.LastName.ToLower().Contains(query)) ||
                    (!string.IsNullOrEmpty(u.Email) && u.Email.ToLower().Contains(query)))
                .ToListAsync();
        }
    }
}
