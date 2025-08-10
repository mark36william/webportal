using System.Collections.Generic;
using System.Threading.Tasks;
using WebPortal.API.DTOs;

namespace WebPortal.API.Services
{
    public interface IRecentlyViewedService
    {
        Task TrackPropertyViewAsync(string userId, int propertyId);
        Task<IEnumerable<RecentlyViewedPropertyDTO>> GetRecentlyViewedPropertiesAsync(string userId, int limit = 10);
    }
}
