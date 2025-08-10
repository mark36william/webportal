import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { RecentlyViewedProvider, useRecentlyViewed } from './contexts/RecentlyViewedContext';
import PrivateRoute from './components/common/PrivateRoute';
import AppHeader from './components/layout/AppHeader';
import RecentlyViewedSidebar from './components/common/RecentlyViewedSidebar';
import LoginPage from './pages/LoginPage';
import PropertySearchPage from './pages/PropertySearchPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import FavoritesPage from './pages/FavoritesPage';

// Create a professional real estate theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50',  // Dark blue-gray for primary actions
      light: '#3D566E',
      dark: '#1E2B38',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E74C3C',  // Coral accent for CTAs
      light: '#EC7063',
      dark: '#A93226',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA',  // Light gray background
      paper: '#FFFFFF',    // White cards/surfaces
    },
    text: {
      primary: '#2C3E50',  // Dark text for better readability
      secondary: '#5D6D7E', // Slightly lighter for secondary text
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      borderRadius: 8,
      padding: '8px 24px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});


const AppContent: React.FC = () => {
  const { isOpen, closeSidebar } = useRecentlyViewed();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppHeader onMenuClick={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/properties" element={<PropertySearchPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Route>
          
          {/* Redirects */}
          <Route path="/" element={<Navigate to="/properties" replace />} />
          <Route path="*" element={<Navigate to="/properties" replace />} />
        </Routes>
      </Box>
      <RecentlyViewedSidebar open={isOpen} onClose={closeSidebar} />
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <RecentlyViewedProvider>
            <AppContent />
          </RecentlyViewedProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
