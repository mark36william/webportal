import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, IconButton } from '@mui/material';
import ImageWithFallback from './ImageWithFallback';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { getRecentlyViewed } from '../../services/recentlyViewedService';
import type { Property } from '../../types/property';

interface RecentlyViewedSidebarProps {
  open: boolean;
  onClose: () => void;
}

const RecentlyViewedSidebar: React.FC<RecentlyViewedSidebarProps> = ({ open, onClose }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        setLoading(true);
        const data = await getRecentlyViewed();
        setRecentlyViewed(data);
      } catch (error) {
        console.error('Error fetching recently viewed:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchRecentlyViewed();
    }
  }, [open]);

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/properties/${propertyId}`);
    onClose();
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 350,
        height: '100vh',
        bgcolor: 'background.paper',
        boxShadow: 3,
        zIndex: 1200,
        overflowY: 'auto',
        p: 2,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h2">
          Recently Viewed
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <Typography>Loading...</Typography>
        </Box>
      ) : recentlyViewed.length === 0 ? (
        <Typography variant="body2" color="text.secondary" textAlign="center" p={2}>
          No recently viewed properties
        </Typography>
      ) : (
        <Box>
          {recentlyViewed.map((property) => (
            <Card 
              key={property.id} 
              sx={{ 
                mb: 2, 
                cursor: 'pointer',
                '&:hover': { boxShadow: 4 }
              }}
              onClick={() => handlePropertyClick(property.id)}
            >
              <Box sx={{ height: 100, width: '100%', overflow: 'hidden' }}>
                <ImageWithFallback
                  src={property.imageURLs?.[0]}
                  alt={property.title || 'Property image'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  fallbackSrc="/src/assets/images/placeholder-property.jpg"
                />
              </Box>
              <CardContent>
                <Typography variant="subtitle2" noWrap>{property.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.city}, ${property.price?.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecentlyViewedSidebar;
