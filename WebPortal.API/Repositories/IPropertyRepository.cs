using WebPortal.API.DTOs;
using WebPortal.API.Models;

namespace WebPortal.API.Repositories;

public interface IPropertyRepository : IRepository<Property, int>
{
    Task<IEnumerable<Property>> GetPropertiesAsync(PropertyQueryParams queryParams);
    Task<Property> GetPropertyWithDetailsAsync(int id);
    
    /// <summary>
    /// Gets the total count of properties matching the filter criteria
    /// </summary>
    /// <param name="queryParams">Filter criteria</param>
    /// <returns>Total count of matching properties</returns>
    Task<int> GetCountAsync(PropertyQueryParams queryParams);
}
