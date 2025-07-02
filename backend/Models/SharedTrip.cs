using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public enum PermissionLevel
    {
        View,
        Edit
    }

    public class SharedTrip
    {
        [Key]
        public long SharedTripId { get; set; }
        public long TripId { get; set; }

        public Trip? Trip { get; set; }

        public long UserId { get; set; }

        public User? User { get; set; }

        [Required]
        public PermissionLevel PermissionLevel { get; set; }
    }
} 