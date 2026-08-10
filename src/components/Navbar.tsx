import React, { useState } from 'react';
import {
  School,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  CloudCheck,
  UserCheck,
  Globe,
  Menu,
  ChevronDown,
  X,
  AlertTriangle,
  Building2,
  Layers,
  Crown,
  LogOut,
  User
} from 'lucide-react';
import { UserProfile, SchoolSettings, NotificationLog, EducationLevel } from '../types';

interface NavbarProps {
  settings: SchoolSettings;
  currentUser: UserProfile;
  users?: UserProfile[];
  onSelectUser?: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenProfileModal?: () => void;
  activeLevel: EducationLevel | 'Semua';
  onSelectLevel: (level: EducationLevel | 'Semua') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: 'id' | 'en';
  onToggleLanguage: () => void;
  notifications: NotificationLog[];
  onOpenMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  currentUser,
  onLogout,
  onOpenProfileModal,
  activeLevel,
  onSelectLevel,
  darkMode,
  onToggleDarkMode,
  language,
  onToggleLanguage,
  notifications,
  onOpenMobileSidebar
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [dismissedNotifIds, setDismissedNotifIds] = useState<string[]>([]);

  const visibleNotifications = notifications.filter(n => !dismissedNotifIds.includes(n.id));

  const unreadAlerts = visibleNotifications.filter(
    n => n.type === 'Push Alert' || n.subject.includes('⚠️') || n.status === 'Pending'
  ).length;

  const roleLabels: Record<string, { label: string; color: string }> = {
    superadmin: { label: 'SUPERADMIN YAYASAN', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    admin: { label: 'ADMIN OPERASIONAL', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    teacher: { label: 'GURU / PENDIDIK', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    student: { label: 'SISWA / MURID', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    parent: { label: 'ORANG TUA / WALI', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' }
  };

  const getUnitDisplayName = () => {
    if (activeLevel === 'Semua') return 'Semua Jenjang Pendidikan';
    return settings.units[activeLevel] || activeLevel;
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md transition-colors w-full">
      <div className="w-full px-2.5 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between min-h-[3.75rem] py-1.5 sm:py-0 sm:h-16 gap-1.5 sm:gap-3">
          
          {/* Mobile Menu Button & Foundation / Unit Branding */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={onOpenMobileSidebar}
              className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition focus:outline-none shrink-0"
              aria-label="Buka Menu"
              id="btn-open-mobile-sidebar"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0 overflow-hidden">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xs sm:text-base font-bold tracking-tight text-white flex items-center gap-2 truncate">
                  <span className="text-amber-400 truncate">{settings.foundationName}</span>
                  {currentUser.role === 'superadmin' && (
                    <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0">
                      <Crown className="w-3 h-3 text-amber-400" /> Superadmin
                    </span>
                  )}
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1.5 truncate">
                  <span className="text-blue-300 font-medium truncate">{getUnitDisplayName()}</span>
                  <span className="text-slate-600 shrink-0">•</span>
                  <span className="shrink-0">TA {settings.academicYear}</span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full shrink-0 shadow-sm" title="Terhubung Realtime dengan Firestore Cloud Sync (Multi-Perangkat)">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    <span>Realtime Cloud Sync</span>
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Foundation Level Selector & Quick Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Multi-Level Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLevelDropdown(!showLevelDropdown)}
                className="flex items-center gap-1 sm:gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-200 transition"
                id="btn-level-selector"
              >
                <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
                <span className="hidden sm:inline text-slate-400">Jenjang:</span>
                <span className="text-amber-300 font-bold">{activeLevel}</span>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
              </button>

              {showLevelDropdown && (
                <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-slate-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-800">
                    Pilih Jenjang Yayasan
                  </div>
                  <div className="mt-1 space-y-1">
                    <button
                      onClick={() => {
                        onSelectLevel('Semua');
                        setShowLevelDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                        activeLevel === 'Semua'
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>Semua Jenjang Pendidikan</span>
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Integrated</span>
                    </button>

                    {(['KB-TK', 'SD', 'SMP', 'SMA'] as EducationLevel[]).map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => {
                          onSelectLevel(lvl);
                          setShowLevelDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition ${
                          activeLevel === lvl
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-semibold text-slate-200">{lvl}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            {settings.units[lvl]}
                          </div>
                        </div>
                        {activeLevel === lvl && <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switch */}
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition hidden md:flex"
              title="Ganti Bahasa"
              id="btn-toggle-language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="uppercase">{language}</span>
            </button>

            {/* Dark Mode Switch */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-amber-400 transition"
              title="Mode Gelap / Terang"
              id="btn-toggle-dark-mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 relative transition"
                id="btn-notifications-toggle"
              >
                <Bell className="w-4 h-4" />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadAlerts}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" /> Notifikasi & Alert
                    </h3>
                    <div className="flex items-center gap-2">
                      {visibleNotifications.length > 0 && (
                        <button
                          onClick={() => setDismissedNotifIds(notifications.map(n => n.id))}
                          className="text-[10px] text-slate-400 hover:text-amber-300 underline font-medium transition cursor-pointer"
                        >
                          Bersihkan Semua
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifDropdown(false)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                        title="Tutup Menu Notifikasi"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {visibleNotifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs font-medium">
                        Tidak ada notifikasi aktif saat ini.
                      </div>
                    ) : (
                      visibleNotifications.slice(0, 8).map(notif => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-xl text-xs border relative group transition-all ${
                            notif.type === 'Push Alert' || notif.subject.includes('⚠️')
                              ? 'bg-amber-950/40 border-amber-800/50 text-amber-200'
                              : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-1 pr-5">
                            <span className="flex items-center gap-1.5 truncate text-amber-300">
                              {notif.subject.includes('⚠️') && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                              {notif.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{notif.sentAt.split(' ')[0]}</span>
                          </div>
                          <p className="line-clamp-2 text-[11px] text-slate-300 leading-snug">{notif.body}</p>

                          {/* Delete/Dismiss notification card item */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDismissedNotifIds(prev => [...prev, notif.id]);
                            }}
                            className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900/80 transition cursor-pointer"
                            title="Hapus Notifikasi Ini"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Badge & Logout Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-200 transition"
                id="btn-profile-menu"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-blue-500 shrink-0"
                />
                <div className="text-left hidden lg:block">
                  <div className="font-semibold truncate max-w-[130px]">{currentUser.name}</div>
                  <div className="text-[9px] uppercase font-bold tracking-wider text-amber-400">
                    {roleLabels[currentUser.role]?.label || currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-slate-200">
                  <div className="pb-3 border-b border-slate-800 flex items-center gap-3">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500 shrink-0"
                    />
                    <div className="truncate flex-1">
                      <div className="font-bold text-xs text-slate-100 truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded border ${roleLabels[currentUser.role]?.color || 'bg-slate-800'}`}>
                          {roleLabels[currentUser.role]?.label || currentUser.role}
                        </span>
                        {currentUser.isGoogleConnected && (
                          <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                            Google SSO
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        if (onOpenProfileModal) onOpenProfileModal();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 font-bold text-xs transition border border-blue-500/20"
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-400" />
                        <span>Edit Profil & Password Saya</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs transition border border-rose-500/20"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Keluar Akun (Log Out)</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
