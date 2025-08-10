import axios from 'axios';
import type { Property } from '../types/property';

const API_URL = '/api/recentlyviewed';

// Track a property view on the server
const trackPropertyView = async (propertyId: number): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/track/${propertyId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  } catch (error) {
    console.error('Error tracking property view:', error);
    // If there's an error with the API, we'll still track it locally
    trackPropertyViewLocally(propertyId);
  }
};

// Track a property view in localStorage
const trackPropertyViewLocally = (propertyId: number): void => {
  try {
    const recentlyViewed = getRecentlyViewedFromLocalStorage();
    
    // Remove if already exists to avoid duplicates
    const updated = recentlyViewed.filter(id => id !== propertyId);
    
    // Add to the beginning of the array
    updated.unshift(propertyId);
    
    // Keep only the last 5 viewed properties
    const limited = updated.slice(0, 5);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(limited));
  } catch (error) {
    console.error('Error tracking property view locally:', error);
  }
};

// Get recently viewed properties from localStorage
const getRecentlyViewedFromLocalStorage = (): number[] => {
  try {
    const stored = localStorage.getItem('recentlyViewed');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting recently viewed from localStorage:', error);
    return [];
  }
};

// Get recently viewed properties from the server
const getRecentlyViewed = async (): Promise<Property[]> => {
  try {
    const response = await axios.get<Array<{ property: Property }>>(
      API_URL,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: { limit: 5 }
      }
    );
    return response.data.map(item => item.property);
  } catch (error) {
    console.error('Error getting recently viewed properties:', error);
    // Fall back to localStorage if API fails
    return getRecentlyViewedFromLocalStorage().map(id => ({ id } as Property));
  }
};

export { trackPropertyView, getRecentlyViewed };
