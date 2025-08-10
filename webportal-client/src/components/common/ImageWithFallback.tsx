import React, { useState } from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';

export interface ImageWithFallbackProps extends BoxProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = '/src/assets/images/placeholder-property.jpg', // Default placeholder image
  className = '',
  style = {},
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [imgError, setImgError] = useState<boolean>(false);

  const handleError = () => {
    if (!imgError) {
      setImgSrc(fallbackSrc);
      setImgError(true);
    }
  };

  return (
    <Box
      component="img"
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      style={{
        objectFit: 'cover',
        width: '100%',
        height: '100%',
        ...style,
      }}
      {...props}
    />
  );
};

export default ImageWithFallback;
