using System.ComponentModel.DataAnnotations;

namespace SmartHealth.Api.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        [StringLength(10)]
        public string Mobile { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public string Gender { get; set; }

        public DateTime Birthdate { get; set; }

        public int Age { get; set; }

        public double Height { get; set; }

        public double Weight { get; set; }

        public string BloodGroup { get; set; } = string.Empty;

        public string? Address { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? Otp { get; set; }
        public DateTime? OtpExpiry { get; set; }

      
    }
}