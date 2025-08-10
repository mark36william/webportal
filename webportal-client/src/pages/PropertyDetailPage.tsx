import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  Divider, 
  IconButton, 
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon 
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { getPropertyById } from '../services/propertyService';
import type { Property } from '../types/property';
import ImageGallery from '../components/properties/ImageGallery';
import PropertySpecs from '../components/properties/PropertySpecs';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getPropertyById(parseInt(id, 10));
        setProperty(data);
        
        // Check if property is in favorites (you'll need to implement this)
        // const favorites = getFavoritesFromStorage();
        // setIsFavorite(favorites.includes(parseInt(id, 10)));
      } catch (err) {
        setError('Failed to load property details. Please try again later.');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSaveToFavorites = async () => {
    if (!property) return;
    
    try {
      setIsSavingFavorite(true);
      // TODO: Implement save to favorites functionality
      // await saveToFavorites(property.id);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error saving to favorites:', err);
    } finally {
      setIsSavingFavorite(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !property) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" py={4}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'Property not found'}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={handleBackClick}
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Back to Listings
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link 
            color="inherit" 
            href="/" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            Properties
          </Link>
          <Typography color="text.primary">{property.title}</Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBackClick}
            sx={{ textTransform: 'none' }}
          >
            Back to Results
          </Button>
          
          {isAuthenticated && (
            <Button
              variant={isFavorite ? 'contained' : 'outlined'}
              color="primary"
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={handleSaveToFavorites}
              disabled={isSavingFavorite}
            >
              {isFavorite ? 'Saved' : 'Save to Favorites'}
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ flex: 2 }}>
          <Paper elevation={0} sx={{ mb: 3, overflow: 'hidden' }}>
            <ImageGallery 
              images={property.imageURLs} 
              alt={property.title} 
            />
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {property.title}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  ${property.price.toLocaleString()}
                  {property.listingType === 'Rent' && ' / month'}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {property.address}, {property.city}
                </Typography>
              </Box>
              
              {isAuthenticated && (
                <IconButton 
                  color={isFavorite ? 'primary' : 'default'} 
                  onClick={handleSaveToFavorites}
                  disabled={isSavingFavorite}
                  size="large"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'primary.main',
                    },
                  }}
                >
                  {isFavorite ? (
                    <FavoriteIcon fontSize="large" />
                  ) : (
                    <FavoriteBorderIcon fontSize="large" />
                  )}
                </IconButton>
              )}
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {property.description || 'No description available.'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Property Features
              </Typography>
              <Box display="grid" gridTemplateColumns={{ xs: '1fr 1fr', sm: '1fr 1fr 1fr' }} gap={2}>
                <Box>
                  <Typography variant="body1">
                    <strong>Bedrooms:</strong> {property.bedrooms}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1">
                    <strong>Bathrooms:</strong> {property.bathrooms}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1">
                    <strong>Car Spots:</strong> {property.carSpots}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1">
                    <strong>Type:</strong> {property.listingType}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <PropertySpecs property={property} />
          
          <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Agent
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Interested in this property? Contact us for more information or to schedule a viewing.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              size="large"
              onClick={() => {
                // TODO: Implement contact agent functionality
                console.log('Contact agent clicked');
              }}
            >
              Contact Agent
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default PropertyDetailPage;
