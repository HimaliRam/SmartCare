using SmartHealth.Api.Data;
using SmartHealth.Api.Models;
using SmartHealth.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace SmartHealth.Api.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;


        public AuthService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> Login(LoginDTO dto)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x =>
                    x.Email == dto.Email &&
                    x.PasswordHash == dto.Password);
        }

        public async Task<bool> Register(RegisterDTO dto)
        {
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Mobile = dto.Mobile,
                PasswordHash = dto.Password,
                Gender = dto.Gender
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ResetPassword(ForgotPasswordDTO dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
                return false;

            user.PasswordHash = dto.NewPassword;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}