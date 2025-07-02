using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories.Abstract
{
    public interface IFollowRepository
    {
        Task FollowUserAsync(long followerId, long followingId);
        Task UnfollowUserAsync(long followerId, long followingId);
        Task<IEnumerable<User>> GetFollowersAsync(long userId);
        Task<IEnumerable<User>> GetFollowingAsync(long userId);
        Task<bool> IsFollowingAsync(long followerId, long followingId);
    }
}