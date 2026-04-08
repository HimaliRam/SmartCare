using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHealth.Api.Data;
using System.Threading.Tasks;

namespace SmartHealth.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentDoctorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DepartmentDoctorsController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetDoctors(
    [FromQuery] string departmentRoute,
    [FromQuery] int cityId)
        {
            var department = await _context.Departments
                .FirstOrDefaultAsync(d => d.Route.ToLower() == departmentRoute.ToLower());

            if (department == null)
                return NotFound("Department not found");

            var doctors = await _context.Doctor
     .Where(d => d.DepartmentId == department.Id && d.CityId == cityId)
     .ToListAsync();
            return Ok(doctors);
        }
    }
}