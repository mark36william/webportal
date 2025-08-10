using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebPortal.API.DTOs;
using WebPortal.API.Services;

namespace WebPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RecentlyViewedController : ControllerBase
    {
        private readonly IRecentlyViewedService _recentlyViewedService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RecentlyViewedController(
            IRecentlyViewedService recentlyViewedService,
            IHttpContextAccessor httpContextAccessor)
        {
            _recentlyViewedService = recentlyViewedService;
            _httpContextAccessor = httpContextAccessor;
        }

        private string GetCurrentUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                throw new UnauthorizedAccessException("User not authenticated");
            }
            return userIdClaim;
        }

        [HttpPost("track/{propertyId}")]
        public async Task<IActionResult> TrackPropertyView(int propertyId)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _recentlyViewedService.TrackPropertyViewAsync(userId, propertyId);
                return Ok();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while tracking property view: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecentlyViewedPropertyDTO>>> GetRecentlyViewed([FromQuery] int limit = 10)
        {
            try
            {
                var userId = GetCurrentUserId();
                var recentlyViewed = await _recentlyViewedService.GetRecentlyViewedPropertiesAsync(userId, limit);
                return Ok(recentlyViewed);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving recently viewed properties: {ex.Message}");
            }
        }
    }
}
