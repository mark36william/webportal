using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace WebPortal.API.Models;

public class Property
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; }
    
    [Required]
    [StringLength(500)]
    public string Address { get; set; }
    
    [Required]
    [StringLength(100)]
    public string City { get; set; }
    
    [StringLength(100)]
    public string Suburb { get; set; }
    
    [StringLength(50)]
    public string PropertyType { get; set; } // e.g., Apartment, House, Townhouse
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
    [Required]
    [StringLength(50)]
    public string ListingType { get; set; } // "Sale" or "Rent"
    
    [Required]
    public int Bedrooms { get; set; }
    
    [Required]
    public int Bathrooms { get; set; }
    
    [Required]
    public int CarSpots { get; set; }
    
    [StringLength(4000)]
    public string Description { get; set; }
    
    public List<string> ImageURLs { get; set; } = new();
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public bool IsFeatured { get; set; } = false;
    public int? FloorArea { get; set; } // in square meters
    public int? YearBuilt { get; set; }
    
    // Navigation property for users who favorited this property
    public virtual ICollection<Favorite> FavoritedBy { get; set; } = new List<Favorite>();
}
