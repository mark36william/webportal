using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebPortal.API.Models;

namespace WebPortal.API.Data;

public static class PropertySeedData
{
    private static readonly Random _random = new();
    private static readonly string[] _cities = 
    {
        "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide",
        "Hobart", "Darwin", "Canberra", "Gold Coast", "Newcastle",
        "Sunshine Coast", "Wollongong", "Geelong", "Townsville", "Cairns"
    };

    private static readonly string[] _suburbs = 
    {
        "CBD", "Richmond", "Southbank", "Bondi", "Manly", "Surry Hills",
        "Paddington", "Newtown", "Parramatta", "Chatswood", "St Kilda",
        "Fitzroy", "South Yarra", "Brunswick", "Fortitude Valley"
    };

    private static readonly string[] _streetTypes = 
    {
        "Street", "Avenue", "Road", "Boulevard", "Drive", "Lane", "Way",
        "Terrace", "Place", "Court", "Parade", "Crescent", "Esplanade"
    };

    private static readonly string[] _listingTypes = { "Sale", "Rent" };
    
    private static readonly string[] _propertyTypes = 
    {
        "Apartment", "House", "Townhouse", "Villa", "Unit", "Studio",
        "Penthouse", "Duplex", "Terrace", "Semi-detached", "Cottage"
    };

    private static readonly string[] _features = 
    {
        "with Ocean View", "with City View", "with Garden", "with Pool",
        "Modern", "Renovated", "Luxury", "Spacious", "Stylish", "Charming"
    };

    private static readonly string[] _propertyTitles = 
    {
        "Modern Apartment in the City",
        "Spacious Family Home",
        "Luxury Penthouse with Ocean View",
        "Cozy Studio in Downtown",
        "Modern Villa with Private Pool",
        "Charming Cottage by the Beach",
        "Stylish Loft in Arts District",
        "Elegant Mansion with Garden",
        "Contemporary Townhouse",
        "Rustic Cabin in the Woods",
        "Executive Apartment with City Views",
        "Renovated Family Home with Pool",
        "Luxury Waterfront Apartment",
        "Modern Townhouse with Courtyard",
        "Charming Heritage Home"
    };

    private static readonly string[] _descriptions =
    {
        "Beautifully designed property with modern amenities and great location. Features include an open floor plan, high ceilings, and premium finishes throughout.",
        "Spacious rooms with natural light and stunning views of the city. Recently renovated with high-quality materials and attention to detail.",
        "Luxurious living at its finest with high-end finishes throughout. The property boasts a gourmet kitchen, spa-like bathrooms, and smart home features.",
        "Perfect for professionals looking for a comfortable and convenient lifestyle. Close to public transport, shops, and dining options.",
        "Family-friendly neighborhood with excellent schools and parks nearby. The property features multiple living areas and a large backyard.",
        "Recently renovated with top-of-the-line appliances and fixtures. The open-plan design is perfect for modern living and entertaining.",
        "Private and peaceful setting with easy access to all amenities. Enjoy the tranquility while being just minutes from the city center.",
        "Stunning architecture with attention to detail in every corner. This property offers a perfect blend of style and functionality.",
        "Open floor plan perfect for entertaining guests. The property features a modern kitchen, spacious living areas, and outdoor entertaining space.",
        "Tranquil retreat with beautiful landscaping and outdoor living spaces. Perfect for those who value privacy and natural surroundings.",
        "Bright and airy apartment with modern finishes and city views. Features include a gourmet kitchen and spacious living areas.",
        "Charming character home with period features and modern updates. Located in a quiet, tree-lined street close to amenities.",
        "Luxury living at its best with high-end finishes and attention to detail. The property includes a private balcony with stunning views.",
        "Modern townhouse with low-maintenance living. Perfect for professionals or small families looking for convenience and style.",
        "Spacious family home with multiple living areas, a large backyard, and plenty of storage. Located in a sought-after school zone."
    };

