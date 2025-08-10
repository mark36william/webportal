using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebPortal.API.Data;
using WebPortal.API.Models;

namespace WebPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<FavoritesController> _logger;

        public FavoritesController(ApplicationDbContext context, ILogger<FavoritesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/favorites
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Property>>> GetFavorites()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var favoriteProperties = await _context.Favorites
                    .Where(f => f.UserId == userId)
                    .Select(f => f.Property)
                    .ToListAsync();

                return Ok(favoriteProperties);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving favorites");
                return StatusCode(500, "An error occurred while retrieving favorites");
            }
        }

        // POST: api/favorites/{propertyId}
        [HttpPost("{propertyId}")]
        public async Task<IActionResult> ToggleFavorite(int propertyId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                // Check if property exists
                var property = await _context.Properties.FindAsync(propertyId);
                if (property == null)
                {
                    return NotFound("Property not found");
                }

                var existingFavorite = await _context.Favorites
                    .FirstOrDefaultAsync(f => f.UserId == userId && f.PropertyId == propertyId);

                if (existingFavorite != null)
                {
                    // Remove from favorites
                    _context.Favorites.Remove(existingFavorite);
                    await _context.SaveChangesAsync();
                    return Ok(new { isFavorite = false });
                }
                else
                {
                    // Add to favorites
                    var favorite = new Favorite
                    {
                        UserId = userId,
                        PropertyId = propertyId,
                        AddedOn = DateTime.UtcNow
                    };
                    
                    _context.Favorites.Add(favorite);
                    await _context.SaveChangesAsync();
                    return Ok(new { isFavorite = true });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling favorite");
                return StatusCode(500, "An error occurred while toggling favorite");
            }
        }

        // GET: api/favorites/check/{propertyId}
        [HttpGet("check/{propertyId}")]
        public async Task<ActionResult<bool>> IsPropertyFavorite(int propertyId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var isFavorite = await _context.Favorites
                    .AnyAsync(f => f.UserId == userId && f.PropertyId == propertyId);

                return Ok(isFavorite);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking favorite status");
                return StatusCode(500, "An error occurred while checking favorite status");
            }
        }

        private string GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return null;
            }
            return userIdClaim;
        }
    }
}
