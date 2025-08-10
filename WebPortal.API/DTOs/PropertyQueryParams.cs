using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace WebPortal.API.DTOs
{
    public class PropertyQueryParams
    {
        // Pagination parameters
        [Range(1, int.MaxValue, ErrorMessage = "PageNumber must be greater than 0")]
        [DefaultValue(1)]
        public int PageNumber { get; set; } = 1;

        [Range(1, 100, ErrorMessage = "PageSize must be between 1 and 100")]
        [DefaultValue(10)]
        public int PageSize { get; set; } = 10;

        // Sorting parameters
        [DefaultValue("CreatedAt")]
        public string SortBy { get; set; } = "CreatedAt";

        [DefaultValue("desc")]
        [RegularExpression("^(?i)(asc|desc)$", ErrorMessage = "SortOrder must be either 'asc' or 'desc'")]
        public string SortOrder { get; set; } = "desc";

        // Filter parameters
        [Range(0, double.MaxValue, ErrorMessage = "PriceFrom must be a positive number")]
        public decimal? PriceFrom { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "PriceTo must be a positive number")]
        public decimal? PriceTo { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Bedrooms must be a positive number")]
        public int? Bedrooms { get; set; }

        public string? City { get; set; }

        public string? ListingType { get; set; } // e.g., "Sale", "Rent"

        // Additional filter parameters
        public string? Suburb { get; set; }
        public string? PropertyType { get; set; } // e.g., "House", "Apartment", "Townhouse"
        public bool? IsFeatured { get; set; }

        // Date range filters
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }

        // Search term for general search
        public string? SearchTerm { get; set; }

        // Helper method to validate pagination parameters
        public void ValidatePagination()
        {
            try
            {
                // Validate using data annotations
                var validationContext = new ValidationContext(this);
                Validator.ValidateObject(this, validationContext, validateAllProperties: true);

                // Additional validation logic
                if (PriceFrom.HasValue && PriceTo.HasValue && PriceFrom > PriceTo)
                {
                    throw new ValidationException("PriceFrom cannot be greater than PriceTo");
                }

                if (DateFrom.HasValue && DateTo.HasValue && DateFrom > DateTo)
                {
                    throw new ValidationException("DateFrom cannot be after DateTo");
                }

                // Ensure valid sort field
                if (string.IsNullOrWhiteSpace(SortBy))
                {
                    SortBy = "CreatedAt";
                }

                // Ensure valid sort order
                if (string.IsNullOrWhiteSpace(SortOrder) ||
                   (SortOrder.ToLower() != "asc" && SortOrder.ToLower() != "desc"))
                {
                    SortOrder = "desc";
                }
            }
            catch (ValidationException ex)
            {
                throw new ValidationException($"Invalid query parameters: {ex.Message}", ex);
            }
        }
    }
}
