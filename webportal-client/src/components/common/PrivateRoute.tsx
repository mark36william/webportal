import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  /**
   * The path to redirect to if the user is not authenticated.
   * Defaults to '/login'.
   */
  redirectPath?: string;
  /**
   * The component to render if the user is authenticated.
   * If not provided, renders the child routes via Outlet.
   */
  element?: React.ReactElement;
}

/**
 * A component that renders child routes only if the user is authenticated.
 * If not authenticated, redirects to the login page with the current location
 * stored in the state so the user can be redirected back after login.
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({
  redirectPath = '/login',
  element: Element,
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the return location
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If element is provided, render it, otherwise render child routes
  return Element || <Outlet />;
};

export default PrivateRoute;
