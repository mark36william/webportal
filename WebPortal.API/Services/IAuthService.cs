using WebPortal.API.DTOs;
using WebPortal.API.Models;

namespace WebPortal.API.Services;

public interface IAuthService
{
    Task<UserResponseDto> RegisterAsync(UserRegisterDto userDto);
    Task<string> LoginAsync(UserLoginDto loginDto);
    Task<UserResponseDto> GetUserByIdAsync(string id);
}
