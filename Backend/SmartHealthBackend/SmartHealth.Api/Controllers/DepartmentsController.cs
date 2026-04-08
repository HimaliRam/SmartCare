using Microsoft.AspNetCore.Mvc;
using SmartHealth.Api.Models;
using SmartHealth.Api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartHealth.Api.Controllers
{
    [ApiController]
    [Route("api/departments")]
    public class DepartmentsController : ControllerBase
    {
        private readonly DepartmentsService _service;

        public DepartmentsController(DepartmentsService service)
        {
            _service = service;
        }

        [HttpGet("nearby-specialists")]
        public async Task<ActionResult<List<Doctor>>> GetNearbyDoctors(
            double lat,
            double lng,
            string specialization)
        {
            var doctors = await _service.GetNearbyDoctors(lat, lng, specialization);

            return Ok(doctors);
        }
    }
}