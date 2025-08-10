using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace WebPortal.API.Models;

public class ApplicationUser : IdentityUser
{
    [MaxLength(100)]
    public string? FullName { get; set; }
    
    // Navigation properties
    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public virtual ICollection<RecentlyViewedProperty> RecentlyViewedProperties { get; set; } = new List<RecentlyViewedProperty>();
    public string PasswordHash { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
