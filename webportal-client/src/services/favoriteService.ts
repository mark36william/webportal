import axios from 'axios';
import type { Property } from '../types/property';

const API_URL = '/api/favorites';

// Get all favorite properties
export const getFavorites = async (): Promise<Property[]> => {
  try {
    const response = await axios.get<Property[]>(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

// Toggle favorite status for a property
export const toggleFavorite = async (propertyId: number): Promise<boolean> => {
  try {
    const response = await axios.post<{ isFavorite: boolean }>(
      `${API_URL}/${propertyId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data.isFavorite;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

// Check if a property is in favorites
export const isPropertyFavorite = async (propertyId: number): Promise<boolean> => {
  try {
    const response = await axios.get<boolean>(`${API_URL}/check/${propertyId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};
