namespace backend.Models
{
    public class UserResponse
    {
        public long UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Description { get; set; }
    }
}
