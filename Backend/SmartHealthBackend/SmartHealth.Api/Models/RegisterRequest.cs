using System;

namespace SmartHealth.Api.Models
{
    public class RegisterRequest
    {
        public string Name { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Gender { get; set; }
        public DateTime Birthdate { get; set; }
        public int Age { get; set; }
        public double Height { get; set; }
        public double Weight { get; set; }

        // ? FIX HERE
        public string BloodGroup { get; set; }

        public string Address { get; set; }
    }
}