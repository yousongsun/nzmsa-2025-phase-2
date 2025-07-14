using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories.Abstract
{
    public interface IPostRepository
    {
        Task<Post?> GetByIdAsync(long id);
        Task<IEnumerable<Post>> GetAllAsync();
        Task<IEnumerable<Post>> GetPostsByUserIdAsync(long userId);
        Task<IEnumerable<Post>> GetPublicPostsAsync(int pageSize = 20, int page = 1);
        Task<IEnumerable<Post>> GetFollowingPostsAsync(long userId, int pageSize = 20, int page = 1);
        Task<IEnumerable<Post>> GetPostsByTripIdAsync(long tripId);
        Task<Post> AddAsync(Post post);
        Task<Post> UpdateAsync(Post post);
        Task DeleteAsync(long id);
        Task<PostLike?> GetLikeAsync(long postId, long userId);
        Task<PostLike> AddLikeAsync(PostLike like);
        Task RemoveLikeAsync(long postId, long userId);
        Task<IEnumerable<PostComment>> GetCommentsAsync(long postId);
        Task<PostComment> AddCommentAsync(PostComment comment);
        Task<PostComment> UpdateCommentAsync(PostComment comment);
        Task DeleteCommentAsync(long commentId);
        Task<bool> CanUserViewPostAsync(long postId, long? userId);
    }
}