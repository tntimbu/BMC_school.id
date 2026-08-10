import React, { useState } from 'react';
import {
  LayoutDashboard,
  QrCode,
  GraduationCap,
  MessageSquare,
  Menu,
  Settings,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { UserProfile } from '../types';

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  onOpenMobileMenu: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onOpenMobileMenu
}) => {
  const [showProfileSheet, setShowProfileSheet] = useState(false);

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Home',
      icon: LayoutDashboard,
      iconClass: 'w-5 h-5',
    },
    {
      id: 'attendance' as ActiveTab,
      label: 'Absensi QR',
      icon: QrCode,
      iconClass: 'w-5 h-5',
    },
    {
      id: 'grades' as ActiveTab,
      label: 'Nilai',
      icon: GraduationCap,
      // GraduationCap shape is naturally wider; set w-[22px] h-[22px] stroke-[2.2] for exact visual parity
      iconClass: 'w-[22px] h-[22px] stroke-[2.2]',
    },
    {
      id: 'chat' as ActiveTab,
      label: 'Media Chat',
      icon: MessageSquare,
      iconClass: 'w-5 h-5',
      badge: true,
    },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 shadow-2xl px-1.5 py-1.5 safe-area-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setShowProfileSheet(false);
                  onSelectTab(item.id);
                }}
                className={`flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all relative flex-1 ${
                  isActive
                    ? 'text-amber-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                id={`mobile-bottom-nav-${item.id}`}
              >
                <div className="w-6 h-6 flex items-center justify-center relative shrink-0">
                  <Icon
                    className={`${item.iconClass} shrink-0 transition-transform ${
                      isActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-400'
                    }`}
                  />
                  {item.badge && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  )}
                </div>
                <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[62px] text-center ${isActive ? 'text-amber-300 font-bold' : 'text-slate-400 font-medium'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5 shrink-0" />
                )}
              </button>
            );
          })}

          {/* Profil Button */}
          <button
            onClick={() => setShowProfileSheet(true)}
            className={`flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all relative flex-1 ${
              showProfileSheet
                ? 'text-amber-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="mobile-bottom-nav-profile"
          >
            <div className="w-6 h-6 flex items-center justify-center relative shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className={`w-5 h-5 rounded-full object-cover ring-1 shrink-0 ${
                  showProfileSheet ? 'ring-amber-400' : 'ring-slate-600'
                }`}
              />
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[62px] text-center ${showProfileSheet ? 'text-amber-300 font-bold' : 'text-slate-400 font-medium'}`}>
              Profil
            </span>
          </button>

          {/* Menu / Lainnya Button */}
          <button
            onClick={() => {
              setShowProfileSheet(false);
              onOpenMobileMenu();
            }}
            className="flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl text-slate-400 hover:text-slate-200 transition-all flex-1 active:scale-95"
            id="mobile-bottom-nav-menu"
            aria-label="Lainnya"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <Menu className="w-5 h-5 text-slate-400 shrink-0" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight text-slate-400 font-medium truncate max-w-[62px] text-center">
              Lainnya
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Profile Bottom Sheet Modal */}
      {showProfileSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setShowProfileSheet(false)}
          />
          <div className="relative w-full max-w-lg bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 shadow-2xl z-10 text-slate-100 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-400/80 shrink-0 shadow-md"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-white truncate">{currentUser.name}</h3>
                  <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase mt-1">
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowProfileSheet(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Navigation Actions */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  setShowProfileSheet(false);
                  onSelectTab('settings');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition text-xs font-semibold text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Pengaturan Sekolah & Instansi</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              <button
                onClick={() => {
                  setShowProfileSheet(false);
                  onSelectTab('roles');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition text-xs font-semibold text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Manajemen Hak Akses & Role</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>SIAKAD Multi-Jenjang</span>
              <button
                onClick={() => setShowProfileSheet(false)}
                className="text-amber-400 font-bold hover:underline"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
