using Microsoft.AspNetCore.Mvc;
using SmartHealth.Api.Data;
using SmartHealth.Api.Models;
using SmartHealth.Api.Services;
using System;
using System.Linq;
using System.Threading.Tasks;
using BCrypt.Net;
using SmartHealth.Api.DTOs;

namespace SmartHealth.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        // ? ADD THIS (MISSING)
        private readonly ApplicationDbContext _context;

        // ? EMAIL SERVICE
        private readonly EmailService _emailService;

        // ? FIXED CONSTRUCTOR
        public AuthController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }
        // ================= CHECK EMAIL =================
        [HttpPost("check-email")]
        public IActionResult CheckEmail([FromBody] EmailRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest("Email required");

            var email = request.Email.Trim().ToLower();

            var user = _context.Users
                .FirstOrDefault(u => u.Email.ToLower() == email);

            if (user == null)
                return NotFound("Email not registered");

            return Ok();
        }

        // ================= SEND OTP =================
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] ForgotRequest request)
        {
            var email = request.Email?.Trim().ToLower();

            if (string.IsNullOrEmpty(email))
                return BadRequest("Email required");

            var otp = new Random().Next(100000, 999999).ToString();

            // ? STORE OTP TEMP (IN MEMORY)
            OtpStore.OtpData[email] = new OtpEntry
            {
                Otp = otp,
                Expiry = DateTime.Now.AddMinutes(5)
            };

            await _emailService.SendEmailAsync(
                email,
                "SmartCare OTP",
                $"<h2>Your OTP is <b>{otp}</b></h2><p>Valid for 5 minutes</p>"
            );

            return Ok(new { message = "OTP sent successfully" });
        }

        // ================= VERIFY OTP =================
        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var email = request.Email?.Trim().ToLower();
            var otp = request.Otp?.Trim();

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(otp))
                return BadRequest("Invalid request");

            if (!OtpStore.OtpData.ContainsKey(email))
                return BadRequest("OTP not found");

            var storedOtp = OtpStore.OtpData[email];

            if (storedOtp.Expiry < DateTime.Now)
                return BadRequest("OTP expired");

            if (storedOtp.Otp != otp)
                return BadRequest("Invalid OTP");

            // ? REMOVE OTP AFTER SUCCESS
            OtpStore.OtpData.TryRemove(email, out _);

            return Ok(new { message = "OTP verified successfully" });
        }

        // ================= RESET PASSWORD =================
        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var email = request.Email?.Trim().ToLower();

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(request.NewPassword))
                return BadRequest(new { message = "Email and password required" });

            var user = _context.Users.FirstOrDefault(x => x.Email.ToLower() == email);

            if (user == null)
                return BadRequest(new { message = "User not found" });

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            _context.SaveChanges();

            return Ok(new { message = "Password reset successfully" });
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

            if (user == null)
                return Unauthorized("Invalid email or password");

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isPasswordValid)
                return Unauthorized("Invalid email or password");

            return Ok(new
            {
                userId = user.Id,
                fullName = user.FullName,
                email = user.Email
            });
        }

        // ================= REGISTER =================
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDTO request)
        {
            try
            {
                var email = request.Email.Trim().ToLower();

                if (_context.Users.Any(u => u.Email == email))
                    return BadRequest(new { message = "Email already exists" });

                if (string.IsNullOrEmpty(request.FullName) ||
                    string.IsNullOrEmpty(request.Mobile) ||
                    string.IsNullOrEmpty(request.Email) ||
                    string.IsNullOrEmpty(request.Password) ||
                    string.IsNullOrEmpty(request.Gender) ||
                    string.IsNullOrEmpty(request.BloodGroup))
                {
                    return BadRequest(new { message = "All fields are required" });
                }

                if (request.Mobile.Length != 10)
                    return BadRequest(new { message = "Mobile must be 10 digits" });

                var user = new User
                {
                    FullName = request.FullName,
                    Mobile = request.Mobile,
                    Email = email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    Gender = request.Gender,
                    Birthdate = request.Birthdate,
                    Age = request.Age,
                    Height = request.Height,
                    Weight = request.Weight,
                    BloodGroup = request.BloodGroup,
                    Address = request.Address,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                _context.SaveChanges();

                var health = new UserHealth
                {
                    UserId = user.Id,
                    Age = user.Age,
                    Height = (float)user.Height,
                    Weight = (float)user.Weight,
                    BloodGroup = user.BloodGroup,
                    HeartRate = 75,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.UserHealths.Add(health);
                _context.SaveChanges();

                return Ok(new
                {
                    success = true,
                    message = "User registered successfully",
                    userId = user.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = ex.InnerException?.Message ?? ex.Message
                });
            }
        }
    }
}