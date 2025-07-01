using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        public long UserId { get; set; }

        public User? User { get; set; }

        public ICollection<ItineraryItem> ItineraryItems { get; set; } = new List<ItineraryItem>();
    }
} 