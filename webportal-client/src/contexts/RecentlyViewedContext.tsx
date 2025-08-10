import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Property {
  id: number;
  title: string;
  // Add other property fields as needed
}

interface RecentlyViewedContextType {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  recentlyViewed: Property[];
  addToRecentlyViewed: (property: Property) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

interface RecentlyViewedProviderProps {
  children: ReactNode;
}

export const RecentlyViewedProvider: React.FC<RecentlyViewedProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Add a function to add a property to recently viewed
  const addToRecentlyViewed = (property: Property) => {
    setRecentlyViewed(prev => {
      // Check if property is already in the list
      const exists = prev.some(item => item.id === property.id);
      if (exists) return prev;
      
      // Add new property to the beginning of the array
      return [property, ...prev].slice(0, 10); // Keep only the 10 most recent
    });
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        isOpen,
        openSidebar,
        closeSidebar,
        toggleSidebar,
        recentlyViewed,
        addToRecentlyViewed
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export default RecentlyViewedContext;
