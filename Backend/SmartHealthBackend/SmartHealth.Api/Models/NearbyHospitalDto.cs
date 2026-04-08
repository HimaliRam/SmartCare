namespace SmartHealth.Api.Models
{
    public class NearbyHospitalDto
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public double Rating { get; set; }
        public bool Emergency { get; set; }
        public double DistanceKm { get; set; }
    }
}