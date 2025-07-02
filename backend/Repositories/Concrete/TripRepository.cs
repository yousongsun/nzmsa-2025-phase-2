using backend.Context;
using backend.Models;
using backend.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Repositories.Concrete
{
    public class TripRepository : ITripRepository
    {
        private readonly AppDbContext _context;

        public TripRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Trip>> GetTripsByUserIdAsync(long userId)
        {
            return await _context.Trips.Where(t => t.UserId == userId).ToListAsync();
        }

        public async Task<Trip?> GetTripByIdAsync(long id)
        {
            return await _context.Trips.FindAsync(id);
        }

        public async Task<Trip?> GetByIdAsync(long id)
        {
            return await _context.Trips.FindAsync(id);
        }

        public async Task<IEnumerable<Trip>> GetAllAsync()
        {
            return await _context.Trips.ToListAsync();
        }

        public async Task<Trip> AddAsync(Trip trip)
        {
            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();
            return trip;
        }

        public async Task<Trip> UpdateAsync(Trip trip)
        {
            _context.Entry(trip).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return trip;
        }

        public async Task DeleteAsync(long id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip != null)
            {
                _context.Trips.Remove(trip);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> TripExistsAsync(long id)
        {
            return await _context.Trips.AnyAsync(e => e.TripId == id);
        }
    }
}