using backend.Context;
using backend.Models;
using backend.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Repositories.Concrete
{
    public class SharedTripRepository : ISharedTripRepository
    {
        private readonly AppDbContext _context;

        public SharedTripRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<SharedTrip?> GetByIdAsync(long id)
        {
            return await _context.SharedTrips.FindAsync(id);
        }

        public async Task<IEnumerable<SharedTrip>> GetAllAsync()
        {
            return await _context.SharedTrips.ToListAsync();
        }

        public async Task<IEnumerable<SharedTrip>> GetByTripIdAsync(long tripId)
        {
            return await _context.SharedTrips
                                 .Where(st => st.TripId == tripId)
                                 .ToListAsync();
        }

        public async Task<SharedTrip> AddAsync(SharedTrip sharedTrip)
        {
            _context.SharedTrips.Add(sharedTrip);
            await _context.SaveChangesAsync();
            return sharedTrip;
        }

        public async Task<SharedTrip> UpdateAsync(SharedTrip sharedTrip)
        {
            _context.Entry(sharedTrip).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return sharedTrip;
        }

        public async Task DeleteAsync(long id)
        {
            var sharedTrip = await _context.SharedTrips.FindAsync(id);
            if (sharedTrip != null)
            {
                _context.SharedTrips.Remove(sharedTrip);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> SharedTripExistsAsync(long id)
        {
            return await _context.SharedTrips.AnyAsync(e => e.SharedTripId == id);
        }
    }
}