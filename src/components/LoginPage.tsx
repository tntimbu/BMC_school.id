import React, { useState } from 'react';
import { UserProfile, UserRole, EducationLevel } from '../types';
import { AnimatedKeyKeeper } from './AnimatedKeyKeeper';
import {
  Building2,
  ShieldCheck,
  Lock,
  Mail,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  LogIn,
  Key,
  ShieldAlert,
  ChevronRight,
  Globe,
  School
} from 'lucide-react';

interface LoginPageProps {
  users: UserProfile[];
  onLogin: (user: UserProfile) => void;
  onRegister: (newUser: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ users, onLogin, onRegister }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('teacher');
  const [regLevel, setRegLevel] = useState<EducationLevel>('SMA');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  // Google SSO Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState<'select' | 'confirm'>('select');
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanInput = loginIdentifier.trim().toLowerCase();

      // Find user by username or email
      const matchedUser = users.find(u => {
        const emailMatch = u.email.toLowerCase() === cleanInput;
        const usernameMatch = u.username && u.username.toLowerCase() === cleanInput;
        return emailMatch || usernameMatch;
      });

      if (!matchedUser) {
        setErrorMsg('Username / Email tidak ditemukan. Periksa kembali data login Anda.');
        return;
      }

      // Check password if set
      if (matchedUser.password && loginPassword !== matchedUser.password) {
        setErrorMsg(`Password salah untuk akun ${matchedUser.name}. Silakan periksa kembali password Anda.`);
        return;
      }

      if (matchedUser.status === 'Diblokir' || matchedUser.status === 'Nonaktif') {
        setErrorMsg(`Akun ${matchedUser.name} saat ini berstatus ${matchedUser.status}. Silakan hubungi Superadmin.`);
        return;
      }

      // Successful login
      onLogin(matchedUser);
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setRegSuccessMsg('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMsg('Mohon isi semua kolom yang wajib diisi.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      return;
    }

    const existing = users.find(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (existing) {
      setErrorMsg('Email ini sudah terdaftar. Silakan gunakan menu Masuk.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      username: regEmail.split('@')[0],
      password: regPassword,
      role: regRole,
      educationLevel: regLevel,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
      status: 'Aktif'
    };

    onRegister(newUser);
    setRegSuccessMsg('Pendaftaran berhasil! Akun Anda telah dibuat dan Anda akan otomatis masuk.');
    setTimeout(() => {
      onLogin(newUser);
    }, 1200);
  };

  const handleGoogleSSOSelect = (email: string, name: string) => {
    // Check if user with this email exists
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Create new user automatically via Google
      user = {
        id: `usr-google-${Date.now()}`,
        name: name,
        email: email,
        username: email.split('@')[0],
        role: 'teacher',
        educationLevel: 'SMA',
        avatarUrl: `https://lh3.googleusercontent.com/a/ACg8ocI8P_example=s96-c`,
        status: 'Aktif',
        isGoogleConnected: true
      };
      onRegister(user);
    } else {
      user = { ...user, isGoogleConnected: true };
    }

    setShowGoogleModal(false);
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Dynamic Animated Glow Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Top Header Branding - Hidden on mobile */}
      <header className="hidden lg:flex relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              SIAKAD TERPADU
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold px-2 py-0.5 rounded-full uppercase">
                v2.5 Protected
              </span>
            </h1>
            <p className="text-xs text-slate-400">Yayasan Pendidikan Nusantara Jaya</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sistem Keamanan SSL 256-Bit</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-12 gap-8 items-center flex-1">
        
        {/* Left Side: Branding / Intro Card - Hidden on mobile screens */}
        <div className="hidden lg:block lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal Otentikasi Resmi SIAKAD</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Akses Terpadu <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-blue-400 bg-clip-text text-transparent">
              Seluruh Jenjang Pendidikan
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Sistem Informasi Akademik Terintegrasi untuk KB-TK, SD, SMP, hingga SMA/SMK Yayasan Pendidikan Nusantara Jaya. Log in menggunakan akun terdaftar atau Google SSO.
          </p>

          {/* Feature Highlights */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Integrasi Multi-Unit</h4>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">Kelola nilai, presensi, & keuangan dalam 1 portal.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Akses Berbasis Peran</h4>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">Keamanan hak akses terenkripsi untuk tiap user.</p>
              </div>
            </div>
          </div>

          {/* Animated Person Holding Key Banner */}
          <AnimatedKeyKeeper />
        </div>

        {/* Right Side: Login / Register Form Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/50 relative overflow-hidden">
            
            {/* Top Tabs */}
            <div className="flex rounded-xl bg-slate-950 p-1 mb-6 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Ke Sistem</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 ${
                  mode === 'register'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar Akun Baru</span>
              </button>
            </div>

            {/* Error or Success Alert */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="leading-snug">{errorMsg}</div>
              </div>
            )}

