import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

interface RoleRouteProps {
  roles: Array<'ADMIN' | 'VENDOR'>;
  children: React.ReactElement;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ roles, children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !roles.includes(user.role as 'ADMIN' | 'VENDOR')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
