using System.ComponentModel.DataAnnotations;

namespace WebPortal.API.DTOs;

public class PropertyDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public decimal Price { get; set; }
    public string ListingType { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public int CarSpots { get; set; }
    public string Description { get; set; }
    public List<string> ImageURLs { get; set; } = new();
}

public class CreatePropertyDto
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; }
    
    [Required]
    [StringLength(500)]
    public string Address { get; set; }
    
    [Required]
    [StringLength(100)]
    public string City { get; set; }
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }
    
    [Required]
    [StringLength(50)]
    public string ListingType { get; set; }
    
    [Required]
    [Range(0, int.MaxValue)]
    public int Bedrooms { get; set; }
    
    [Required]
    [Range(0, int.MaxValue)]
    public int Bathrooms { get; set; }
    
    [Required]
    [Range(0, int.MaxValue)]
    public int CarSpots { get; set; }
    
    [StringLength(4000)]
    public string Description { get; set; }
    
    public List<string> ImageURLs { get; set; } = new();
}
