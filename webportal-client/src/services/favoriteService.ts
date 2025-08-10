import api from '../utils/api';
import type { Property } from '../types/property';

const FAVORITES_ENDPOINT = '/favorites';

// Get all favorite properties
export const getFavorites = async (): Promise<Property[]> => {
  try {
    const response = await api.get<Property[]>(FAVORITES_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw new Error('Failed to load favorites. Please try again later.');
  }
};

// Toggle favorite status for a property
export const toggleFavorite = async (propertyId: number): Promise<boolean> => {
  try {
    const response = await api.post<{ isFavorite: boolean }>(
      `${FAVORITES_ENDPOINT}/${propertyId}`,
      {}
    );
    return response.data.isFavorite;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw new Error('Failed to update favorites. Please try again.');
  }
};

// Check if a property is in favorites
export const isPropertyFavorite = async (propertyId: number): Promise<boolean> => {
  try {
    const response = await api.get<boolean>(`${FAVORITES_ENDPOINT}/check/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};
