using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using System.Security.Cryptography;
using SmartHealth.Api.Data;
using SmartHealth.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace SmartHealth.Api.Controllers
{
    [ApiController]
    [Route("api/hospitals")]
    public class HospitalsController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly ApplicationDbContext _context;

        public HospitalsController(
            IHttpClientFactory factory,
            ApplicationDbContext context)
        {
            _httpClient = factory.CreateClient();
            _context = context;
        }
        // ============================
        // GET NEARBY HOSPITALS
        // ============================
        [HttpGet("nearby")]
        public async Task<IActionResult> GetNearbyHospitals(
            [FromQuery] double lat,
            [FromQuery] double lng)
        {
            double[] radii = { 2500, 5000, 10000, 20000, 30000, 50000 };
            const int REQUIRED_MIN = 5;
            const int MAX_RETURN = 12;

            var finalHospitals = new List<dynamic>();

            foreach (var radius in radii)
            {
                var hospitals = await FetchHospitalsByRadius(lat, lng, radius);

                if (hospitals.Count >= REQUIRED_MIN)
                {
                    finalHospitals = hospitals;
                    break;
                }

                finalHospitals = hospitals;
            }

            return Ok(
                finalHospitals
                    .OrderBy(h => h.distanceKm)
                    .Take(MAX_RETURN)
                    .ToList()
            );
        }

        // ============================
        // FETCH BY RADIUS
        // ============================
        private async Task<List<dynamic>> FetchHospitalsByRadius(
            double lat,
            double lng,
            double radiusMeters)
        {
            var query = $@"
[out:json];
node[""amenity""=""hospital""](around:{radiusMeters},{lat},{lng});
out tags center;
";

            var response = await _httpClient.PostAsync(
                "https://overpass-api.de/api/interpreter",
                new StringContent(query, Encoding.UTF8, "text/plain")
            );

            if (!response.IsSuccessStatusCode)
                return new List<dynamic>();

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            var hospitals = new List<dynamic>();

            if (!doc.RootElement.TryGetProperty("elements", out var elements))
                return hospitals;

            foreach (var el in elements.EnumerateArray())
            {
                if (!el.TryGetProperty("tags", out var tags))
                    continue;

                string name =
                    tags.TryGetProperty("name", out var n)
                        ? n.GetString() ?? "Hospital"
                        : "Hospital";

                double hLat = el.GetProperty("lat").GetDouble();
                double hLng = el.GetProperty("lon").GetDouble();
                double distance = CalculateDistance(lat, lng, hLat, hLng);
                // Check if hospital exists in DB
                var existingHospital = await _context.Hospitals
                    .FirstOrDefaultAsync(h =>
                        h.Name == name &&
                        Math.Abs(h.Latitude - hLat) < 0.0001);

                if (existingHospital == null)
                {
                    var newHospital = new Hospital
                    {
                        Name = name,
                        Latitude = hLat,
                        Longitude = hLng
                    };

                    _context.Hospitals.Add(newHospital);
                    await _context.SaveChangesAsync();

                    // 🔥 Generate doctors automatically
                    GenerateDoctorsForHospital(newHospital);
                }

                // ? Extract phone FIRST
                string? phone = ExtractPhone(tags);

               
                string? description = null;


                if (distance <= 3)
                {
                    
                    description = await GetWikipediaDescription(name);
                }

                hospitals.Add(new
                {
                    name,
                    address = tags.TryGetProperty("addr:full", out var a)
                        ? a.GetString()
                        : "Not available",
                    phone,
          
                    description,
                    lat = hLat,
                    lng = hLng,
                    distanceKm = distance,
                    rating = GenerateRating(name),
                    emergency = true
                });
            }

            return hospitals;
        }

        // ============================
        // PHONE EXTRACTION (REAL OSM)
        // ============================
        private static string? ExtractPhone(JsonElement tags)
        {
            string[] phoneKeys =
            {
                "phone",
                "contact:phone",
                "contact:mobile",
                "mobile",
                "operator:phone"
            };

            foreach (var key in phoneKeys)
            {
                if (tags.TryGetProperty(key, out var val))
                {
                    var phone = val.GetString();
                    if (!string.IsNullOrWhiteSpace(phone))
                        return phone.Trim();
                }
            }

            return null;
        }

        // ============================
        // WIKIPEDIA DESCRIPTION
        // ============================
        private async Task<string?> GetWikipediaDescription(string hospitalName)
        {
            try
            {
                var url =
                    $"https://en.wikipedia.org/api/rest_v1/page/summary/{Uri.EscapeDataString(hospitalName)}";

                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                    return null;

                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);

                return doc.RootElement.TryGetProperty("extract", out var extract)
                    ? extract.GetString()
                    : null;
            }
            catch
            {
                return null;
            }
        }

        // ============================
        // WIKIDATA IMAGE
        // ============================
        private async Task<string?> GetWikidataImage(string hospitalName)
        {
            try
            {
                var wikiUrl =
                    $"https://en.wikipedia.org/api/rest_v1/page/summary/{Uri.EscapeDataString(hospitalName)}";

                var wikiResponse = await _httpClient.GetAsync(wikiUrl);
                if (!wikiResponse.IsSuccessStatusCode)
                    return null;

                var wikiJson = await wikiResponse.Content.ReadAsStringAsync();
                using var wikiDoc = JsonDocument.Parse(wikiJson);

                if (!wikiDoc.RootElement.TryGetProperty("wikibase_item", out var qidProp))
                    return null;

                var qid = qidProp.GetString();
                if (qid == null)
                    return null;

                var entityUrl =
                    $"https://www.wikidata.org/wiki/Special:EntityData/{qid}.json";

                var entityJson = await _httpClient.GetStringAsync(entityUrl);
                using var entityDoc = JsonDocument.Parse(entityJson);

                var claims = entityDoc.RootElement
                    .GetProperty("entities")
                    .GetProperty(qid)
                    .GetProperty("claims");

                if (!claims.TryGetProperty("P18", out var images))
                    return null;

                var fileName = images[0]
                    .GetProperty("mainsnak")
                    .GetProperty("datavalue")
                    .GetProperty("value")
                    .GetString();

                if (fileName == null)
                    return null;

                fileName = fileName.Replace(" ", "_");

                var hash = MD5.HashData(Encoding.UTF8.GetBytes(fileName));
                var hex = BitConverter.ToString(hash).Replace("-", "").ToLower();

                return $"https://upload.wikimedia.org/wikipedia/commons/{hex[0]}/{hex[..2]}/{fileName}";
            }
            catch
            {
                return null;
            }
        }
        private void GenerateDoctorsForHospital(Hospital hospital)
        {
            // 🔥 STOP if doctors already exist
            if (_context.Doctor.Any(d => d.HospitalId == hospital.Id))
                return;

            string[] specializations =
            {
        "Cardiologist",
        "Neurologist",
        "Orthopedic"
    };

            string[] images =
            {
        "https://randomuser.me/api/portraits/men/32.jpg",
        "https://randomuser.me/api/portraits/women/44.jpg",
        "https://randomuser.me/api/portraits/men/45.jpg"
    };

            var random = new Random();

            for (int i = 0; i < 3; i++)
            {
                var newDoctor = new Doctor
                {
                    Name = $"Dr {hospital.Name}",
                    Specialization = "Cardiologist",
                    Degree = "MBBS, MD",
                    Experience = 10,
                    Rating = 4.5,
                    Available = true,
                    HospitalId = hospital.Id,
                    Latitude = hospital.Latitude,
                    Longitude = hospital.Longitude
                };
                _context.Doctor.Add(newDoctor);

                
            }

            _context.SaveChanges();
        }

        // ============================
        // DISTANCE
        // ============================
        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371;
            double dLat = DegreesToRadians(lat2 - lat1);
            double dLon = DegreesToRadians(lon2 - lon1);

            double a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(DegreesToRadians(lat1)) *
                Math.Cos(DegreesToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            return Math.Round(R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a)), 2);
        }

        private double DegreesToRadians(double deg) => deg * (Math.PI / 180);

        private double GenerateRating(string? hospitalName)
        {
            int hash = hospitalName?.GetHashCode() ?? 1;
            return Math.Round(4.0 + (Math.Abs(hash) % 9) * 0.1, 1);
        }

       
    }
}