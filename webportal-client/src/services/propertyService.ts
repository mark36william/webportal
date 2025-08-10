import type { PropertyQueryParams, PaginatedResponse, Property } from '../types/property';
import api from '../utils/api';

const API_URL = '/properties';

const DEFAULT_PAGE_SIZE = 12;

export const getProperties = async (params: PropertyQueryParams): Promise<PaginatedResponse<Property>> => {
  try {
    // Set default pagination parameters if not provided
    const queryParams = {
      pageNumber: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      ...params,
    };

    console.log('Fetching properties with params:', queryParams);
    const response = await api.get(API_URL, { params: queryParams });
    
    // Log the raw response to see the exact structure
    console.log('Raw API response:', response);
    
    // Handle different response structures
    const responseData = response.data;
    let items = [];
    let totalCount = 0;
    let pageNumber = queryParams.pageNumber;
    let totalPages = 1;
    
    // Check if the response is an array (direct items) or has pagination structure
    if (Array.isArray(responseData)) {
      console.log('Response is an array, converting to paginated format');
      items = responseData;
      totalCount = responseData.length;
      totalPages = Math.ceil(totalCount / queryParams.pageSize);
    } else if (responseData && typeof responseData === 'object') {
      // Handle paginated response
      items = responseData.items || responseData.data || [];
      totalCount = responseData.totalCount || responseData.total || items.length;
      pageNumber = responseData.pageNumber || queryParams.pageNumber;
      totalPages = responseData.totalPages || Math.ceil(totalCount / queryParams.pageSize);
    }
    
    const paginatedResponse = {
      items,
      totalCount,
      pageNumber,
      totalPages,
      hasPreviousPage: pageNumber > 1,
      hasNextPage: pageNumber < totalPages,
    };
    
    console.log('Processed pagination:', {
      itemsCount: items.length,
      totalCount,
      pageNumber,
      totalPages,
      hasPreviousPage: paginatedResponse.hasPreviousPage,
      hasNextPage: paginatedResponse.hasNextPage,
    });
    
    return paginatedResponse;
  } catch (error) {
    console.error('Error fetching properties:', error);
    // Return empty paginated response on error
    return {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }
};

export const getPropertyById = async (id: number) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};
