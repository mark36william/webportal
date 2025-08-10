using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebPortal.API.Data;
using WebPortal.API.DTOs;
using WebPortal.API.Models;

namespace WebPortal.API.Services
{
    public class RecentlyViewedService : IRecentlyViewedService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public RecentlyViewedService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task TrackPropertyViewAsync(string userId, int propertyId)
        {
            // Check if the property exists
            var propertyExists = await _context.Properties.AnyAsync(p => p.Id == propertyId);
            if (!propertyExists)
            {
                throw new KeyNotFoundException("Property not found");
            }

            // Check if the user has already viewed this property
            var existingView = await _context.RecentlyViewedProperties
                .FirstOrDefaultAsync(rvp => rvp.UserId == userId && rvp.PropertyId == propertyId);

            if (existingView != null)
            {
                // Update the timestamp if already viewed
                existingView.ViewedAt = DateTime.UtcNow;
                _context.RecentlyViewedProperties.Update(existingView);
            }
            else
            {
                // Add new view
                var newView = new RecentlyViewedProperty
                {
                    UserId = userId,
                    PropertyId = propertyId,
                    ViewedAt = DateTime.UtcNow
                };
                await _context.RecentlyViewedProperties.AddAsync(newView);
            }

            await _context.SaveChangesAsync();

            // Keep only the most recent 20 views per user
            await CleanupOldViews(userId, 20);
        }

        public async Task<IEnumerable<RecentlyViewedPropertyDTO>> GetRecentlyViewedPropertiesAsync(string userId, int limit = 10)
        {
            var recentViews = await _context.RecentlyViewedProperties
                .Where(rvp => rvp.UserId == userId)
                .Include(rvp => rvp.Property)
                .OrderByDescending(rvp => rvp.ViewedAt)
                .Take(limit)
                .ToListAsync();

            return _mapper.Map<IEnumerable<RecentlyViewedPropertyDTO>>(recentViews);
        }

        private async Task CleanupOldViews(string userId, int keepCount)
        {
            var viewsToKeep = await _context.RecentlyViewedProperties
                .Where(rvp => rvp.UserId == userId)
                .OrderByDescending(rvp => rvp.ViewedAt)
                .Take(keepCount)
                .Select(rvp => rvp.Id)
                .ToListAsync();

            var oldViews = await _context.RecentlyViewedProperties
                .Where(rvp => rvp.UserId == userId && !viewsToKeep.Contains(rvp.Id))
                .ToListAsync();

            if (oldViews.Any())
            {
                _context.RecentlyViewedProperties.RemoveRange(oldViews);
                await _context.SaveChangesAsync();
            }
        }
    }
}
