namespace SmartHealth.Api.DTOs
{
    public class DoctorDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = "";

        public string Degree { get; set; } = "";

        public string Specialization { get; set; } = "";

        public string Hospital { get; set; } = "";

        public int Experience { get; set; }

        public double Rating { get; set; }

        public bool Available { get; set; }

        public double Distance { get; set; }
    }
}