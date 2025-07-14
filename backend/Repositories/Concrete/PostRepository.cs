using backend.Context;
using backend.Models;
using backend.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Repositories.Concrete
{
    public class PostRepository : IPostRepository
    {
        private readonly AppDbContext _context;
        private readonly IFollowRepository _followRepository;

        public PostRepository(AppDbContext context, IFollowRepository followRepository)
        {
            _context = context;
            _followRepository = followRepository;
        }

        public async Task<Post?> GetByIdAsync(long id)
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Trip)
                .Include(p => p.Likes)
                    .ThenInclude(l => l.User)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .AsSplitQuery() // Use split queries to avoid cartesian explosion
                .FirstOrDefaultAsync(p => p.PostId == id);
        }

        public async Task<IEnumerable<Post>> GetAllAsync()
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Trip)
                .Include(p => p.Likes)
                    .ThenInclude(l => l.User)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .AsSplitQuery() // Use split queries to avoid cartesian explosion
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetPostsByUserIdAsync(long userId)
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Trip)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetPublicPostsAsync(int pageSize = 20, int page = 1)
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Trip)
                .Include(p => p.Likes)
                    .ThenInclude(l => l.User)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .Where(p => p.Privacy == PostPrivacy.Public)
                .AsSplitQuery() // Use split queries to avoid cartesian explosion
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetFollowingPostsAsync(long userId, int pageSize = 20, int page = 1)
        {
            // Get users that the current user is following
            var followedUserIds = await _context.Follows
                .Where(f => f.FollowerId == userId)
                .Select(f => f.FollowingId)
                .ToListAsync();

            // Include the user's own posts
            followedUserIds.Add(userId);

            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Trip)
                .Include(p => p.Likes)
                    .ThenInclude(l => l.User)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .Where(p => followedUserIds.Contains(p.UserId) &&
                           (p.Privacy == PostPrivacy.Public || p.Privacy == PostPrivacy.FollowersOnly))
                .AsSplitQuery() // Use split queries to avoid cartesian explosion
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetPostsByTripIdAsync(long tripId)
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Trip)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .Where(p => p.TripId == tripId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Post> AddAsync(Post post)
        {
            post.CreatedAt = DateTime.UtcNow;
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            // Reload with includes
            return await GetByIdAsync(post.PostId) ?? post;
        }

        public async Task<Post> UpdateAsync(Post post)
        {
            post.UpdatedAt = DateTime.UtcNow;
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();

            // Reload with includes
            return await GetByIdAsync(post.PostId) ?? post;
        }

        public async Task DeleteAsync(long id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<PostLike?> GetLikeAsync(long postId, long userId)
        {
            return await _context.PostLikes
                .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);
        }

        public async Task<PostLike> AddLikeAsync(PostLike like)
        {
            like.CreatedAt = DateTime.UtcNow;
            _context.PostLikes.Add(like);
            await _context.SaveChangesAsync();
            return like;
        }

        public async Task RemoveLikeAsync(long postId, long userId)
        {
            var like = await GetLikeAsync(postId, userId);
            if (like != null)
            {
                _context.PostLikes.Remove(like);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<PostComment>> GetCommentsAsync(long postId)
        {
            return await _context.PostComments
                .Include(c => c.User)
                .Where(c => c.PostId == postId)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<PostComment> AddCommentAsync(PostComment comment)
        {
            comment.CreatedAt = DateTime.UtcNow;
            _context.PostComments.Add(comment);
            await _context.SaveChangesAsync();

            // Reload with includes
            return await _context.PostComments
                .Include(c => c.User)
                .FirstAsync(c => c.PostCommentId == comment.PostCommentId);
        }

        public async Task<PostComment> UpdateCommentAsync(PostComment comment)
        {
            comment.UpdatedAt = DateTime.UtcNow;
            _context.PostComments.Update(comment);
            await _context.SaveChangesAsync();

            // Reload with includes
            return await _context.PostComments
                .Include(c => c.User)
                .FirstAsync(c => c.PostCommentId == comment.PostCommentId);
        }

        public async Task DeleteCommentAsync(long commentId)
        {
            var comment = await _context.PostComments.FindAsync(commentId);
            if (comment != null)
            {
                _context.PostComments.Remove(comment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> CanUserViewPostAsync(long postId, long? userId)
        {
            var post = await _context.Posts
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.PostId == postId);

            if (post == null) return false;

            switch (post.Privacy)
            {
                case PostPrivacy.Public:
                    return true;

                case PostPrivacy.Private:
                    return userId.HasValue && post.UserId == userId.Value;

                case PostPrivacy.FollowersOnly:
                    if (!userId.HasValue) return false;
                    if (post.UserId == userId.Value) return true;

                    return await _context.Follows
                        .AnyAsync(f => f.FollowerId == userId.Value && f.FollowingId == post.UserId);

                default:
                    return false;
            }
        }
    }
}