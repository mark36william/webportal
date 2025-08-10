using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebPortal.API.Models
{
    public class Favorite
    {
        [Required]
        public string UserId { get; set; }
        
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        
        [Required]
        public int PropertyId { get; set; }
        
        [ForeignKey("PropertyId")]
        public virtual Property Property { get; set; }
        
        public DateTime AddedOn { get; set; } = DateTime.UtcNow;
        
        // Composite primary key
        protected bool Equals(Favorite other)
        {
            return UserId == other.UserId && PropertyId == other.PropertyId;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((Favorite)obj);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(UserId, PropertyId);
        }
    }
}
