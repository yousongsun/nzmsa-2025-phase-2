using backend.Repositories.Abstract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _repository;

        public UsersController(IUserRepository repository)
        {
            _repository = repository;
        }

        private static UserResponse ToUserResponse(User user)
        {
            return new UserResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Description = user.Description
            };
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsers()
        {
            var users = await _repository.GetAllUsersAsync();
            var result = users.Select(ToUserResponse);
            return Ok(result);
        }

        // GET: api/Users/login
        [HttpGet("login")]
        public async Task<ActionResult<UserResponse>> GetUsersLogin([FromQuery] string email, [FromQuery] string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                // Return a BadRequest response if email or password is missing
                return BadRequest("Email and password are required.");
            }

            // Fetch the user by email and password
            var user = await _repository.GetUserByEmailPasswordAsync(email, password);

            if (user == null)
            {
                // Return NotFound if no matching user is found
                return NotFound("Invalid email or password.");
            }

            // Return the user, but exclude sensitive information
            return Ok(ToUserResponse(user));
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<ActionResult<UserResponse>> PostUsersLogin(UserLogin userLogin)
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

            // Return the user, but exclude sensitive information
            return Ok(ToUserResponse(user));
        }


        // GET: api/Users/exists
        [HttpGet("exists")]
        public async Task<ActionResult<User>> GetEmailExists([FromQuery] string email)
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
            if (id != user.Id)
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
        public async Task<ActionResult<UserResponse>> PostUser(User user)
        {
            await _repository.AddUserAsync(user);
            return CreatedAtAction("GetUser", new { id = user.Id }, ToUserResponse(user));
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