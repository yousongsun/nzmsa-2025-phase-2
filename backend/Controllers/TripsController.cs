using backend.Models;
using backend.Repositories.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController : ControllerBase
    {
        private readonly ITripRepository _tripRepository;

        public TripsController(ITripRepository tripRepository)
        {
            _tripRepository = tripRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<Trip>> GetTrips()
        {
            return await _tripRepository.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetTrip(long id)
        {
            var trip = await _tripRepository.GetByIdAsync(id);

            if (trip == null)
            {
                return NotFound();
            }

            return trip;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTrip(long id, Trip trip)
        {
            if (id != trip.TripId)
            {
                return BadRequest();
            }

            await _tripRepository.UpdateAsync(trip);

            return NoContent();
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Trip>> PostTrip(Trip trip)
        {
            if (trip.UserId == 0)
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? User.FindFirst("nameid")?.Value
                    ?? User.FindFirst("userid")?.Value;

                if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized("Invalid user token");
                }

                trip.UserId = userId;
            }

            await _tripRepository.AddAsync(trip);

            return CreatedAtAction(nameof(GetTrip), new { id = trip.TripId }, trip);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(long id)
        {
            var trip = await _tripRepository.GetByIdAsync(id);
            if (trip == null)
            {
                return NotFound();
            }

            await _tripRepository.DeleteAsync(id);

            return NoContent();
        }
    }
}