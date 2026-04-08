using Microsoft.EntityFrameworkCore;
using SmartHealth.Api.Models;

namespace SmartHealth.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Users
        public DbSet<User> Users { get; set; }

        public DbSet<UserHealth> UserHealths { get; set; }

        // Doctors
        public DbSet<Doctor> Doctor { get; set; }
        
        // Hospitals
        public DbSet<Hospital> Hospitals { get; set; }

        // Appointments
        public DbSet<Appointment> Appointments { get; set; }

        // Departments
        public DbSet<Department> Departments { get; set; }

        // Cities
        public DbSet<City> Cities { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Doctor>().ToTable("Doctor");
        }
    }
}