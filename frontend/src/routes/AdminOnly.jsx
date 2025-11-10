
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/context/AuthContext';

const AdminOnly = () => {
  const { user, isAuthenticated } = useAuth();
  
  // console.log('AdminOnly Check:', { user, isAuthenticated });

  if (!isAuthenticated) {
    // console.log('Not authenticated in AdminOnly');
    return <Navigate to="/auth/login" replace />;
  }

  const role = user?.role?.toString?.() || '';

  
  if (role.toLowerCase() !== 'admin') {

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminOnly;
