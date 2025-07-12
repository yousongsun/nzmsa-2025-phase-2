using backend.Context;
using backend.Models;
using backend.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Concrete
{
    public class TripInviteRepository : ITripInviteRepository
    {
        private readonly AppDbContext _context;

        public TripInviteRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TripInvite> AddAsync(TripInvite invite)
        {
            _context.TripInvites.Add(invite);
            await _context.SaveChangesAsync();
            return invite;
        }

        public async Task<IEnumerable<TripInvite>> GetByEmailAsync(string email)
        {
            return await _context.TripInvites
                .Where(i => i.Email == email)
                .ToListAsync();
        }

        public async Task DeleteAsync(long id)
        {
            var invite = await _context.TripInvites.FindAsync(id);
            if (invite != null)
            {
                _context.TripInvites.Remove(invite);
                await _context.SaveChangesAsync();
            }
        }
    }
}
