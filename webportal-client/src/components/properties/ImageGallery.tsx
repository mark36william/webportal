import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const GalleryContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  aspectRatio: '16/9',
});

const MainImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

const ThumbnailContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  marginTop: '8px',
  overflowX: 'auto',
  padding: '4px 0',
  '&::-webkit-scrollbar': {
    height: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '4px',
  },
});

const Thumbnail = styled('img', {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ isActive, theme }) => ({
  width: '80px',
  height: '60px',
  objectFit: 'cover',
  borderRadius: '4px',
  cursor: 'pointer',
  border: `2px solid ${isActive ? theme.palette.primary.main : 'transparent'}`,
  opacity: isActive ? 1 : 0.7,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    opacity: 1,
  },
}));

const NavButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  '&.Mui-disabled': {
    opacity: 0.5,
  },
});

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          aspectRatio: '16/9',
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
        }}
      >
        <Typography color="text.secondary">No images available</Typography>
      </Box>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Box>
      <GalleryContainer>
        <MainImage 
          src={images[currentIndex]} 
          alt={`${alt} - ${currentIndex + 1} of ${images.length}`} 
        />
        {images.length > 1 && (
          <>
            <NavButton 
              onClick={handlePrevious} 
              sx={{ left: 16 }}
              disabled={images.length <= 1}
            >
              <NavigateBeforeIcon />
            </NavButton>
            <NavButton 
              onClick={handleNext} 
              sx={{ right: 16 }}
              disabled={images.length <= 1}
            >
              <NavigateNextIcon />
            </NavButton>
          </>
        )}
      </GalleryContainer>
      
      {images.length > 1 && (
        <ThumbnailContainer>
          {images.map((img, index) => (
            <Thumbnail
              key={index}
              src={img}
              alt={`${alt} thumbnail ${index + 1}`}
              isActive={index === currentIndex}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
        </ThumbnailContainer>
      )}
    </Box>
  );
};

export default ImageGallery;
