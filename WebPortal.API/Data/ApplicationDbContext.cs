using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Web.Providers.Entities;
using WebPortal.API.Models;

namespace WebPortal.API.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Users are handled by Identity
    public DbSet<Property> Properties { get; set; }
    public DbSet<Favorite> Favorites { get; set; }
    public DbSet<RecentlyViewedProperty> RecentlyViewedProperties { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configure composite key for RecentlyViewedProperty
        modelBuilder.Entity<RecentlyViewedProperty>()
            .HasIndex(rvp => new { rvp.UserId, rvp.PropertyId })
            .IsUnique();
            
        modelBuilder.Entity<RecentlyViewedProperty>()
            .HasIndex(rvp => rvp.ViewedAt);
            
        // Configure relationships
        modelBuilder.Entity<RecentlyViewedProperty>()
            .HasOne(rvp => rvp.User)
            .WithMany(u => u.RecentlyViewedProperties)
            .HasForeignKey(rvp => rvp.UserId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<RecentlyViewedProperty>()
            .HasOne(rvp => rvp.Property)
            .WithMany()
            .HasForeignKey(rvp => rvp.PropertyId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure ApplicationUser entity
        modelBuilder.Entity<ApplicationUser>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.UserName).IsUnique();
        });

        // Configure Property entity
        modelBuilder.Entity<Property>(entity =>
        {
            entity.Property(p => p.ImageURLs)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                    v => JsonSerializer.Deserialize<List<string>>(v, new JsonSerializerOptions()) ?? new List<string>()
                );
            
            entity.HasIndex(p => p.City);
            entity.HasIndex(p => p.Price);
            entity.HasIndex(p => p.ListingType);
            entity.HasIndex(p => p.Bedrooms);
        });

        // Configure Favorite entity (many-to-many relationship)
        modelBuilder.Entity<Favorite>(entity =>
        {
            // Composite primary key
            entity.HasKey(f => new { f.UserId, f.PropertyId });

            // Relationship with User
            entity.HasOne(f => f.User)
                .WithMany(u => u.Favorites)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relationship with Property
            entity.HasOne(f => f.Property)
                .WithMany(p => p.FavoritedBy)
                .HasForeignKey(f => f.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
