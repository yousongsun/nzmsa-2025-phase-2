using backend.Models;
using backend.Repositories.Abstract;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/trips/{tripId}/itinerary-items")]
    [ApiController]
    public class ItineraryItemsController : ControllerBase
    {
        private readonly IItineraryItemRepository _itineraryItemRepository;

        public ItineraryItemsController(IItineraryItemRepository itineraryItemRepository)
        {
            _itineraryItemRepository = itineraryItemRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<ItineraryItem>> GetItineraryItemsByTripId(long tripId)
        {
            return await _itineraryItemRepository.GetByTripIdAsync(tripId);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ItineraryItem>> GetItineraryItem(long tripId, long id)
        {
            var itineraryItem = await _itineraryItemRepository.GetByIdAsync(id);

            if (itineraryItem == null)
            {
                return NotFound();
            }

            return itineraryItem;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutItineraryItem(long tripId, long id, ItineraryItem itineraryItem)
        {
            if (id != itineraryItem.ItineraryItemId)
            {
                return BadRequest();
            }

            await _itineraryItemRepository.UpdateAsync(itineraryItem);

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<ItineraryItem>> PostItineraryItem(long tripId, ItineraryItem itineraryItem)
        {
            itineraryItem.TripId = tripId;
            await _itineraryItemRepository.AddAsync(itineraryItem);

            return CreatedAtAction(nameof(GetItineraryItem), new { tripId = itineraryItem.TripId, id = itineraryItem.ItineraryItemId }, itineraryItem);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItineraryItem(long tripId, long id)
        {
            var itineraryItem = await _itineraryItemRepository.GetByIdAsync(id);
            if (itineraryItem == null)
            {
                return NotFound();
            }

            await _itineraryItemRepository.DeleteAsync(id);

            return NoContent();
        }
    }
}