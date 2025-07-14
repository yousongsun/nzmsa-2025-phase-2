namespace backend.Models
{
    public class PostDto
    {
        public long PostId { get; set; }
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? ImageAltText { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public PostPrivacy Privacy { get; set; }
        public long UserId { get; set; }

        // User information (flattened to avoid circular references)
        public string? UserFirstName { get; set; }
        public string? UserLastName { get; set; }
        public string? UserProfilePicture { get; set; }

        // Trip information (flattened to avoid circular references)
        public long? TripId { get; set; }
        public string? TripName { get; set; }
        public string? TripDestination { get; set; }

        // Counts only (no nested objects)
        public int LikeCount { get; set; }
        public int CommentCount { get; set; }

        // Simple lists without back-references
        public List<PostLikeDto> Likes { get; set; } = new List<PostLikeDto>();
        public List<PostCommentDto> Comments { get; set; } = new List<PostCommentDto>();
    }

    public class PostLikeDto
    {
        public long PostLikeId { get; set; }
        public long PostId { get; set; }
        public long UserId { get; set; }
        public string? UserFirstName { get; set; }
        public string? UserLastName { get; set; }
        public string? UserProfilePicture { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class PostCommentDto
    {
        public long PostCommentId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public long PostId { get; set; }
        public long UserId { get; set; }
        public string? UserFirstName { get; set; }
        public string? UserLastName { get; set; }
        public string? UserProfilePicture { get; set; }
    }
}