import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '../features/authSlice';
import { selectIsProfileComplete } from '../features/userSlice';

const ProtectedRoute = ({ children, requireProfileComplete = false }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isProfileComplete = useSelector(selectIsProfileComplete);
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If profile completion is required but profile is incomplete
  if (requireProfileComplete && !isProfileComplete) {
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
