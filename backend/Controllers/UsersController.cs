using backend.Repositories.Abstract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _repository;
        private readonly ITripInviteRepository _inviteRepository;
        private readonly ISharedTripRepository _sharedTripRepository;
        private readonly TokenService _tokenService;

        public UsersController(
            IUserRepository repository,
            ITripInviteRepository inviteRepository,
            ISharedTripRepository sharedTripRepository,
            TokenService tokenService)
        {
            _repository = repository;
            _inviteRepository = inviteRepository;
            _sharedTripRepository = sharedTripRepository;
            _tokenService = tokenService;
        }

        private static UserResponse ToUserResponse(User user)
        {
            return new UserResponse
            {
                UserId = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Description = user.Description
            };
        }

        // GET: api/Users
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsers()
        {
            var users = await _repository.GetAllUsersAsync();
            var result = users.Select(ToUserResponse);
            return Ok(result);
        }

        // POST: api/Users/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<UserLoginResponse>> PostUsersLogin(UserLogin userLogin)
        {
            if (string.IsNullOrEmpty(userLogin.Email) || string.IsNullOrEmpty(userLogin.Password))
            {
                // Return a BadRequest response if email or password is missing
                return BadRequest("Email and password are required.");
            }

            // Fetch the user by email and password
            var user = await _repository.GetUserByEmailPasswordAsync(userLogin.Email, userLogin.Password);

            if (user == null)
            {
                // Return NotFound if no matching user is found
                return NotFound("Invalid email or password.");
            }

            var token = _tokenService.GenerateToken(user);

            return Ok(new UserLoginResponse { UserId = user.UserId, Email = user.Email, Token = token });
        }

        // GET: api/Users/by-email
        [HttpGet("by-email")]
        [Authorize]
        public async Task<ActionResult<UserResponse>> GetUserByEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required.");
            }

            var user = await _repository.GetUserByEmailAsync(email);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(ToUserResponse(user));
        }

        // GET: api/Users/exists
        [HttpGet("exists")]
        [AllowAnonymous]
        public async Task<ActionResult<bool>> GetEmailExists([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                // Return a BadRequest response if email is missing
                return BadRequest("Email is required.");
            }

            // Check if the email exists
            var emailExists = await _repository.EmailExists(email);

            return Ok(emailExists);
        }

        // GET: api/Users/search
        [HttpGet("search")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UserResponse>>> SearchUsers([FromQuery(Name = "q")] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Query is required.");
            }

            var users = await _repository.SearchUsersAsync(query);
            var result = users.Select(ToUserResponse);
            return Ok(result);
        }




        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponse>> GetUser(long id)
        {
            var user = await _repository.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(ToUserResponse(user));
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(long id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            try
            {
                await _repository.UpdateUserAsync(user);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _repository.UserExistsAsync(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<UserResponse>> PostUser(User user)
        {
            await _repository.AddUserAsync(user);

            if (!string.IsNullOrEmpty(user.Email))
            {
                var invites = await _inviteRepository.GetByEmailAsync(user.Email);
                foreach (var invite in invites)
                {
                    var shared = new SharedTrip
                    {
                        TripId = invite.TripId,
                        UserId = user.UserId,
                        PermissionLevel = invite.PermissionLevel
                    };
                    await _sharedTripRepository.AddAsync(shared);
                    await _inviteRepository.DeleteAsync(invite.TripInviteId);
                }
            }

            return CreatedAtAction("GetUser", new { id = user.UserId }, ToUserResponse(user));
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            var user = await _repository.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            await _repository.DeleteUserAsync(id);

            return NoContent();
        }

        // POST: api/Users/bulk
        [HttpPost("bulk")]
        public async Task<ActionResult<IEnumerable<UserResponse>>> BulkCreateUsers(IEnumerable<User> users)
        {
            if (users == null || !users.Any())
            {
                return BadRequest("User data is required.");
            }

            try
            {
                await _repository.BulkAddUsersAsync(users);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }

            var result = users.Select(ToUserResponse);
            return Ok(result);
        }
    }
}