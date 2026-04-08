public class AppointmentDto
{
    public string PatientName { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public DateTime Date { get; set; }
    public string Time { get; set; } = "";
    public string Symptoms { get; set; } = "";
    public int DoctorId { get; set; }
}