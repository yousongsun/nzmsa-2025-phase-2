using System.ComponentModel.DataAnnotations;


namespace backend.Models
{
    public class User
    {
        public long UserId { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        public string? Password { get; set; }

        public string? Description { get; set; }

        public string? ProfilePicture { get; set; }

        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}