using backend.Context;
using backend.Models;
using backend.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Repositories.Concrete
{
    public class FollowRepository : IFollowRepository
    {
        private readonly AppDbContext _context;

        public FollowRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task FollowUserAsync(long followerId, long followingId)
        {
            var follow = new Follow { FollowerId = followerId, FollowingId = followingId };
            await _context.Follows.AddAsync(follow);
            await _context.SaveChangesAsync();
        }

        public async Task UnfollowUserAsync(long followerId, long followingId)
        {
            var follow = await _context.Follows
                .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowingId == followingId);
            if (follow != null)
            {
                _context.Follows.Remove(follow);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<User>> GetFollowersAsync(long userId)
        {
            return await _context.Follows
                .Where(f => f.FollowingId == userId && f.Follower != null)
                .Select(f => f.Follower!)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetFollowingAsync(long userId)
        {
            return await _context.Follows
                .Where(f => f.FollowerId == userId && f.Following != null)
                .Select(f => f.Following!)
                .ToListAsync();
        }

        public async Task<bool> IsFollowingAsync(long followerId, long followingId)
        {
            return await _context.Follows
                .AnyAsync(f => f.FollowerId == followerId && f.FollowingId == followingId);
        }
    }
}