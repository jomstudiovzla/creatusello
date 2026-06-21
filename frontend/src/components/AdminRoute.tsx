import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function AdminRoute() {
  const { user, isAuthInitialized } = useStore();

  if (!isAuthInitialized) {
    // Muestra un estado de carga mientras Firebase verifica sesión
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Verifica explícitamente el rol en el estado global
  if (!user || user.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
