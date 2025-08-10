import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  CircularProgress, 
  Alert, 
  Paper,
  Pagination,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material';
import PropertyCard from '../components/properties/PropertyCard';
import PropertySearchFilters from '../components/properties/PropertySearchFilters';
import { getProperties } from '../services/propertyService';
import type { Property, PropertyQueryParams, PaginatedResponse } from '../types/property';

const PropertySearchPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [pagination, setPagination] = useState<PaginatedResponse<Property>>({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyQueryParams>({
    pageNumber: 1,
    pageSize: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);

  const fetchProperties = useCallback(async (currentFilters: PropertyQueryParams) => {
    try {
      console.log('Starting to fetch properties with filters:', currentFilters);
      setLoading(true);
      setError(null);
      
      const response = await getProperties(currentFilters);
      console.log('Received response from getProperties:', response);
      
      const newPagination = {
        items: response.items || [],
        totalCount: response.totalCount || 0,
        pageNumber: response.pageNumber || 1,
        totalPages: response.totalPages || 1,
        hasPreviousPage: response.hasPreviousPage || false,
        hasNextPage: response.hasNextPage || false,
      };
      
      console.log('Setting pagination state:', newPagination);
      setPagination(newPagination);
      
    } catch (err) {
      const errorMsg = 'Failed to fetch properties. Please try again later.';
      console.error('Error fetching properties:', err);
      setError(errorMsg);
      
      // Reset pagination on error
      setPagination({
        items: [],
        totalCount: 0,
        pageNumber: 1,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });
    } finally {
      console.log('Fetch properties completed, loading set to false');
      setLoading(false);
    }
  }, []);

  // Effect for initial load and when filters change
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Fetch properties with current filters
    fetchProperties(filters);
  }, [user, navigate, filters, fetchProperties]);

  const handleFilterChange = useCallback((newFilters: PropertyQueryParams) => {
    // When filters change, reset to first page
    setFilters(prev => {
      const updatedFilters = {
        ...prev,
        ...newFilters,
        pageNumber: 1, // Reset to first page when filters change
        // Remove empty values
        ...Object.fromEntries(
          Object.entries(newFilters).filter(([_, v]) => v !== '' && v !== undefined)
        )
      };
      console.log('Filters changed:', updatedFilters);
      return updatedFilters;
    });
  }, []);

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    console.log('Page changed to:', page);
    setFilters(prev => ({
      ...prev,
      pageNumber: page,
    }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleResetFilters = () => {
    // Reset to default filters but keep pagination parameters
    setFilters({
      pageNumber: 1, // Reset to first page
      pageSize: 12,  // Keep default page size
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPriceRange([0, 5000000]);
  };

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/properties/${propertyId}`);
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Property Listings
        </Typography>
        <Button variant="outlined" onClick={logout}>
          Logout
        </Button>
      </Box>

      <Paper elevation={0} sx={{ mb: 4, p: 3, bgcolor: 'background.default' }}>
        <PropertySearchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && pagination.pageNumber === 1 ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : pagination.items.length === 0 ? (
        <Box textAlign="center" my={4}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No properties found matching your criteria.
          </Typography>
          <Button variant="outlined" onClick={handleResetFilters} sx={{ mt: 2 }}>
            Clear all filters
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {pagination.items.map((property) => (
              <Grid 
                item 
                key={property.id} 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3}
                sx={{ display: 'flex' }}
              >
                <PropertyCard 
                  property={property}
                  onCardClick={() => handlePropertyClick(property.id)}
                />
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <Box mt={4} display="flex" justifyContent="center">
              <Stack spacing={2}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.pageNumber}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                  showFirstButton
                  showLastButton
                />
                <Typography variant="body2" color="textSecondary" textAlign="center">
                  Showing {pagination.items.length} of {pagination.totalCount} properties
                </Typography>
              </Stack>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default PropertySearchPage;
