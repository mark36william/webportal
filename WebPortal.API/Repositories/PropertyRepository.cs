using Microsoft.EntityFrameworkCore;
using WebPortal.API.Data;
using WebPortal.API.DTOs;
using WebPortal.API.Models;

namespace WebPortal.API.Repositories;

public class PropertyRepository : Repository<Property, int>, IPropertyRepository
{
    public PropertyRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Property>> GetPropertiesAsync(PropertyQueryParams queryParams)
    {
        var query = _context.Properties.AsQueryable();

        // Apply filters
        if (queryParams.PriceFrom.HasValue)
        {
            query = query.Where(p => p.Price >= queryParams.PriceFrom.Value);
        }

        if (queryParams.PriceTo.HasValue)
        {
            query = query.Where(p => p.Price <= queryParams.PriceTo.Value);
        }

        if (queryParams.Bedrooms.HasValue)
        {
            query = query.Where(p => p.Bedrooms == queryParams.Bedrooms.Value);
        }

        if (!string.IsNullOrEmpty(queryParams.City))
        {
            query = query.Where(p => p.City.ToLower() == queryParams.City.ToLower());
        }

        if (!string.IsNullOrEmpty(queryParams.ListingType))
        {
            query = query.Where(p => p.ListingType.ToLower() == queryParams.ListingType.ToLower());
        }

        // Apply sorting
        query = queryParams.SortBy?.ToLower() switch
        {
            "price" when queryParams.SortOrder?.ToLower() == "asc" => query.OrderBy(p => p.Price),
            "price" when queryParams.SortOrder?.ToLower() == "desc" => query.OrderByDescending(p => p.Price),
            "createdat" when queryParams.SortOrder?.ToLower() == "asc" => query.OrderBy(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.CreatedAt) // Default sort
        };

        // Apply pagination
        if (queryParams.PageNumber > 0 && queryParams.PageSize > 0)
        {
            query = query
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize);
        }

        return await query.ToListAsync();
    }

    public async Task<int> GetCountAsync(PropertyQueryParams queryParams)
    {
        var query = _context.Properties.AsQueryable();

        // Apply the same filters as in GetPropertiesAsync
        if (queryParams.PriceFrom.HasValue)
        {
            query = query.Where(p => p.Price >= queryParams.PriceFrom.Value);
        }

        if (queryParams.PriceTo.HasValue)
        {
            query = query.Where(p => p.Price <= queryParams.PriceTo.Value);
        }

        if (queryParams.Bedrooms.HasValue)
        {
            query = query.Where(p => p.Bedrooms == queryParams.Bedrooms.Value);
        }

        if (!string.IsNullOrEmpty(queryParams.City))
        {
            query = query.Where(p => p.City.ToLower() == queryParams.City.ToLower());
        }

        if (!string.IsNullOrEmpty(queryParams.ListingType))
        {
            query = query.Where(p => p.ListingType.ToLower() == queryParams.ListingType.ToLower());
        }

        return await query.CountAsync();
    }

    public async Task<Property> GetPropertyWithDetailsAsync(int id)
    {
        return await _context.Properties
            .FirstOrDefaultAsync(p => p.Id == id);
    }
}
