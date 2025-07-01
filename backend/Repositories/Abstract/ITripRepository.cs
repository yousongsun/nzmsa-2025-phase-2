using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories.Abstract
{
    public interface ITripRepository
    {
        Task<Trip?> GetByIdAsync(long id);
        Task<IEnumerable<Trip>> GetAllAsync();
        Task<IEnumerable<Trip>> GetTripsByUserIdAsync(long userId);
        Task<Trip?> GetTripByIdAsync(long id);
        Task<Trip> AddAsync(Trip trip);
        Task<Trip> UpdateAsync(Trip trip);
        Task DeleteAsync(long id);
    }
} 