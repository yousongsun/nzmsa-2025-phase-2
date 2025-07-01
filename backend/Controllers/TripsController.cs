using backend.Models;
using backend.Repositories.Abstract;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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
        public async Task<ActionResult<Trip>> PostTrip(Trip trip)
        {
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