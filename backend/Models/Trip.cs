using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Trip
    {
        [Key]
        public long TripId { get; set; }

        public string? Name { get; set; }

        public string? Destination { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        // Optional location coordinates for map features
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public long UserId { get; set; }

        [JsonIgnore] // User info can be included separately when needed
        public User? User { get; set; }

        [JsonIgnore] // Itinerary items can be loaded separately
        public ICollection<ItineraryItem> ItineraryItems { get; set; } = new List<ItineraryItem>();
    }
}