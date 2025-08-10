using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using WebPortal.API.DTOs;
using WebPortal.API.Models;
using WebPortal.API.Models.Responses;
using WebPortal.API.Repositories;

namespace WebPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly ILogger<PropertiesController> _logger;

    public PropertiesController(IPropertyRepository propertyRepository, ILogger<PropertiesController> logger)
    {
        _propertyRepository = propertyRepository ?? throw new ArgumentNullException(nameof(propertyRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<PropertyDto>>> GetProperties([FromQuery] PropertyQueryParams queryParams)
    {
        try
        {
            _logger.LogInformation("Received request with query params: {@QueryParams}", queryParams);
            
            if (queryParams == null)
            {
                _logger.LogWarning("Query parameters are null");
                return BadRequest("Query parameters cannot be null");
            }
            
            // Log individual parameters
            _logger.LogInformation("PageNumber: {PageNumber}, PageSize: {PageSize}", queryParams.PageNumber, queryParams.PageSize);
            _logger.LogInformation("SortBy: {SortBy}, SortOrder: {SortOrder}", queryParams.SortBy, queryParams.SortOrder);
            _logger.LogInformation("PriceFrom: {PriceFrom}, PriceTo: {PriceTo}", queryParams.PriceFrom, queryParams.PriceTo);
            
            // Validate model state
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Model validation failed: {Errors}", 
                    string.Join(", ", ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)));
                return BadRequest(ModelState);
            }
            
            // Validate and normalize pagination parameters
            try
            {
                queryParams.ValidatePagination();
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Validation failed for query parameters");
                return BadRequest(new { message = ex.Message });
            }
            
            _logger.LogInformation("Getting total count of properties...");
            // Get total count of properties matching the filter
            var totalCount = await _propertyRepository.GetCountAsync(queryParams);
            _logger.LogInformation("Found {TotalCount} properties matching the criteria", totalCount);
            
            _logger.LogInformation("Getting paginated properties...");
            // Get paginated properties
            var properties = await _propertyRepository.GetPropertiesAsync(queryParams);
            _logger.LogInformation("Retrieved {Count} properties", properties.Count());
            
            // Calculate pagination metadata
            var totalPages = (int)Math.Ceiling(totalCount / (double)queryParams.PageSize);
            
            // Map to DTOs
            var items = properties.Select(p => MapToPropertyDto(p)).ToList();
            
            // Create paginated response
            var response = new PaginatedResponse<PropertyDto>
            {
                Items = items,
                PageNumber = queryParams.PageNumber,
                PageSize = queryParams.PageSize,
                TotalCount = totalCount,
                TotalPages = totalPages,
                HasPreviousPage = queryParams.PageNumber > 1,
                HasNextPage = queryParams.PageNumber < totalPages
            };
            
            return Ok(response);
        }
        catch (Exception ex)
        {
            // Log the exception
            _logger.LogError(ex, "Error retrieving properties");
            return StatusCode(500, new { message = "An error occurred while retrieving properties." });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PropertyDto>> GetProperty(int id)
    {
        try
        {
            var property = await _propertyRepository.GetByIdAsync(id);
            if (property == null)
            {
                return NotFound(new { message = "Property not found." });
            }

            return Ok(MapToPropertyDto(property));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the property." });
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<PropertyDto>> CreateProperty(CreatePropertyDto createPropertyDto)
    {
        try
        {
            var property = new Property
            {
                Title = createPropertyDto.Title,
                Address = createPropertyDto.Address,
                City = createPropertyDto.City,
                Price = createPropertyDto.Price,
                ListingType = createPropertyDto.ListingType,
                Bedrooms = createPropertyDto.Bedrooms,
                Bathrooms = createPropertyDto.Bathrooms,
                CarSpots = createPropertyDto.CarSpots,
                Description = createPropertyDto.Description,
                ImageURLs = createPropertyDto.ImageURLs ?? new List<string>(),
                CreatedAt = DateTime.UtcNow
            };

            await _propertyRepository.AddAsync(property);
            await _propertyRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, MapToPropertyDto(property));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the property." });
        }
    }

    private static PropertyDto MapToPropertyDto(Property property)
    {
        return new PropertyDto
        {
            Id = property.Id,
            Title = property.Title,
            Address = property.Address,
            City = property.City,
            Price = property.Price,
            ListingType = property.ListingType,
            Bedrooms = property.Bedrooms,
            Bathrooms = property.Bathrooms,
            CarSpots = property.CarSpots,
            Description = property.Description,
            ImageURLs = property.ImageURLs
        };
    }
}
