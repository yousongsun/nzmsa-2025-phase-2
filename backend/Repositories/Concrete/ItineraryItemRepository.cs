using backend.Context;
using backend.Models;
using backend.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Repositories.Concrete
{
    public class ItineraryItemRepository : IItineraryItemRepository
    {
        private readonly AppDbContext _context;

        public ItineraryItemRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ItineraryItem?> GetByIdAsync(long id)
        {
            return await _context.ItineraryItems.FindAsync(id);
        }

        public async Task<IEnumerable<ItineraryItem>> GetAllAsync()
        {
            return await _context.ItineraryItems.ToListAsync();
        }

        public async Task<IEnumerable<ItineraryItem>> GetByTripIdAsync(long tripId)
        {
            return await _context.ItineraryItems
                                 .Where(i => i.TripId == tripId)
                                 .ToListAsync();
        }

        public async Task<ItineraryItem> AddAsync(ItineraryItem itineraryItem)
        {
            _context.ItineraryItems.Add(itineraryItem);
            await _context.SaveChangesAsync();
            return itineraryItem;
        }

        public async Task<ItineraryItem> UpdateAsync(ItineraryItem itineraryItem)
        {
            _context.Entry(itineraryItem).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return itineraryItem;
        }

        public async Task DeleteAsync(long id)
        {
            var itineraryItem = await _context.ItineraryItems.FindAsync(id);
            if (itineraryItem != null)
            {
                _context.ItineraryItems.Remove(itineraryItem);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ItineraryItemExistsAsync(long id)
        {
            return await _context.ItineraryItems.AnyAsync(e => e.ItineraryItemId == id);
        }
    }
}