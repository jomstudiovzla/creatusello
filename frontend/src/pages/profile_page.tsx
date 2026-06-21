import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cedula: '',
    phone: '',
    photoURL: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || '',
            cedula: data.cedula || '',
            phone: data.phone || '',
            photoURL: data.photoURL || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), formData, { merge: true });
      alert('Perfil guardado exitosamente');
    } catch (err) {
      console.error('Error saving profile', err);
      alert('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="pt-32 text-center text-primary">Cargando perfil...</div>;

  return (
    <main className="pt-32 pb-20 px-4 md:px-10 max-w-[800px] mx-auto flex-grow w-full">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-container">
        <div className="flex items-center gap-6 mb-8">
          {formData.photoURL ? (
            <img src={formData.photoURL} alt="Perfil" className="w-20 h-20 rounded-full object-cover border border-outline" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center border border-outline">
              <span className="material-symbols-outlined text-4xl text-outline">person</span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-primary">Mi Perfil</h1>
            <p className="text-text-secondary">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-primary">Nombre Completo</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-outline rounded-lg bg-white" placeholder="Ej. Juan Pérez" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-primary">Cédula / ID</label>
              <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} className="w-full p-3 border border-outline rounded-lg bg-white" placeholder="Ej. V-12345678" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-primary">Teléfono (WhatsApp)</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-outline rounded-lg bg-white" placeholder="Ej. +58 414 1234567" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-primary">URL de Foto (Opcional)</label>
              <input type="text" name="photoURL" value={formData.photoURL} onChange={handleChange} className="w-full p-3 border border-outline rounded-lg bg-white" placeholder="https://..." />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={saving} className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition-colors">
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
