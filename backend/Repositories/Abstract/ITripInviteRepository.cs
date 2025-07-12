using backend.Models;

namespace backend.Repositories.Abstract
{
    public interface ITripInviteRepository
    {
        Task<TripInvite> AddAsync(TripInvite invite);
        Task<IEnumerable<TripInvite>> GetByEmailAsync(string email);
        Task DeleteAsync(long id);
    }
}
