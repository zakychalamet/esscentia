'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Camera, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';
import { adminRoleLabel } from '@/lib/admin-permissions';

export default function SettingsPage() {
  const { user, isLoading, updateUser } = useAuth();
  const router = useRouter();
  
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
      if (user.role !== 'user') {
        router.push('/admin/settings');
      }
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex flex-col">
        <CatalogNav />
        <div className="flex-1 flex items-center justify-center text-stone-500 text-sm">
          Memuat pengaturan…
        </div>
        <CatalogFooter variant="catalog" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
        <CatalogNav />
        <main className="flex-1 max-w-lg mx-auto w-full px-4 sm:px-6 py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#EDEAE4] flex items-center justify-center">
            <User size={36} strokeWidth={1.5} className="text-[#8C7355]" />
          </div>
          <h1 className="text-3xl font-serif text-[#4A3728] mb-4">Akses Ditolak</h1>
          <p className="text-stone-600 text-sm leading-relaxed mb-10">
            Anda harus masuk terlebih dahulu untuk mengakses halaman pengaturan akun.
          </p>
          <Link
            href="/login"
            className="px-8 py-3 bg-[#4A3728] text-[#F9F7F2] text-xs uppercase tracking-[0.15em] hover:bg-[#8C7355] transition"
          >
            Masuk Sekarang
          </Link>
        </main>
        <CatalogFooter variant="catalog" />
      </div>
    );
  }

  // Generate Initials
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

    // Client-side size check (max 5MB)
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
      setNotification({ type: 'success', message: 'Foto berhasil diunggah' });
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
      
      // Redirect back to profile page after a brief delay to show success
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
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
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-12">
        {/* Back Link */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-[10px] font-serif uppercase tracking-[0.2em] text-[#8C7355] hover:text-[#4A3728] transition mb-8"
        >
          <ArrowLeft size={12} />
          Kembali ke Profil
        </Link>

        <h1 className="text-3xl sm:text-4xl font-serif text-[#4A3728] mb-8 font-semibold">Pengaturan Akun</h1>

        {notification && (
          <div className={`p-4 rounded mb-6 flex items-center gap-3 border text-xs sm:text-sm font-sans ${
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

        <form onSubmit={handleSubmit} className="bg-white/70 border border-stone-200/80 p-6 sm:p-8 space-y-8">
          
          {/* Profile Picture Uploader */}
          <div className="flex flex-col items-center gap-4 border-b border-stone-100 pb-8">
            <div 
              onClick={handlePhotoClick}
              className="relative w-24 h-24 rounded-full group cursor-pointer overflow-hidden border-2 border-stone-200 hover:border-[#8C7355] transition flex items-center justify-center bg-stone-100 animate-fade-in"
            >
              {image ? (
                <img 
                  src={image} 
                  alt="Preview" 
                  className="w-full h-full object-cover transition duration-300 group-hover:opacity-75"
                />
              ) : (
                <div className="w-full h-full bg-[#4A3728] text-[#F9F7F2] flex items-center justify-center text-3xl font-serif transition duration-300 group-hover:opacity-75">
                  {initials}
                </div>
              )}
              
              {/* Overlay upload icon on hover */}
              <div className="absolute inset-0 bg-[#4A3728]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="text-white" size={24} />
              </div>
              
              {/* Uploading loading spinner */}
              {uploading && (
                <div className="absolute inset-0 bg-[#F9F7F2]/80 flex items-center justify-center">
                  <Loader2 className="animate-spin text-[#8C7355]" size={24} />
                </div>
              )}
            </div>

            <div className="text-center">
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
                className="text-xs font-serif uppercase tracking-[0.15em] text-[#8C7355] hover:text-[#4A3728] font-bold"
              >
                Ubah Foto Profil
              </button>
              <p className="text-[10px] text-stone-400 mt-1">PNG, JPG, atau JPEG hingga 5MB</p>
            </div>
          </div>

          {/* Details Form inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-stone-400 tracking-wider uppercase mb-2">
                Nama Lengkap
              </label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={saving}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full border border-stone-200 focus:border-[#8C7355] focus:ring-1 focus:ring-[#8C7355] rounded px-4 py-2.5 text-sm bg-white/50 focus:bg-white outline-none transition font-sans text-[#4A3728] font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-400 tracking-wider uppercase mb-2">
                Alamat Email (Tidak Dapat Diubah)
              </label>
              <div className="flex items-center gap-2 border border-stone-150 bg-stone-50/50 rounded px-4 py-2.5 text-sm text-stone-500 select-none">
                <Mail size={16} strokeWidth={1.5} className="shrink-0" />
                <span className="font-sans font-medium">{user.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-400 tracking-wider uppercase mb-2">
                Hak Akses / Peran
              </label>
              <div className="flex items-center">
                <span className="inline-block text-[10px] uppercase tracking-[0.15em] px-3 py-1 bg-stone-100 border border-stone-200 text-stone-600 font-medium select-none">
                  {user.role === 'user' ? 'Member' : adminRoleLabel(user.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-stone-100">
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 bg-[#4A3728] hover:bg-[#8C7355] text-[#F9F7F2] py-3 text-xs uppercase tracking-[0.15em] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving && <Loader2 className="animate-spin" size={14} />}
              {saving ? 'Menyimpan…' : 'Simpan Perubahan'}
            </button>
            <Link
              href="/profile"
              className="flex-1 border border-stone-300 hover:border-[#4A3728] text-stone-600 hover:text-[#4A3728] py-3 text-xs uppercase tracking-[0.15em] transition flex items-center justify-center"
            >
              Batal
            </Link>
          </div>

        </form>
      </main>

      <CatalogFooter variant="catalog" />
    </div>
  );
}
