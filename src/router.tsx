import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useStore } from './state/store';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import PatientApp from './pages/PatientApp';
import DoctorApp from './pages/DoctorApp';

// Protected route wrapper
function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode;
  requiredRole?: 'patient' | 'doctor';
}) {
  const user = useStore((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/patient/*',
    element: (
      <ProtectedRoute requiredRole="patient">
        <PatientApp />
      </ProtectedRoute>
    ),
  },
  {
    path: '/doctor/*',
    element: (
      <ProtectedRoute requiredRole="doctor">
        <DoctorApp />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);