            {regSuccessMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-snug">{regSuccessMsg}</div>
              </div>
            )}

            {/* GOOGLE SSO DIRECT BUTTON */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-md hover:shadow-lg transition flex items-center justify-center gap-3 border border-slate-300"
              >
                {/* Google Multi-Color G Icon SVG */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{mode === 'login' ? 'Masuk dengan Akun Google' : 'Daftar Langsung via Google'}</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider shrink-0">
                  atau gunakan email / username
                </span>
              </div>
            </div>

            {/* FORM LOGIN */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Username / Email Terdaftar
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={e => setLoginIdentifier(e.target.value)}
                      placeholder="Contoh: superadmin atau admin@yayasan-nusantara.sch.id"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Silakan hubungi Administrator IT Yayasan untuk bantuan reset password.')}
                      className="text-[11px] text-blue-400 hover:text-blue-300 transition"
                    >
                      Lupa password?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span>Ingat Sesi Saya</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Masuk Ke Sistem SIAKAD</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORM REGISTER */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Nama beserta gelar (contoh: Drs. Budi, M.Pd)"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="email@domain.sch.id"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Peran Akun
                    </label>
                    <select
                      value={regRole}
                      onChange={e => setRegRole(e.target.value as UserRole)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
                    >
                      <option value="teacher">Guru / Pengajar</option>
                      <option value="admin">Admin Operasional</option>
                      <option value="parent">Orang Tua / Wali</option>
                      <option value="student">Siswa / Murid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Jenjang Pendidikan
                    </label>
                    <select
                      value={regLevel}
                      onChange={e => setRegLevel(e.target.value as EducationLevel)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
                    >
                      <option value="SMA">SMA / SMK</option>
                      <option value="SMP">SMP</option>
                      <option value="SD">SD</option>
                      <option value="KB-TK">KB-TK</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar Akun Baru</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-500 border-t border-slate-800/80 mt-auto">
        &copy; {new Date().getFullYear()} SIAKAD Yayasan Pendidikan Nusantara Jaya. All Rights Reserved. Protected by Multi-Factor Authentication.
      </footer>

      {/* GOOGLE SSO SIMULATION MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
            
            {/* Header Google Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="font-bold text-slate-800 text-sm">Sign in with Google</span>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="text-center">
                <h3 className="font-bold text-slate-800 text-base">Pilih Akun Google Anda</h3>
                <p className="text-xs text-slate-500 mt-1">
                  untuk melanjutkan ke <strong className="text-slate-800">SIAKAD Yayasan Nusantara Jaya</strong>
                </p>
              </div>

              {/* Account Options */}
              <div className="space-y-2 pt-2">
                {/* Superadmin Google Account */}
                <button
                  onClick={() => handleGoogleSSOSelect('superadmin@yayasan-nusantara.sch.id', 'Dr. H. Budi Santoso, M.Kom.')}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition flex items-center gap-3 text-left group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                    alt="Superadmin"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 truncate">
                    <div className="font-bold text-xs text-slate-800 group-hover:text-blue-600 truncate">
                      Dr. H. Budi Santoso, M.Kom. (Superadmin)
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">superadmin@yayasan-nusantara.sch.id</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition" />
                </button>

                {/* User's Current Session Google Email */}
                <button
                  onClick={() => handleGoogleSSOSelect('brielletimbu@gmail.com', 'Brielle Timbu (Google User)')}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition flex items-center gap-3 text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    BT
                  </div>
                  <div className="flex-1 truncate">
                    <div className="font-bold text-xs text-slate-800 group-hover:text-blue-600 truncate">
                      Brielle Timbu
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">brielletimbu@gmail.com</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition" />
                </button>

                {/* Custom Google Email */}
                <button
                  onClick={() => {
                    const customEmail = prompt('Masukkan Email Google Anda:', 'user.google@gmail.com');
                    if (customEmail) {
                      const name = customEmail.split('@')[0].toUpperCase();
                      handleGoogleSSOSelect(customEmail, `Pengguna ${name}`);
                    }
                  }}
                  className="w-full p-3 rounded-2xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-slate-50 transition flex items-center gap-3 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold text-lg flex items-center justify-center shrink-0">
                    +
                  </div>
                  <div className="font-semibold text-xs text-slate-700">Gunakan akun Google lain</div>
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center pt-2">
                Google akan membagikan nama, alamat email, dan foto profil Anda ke SIAKAD Yayasan.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
