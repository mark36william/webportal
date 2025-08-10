export interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  suburb?: string;
  price: number;
  listingType: 'Sale' | 'Rent';
  propertyType?: string;
  bedrooms: number;
  bathrooms: number;
  carSpots: number;
  floorArea?: number;
  yearBuilt?: number;
  description: string;
  imageURLs: string[];
  isFeatured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PropertyQueryParams {
  // Filter parameters
  priceFrom?: number;
  priceTo?: number;
  bedrooms?: number;
  city?: string;
  listingType?: 'Sale' | 'Rent';
  
  // Pagination parameters
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const CITIES = [
  'Sydney',
  'Melbourne',
  'Brisbane',
  'Perth',
  'Adelaide'
] as const;

export const BEDROOM_OPTIONS = [
  { value: 1, label: '1+ Bedroom' },
  { value: 2, label: '2+ Bedrooms' },
  { value: 3, label: '3+ Bedrooms' },
  { value: 4, label: '4+ Bedrooms' },
  { value: 5, label: '5+ Bedrooms' },
];

export const LISTING_TYPES = [
  { value: 'Sale', label: 'For Sale' },
  { value: 'Rent', label: 'For Rent' },
];
