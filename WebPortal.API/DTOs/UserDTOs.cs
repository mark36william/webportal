using System.ComponentModel.DataAnnotations;

namespace WebPortal.API.DTOs;

public class UserRegisterDto
{
    [Required]
    [StringLength(100)]
    public string Username { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; }
}

public class UserLoginDto
{
    [Required]
    public string Identifier { get; set; } // Can be username or email

    [Required]
    public string Password { get; set; }
}

public class UserResponseDto
{
    public string Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }
}
