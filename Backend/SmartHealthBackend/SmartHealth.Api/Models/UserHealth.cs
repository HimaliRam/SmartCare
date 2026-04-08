namespace SmartHealth.Api.Models
{
    public class UserHealth
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public int Age { get; set; }
        public float Height { get; set; }
        public float Weight { get; set; }

        public string BloodGroup { get; set; } = string.Empty;
        public int? HeartRate { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}