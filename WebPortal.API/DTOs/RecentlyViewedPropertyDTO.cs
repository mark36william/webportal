using System;

namespace WebPortal.API.DTOs
{
    public class RecentlyViewedPropertyDTO
    {
        public int PropertyId { get; set; }
        public DateTime ViewedAt { get; set; }
        public PropertyDTO Property { get; set; }
    }
}
