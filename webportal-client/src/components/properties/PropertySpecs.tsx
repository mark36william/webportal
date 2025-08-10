import React from 'react';
import { Box, Typography, Divider, Paper, useTheme } from '@mui/material';
import type { Property } from '../../types/property';
import {
  Hotel as BedIcon,
  Bathtub as BathIcon,
  DirectionsCar as CarIcon,
  Map as MapIcon,
  Category as TypeIcon,
  AttachMoney as PriceIcon,
} from '@mui/icons-material';

const SpecItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({
  icon,
  label,
  value,
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
    <Box sx={{ color: 'primary.main' }}>{icon}</Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Box>
);

interface PropertySpecsProps {
  property: Property;
}

const PropertySpecs: React.FC<PropertySpecsProps> = ({ property }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Property Details
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <SpecItem
          icon={<PriceIcon />}
          label="Price"
          value={`$${property.price.toLocaleString()} ${property.listingType === 'Rent' ? '/month' : ''}`}
        />
        
        <SpecItem
          icon={<TypeIcon />}
          label="Type"
          value={property.listingType === 'Rent' ? 'For Rent' : 'For Sale'}
        />
        
        <SpecItem
          icon={<BedIcon />}
          label="Bedrooms"
          value={`${property.bedrooms} ${property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}`}
        />
        
        <SpecItem
          icon={<BathIcon />}
          label="Bathrooms"
          value={`${property.bathrooms} ${property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}`}
        />
        
        <SpecItem
          icon={<CarIcon />}
          label="Parking"
          value={`${property.carSpots} ${property.carSpots === 1 ? 'Car Spot' : 'Car Spots'}`}
        />
        
        <SpecItem
          icon={<MapIcon />}
          label="Location"
          value={`${property.city}`}
        />
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Box>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Address
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {property.address}, {property.city}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PropertySpecs;
