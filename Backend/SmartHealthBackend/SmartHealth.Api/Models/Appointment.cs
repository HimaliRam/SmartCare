using System;

namespace SmartHealth.Api.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        public string PatientName { get; set; } = "";

        public string Email { get; set; } = "";

        public string Phone { get; set; } = "";

        public DateTime Date { get; set; }

        public string Time { get; set; } = "";

        public string Symptoms { get; set; } = "";

        public int DoctorId { get; set; }
    }
}