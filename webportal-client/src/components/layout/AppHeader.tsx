import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Badge,
  InputBase,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Dashboard,
  Home as HomeIcon,
  Apartment as PropertiesIcon,
  Favorite as FavoriteFilledIcon,
  History as HistoryIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useRecentlyViewed } from '../../contexts/RecentlyViewedContext';
import { getFavorites } from '../../services/favoriteService';

interface AppHeaderProps {
  onMenuClick?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user, logout } = useAuth();
  const { openSidebar, recentlyViewed } = useRecentlyViewed();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Fetch favorites count when authenticated
  useEffect(() => {
    const fetchFavoritesCount = async () => {
      if (isAuthenticated) {
        try {
          const favorites = await getFavorites();
          setFavoritesCount(favorites.length);
        } catch (error) {
          console.error('Error fetching favorites count:', error);
        }
      } else {
        setFavoritesCount(0);
      }
    };

    fetchFavoritesCount();
  }, [isAuthenticated]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 70, py: 1 }}>
          {/* Logo / Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  color: 'primary.dark',
                },
              }}
            >
              <Box component="span" sx={{ color: 'secondary.main', mr: 0.5 }}>Estate</Box>Pro
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Button
                component={RouterLink}
                to="/properties"
                startIcon={<HomeIcon />}
                sx={{ mr: 1, color: 'text.primary' }}
              >
                Home
              </Button>
              <Button
                component={RouterLink}
                to="/properties?listingType=Sale"
                startIcon={<PropertiesIcon />}
                sx={{ mr: 1, color: 'text.primary' }}
              >
                Buy
              </Button>
              <Button
                component={RouterLink}
                to="/properties?listingType=Rent"
                startIcon={<PropertiesIcon />}
                sx={{ mr: 1, color: 'text.primary' }}
              >
                Rent
              </Button>
            </Box>
          )}

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              position: 'relative',
              borderRadius: theme.shape.borderRadius,
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
              marginRight: theme.spacing(2),
              marginLeft: 0,
              width: '100%',
              maxWidth: 600,
              [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '2px 4px' }}>
              <IconButton type="submit" size="small" sx={{ p: '10px', color: 'text.secondary' }}>
                <SearchIcon />
              </IconButton>
              <InputBase
                placeholder="Search by location, property type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  color: 'inherit',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: theme.spacing(1, 1, 1, 0),
                    transition: theme.transitions.create('width'),
                    width: '100%',
                    [theme.breakpoints.up('md')]: {
                      width: '20ch',
                      '&:focus': {
                        width: '30ch',
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {/* User Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={openSidebar}
                  aria-label="show recently viewed properties"
                  sx={{ mr: 1, color: 'text.primary' }}
                >
                  <Badge 
                    badgeContent={recentlyViewed?.length || 0} 
                    color="secondary"
                    invisible={!recentlyViewed?.length}
                  >
                    <HistoryIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  component={RouterLink}
                  to="/favorites"
                  size="large"
                  color="inherit"
                  aria-label="show favorites"
                  sx={{ mr: 2, color: 'text.primary' }}
                >
                  <Badge badgeContent={favoritesCount} color="secondary">
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  onClick={handleMenu}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls="user-menu"
                  aria-haspopup="true"
                >
                  <Avatar
                    alt={user?.name || 'User'}
                    src={user?.avatar}
                    sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
                  >
                    {user?.name?.[0] || 'U'}
                  </Avatar>
                </IconButton>

                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem component={RouterLink} to="/profile">
                    <Avatar /> Profile
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/dashboard">
                    <ListItemIcon>
                      <Dashboard fontSize="small" />
                    </ListItemIcon>
                    Dashboard
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  sx={{ mr: 1, px: 3 }}
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{ px: 3 }}
                >
                  Sign Up
                </Button>
              </>
            )}

            {isMobile && (
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={onMenuClick}
                sx={{ ml: 1, color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppHeader;
