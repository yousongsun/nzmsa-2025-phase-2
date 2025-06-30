using backend.Models;

namespace backend.Repositories.Abstract
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(long id);
        Task<User> GetUserByEmailPasswordAsync(string email, string password);
        Task<bool> EmailExists(string email);
        Task<User?> GetUserByEmailAsync(string email);
        Task AddUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(long id);
        Task<bool> UserExistsAsync(long id);
        Task BulkAddUsersAsync(IEnumerable<User> users);
    }
}
