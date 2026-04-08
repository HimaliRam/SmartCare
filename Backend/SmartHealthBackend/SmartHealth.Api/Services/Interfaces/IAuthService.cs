using SmartHealth.Api.DTOs;
using SmartHealth.Api.Models;

namespace SmartHealth.Api.Services
{
    public interface IAuthService
    {
        User Register(RegisterDTO dto);
        User Login(LoginDTO dto);
        bool ResetPassword(ForgotPasswordDTO dto);
        bool EmailExists(string email);
    }
}