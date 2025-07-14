using backend.Models;
using backend.Repositories.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PostsController : ControllerBase
    {
        private readonly IPostRepository _postRepository;
        private readonly IWebHostEnvironment _environment;

        public PostsController(IPostRepository postRepository, IWebHostEnvironment environment)
        {
            _postRepository = postRepository;
            _environment = environment;
        }

        private long GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            {
                throw new UnauthorizedAccessException("User not authenticated");
            }
            return userId;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PostDto>>> GetPublicPosts([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var posts = await _postRepository.GetPublicPostsAsync(pageSize, page);
            var postDtos = posts.Select(p => p.MapToDto()).ToList();
            return Ok(postDtos);
        }

        [HttpGet("feed")]
        public async Task<ActionResult<IEnumerable<PostDto>>> GetFeed([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = GetCurrentUserId();
            var posts = await _postRepository.GetFollowingPostsAsync(userId, pageSize, page);
            var postDtos = posts.Select(p => p.MapToDto()).ToList();
            return Ok(postDtos);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Post>>> GetUserPosts(long userId)
        {
            var currentUserId = GetCurrentUserId();
            var posts = await _postRepository.GetPostsByUserIdAsync(userId);

            // Filter posts based on privacy and current user
            var filteredPosts = new List<Post>();
            foreach (var post in posts)
            {
                if (await _postRepository.CanUserViewPostAsync(post.PostId, currentUserId))
                {
                    filteredPosts.Add(post);
                }
            }

            return Ok(filteredPosts);
        }

        [HttpGet("trip/{tripId}")]
        public async Task<ActionResult<IEnumerable<Post>>> GetTripPosts(long tripId)
        {
            var currentUserId = GetCurrentUserId();
            var posts = await _postRepository.GetPostsByTripIdAsync(tripId);

            // Filter posts based on privacy and current user
            var filteredPosts = new List<Post>();
            foreach (var post in posts)
            {
                if (await _postRepository.CanUserViewPostAsync(post.PostId, currentUserId))
                {
                    filteredPosts.Add(post);
                }
            }

            return Ok(filteredPosts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PostDto>> GetPost(long id)
        {
            var currentUserId = GetCurrentUserId();

            if (!await _postRepository.CanUserViewPostAsync(id, currentUserId))
            {
                return Forbid("You don't have permission to view this post");
            }

            var post = await _postRepository.GetByIdAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            return Ok(post.MapToDto());
        }

        [HttpPost]
        public async Task<ActionResult<PostDto>> CreatePost([FromForm] CreatePostRequest request)
        {
            var userId = GetCurrentUserId();

            var post = new Post
            {
                Content = request.Content,
                UserId = userId,
                TripId = request.TripId,
                Privacy = request.Privacy ?? PostPrivacy.Public
            };

            // Handle image upload
            if (request.Image != null && request.Image.Length > 0)
            {
                var imageUrl = await SaveImageAsync(request.Image);
                post.ImageUrl = imageUrl;
                post.ImageAltText = request.ImageAltText;
            }

            var createdPost = await _postRepository.AddAsync(post);
            return CreatedAtAction(nameof(GetPost), new { id = createdPost.PostId }, createdPost.MapToDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(long id, [FromForm] UpdatePostRequest request)
        {
            var userId = GetCurrentUserId();
            var post = await _postRepository.GetByIdAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            if (post.UserId != userId)
            {
                return Forbid("You can only edit your own posts");
            }

            post.Content = request.Content ?? post.Content;
            post.Privacy = request.Privacy ?? post.Privacy;
            post.TripId = request.TripId ?? post.TripId;

            // Handle new image upload
            if (request.Image != null && request.Image.Length > 0)
            {
                // Delete old image if exists
                if (!string.IsNullOrEmpty(post.ImageUrl))
                {
                    await DeleteImageAsync(post.ImageUrl);
                }

                var imageUrl = await SaveImageAsync(request.Image);
                post.ImageUrl = imageUrl;
                post.ImageAltText = request.ImageAltText;
            }
            else if (request.RemoveImage == true && !string.IsNullOrEmpty(post.ImageUrl))
            {
                // Remove existing image
                await DeleteImageAsync(post.ImageUrl);
                post.ImageUrl = null;
                post.ImageAltText = null;
            }

            await _postRepository.UpdateAsync(post);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(long id)
        {
            var userId = GetCurrentUserId();
            var post = await _postRepository.GetByIdAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            if (post.UserId != userId)
            {
                return Forbid("You can only delete your own posts");
            }

            // Delete associated image
            if (!string.IsNullOrEmpty(post.ImageUrl))
            {
                await DeleteImageAsync(post.ImageUrl);
            }

            await _postRepository.DeleteAsync(id);
            return NoContent();
        }

        [HttpPost("{id}/like")]
        public async Task<IActionResult> LikePost(long id)
        {
            var userId = GetCurrentUserId();

            if (!await _postRepository.CanUserViewPostAsync(id, userId))
            {
                return Forbid("You don't have permission to like this post");
            }

            var existingLike = await _postRepository.GetLikeAsync(id, userId);
            if (existingLike != null)
            {
                return BadRequest("You have already liked this post");
            }

            var like = new PostLike
            {
                PostId = id,
                UserId = userId
            };

            await _postRepository.AddLikeAsync(like);
            return Ok(new { message = "Post liked successfully" });
        }

        [HttpDelete("{id}/like")]
        public async Task<IActionResult> UnlikePost(long id)
        {
            var userId = GetCurrentUserId();
            await _postRepository.RemoveLikeAsync(id, userId);
            return Ok(new { message = "Post unliked successfully" });
        }

        [HttpGet("{id}/comments")]
        public async Task<ActionResult<IEnumerable<PostComment>>> GetComments(long id)
        {
            var userId = GetCurrentUserId();

            if (!await _postRepository.CanUserViewPostAsync(id, userId))
            {
                return Forbid("You don't have permission to view comments on this post");
            }

            var comments = await _postRepository.GetCommentsAsync(id);
            return Ok(comments);
        }

        [HttpPost("{id}/comments")]
        public async Task<ActionResult<PostComment>> AddComment(long id, [FromBody] CreateCommentRequest request)
        {
            var userId = GetCurrentUserId();

            if (!await _postRepository.CanUserViewPostAsync(id, userId))
            {
                return Forbid("You don't have permission to comment on this post");
            }

            var comment = new PostComment
            {
                PostId = id,
                UserId = userId,
                Content = request.Content
            };

            var createdComment = await _postRepository.AddCommentAsync(comment);
            return CreatedAtAction(nameof(GetComments), new { id }, createdComment);
        }

        [HttpPut("comments/{commentId}")]
        public async Task<IActionResult> UpdateComment(long commentId, [FromBody] UpdateCommentRequest request)
        {
            var userId = GetCurrentUserId();
            var comment = await _postRepository.GetCommentsAsync(commentId);
            var targetComment = comment.FirstOrDefault(c => c.PostCommentId == commentId);

            if (targetComment == null)
            {
                return NotFound();
            }

            if (targetComment.UserId != userId)
            {
                return Forbid("You can only edit your own comments");
            }

            targetComment.Content = request.Content;
            await _postRepository.UpdateCommentAsync(targetComment);
            return NoContent();
        }

        [HttpDelete("comments/{commentId}")]
        public async Task<IActionResult> DeleteComment(long commentId)
        {
            var userId = GetCurrentUserId();
            var comment = await _postRepository.GetCommentsAsync(commentId);
            var targetComment = comment.FirstOrDefault(c => c.PostCommentId == commentId);

            if (targetComment == null)
            {
                return NotFound();
            }

            if (targetComment.UserId != userId)
            {
                return Forbid("You can only delete your own comments");
            }

            await _postRepository.DeleteCommentAsync(commentId);
            return NoContent();
        }

        private async Task<string> SaveImageAsync(IFormFile image)
        {
            var uploadsFolder = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "posts");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            return $"/uploads/posts/{fileName}";
        }

        private async Task DeleteImageAsync(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl)) return;

            var fileName = Path.GetFileName(imageUrl);
            var filePath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "posts", fileName);

            if (System.IO.File.Exists(filePath))
            {
                await Task.Run(() => System.IO.File.Delete(filePath));
            }
        }
    }

    // Request DTOs
    public class CreatePostRequest
    {
        public string? Content { get; set; }
        public IFormFile? Image { get; set; }
        public string? ImageAltText { get; set; }
        public long? TripId { get; set; }
        public PostPrivacy? Privacy { get; set; }
    }

    public class UpdatePostRequest
    {
        public string? Content { get; set; }
        public IFormFile? Image { get; set; }
        public string? ImageAltText { get; set; }
        public long? TripId { get; set; }
        public PostPrivacy? Privacy { get; set; }
        public bool? RemoveImage { get; set; }
    }

    public class CreateCommentRequest
    {
        public string? Content { get; set; }
    }

    public class UpdateCommentRequest
    {
        public string? Content { get; set; }
    }

    // Extension method for mapping Post to PostDto
    public static class PostMappingExtensions
    {
        public static PostDto MapToDto(this Post post)
        {
            return new PostDto
            {
                PostId = post.PostId,
                Content = post.Content,
                ImageUrl = post.ImageUrl,
                ImageAltText = post.ImageAltText,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                Privacy = post.Privacy,
                UserId = post.UserId,
                UserFirstName = post.User?.FirstName,
                UserLastName = post.User?.LastName,
                UserProfilePicture = post.User?.ProfilePicture,
                TripId = post.TripId,
                TripName = post.Trip?.Name,
                TripDestination = post.Trip?.Destination,
                LikeCount = post.Likes?.Count ?? 0,
                CommentCount = post.Comments?.Count ?? 0,
                Likes = post.Likes?.Select(l => new PostLikeDto
                {
                    PostLikeId = l.PostLikeId,
                    PostId = l.PostId,
                    UserId = l.UserId,
                    UserFirstName = l.User?.FirstName,
                    UserLastName = l.User?.LastName,
                    UserProfilePicture = l.User?.ProfilePicture,
                    CreatedAt = l.CreatedAt
                }).ToList() ?? new List<PostLikeDto>(),
                Comments = post.Comments?.Select(c => new PostCommentDto
                {
                    PostCommentId = c.PostCommentId,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    PostId = c.PostId,
                    UserId = c.UserId,
                    UserFirstName = c.User?.FirstName,
                    UserLastName = c.User?.LastName,
                    UserProfilePicture = c.User?.ProfilePicture
                }).ToList() ?? new List<PostCommentDto>()
            };
        }
    }
}