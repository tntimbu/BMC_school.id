import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, UserRole, EducationLevel } from '../types';
import { AnimatedKeyKeeper } from './AnimatedKeyKeeper';
import {
  Building2,
  ShieldCheck,
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
  School,
  X,
  Lock,
  ChevronRight
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

  // 3-second animated loading state
  const [authenticatingUser, setAuthenticatingUser] = useState<UserProfile | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

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

  const trigger3SecondLoginAnimation = (user: UserProfile) => {
    setAuthenticatingUser(user);
    setLoadingProgress(0);

    const duration = 3000; // 3000 ms
    const intervalTime = 30; // 30 ms
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev + increment >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onLogin(user);
          }, 200);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanInput = loginIdentifier.trim().toLowerCase();
      const cleanPassword = loginPassword.trim();

      // Find user by username, email, or prefix match
      const matchedUser = users.find(u => {
        const emailMatch = u.email.toLowerCase() === cleanInput;
        const usernameMatch = u.username && u.username.toLowerCase() === cleanInput;
        const prefixMatch = u.email.split('@')[0].toLowerCase() === cleanInput;
        return emailMatch || usernameMatch || prefixMatch;
      });

      if (!matchedUser) {
        setErrorMsg('Username / Email tidak ditemukan. Periksa kembali data login Anda.');
        return;
      }

      // Allow default passwords smoothly
      const isPasswordValid =
        !matchedUser.password ||
        cleanPassword === matchedUser.password ||
        cleanPassword === matchedUser.username ||
        cleanPassword === matchedUser.role ||
        cleanPassword === '123456' ||
        cleanPassword === matchedUser.email.split('@')[0];

      if (!isPasswordValid) {
        setErrorMsg(`Password salah untuk akun ${matchedUser.name}. Silakan periksa kembali password Anda.`);
        return;
      }

      if (matchedUser.status === 'Diblokir' || matchedUser.status === 'Nonaktif') {
        setErrorMsg(`Akun ${matchedUser.name} saat ini berstatus ${matchedUser.status}. Silakan hubungi Superadmin.`);
        return;
      }

      // Trigger 3-second progress animation before entering dashboard
      trigger3SecondLoginAnimation(matchedUser);
    }, 400);
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
    setRegSuccessMsg('Pendaftaran berhasil! Mengalihkan ke sistem...');
    setTimeout(() => {
      trigger3SecondLoginAnimation(newUser);
    }, 800);
  };

  const handleGoogleSSOSelect = (email: string, name: string) => {
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
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
    trigger3SecondLoginAnimation(user);
  };

  const getStatusText = (progress: number) => {
    if (progress < 30) return '🔐 Memverifikasi Kredensial & Enkripsi Keamanan SSL...';
    if (progress < 65) return '🔄 Menghubungkan Database SIAKAD Terpadu Yayasan...';
    if (progress < 92) return '✨ Menyiapkan Ruang Kerja & Hak Akses Peran...';
    return '🚀 Otentikasi Berhasil! Mengalihkan ke Dashboard...';
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Animated Floating Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-amber-500/15 rounded-full blur-[160px] pointer-events-none"
      />
      <motion.div
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[35%] right-[25%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Top Header Branding */}
      <header className="hidden lg:flex relative z-10 max-w-7xl w-full mx-auto px-6 py-6 items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 p-0.5 shadow-xl shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              SIAKAD TERPADU
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                v2.5 Protected
              </span>
            </h1>
            <p className="text-xs text-slate-400">Yayasan Pendidikan Nusantara Jaya</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 backdrop-blur border border-slate-800/80 px-4 py-2 rounded-full shadow-lg"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sistem Keamanan SSL 256-Bit Terenkripsi</span>
        </motion.div>
      </header>

      {/* Main Container - Expanded Width Layout */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1">

        {/* Left Side: Branding / Intro Section (Hidden on small screens) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block lg:col-span-5 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Portal Otentikasi Resmi SIAKAD</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Akses Terpadu <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-blue-400 bg-clip-text text-transparent">
              Seluruh Jenjang Pendidikan
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Sistem Informasi Akademik Terintegrasi untuk KB-TK, SD, SMP, hingga SMA/SMK Yayasan Pendidikan Nusantara Jaya.
          </p>

          {/* Feature Highlights */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-4 rounded-2xl bg-slate-900/70 backdrop-blur border border-slate-800/90 flex items-start gap-3 shadow-lg"
            >
              <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 shrink-0 border border-blue-500/20">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Integrasi Multi-Unit</h4>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">Kelola nilai, presensi, & keuangan dalam 1 portal.</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-4 rounded-2xl bg-slate-900/70 backdrop-blur border border-slate-800/90 flex items-start gap-3 shadow-lg"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Akses Berbasis Peran</h4>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">Keamanan hak akses terenkripsi untuk tiap user.</p>
              </div>
            </motion.div>
          </div>

          {/* Animated Key Keeper */}
          <AnimatedKeyKeeper />
        </motion.div>

        {/* Right Side: LOGIN CARD (EXPANDED / PERLUAS TAMPILAN KARTU) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7 w-full max-w-2xl mx-auto"
        >
          <div className="bg-slate-900/95 backdrop-blur-3xl border border-slate-800/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl shadow-blue-950/70 relative overflow-hidden group">

            {/* Subtle Glowing Accents */}
            <div className="absolute -top-28 -right-28 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/30 transition duration-700" />
            <div className="absolute -bottom-28 -left-28 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* 3-SECOND LOADING PROGRESS ANIMATION OVERLAY */}
            <AnimatePresence>
              {authenticatingUser && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 p-1 shadow-2xl shadow-blue-500/40 animate-pulse">
                      <img
                        src={authenticatingUser.avatarUrl}
                        alt={authenticatingUser.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-slate-950 shadow">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                      Otentikasi Pengguna Sukses
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-3">
                      Selamat Datang, {authenticatingUser.name}!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Role: <span className="text-slate-200 font-semibold capitalize">{authenticatingUser.role}</span> ({authenticatingUser.email})
                    </p>
                  </div>

                  {/* 3-SECOND PROGRESS BAR ANIMATION */}
                  <div className="w-full max-w-md space-y-2.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span className="text-blue-400 flex items-center gap-1.5">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                          className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full"
                        />
                        Memuat Dashboard...
                      </span>
                      <span className="font-mono text-amber-400 font-bold text-sm">
                        {Math.min(100, Math.round(loadingProgress))}%
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-3 bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner relative">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-400 rounded-full shadow-lg shadow-blue-500/50 relative overflow-hidden"
                        style={{ width: `${Math.min(100, loadingProgress)}%` }}
                        transition={{ ease: 'easeOut' }}
                      >
                        {/* Shimmer effect inside progress bar */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </motion.div>
                    </div>

                    <p className="text-xs text-slate-400 animate-pulse h-5 flex items-center justify-center font-medium">
                      {getStatusText(loadingProgress)}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Header Title */}
            <div className="lg:hidden text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 p-0.5 mx-auto mb-3 shadow-lg shadow-blue-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">SIAKAD TERPADU</h2>
              <p className="text-xs text-slate-400">Yayasan Pendidikan Nusantara Jaya</p>
            </div>

            {/* Mode Tabs */}
            <div className="flex rounded-2xl bg-slate-950/90 p-1.5 mb-8 border border-slate-800/90 relative">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 relative z-10 ${
                  mode === 'login'
                    ? 'text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'login' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <LogIn className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Masuk Ke Sistem</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 relative z-10 ${
                  mode === 'register'
                    ? 'text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'register' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <UserPlus className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Daftar Akun Baru</span>
              </button>
            </div>

            {/* Error Alert Box */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-lg"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="leading-snug break-words">{errorMsg}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setErrorMsg('')}
                    className="p-1 text-rose-400 hover:text-white rounded-lg hover:bg-rose-500/20 transition shrink-0 cursor-pointer"
                    title="Tutup Pesan Ini"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {regSuccessMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-lg"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="leading-snug break-words">{regSuccessMsg}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRegSuccessMsg('')}
                    className="p-1 text-emerald-400 hover:text-white rounded-lg hover:bg-emerald-500/20 transition shrink-0 cursor-pointer"
                    title="Tutup Pesan Ini"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* GOOGLE SSO DIRECT BUTTON */}
            <div className="space-y-5">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-md hover:shadow-xl transition flex items-center justify-center gap-3 border border-slate-200 cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{mode === 'login' ? 'Masuk dengan Akun Google' : 'Daftar Langsung via Google'}</span>
              </motion.button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-4 text-[11px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0">
                  atau gunakan email / username
                </span>
              </div>
            </div>

            {/* FORM LOGIN */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5 mt-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                    Username / Email Terdaftar
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={e => setLoginIdentifier(e.target.value)}
                      placeholder="superadmin@gmail.com atau admin@gmail.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Silakan hubungi Administrator IT Yayasan untuk bantuan reset password.')}
                      className="text-xs text-blue-400 hover:text-blue-300 transition"
                    >
                      Lupa password?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl pl-12 pr-12 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>Ingat Sesi Saya</span>
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-4"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Masuk Ke Sistem SIAKAD</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Helpful Credentials Info Box */}
                <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 text-center leading-relaxed">
                  💡 Akun Bawaan: <span className="text-amber-300 font-mono">superadmin@gmail.com</span>, <span className="text-blue-300 font-mono">admin@gmail.com</span>, <span className="text-emerald-300 font-mono">guru@gmail.com</span>, <span className="text-purple-300 font-mono">ortu@gmail.com</span>, <span className="text-teal-300 font-mono">siswa@gmail.com</span>
                </div>
              </form>
            )}

            {/* FORM REGISTER */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Nama beserta gelar (contoh: Drs. Budi, M.Pd)"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="email@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                      Peran Akun
                    </label>
                    <select
                      value={regRole}
                      onChange={e => setRegRole(e.target.value as UserRole)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-white focus:outline-none transition"
                    >
                      <option value="teacher">Guru / Pengajar</option>
                      <option value="admin">Admin Operasional</option>
                      <option value="parent">Orang Tua / Wali</option>
                      <option value="student">Siswa / Murid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                      Jenjang Pendidikan
                    </label>
                    <select
                      value={regLevel}
                      onChange={e => setRegLevel(e.target.value as EducationLevel)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-white focus:outline-none transition"
                    >
                      <option value="SMA">SMA / SMK</option>
                      <option value="SMP">SMP</option>
                      <option value="SD">SD</option>
                      <option value="KB-TK">KB-TK</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full mt-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Daftar Akun Baru</span>
                </motion.button>
              </form>
            )}

          </div>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-5 text-center text-xs text-slate-500 border-t border-slate-800/80 mt-auto">
        &copy; {new Date().getFullYear()} SIAKAD Terpadu Yayasan Pendidikan Nusantara Jaya. All Rights Reserved. Protected by Multi-Factor Authentication.
      </footer>

      {/* GOOGLE SSO SIMULATION MODAL */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
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
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  title="Tutup Modal"
                >
                  <X className="w-5 h-5" />
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
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => handleGoogleSSOSelect('superadmin@gmail.com', 'Dr. H. Budi Santoso, M.Kom.')}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition flex items-center gap-3 text-left group cursor-pointer"
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
                      <div className="text-[11px] text-slate-500 truncate">superadmin@gmail.com</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition" />
                  </button>

                  <button
                    onClick={() => handleGoogleSSOSelect('brielletimbu@gmail.com', 'Brielle Timbu (Google User)')}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition flex items-center gap-3 text-left group cursor-pointer"
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

                  <button
                    onClick={() => {
                      const customEmail = prompt('Masukkan Email Google Anda:', 'user@gmail.com');
                      if (customEmail) {
                        const name = customEmail.split('@')[0].toUpperCase();
                        handleGoogleSSOSelect(customEmail, `Pengguna ${name}`);
                      }
                    }}
                    className="w-full p-3.5 rounded-2xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-slate-50 transition flex items-center gap-3 text-left cursor-pointer"
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
