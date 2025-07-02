using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories.Abstract
{
    public interface IItineraryItemRepository
    {
        Task<ItineraryItem?> GetByIdAsync(long id);
        Task<IEnumerable<ItineraryItem>> GetAllAsync();
        Task<IEnumerable<ItineraryItem>> GetByTripIdAsync(long tripId);
        Task<ItineraryItem> AddAsync(ItineraryItem itineraryItem);
        Task<ItineraryItem> UpdateAsync(ItineraryItem itineraryItem);
        Task DeleteAsync(long id);
    }
}