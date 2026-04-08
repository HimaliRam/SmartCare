using Microsoft.AspNetCore.Mvc;
using SmartHealth.Api.Data;
using SmartHealth.Api.Models;
using System.Linq;

namespace SmartHealth.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ? UPDATE USER
        [HttpPut("update")]
        public IActionResult UpdateUser([FromBody] UserUpdateDto dto)
        {
            if (dto == null || dto.Id == 0)
                return BadRequest("Invalid data");

            var user = _context.Users.FirstOrDefault(u => u.Id == dto.Id);

            if (user == null)
                return NotFound("User not found");

            // ? UPDATE ONLY REQUIRED FIELDS
            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.Mobile = dto.Mobile;

            user.Age = dto.Age ?? 0;
            user.Height = dto.Height ?? 0;
            user.Weight = dto.Weight ?? 0;
            user.BloodGroup = dto.BloodGroup;

            _context.SaveChanges();

            // ? SYNC HEALTH TABLE
            var health = _context.UserHealths
                .FirstOrDefault(h => h.UserId == user.Id);

            if (health != null)
            {
                health.Age = user.Age;
                health.Height = (float)user.Height;
                health.Weight = (float)user.Weight;
                health.BloodGroup = user.BloodGroup;
                health.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                _context.UserHealths.Add(new UserHealth
                {
                    UserId = user.Id,
                    Age = user.Age,
                    Height = (float)user.Height,
                    Weight = (float)user.Weight,
                    BloodGroup = user.BloodGroup
                });
            }

            _context.SaveChanges();

            return Ok(user);
        }
        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // ? DELETE USER
        [HttpDelete("delete/{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound("User not found");

            // ? DELETE USER HEALTH FIRST
            var health = _context.UserHealths.Where(h => h.UserId == id);
            _context.UserHealths.RemoveRange(health);

            // ? DELETE USER
            _context.Users.Remove(user);

            _context.SaveChanges();

            return Ok(new { message = "User deleted successfully" });
        }
    }
}