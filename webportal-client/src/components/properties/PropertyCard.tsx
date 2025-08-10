import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Chip, 
  IconButton, 
  Tooltip, 
  Typography, 
  useTheme,
  Button,
  Avatar,
  CircularProgress
} from '@mui/material';
import ImageWithFallback from '../common/ImageWithFallback';
import { 
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon, 
  LocationOn as LocationIcon,
  KingBed as BedIcon,
  Bathtub as BathIcon,
  DirectionsCar as ParkingIcon,
  SquareFoot as AreaIcon,
  Apartment as PropertyTypeIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
  CompareArrows as CompareIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import type { Property } from '../../types/property';
import { toggleFavorite, isPropertyFavorite } from '../../services/favoriteService';
// Format price based on listing type (kept for potential future use)
// const formatPrice = (price: number, listingType: 'Sale' | 'Rent'): string => {
//   const formattedPrice = new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0
//   }).format(price);
  
//   return listingType === 'Rent' ? `${formattedPrice}/mo` : formattedPrice;
// };

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onFavoriteToggle?: (propertyId: number) => void;
  onCardClick?: (propertyId: number) => void;
  showFavoriteButton?: boolean;
  hideFavoriteStatus?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  isFavorite: propIsFavorite, 
  onFavoriteToggle: propOnFavoriteToggle,
  onCardClick,
  showFavoriteButton = true,
  hideFavoriteStatus = false
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(propIsFavorite || false);
  const [isLoading, setIsLoading] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    if (propIsFavorite !== undefined) {
      setIsFavorite(propIsFavorite);
    }
  }, [propIsFavorite]);

  // Check favorite status if not provided as prop
  useEffect(() => {
    if (propIsFavorite === undefined && !hideFavoriteStatus && isAuthenticated) {
      const checkFavoriteStatus = async () => {
        try {
          const favoriteStatus = await isPropertyFavorite(property.id);
          setIsFavorite(favoriteStatus);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      };
      checkFavoriteStatus();
    }
  }, [property.id, isAuthenticated, propIsFavorite, hideFavoriteStatus]);
  
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(property.id);
    } else {
      navigate(`/properties/${property.id}`);
    }
  };
  
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    setIsLoading(true);
    
    try {
      // If parent component is managing the favorite state
      if (propOnFavoriteToggle) {
        propOnFavoriteToggle(property.id);
      } else {
        // Otherwise, manage it locally
        const newStatus = await toggleFavorite(property.id);
        setIsFavorite(newStatus);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // Destructure only the properties we need
  const { 
    title: propertyTitle, 
    price, 
    imageURLs, 
    listingType, 
    bedrooms,
    bathrooms,
    carSpots,
    city,
    suburb: propertySuburb,
    propertyType, 
    yearBuilt,
    floorArea
  } = property;
  
  const theme = useTheme();
  const propertyImage = imageURLs?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';
  
  // Format price based on listing type
  const formattedPrice = listingType === 'Rent' 
    ? `$${price}/mo`
    : `$${price.toLocaleString()}`;
  
  // Calculate days on market
  const daysOnMarket = property.createdAt 
    ? Math.floor((new Date().getTime() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          '& .property-image': {
            transform: 'scale(1.03)',
          },
        },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Property Image */}
        <Box sx={{ position: 'relative', height: 200, mb: 2, borderRadius: 1, overflow: 'hidden' }}>
          <ImageWithFallback
            src={propertyImage}
            alt={propertyTitle || 'Property image'}
            className="property-image"
            style={{
              transition: 'transform 0.5s ease',
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
            fallbackSrc="/src/assets/images/placeholder-property.jpg"
          />
          
          {/* Listing Type Badge */}
          <Chip
            label={property.listingType}
            color={property.listingType === 'Sale' ? 'secondary' : 'primary'}
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              fontWeight: 600,
              boxShadow: 1,
              textTransform: 'capitalize'
            }}
          />
          
          {/* Favorite Button */}
          {showFavoriteButton && (
            <Tooltip 
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              arrow
              placement="left"
            >
              <IconButton
                size="medium"
                onClick={handleFavoriteClick}
                disabled={isLoading}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(4px)',
                  boxShadow: 1,
                  '&:hover': {
                    backgroundColor: 'background.paper',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                  width: 36,
                  height: 36,
                  zIndex: 1,
                }}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : isFavorite ? (
                  <FavoriteIcon fontSize="small" color="error" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        {/* Property Location */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <LocationIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5, fontSize: '1rem' }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {city}{propertySuburb ? `, ${propertySuburb}` : ''}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, mb: 1 }}>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700, 
                color: 'primary.main',
                lineHeight: 1.2
              }}
            >
              {formattedPrice}
            </Typography>
            
            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'success.light', px: 1, py: 0.5, borderRadius: 1 }}>
              <StarIcon sx={{ color: 'warning.main', fontSize: '1rem', mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: 'success.dark', fontWeight: 600 }}>
                4.8
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Property Features */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5,
            mt: 'auto',
            pt: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BedIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, fontSize: '1.1rem' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
                {bedrooms > 0 ? `${bedrooms} ${bedrooms === 1 ? 'Bed' : 'Beds'}` : 'Studio'}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {bedrooms > 0 ? bedrooms : 'Studio'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BathIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, fontSize: '1.1rem' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
                {bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {bathrooms}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ParkingIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, fontSize: '1.1rem' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
                Parking
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {carSpots > 0 ? carSpots : 'None'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AreaIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, fontSize: '1.1rem' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
                Area
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {floorArea ? `${floorArea} m²` : 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Property Type and Year Built */}
        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            icon={<PropertyTypeIcon fontSize="small" />} 
            label={propertyType || 'Property'}
            size="small" 
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
          {yearBuilt && (
            <Typography variant="caption" color="text.secondary">
              Built {yearBuilt}
            </Typography>
          )}
        </Box>
        
        {/* Action Buttons */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            size="small" 
            fullWidth 
            startIcon={<ViewIcon />}
            onClick={handleCardClick}
            sx={{ py: 0.8 }}
          >
            View Details
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            fullWidth 
            startIcon={<CompareIcon />}
            sx={{ py: 0.8 }}
          >
            Compare
          </Button>
        </Box>
      </CardContent>
      
      {/* Footer */}
      <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'grey.50', borderTop: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src="/images/agent-1.jpg" 
              alt="Agent" 
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
                Agent
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                John Doe
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
              Listed
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {daysOnMarket === 0 ? 'Today' : `${daysOnMarket}d ago`}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default PropertyCard;
