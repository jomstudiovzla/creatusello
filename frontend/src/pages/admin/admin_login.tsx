import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAdminStatus = useStore(state => state.setAdminStatus);
  const setUser = useStore(state => state.setUser);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Hardcoded initial validation layer
    if (email !== 'admin@jomstudio.com' || password !== 'VZLA123') {
      setError('Credenciales de administrador inválidas. Usa la contraseña actualizada.');
      return;
    }

    setIsLoading(true);

    try {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser({ uid: userCredential.user.uid, email: userCredential.user.email, isAdmin: true });
        setAdminStatus(true);
        navigate('/admin/dashboard');
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
          setUser({ uid: newUserCredential.user.uid, email: newUserCredential.user.email, isAdmin: true });
          setAdminStatus(true);
          navigate('/admin/dashboard');
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('Error interno en Firebase al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-tertiary-container pt-20">
      <div className="bg-white p-8 rounded-xl shadow-2xl border border-outline w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
          </div>
          <h2 className="text-2xl font-bold text-primary">Portal Administrador</h2>
        </div>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-lg mb-6 text-sm font-medium border border-error/20">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-1">Correo Administrador</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-lowest" 
              placeholder="admin@dominio.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-1">Código de Acceso</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-lowest" 
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-70 mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined">security</span>}
            Ingresar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}
