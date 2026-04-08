using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHealth.Api.Data;
using SmartHealth.Api.DTOs;

namespace SmartHealth.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("nearby")]
        public async Task<ActionResult<IEnumerable<DoctorDto>>> GetNearbyDoctors(
    [FromQuery] double lat,
    [FromQuery] double lng,
    [FromQuery] string? search = "")
        {
            const int MAX_RESULTS = 12;

            var query = _context.Doctor.AsQueryable();

            // filter specialization
            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();

                query = query.Where(d =>
                    d.Specialization.ToLower().Contains(search));
            }

            // ?? FIRST get data from database
            var doctors = await query.ToListAsync();

            // ?? THEN calculate distance in memory
            var result = doctors
                .Select(d => new DoctorDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Degree = d.Degree,
                    Specialization = d.Specialization,
                    Experience = d.Experience,
                    Rating = d.Rating,
                    Hospital = d.Hospital,
                    Available = d.Available,
                    Distance = CalculateDistance(lat, lng, d.Latitude, d.Longitude)
                })
                .Where(d => d.Distance <= 20)
                .OrderBy(d => d.Distance)
                .Take(MAX_RESULTS)
                .ToList();

            return Ok(result);
        }

        private double CalculateDistance(
            double lat1,
            double lon1,
            double lat2,
            double lon2)
        {
            const double R = 6371;

            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);

            var a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) *
                Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) *
                Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return Math.Round(R * c, 2);
        }

        private double ToRadians(double angle)
        {
            return angle * Math.PI / 180;
        }
    }
}