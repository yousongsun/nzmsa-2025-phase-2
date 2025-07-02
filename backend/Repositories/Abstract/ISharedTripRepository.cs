using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories.Abstract
{
    public interface ISharedTripRepository
    {
        Task<SharedTrip?> GetByIdAsync(long id);
        Task<IEnumerable<SharedTrip>> GetAllAsync();
        Task<IEnumerable<SharedTrip>> GetByTripIdAsync(long tripId);
        Task<SharedTrip> AddAsync(SharedTrip sharedTrip);
        Task<SharedTrip> UpdateAsync(SharedTrip sharedTrip);
        Task DeleteAsync(long id);
    }
}