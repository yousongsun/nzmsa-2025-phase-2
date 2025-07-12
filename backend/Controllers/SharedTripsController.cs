using backend.Models;
using backend.Repositories.Abstract;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/trips/{tripId}/shared-trips")]
    [ApiController]
    public class SharedTripsController : ControllerBase
    {
        private readonly ISharedTripRepository _sharedTripRepository;
        private readonly IUserRepository _userRepository;
        private readonly ITripInviteRepository _inviteRepository;

        public SharedTripsController(
            ISharedTripRepository sharedTripRepository,
            IUserRepository userRepository,
            ITripInviteRepository inviteRepository)
        {
            _sharedTripRepository = sharedTripRepository;
            _userRepository = userRepository;
            _inviteRepository = inviteRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<SharedTrip>> GetSharedTripsByTripId(long tripId)
        {
            return await _sharedTripRepository.GetByTripIdAsync(tripId);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SharedTrip>> GetSharedTrip(long tripId, long id)
        {
            var sharedTrip = await _sharedTripRepository.GetByIdAsync(id);

            if (sharedTrip == null)
            {
                return NotFound();
            }

            return sharedTrip;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSharedTrip(long tripId, long id, SharedTrip sharedTrip)
        {
            if (id != sharedTrip.SharedTripId)
            {
                return BadRequest();
            }

            await _sharedTripRepository.UpdateAsync(sharedTrip);

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<SharedTrip>> PostSharedTrip(long tripId, SharedTrip sharedTrip)
        {
            sharedTrip.TripId = tripId;
            await _sharedTripRepository.AddAsync(sharedTrip);

            return CreatedAtAction(nameof(GetSharedTrip), new { tripId = sharedTrip.TripId, id = sharedTrip.SharedTripId }, sharedTrip);
        }

        [HttpPost("share")]
        public async Task<IActionResult> ShareTripWithEmail(long tripId, ShareTripRequest request)
        {
            var user = await _userRepository.GetUserByEmailAsync(request.Email);
            if (user != null)
            {
                var sharedTrip = new SharedTrip
                {
                    TripId = tripId,
                    UserId = user.UserId,
                    PermissionLevel = request.PermissionLevel
                };
                await _sharedTripRepository.AddAsync(sharedTrip);
                return Ok(sharedTrip);
            }

            var invite = new TripInvite
            {
                TripId = tripId,
                Email = request.Email,
                PermissionLevel = request.PermissionLevel
            };
            await _inviteRepository.AddAsync(invite);
            return Ok(new { pending = true });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSharedTrip(long tripId, long id)
        {
            var sharedTrip = await _sharedTripRepository.GetByIdAsync(id);
            if (sharedTrip == null)
            {
                return NotFound();
            }

            await _sharedTripRepository.DeleteAsync(id);

            return NoContent();
        }
    }
}