using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class TripInvite
    {
        [Key]
        public long TripInviteId { get; set; }

        [Required]
        public long TripId { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public PermissionLevel PermissionLevel { get; set; }
    }
}
