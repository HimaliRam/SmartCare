using Microsoft.AspNetCore.Mvc;
using SmartHealth.Api.Data;

namespace SmartHealth.Api.Controllers
{
    [ApiController]
    [Route("api/health")]
    public class HealthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HealthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public IActionResult GetHealth(int userId)
        {
            var health = _context.UserHealths
                .Where(h => h.UserId == userId)
                .Select(h => new
                {
                    h.UserId,
                    h.Age,          // ? IMPORTANT
                    h.Height,
                    h.Weight,
                    h.HeartRate,
                    h.BloodGroup
                })
                .FirstOrDefault();

            if (health == null)
                return NotFound(new { message = "Health data not found" });

            return Ok(health);
        }
    }
}