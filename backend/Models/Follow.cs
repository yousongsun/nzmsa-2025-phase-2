using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Follow
    {
        [Key]
        public long FollowId { get; set; }

        [Required]
        public long FollowerId { get; set; }

        public User? Follower { get; set; }

        [Required]
        public long FollowingId { get; set; }

        public User? Following { get; set; }
    }
}