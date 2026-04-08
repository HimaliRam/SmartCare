namespace SmartHealth.Api.Models
{
    public class Hospital
    {
        public int Id { get; set; }

        public string Name { get; set; } = "";

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        // ?? FIX HERE
        public List<Doctor> Doctors { get; set; } = new();
    }
}