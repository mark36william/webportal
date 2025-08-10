import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  CircularProgress, 
  Alert,
  IconButton
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import PropertyCard from '../components/properties/PropertyCard';
import { getFavorites, toggleFavorite } from '../services/favoriteService';
import type { Property } from '../types/property';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      setError('Failed to load favorites. Please try again.');
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (propertyId: number) => {
    try {
      await toggleFavorite(propertyId);
      // Remove the unfavorited property from the list
      setFavorites(prevFavorites => 
        prevFavorites.filter(property => property.id !== propertyId)
      );
    } catch (err) {
      setError('Failed to update favorites. Please try again.');
      console.error('Error toggling favorite:', err);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Back
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          My Favorites
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {favorites.length === 0 ? (
          <Box textAlign="center" py={6}>
            <FavoriteBorderIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your favorites list is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Save properties you like by clicking the heart icon.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/properties')}
            >
              Browse Properties
            </Button>
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)', 
                lg: 'repeat(4, 1fr)' 
              }, 
              gap: 3 
            }}
          >
            {favorites.map((property) => (
              <Box key={property.id} sx={{ position: 'relative' }}>
                <PropertyCard 
                  property={property} 
                  onFavoriteToggle={handleToggleFavorite}
                  isFavorite={true}
                />
                <IconButton
                  aria-label="remove from favorites"
                  onClick={() => handleToggleFavorite(property.id)}
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <FavoriteIcon color="error" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default FavoritesPage;
