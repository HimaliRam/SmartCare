using SmartHealth.Api.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SmartHealth.Api.Services
{
    public class DepartmentsService
    {
        private readonly HttpClient _httpClient;

        public DepartmentsService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<Doctor>> GetNearbyDoctors(
            double lat,
            double lng,
            string specialization)
        {
            double radius = 70000;

            string query = $@"
[out:json][timeout:25];
(
  node[""amenity""~""hospital|clinic""](around:{radius},{lat},{lng});
  way[""amenity""~""hospital|clinic""](around:{radius},{lat},{lng});
  relation[""amenity""~""hospital|clinic""](around:{radius},{lat},{lng});

  node[""healthcare""~""hospital|clinic""](around:{radius},{lat},{lng});
  way[""healthcare""~""hospital|clinic""](around:{radius},{lat},{lng});
  relation[""healthcare""~""hospital|clinic""](around:{radius},{lat},{lng});
);
out center;";

            var doctors = new List<Doctor>();

            var content = new StringContent(query, Encoding.UTF8, "text/plain");

            var response = await _httpClient.PostAsync(
                "https://overpass-api.de/api/interpreter",
                content);

            if (!response.IsSuccessStatusCode)
                return doctors;

            var json = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(json);

            if (!doc.RootElement.TryGetProperty("elements", out var elements))
                return doctors;

            int id = 1;
            Random random = new Random();

            foreach (var el in elements.EnumerateArray())
            {
                if (!el.TryGetProperty("tags", out var tags))
                    continue;

                string hospital = "Hospital";

                if (tags.TryGetProperty("name", out var nameProp))
                    hospital = nameProp.GetString() ?? "Hospital";

                double docLat = 0;
                double docLng = 0;

                if (el.TryGetProperty("lat", out var latProp))
                    docLat = latProp.GetDouble();

                if (el.TryGetProperty("lon", out var lonProp))
                    docLng = lonProp.GetDouble();

                if (el.TryGetProperty("center", out var center))
                {
                    docLat = center.GetProperty("lat").GetDouble();
                    docLng = center.GetProperty("lon").GetDouble();
                }

                double distance = CalculateDistance(lat, lng, docLat, docLng);

                doctors.Add(new Doctor
                {
                    Id = id++,
                    Name = $"Dr. {hospital.Split(' ')[0]}",
                    Degree = "MBBS, MD",
                    Hospital = hospital,
                    Experience = random.Next(5, 25),
                    Specialization = specialization,
                    Rating = Math.Round(random.NextDouble() * 2 + 3, 1),
                    Distance = Math.Round(distance, 1)
                });
            }

            return doctors
                .OrderBy(d => d.Distance)
                .Take(10)
                .ToList();
        }

        private double CalculateDistance(
            double lat1,
            double lon1,
            double lat2,
            double lon2)
        {
            double R = 6371;

            double dLat = (lat2 - lat1) * Math.PI / 180;
            double dLon = (lon2 - lon1) * Math.PI / 180;

            double a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) *
                Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLon / 2) *
                Math.Sin(dLon / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return R * c;
        }
    }
}