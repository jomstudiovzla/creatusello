import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useStore } from '../store/useStore';

export default function AuthLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      try {
        // Intentar iniciar sesión
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          lastLogin: serverTimestamp()
        }, { merge: true });
        setUser({ uid: userCredential.user.uid, email: userCredential.user.email });
        navigate('/customizer'); // Ir al catálogo por defecto
      } catch (err: any) {
        // Si el usuario no existe, intentar crear la cuenta automáticamente
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
          await setDoc(doc(db, 'users', newUserCredential.user.uid), {
            email: newUserCredential.user.email,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          });
          setUser({ uid: newUserCredential.user.uid, email: newUserCredential.user.email });
          navigate('/customizer');
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      setError('Error al iniciar sesión o registrarse. Verifica tus credenciales.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
        lastLogin: serverTimestamp()
      }, { merge: true });
      setUser({ uid: result.user.uid, email: result.user.email });
      navigate('/customizer');
    } catch (err: any) {
      setError('Error al iniciar sesión con Google.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background pt-20">
      <div className="bg-surface-canvas p-8 rounded-xl shadow-xl border border-surface-container w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Mi Cuenta</h2>
          <p className="text-text-secondary text-sm">Ingresa o regístrate para hacer seguimiento a tus pedidos.</p>
        </div>
        
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-lowest" 
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-1">Contraseña</label>
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
            className="w-full bg-vibrant-blue text-white py-4 rounded-lg font-bold text-lg hover:bg-primary transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-vibrant-blue/20"
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined">login</span>
            )}
            Continuar con Correo
          </button>
        </form>

        <div className="mt-6 border-t border-outline-variant pt-6">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-on-surface border border-outline py-4 rounded-lg font-bold text-base hover:bg-surface-container-low transition-colors disabled:opacity-70 flex justify-center items-center gap-3 shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    </div>
  );
}
