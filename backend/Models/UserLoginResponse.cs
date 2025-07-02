namespace backend.Models
{
    public class UserLoginResponse
    {
        public long UserId { get; set; }
        public string? Email { get; set; }
        public string? Token { get; set; }
    }
}