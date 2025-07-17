// src/components/auth/RoleRedirect.tsx
import { Navigate } from 'react-router-dom';

// You can pull this from Context, Redux, or localStorage
const getUserRole = (): string | null => {
  const userData = localStorage.getItem('dinedash_user');
  if (!userData) return null;
  try {
    const user = JSON.parse(userData);
    return user.role || null;
  } catch {
    return null;
  }
};

const RoleRedirect = () => {
  const role = getUserRole();

  switch (role) {
    case 'Admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'Cashier':
      return <Navigate to="/dashboard/cashier" replace />;
    case 'Waiter':
      return <Navigate to="/dashboard/waiter" replace />;
    case 'Kitchen':
      return <Navigate to="/dashboard/kitchen" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RoleRedirect;
