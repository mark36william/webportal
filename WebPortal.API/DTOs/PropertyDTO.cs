using System.ComponentModel.DataAnnotations;

namespace WebPortal.API.DTOs;

public class PropertyDTO
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string Address { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }
    
    [Required]
    public string ListingType { get; set; } = "Sale"; // "Rent" or "Sale"
    
    [Range(0, 20)]
    public int Bedrooms { get; set; }
    
    [Range(0, 20)]
    public int Bathrooms { get; set; }
    
    [Range(0, 10)]
    public int? CarSpots { get; set; }
    
    public string? Description { get; set; }
    public List<string> ImageURLs { get; set; } = new();
}
