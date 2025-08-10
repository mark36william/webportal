using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.Providers.Entities;

namespace WebPortal.API.Models
{
    public class RecentlyViewedProperty
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(450)] // Required for string keys in SQL Server
        public string UserId { get; set; }
        
        [Required]
        public int PropertyId { get; set; }
        
        [Required]
        public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
        
        [ForeignKey("PropertyId")]
        public virtual Property Property { get; set; }
    }
}
