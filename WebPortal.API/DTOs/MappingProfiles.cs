using AutoMapper;
using System.Web.Providers.Entities;
using WebPortal.API.DTOs;
using WebPortal.API.Models;

namespace WebPortal.API.DTOs;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        // User mappings
        CreateMap<UserRegisterDto, User>();

        CreateMap<User, UserResponseDto>();
    }
}
