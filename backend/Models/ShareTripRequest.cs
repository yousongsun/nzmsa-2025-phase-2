using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ShareTripRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public PermissionLevel PermissionLevel { get; set; }
    }
}
