using AutoMapper;
using WebPortal.API.DTOs;
using WebPortal.API.Models;

namespace WebPortal.API.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Property mappings
            CreateMap<Property, PropertyDTO>();
            
            // RecentlyViewedProperty mappings
            CreateMap<RecentlyViewedProperty, RecentlyViewedPropertyDTO>()
                .ForMember(dest => dest.Property, opt => opt.MapFrom(src => src.Property));
                
            // Add other mappings as needed
        }
    }
}
