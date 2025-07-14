using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Post
    {
        [Key]
        public long PostId { get; set; }

        [Required]
        [StringLength(2000, ErrorMessage = "Post content cannot exceed 2000 characters")]
        public string? Content { get; set; }

        public string? ImageUrl { get; set; }

        [StringLength(500, ErrorMessage = "Image alt text cannot exceed 500 characters")]
        public string? ImageAltText { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Privacy settings
        public PostPrivacy Privacy { get; set; } = PostPrivacy.Public;

        // Relationships
        [Required]
        public long UserId { get; set; }
        public User? User { get; set; }

        // Optional trip reference - posts can be about specific trips
        public long? TripId { get; set; }
        public Trip? Trip { get; set; }

        // Navigation properties for interactions
        public ICollection<PostLike> Likes { get; set; } = new List<PostLike>();
        public ICollection<PostComment> Comments { get; set; } = new List<PostComment>();

        // Computed properties for counts
        [NotMapped]
        public int LikeCount => Likes?.Count ?? 0;

        [NotMapped]
        public int CommentCount => Comments?.Count ?? 0;
    }

    public enum PostPrivacy
    {
        Public = 0,
        FollowersOnly = 1,
        Private = 2
    }

    public class PostLike
    {
        [Key]
        public long PostLikeId { get; set; }

        [Required]
        public long PostId { get; set; }

        [JsonIgnore] // Prevent circular reference
        public Post? Post { get; set; }

        [Required]
        public long UserId { get; set; }
        public User? User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class PostComment
    {
        [Key]
        public long PostCommentId { get; set; }

        [Required]
        [StringLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters")]
        public string? Content { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Relationships
        [Required]
        public long PostId { get; set; }

        [JsonIgnore] // Prevent circular reference
        public Post? Post { get; set; }

        [Required]
        public long UserId { get; set; }
        public User? User { get; set; }
    }
}