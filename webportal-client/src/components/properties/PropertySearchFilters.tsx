import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import {
  Box, 
  Button, 
  Grid, 
  Typography, 
  Slider, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  useTheme,
  useMediaQuery,
  IconButton,
  Collapse,
  Paper,
  styled
} from '@mui/material';
import type { PropertyQueryParams } from '../../types/property';
import { CITIES, BEDROOM_OPTIONS, LISTING_TYPES } from '../../types/property';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

// Styled button component for consistent styling
const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: 6,
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s ease-in-out',
  minWidth: 120,
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[1],
  },
}));

// Styled form control for consistent inputs
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
  minWidth: 180, // Ensure minimum width for all form controls
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    fontSize: '0.95rem',
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    '& .MuiSelect-select': {
      minWidth: 120, // Ensure minimum width for the select input
    },
    backgroundColor: theme.palette.background.paper,
    minHeight: 48,
    '& .MuiSelect-select': {
      padding: '12px 14px',
      paddingRight: '36px !important',
      display: 'flex',
      alignItems: 'center',
      minHeight: '24px',
    },
    '& fieldset': {
      borderColor: theme.palette.divider,
      borderWidth: 1.5,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 1.5,
      boxShadow: `0 0 0 2px ${theme.palette.primary.light}40`,
    },
  },
  '& .MuiSelect-icon': {
    right: 12,
    color: theme.palette.text.secondary,
  },
  '& .MuiMenuItem-root': {
    padding: '10px 16px',
    minHeight: 'auto',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-selected': {
      backgroundColor: `${theme.palette.primary.light}20`,
      '&:hover': {
        backgroundColor: `${theme.palette.primary.light}30`,
      },
    },
  },
  '& .MuiList-root': {
    padding: '8px 0',
    boxShadow: theme.shadows[3],
    borderRadius: 8,
  },
}));

interface PropertySearchFiltersProps {
  filters: PropertyQueryParams;
  onFilterChange: (filters: PropertyQueryParams) => void;
  onReset: () => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
}

const PropertySearchFilters: React.FC<PropertySearchFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  priceRange,
  onPriceRangeChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Toggle mobile filters
  const toggleMobileFilters = () => setMobileFiltersOpen(!mobileFiltersOpen);

  // Reset mobile state when viewport changes
  useEffect(() => {
    if (!isMobile) {
      setMobileFiltersOpen(false);
    }
  }, [isMobile]);

  // Handle reset with mobile state
  const handleReset = () => {
    onReset();
    if (isMobile) {
      setMobileFiltersOpen(false);
    }
  };
  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    onPriceRangeChange(newValue as [number, number]);
  };

  const handleInputChange = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  // Render filter content
  const renderFilterContent = () => (
    <Grid container spacing={2} sx={{ 
      py: 1, 
      width: '100%',
      '& .MuiGrid-item': {
        minWidth: '12%',
      }
    }}>
      <Grid item xs={12} sm={6} md={3} component="div">
        <StyledFormControl fullWidth size="small">
          <InputLabel id="listing-type-label">Listing Type</InputLabel>
          <Select
            labelId="listing-type-label"
            name="listingType"
            value={filters.listingType || ''}
            onChange={handleInputChange}
            label="Listing Type"
          >
            <MenuItem value="">Any</MenuItem>
            {LISTING_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3} component="div">
        <StyledFormControl fullWidth size="small">
          <InputLabel id="city-label">City</InputLabel>
          <Select
            labelId="city-label"
            name="city"
            value={filters.city || ''}
            onChange={handleInputChange}
            label="City"
          >
            <MenuItem value="">All Cities</MenuItem>
            {CITIES.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3} component="div">
        <StyledFormControl fullWidth size="small">
          <InputLabel id="bedrooms-label">Bedrooms</InputLabel>
          <Select
            labelId="bedrooms-label"
            name="bedrooms"
            value={filters.bedrooms || ''}
            onChange={handleInputChange}
            label="Bedrooms"
          >
            <MenuItem value="">Any</MenuItem>
            {BEDROOM_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} component="div" sx={{ mt: 1 }}>
        <Box sx={{ 
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          p: 2,
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="subtitle2" color="text.primary" gutterBottom>
            Price Range (${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()})
          </Typography>
          <Box sx={{ px: 2, mt: 2 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="off"
              min={0}
              max={5000000}
              step={50000}
              sx={{ 
                color: 'primary.main',
                '& .MuiSlider-thumb': {
                  height: 18,
                  width: 18,
                  backgroundColor: theme.palette.primary.main,
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0 0 0 6px ${theme.palette.primary.light}40`,
                  },
                },
                '& .MuiSlider-rail': {
                  opacity: 0.5,
                  backgroundColor: theme.palette.grey[400],
                },
                '& .MuiSlider-track': {
                  border: 'none',
                },
              }}
            />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 0.5,
              px: 0.5
            }}>
              <Typography variant="caption" color="text.secondary">
                ${priceRange[0].toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ${priceRange[1].toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} component="div" sx={{ mt: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          justifyContent: { xs: 'stretch', sm: 'flex-end' },
          '& > *': {
            flex: { xs: '1 1 100%', sm: '0 0 auto' },
          }
        }}>
          <StyledButton
            variant="outlined"
            color="primary"
            onClick={handleReset}
            startIcon={<CloseIcon fontSize="small" />}
            fullWidth={isMobile}
            sx={{
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Reset Filters
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => {
              onFilterChange({
                ...filters,
                priceFrom: priceRange[0],
                priceTo: priceRange[1],
              });
              if (isMobile) setMobileFiltersOpen(false);
            }}
            fullWidth={isMobile}
            disableElevation
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            Apply Filters
          </StyledButton>
        </Box>
      </Grid>
    </Grid>
  );

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        width: '100%',
        mb: 4, 
        borderRadius: 2, 
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {/* Mobile Filter Toggle */}
      {isMobile && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'background.paper',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="subtitle1" fontWeight={500}>
            Filters
          </Typography>
          <IconButton 
            onClick={toggleMobileFilters}
            size="small"
            sx={{
              color: mobileFiltersOpen ? theme.palette.primary.main : 'inherit',
              transform: mobileFiltersOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s ease, color 0.3s ease',
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>
      )}

      {/* Desktop View */}
      {!isMobile && (
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Refine Your Search
          </Typography>
          {renderFilterContent()}
        </Box>
      )}

      {/* Mobile Collapsible Content */}
      {isMobile && (
        <Collapse in={mobileFiltersOpen}>
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            {renderFilterContent()}
          </Box>
        </Collapse>
      )}
    </Paper>
  );
};

export default PropertySearchFilters;
