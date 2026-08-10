import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Key,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  Sparkles,
  Camera,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updatedUser: UserProfile) => void;
}

const presetAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSaveProfile
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [username, setUsername] = useState(currentUser.username || '');
  const [password, setPassword] = useState(currentUser.password || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) {
      alert('Mohon lengkapi Nama, Username, dan Password!');
      return;
    }

    const updated: UserProfile = {
      ...currentUser,
      name,
      email,
      username,
      password,
      avatarUrl
    };

    onSaveProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Edit Profil Pribadi Saya</h3>
              <p className="text-xs text-slate-400">Perbarui informasi diri, Username, dan Password akun Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {saveSuccess && (
            <div className="p-3 bg-emerald-600/20 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Profil & Kredensial Berhasil Diperbarui!</span>
            </div>
          )}

          {/* Avatar Preview & Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Foto Profil / Avatar</label>
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/30 shadow-lg shrink-0"
              />
              <div className="flex-1 space-y-2">
                <div className="text-[10px] text-slate-400">Pilih Avatar Preset:</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {presetAvatars.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition ${
                        avatarUrl === url ? 'border-amber-400 ring-2 ring-amber-400/50 scale-110' : 'border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="Atau masukkan URL Foto Profil Custom..."
            />
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Nama Lengkap</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 font-semibold focus:border-blue-500 focus:outline-none"
                placeholder="Nama Lengkap Pengguna..."
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 font-medium focus:border-blue-500 focus:outline-none"
                placeholder="email@domain.sch.id"
                required
              />
            </div>
          </div>

          {/* Username & Password Fields */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-3">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Key className="w-4 h-4" /> Pengaturan Username & Password Login Akun
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Username Login</label>
              <div className="relative">
                <User className="w-4 h-4 text-amber-500/80 absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
                  placeholder="Username login..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password / Sandi Akun</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-500/80 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  placeholder="Password akun..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Role badge read-only info */}
          <div className="flex items-center justify-between text-xs p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
            <span className="text-slate-400">Peran / Hak Akses:</span>
            <span className="font-bold uppercase text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded">
              {currentUser.role}
            </span>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-4 h-4" /> Simpan Perubahan Profil
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
