using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public enum ItineraryItemType
    {
        Flight,
        Hotel,
        Activity
    }

    public class ItineraryItem
    {
        [Key]
        public long ItineraryItemId { get; set; }
        public string? Name { get; set; }
        public string? Category { get; set; }
        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }
        public string? ConfirmationNumber { get; set; }
        public string? Notes { get; set; }
        public long TripId { get; set; }

        public Trip? Trip { get; set; }
    }
} 