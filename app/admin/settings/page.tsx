'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Camera, 
  CheckCircle2, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { adminRoleLabel } from '@/lib/admin-permissions';

export default function AdminSettingsPage() {
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize state with current user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setImage(user.image || null);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-500 max-w-lg mx-auto">
        <User size={36} className="mx-auto mb-4 text-slate-400" />
        <p className="font-semibold text-slate-800 mb-1">Akses Ditolak</p>
        <p className="text-xs text-slate-500">Anda harus login terlebih dahulu.</p>
      </div>
    );
  }

  // Generate initials for avatar fallback
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Handle Photo Click
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Handle File Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setNotification({ type: 'error', message: 'Ukuran file terlalu besar (maksimal 5MB)' });
      return;
    }

    setUploading(true);
    setNotification(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah foto');
      }

      setImage(data.url);
      setNotification({ type: 'success', message: 'Foto berhasil diunggah!' });
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunggah foto',
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNotification({ type: 'error', message: 'Nama lengkap wajib diisi' });
      return;
    }

    setSaving(true);
    setNotification(null);

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: name.trim(),
          image: image,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan pengaturan');
      }

      // Update Local State Context
      updateUser(data.user);

      setNotification({ type: 'success', message: 'Profil Anda berhasil diperbarui!' });
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan pengaturan',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto text-[#4A3728] pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E7E5E0] pb-5">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#4A3728]">Account Settings</h1>
          <p className="text-stone-500 text-sm mt-1">
            Perbarui nama lengkap dan foto profil untuk akun panel administrasi Anda.
          </p>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border text-xs sm:text-sm font-sans ${
          notification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
            : 'bg-red-50 text-red-800 border-red-100'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="shrink-0 text-emerald-600" size={18} />
          ) : (
            <AlertTriangle className="shrink-0 text-red-600" size={18} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Left Column: Visual Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#E7E5E0] rounded-2xl p-6 flex flex-col items-center text-center shadow-xs h-full justify-between">
            
            {/* Profile Info Container */}
            <div className="w-full flex flex-col items-center">
              <h3 className="w-full text-left font-serif text-xs font-semibold text-stone-400 uppercase tracking-widest border-b border-[#F9F7F2] pb-3 mb-6">
                Profil Anda
              </h3>
              
              {/* Clickable Profile Image Container */}
              <div 
                onClick={handlePhotoClick}
                className="relative w-28 h-28 rounded-full group cursor-pointer overflow-hidden border-2 border-[#E7E5E0] hover:border-[#8C7355] transition-all duration-300 flex items-center justify-center bg-[#F9F7F2] shrink-0 shadow-sm"
              >
                {image ? (
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-75"
                  />
                ) : (
                  <div className="w-full h-full bg-[#4A3728] text-[#F9F7F2] flex items-center justify-center text-3xl font-serif transition duration-300 group-hover:opacity-75">
                    {initials}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-[#4A3728]/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="text-white mb-1" size={20} />
                  <span className="text-[9px] uppercase tracking-wider text-white font-medium">Ubah Foto</span>
                </div>
                
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#8C7355]" size={24} />
                  </div>
                )}
              </div>

              <h2 className="font-serif text-xl font-bold text-[#4A3728] mt-4 leading-tight">
                {user.name}
              </h2>
              <p className="text-xs text-stone-500 font-sans mt-1">
                {user.email}
              </p>
              
              <div className="mt-4">
                <span className="inline-block text-[10px] uppercase tracking-wider px-3 py-1 bg-[#8C7355]/10 border border-[#8C7355]/20 text-[#8C7355] font-bold rounded-full">
                  {adminRoleLabel(user.role)}
                </span>
              </div>
            </div>

            {/* Quick Upload action helper */}
            <div className="mt-8 pt-4 border-t border-[#E7E5E0]/60 w-full">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" 
              />
              <button
                type="button"
                onClick={handlePhotoClick}
                disabled={uploading}
                className="text-[10px] uppercase tracking-wider text-[#8C7355] hover:text-[#4A3728] font-bold transition"
              >
                Ganti Foto Profil
              </button>
              <p className="text-[9px] text-stone-400 mt-1">
                PNG, JPG, or JPEG up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Editor Form Card */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border border-[#E7E5E0] rounded-2xl p-6 sm:p-8 shadow-xs h-full flex flex-col justify-between">
            <div className="space-y-6 w-full">
              <h3 className="font-serif text-xs font-semibold text-stone-400 uppercase tracking-widest border-b border-[#F9F7F2] pb-3 mb-2">
                Edit Pengaturan Akun
              </h3>

              {/* Inputs */}
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 tracking-wider uppercase mb-1.5">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={saving}
                      placeholder="Nama Lengkap"
                      className="w-full border border-[#E7E5E0] focus:outline-none focus:ring-2 focus:ring-[#8C7355]/30 focus:border-[#8C7355] rounded-xl px-4 py-3 text-sm bg-white hover:bg-stone-50/20 focus:bg-white transition text-[#4A3728] font-medium font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 tracking-wider uppercase mb-1.5">
                    Alamat Email (Tidak Dapat Diubah)
                  </label>
                  <div className="flex items-center gap-3 border border-[#E7E5E0] bg-[#F9F7F2]/40 rounded-xl px-4 py-3 text-sm text-stone-500 select-none">
                    <Mail size={16} strokeWidth={1.5} className="shrink-0 text-stone-400" />
                    <span className="font-sans font-medium">{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 tracking-wider uppercase mb-1.5">
                    Peran Sistem (Tidak Dapat Diubah)
                  </label>
                  <div className="flex items-center gap-3 border border-[#E7E5E0] bg-[#F9F7F2]/40 rounded-xl px-4 py-3 text-sm text-stone-500 select-none">
                    <span className="font-sans font-medium">{adminRoleLabel(user.role)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-[#E7E5E0]/60 mt-8 w-full">
              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full sm:w-auto px-8 bg-[#4A3728] hover:bg-[#8C7355] text-white py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm hover:shadow"
              >
                {saving && <Loader2 className="animate-spin" size={14} />}
                {saving ? 'Menyimpan Perubahan…' : 'Simpan Perubahan'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
