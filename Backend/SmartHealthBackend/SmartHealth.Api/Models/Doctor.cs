using System.ComponentModel.DataAnnotations;

namespace SmartHealth.Api.Models
{
    public class Doctor
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = "";

        public string Degree { get; set; } = "";

        public string Specialization { get; set; } = "";

        public string Hospital { get; set; } = "";

        public int HospitalId { get; set; }

        public int CityId { get; set; }

        public int DepartmentId { get; set; }

        public int Experience { get; set; }

        public double Rating { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public bool Available { get; set; }

        public double Distance { get; set; }
    }
}