using backend.Repositories.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class FollowsController : ControllerBase
    {
        private readonly IFollowRepository _followRepository;

        public FollowsController(IFollowRepository followRepository)
        {
            _followRepository = followRepository;
        }

        [HttpPost("{userId}/follow")]
        public async Task<IActionResult> FollowUser(long userId)
        {
            var followerIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (followerIdClaim == null)
            {
                return Unauthorized();
            }

            var followerId = long.Parse(followerIdClaim);
            await _followRepository.FollowUserAsync(followerId, userId);
            return Ok();
        }

        [HttpPost("{userId}/unfollow")]
        public async Task<IActionResult> UnfollowUser(long userId)
        {
            var followerIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (followerIdClaim == null)
            {
                return Unauthorized();
            }

            var followerId = long.Parse(followerIdClaim);
            await _followRepository.UnfollowUserAsync(followerId, userId);
            return Ok();
        }

        [HttpGet("{userId}/followers")]
        public async Task<IActionResult> GetFollowers(long userId)
        {
            var followers = await _followRepository.GetFollowersAsync(userId);
            return Ok(followers);
        }

        [HttpGet("{userId}/following")]
        public async Task<IActionResult> GetFollowing(long userId)
        {
            var following = await _followRepository.GetFollowingAsync(userId);
            return Ok(following);
        }

        [HttpGet("{followerId}/following/{followingId}")]
        public async Task<IActionResult> IsFollowing(long followerId, long followingId)
        {
            var result = await _followRepository.IsFollowingAsync(followerId, followingId);
            return Ok(result);
        }
    }
}