    private static readonly string[] _imageUrls = 
    {
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=80", // Modern house
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&auto=format&fit=crop&q=80", // Luxury home
        "https://images.unsplash.com/photo-1600566752225-ff822e1c7856?w=800&auto=format&fit=crop&q=80", // Apartment interior
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop&q=80", // Modern apartment
        "https://images.unsplash.com/photo-1600049809665-5eb0b9a4f5fe?w=800&auto=format&fit=crop&q=80", // Cozy living room
        "https://images.unsplash.com/photo-1600607687939-ce8bbf269f80?w=800&auto=format&fit=crop&q=80", // Modern kitchen
        "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&auto=format&fit=crop&q=80", // Luxury bathroom
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80", // Bedroom
        "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&auto=format&fit=crop&q=80", // Dining area
        "https://images.unsplash.com/photo-1600607687559-7e81809d2411?w=800&auto=format&fit=crop&q=80"  // Home office
    };

    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Always clear existing properties to ensure fresh data
        Console.WriteLine("Clearing existing properties...");
        context.Properties.RemoveRange(await context.Properties.ToListAsync());
        await context.SaveChangesAsync();

        var properties = new List<Property>();
        var random = new Random();
        
        // Clear existing properties if any
        if (await context.Properties.AnyAsync())
        {
            context.Properties.RemoveRange(await context.Properties.ToListAsync());
            await context.SaveChangesAsync();
        }

        // Generate 120 properties (more than 100 as requested)
        for (int i = 0; i < 120; i++)
        {
            var property = new Property
            {
                Title = GeneratePropertyTitle(random),
                Address = GenerateAddress(random),
                City = _cities[random.Next(_cities.Length)],
                Suburb = _suburbs[random.Next(_suburbs.Length)],
                Price = GeneratePrice(random, i % 2 == 0 ? "Sale" : "Rent"),
                ListingType = i % 2 == 0 ? "Sale" : "Rent",
                PropertyType = _propertyTypes[random.Next(_propertyTypes.Length)],
                Bedrooms = GenerateBedroomCount(random),
                Bathrooms = Math.Max(1, random.Next(1, 4)),
                CarSpots = random.Next(0, 3),
                Description = _descriptions[random.Next(_descriptions.Length)],
                ImageURLs = GetRandomImageUrls(random.Next(3, 8)),
                CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 90)),
                IsFeatured = random.Next(10) < 3, // 30% chance of being featured
                FloorArea = random.Next(50, 500), // Square meters
                YearBuilt = DateTime.Now.Year - random.Next(0, 50)
            };

            properties.Add(property);
        }

        await context.Properties.AddRangeAsync(properties);
        await context.SaveChangesAsync();
    }

    private static string GeneratePropertyTitle(Random random)
    {
        var propertyType = _propertyTypes[random.Next(_propertyTypes.Length)];
        var feature = _features[random.Next(_features.Length)];
        var location = random.Next(2) == 0 ? _cities[random.Next(_cities.Length)] : _suburbs[random.Next(_suburbs.Length)];
        
        if (random.Next(2) == 0)
        {
            return $"{feature} {propertyType} in {location}";
        }
        else
        {
            return $"{_propertyTitles[random.Next(_propertyTitles.Length)]} in {location}";
        }
    }

    private static string GenerateAddress(Random random)
    {
        var streetNumber = random.Next(1, 1000);
        var streetName = $"Sample {_streetTypes[random.Next(_streetTypes.Length)]}";
        var unitNumber = random.Next(10) > 7 ? $"Unit {random.Next(1, 100)}/" : "";
        
        return $"{unitNumber}{streetNumber} {streetName}";
    }

    private static int GeneratePrice(Random random, string listingType)
    {
        if (listingType == "Sale")
        {
            // Sale prices between 300K and 3M, in 10K increments
            return random.Next(30, 301) * 10000;
        }
        else
        {
            // Weekly rent between 300 and 2000, in 50 increments
            return random.Next(6, 41) * 50;
        }
    }

    private static int GenerateBedroomCount(Random random)
    {
        // Weighted random to have more 2-3 bedroom properties
        var rand = random.Next(10);
        return rand switch
        {
            < 1 => 1,   // 10% 1-bedroom
            < 4 => 2,   // 30% 2-bedroom
            < 7 => 3,   // 30% 3-bedroom
            < 9 => 4,   // 20% 4-bedroom
            _ => 5      // 10% 5+ bedroom
        };
    }

    private static List<string> GetRandomImageUrls(int count)
    {
        var urls = new List<string>();
        var usedIndices = new HashSet<int>();
        
        // Always include at least one image
        if (count < 1) count = 1;
        
        // Don't exceed available images
        count = Math.Min(count, _imageUrls.Length);
        
        while (urls.Count < count)
        {
            int index;
            do
            {
                index = _random.Next(_imageUrls.Length);
            } while (usedIndices.Contains(index));
            
            usedIndices.Add(index);
            urls.Add(_imageUrls[index]);
        }
        
        return urls;
    }
}
