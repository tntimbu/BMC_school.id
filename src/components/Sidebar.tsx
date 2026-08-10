import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  QrCode,
  CreditCard,
  UserPlus,
  Megaphone,
  Calendar,
  Bell,
  BarChart3,
  ShieldAlert,
  FileSpreadsheet,
  Settings,
  X,
  Building2,
  Crown,
  MessageSquare
} from 'lucide-react';
import { UserProfile } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'grades'
  | 'attendance'
  | 'tuition'
  | 'chat'
  | 'ppdb'
  | 'announcements'
  | 'calendar'
  | 'notifications'
  | 'analytics'
  | 'roles'
  | 'api-export'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  mobileOpen,
  onCloseMobile
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Ringkasan Dashboard',
      icon: LayoutDashboard,
      roles: ['superadmin', 'admin', 'teacher', 'parent', 'student'],
      badge: 'Utama'
    },
    {
      id: 'grades',
      label: 'Nilai & Rapor Digital',
      icon: GraduationCap,
      roles: ['superadmin', 'admin', 'teacher', 'parent', 'student'],
      badge: 'Nilai'
    },
    {
      id: 'attendance',
      label: 'Absensi QR Code',
      icon: QrCode,
      roles: ['superadmin', 'admin', 'teacher', 'parent', 'student'],
      badge: 'Real-time'
    },
    {
      id: 'tuition',
      label: 'Biaya Pendidikan (SPP)',
      icon: CreditCard,
      roles: ['superadmin', 'admin', 'parent', 'student'],
      badge: 'Keuangan'
    },
    {
      id: 'chat',
      label: 'Media Chat Terhubung',
      icon: MessageSquare,
      roles: ['superadmin', 'admin', 'teacher', 'parent', 'student'],
      badge: 'Live Chat'
    },
    {
      id: 'ppdb',
      label: 'Pendaftaran PPDB Online',
      icon: UserPlus,
      roles: ['superadmin', 'admin', 'teacher', 'parent', 'student'],
      badge: 'Publik'
    },
    {
      id: 'announcements',
      label: 'Pengumuman Sekolah',
      icon: Megaphone,
      roles: ['superadmin', 'admin', 'teacher', 'parent', 'student']
    },
    {
      id: 'calendar',
      label: 'Kalender & Agenda Sync',
      icon: Calendar,
      roles: ['superadmin', 'admin', 'teacher', 'parent', 'student']
    },
    {
      id: 'analytics',
      label: 'Analitik Akademik',
      icon: BarChart3,
      roles: ['superadmin', 'admin', 'teacher'],
      badge: 'Grafik'
    },
    {
      id: 'notifications',
      label: 'Notifikasi & Email Log',
      icon: Bell,
      roles: ['superadmin', 'admin', 'teacher']
    },
    {
      id: 'roles',
      label: 'Manajemen Hak Akses',
      icon: ShieldAlert,
      roles: ['superadmin', 'admin'],
      badge: 'Security'
    },
    {
      id: 'api-export',
      label: 'Integrasi API & Ekspor',
      icon: FileSpreadsheet,
      roles: ['superadmin', 'admin', 'teacher']
    },
    {
      id: 'settings',
      label: 'Pengaturan Yayasan',
      icon: Settings,
      roles: ['superadmin', 'admin'],
      badge: currentUser.role === 'superadmin' ? 'Full Sys' : 'Config'
    }
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  const roleDisplayNames: Record<string, string> = {
    superadmin: 'SUPERADMIN YAYASAN',
    admin: 'ADMIN OPERASIONAL',
    teacher: 'GURU / PENDIDIK',
    student: 'SISWA / MURID',
    parent: 'ORANG TUA / WALI'
  };

  const navContent = (
    <div className="h-full flex flex-col justify-between p-3.5 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800/80 shadow-xl overflow-y-auto">
      
      <div>
        {/* Header Title on Mobile Drawer */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 md:hidden px-1">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>SIAKAD Yayasan</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Section Title */}
        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
          <span>{roleDisplayNames[currentUser.role] || currentUser.role.toUpperCase()}</span>
          {currentUser.role === 'superadmin' && <Crown className="w-3.5 h-3.5 text-amber-400" />}
        </div>

        {/* Menu Items */}
        <nav className="mt-2 space-y-1">
          {filteredItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id as ActiveTab);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
                id={`nav-item-${item.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0 hidden sm:inline-block ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info Card Footer */}
      <div className="pt-3 border-t border-slate-800/80 px-0.5 mt-4">
        <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/50 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">{currentUser.name}</div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wide truncate">
                {roleDisplayNames[currentUser.role] || currentUser.role}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-56 lg:w-64 shrink-0 h-[calc(100vh-5rem)] sticky top-20">
        {navContent}
      </aside>

      {/* Mobile Drawer Slide-over */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative max-w-[280px] w-full bg-slate-900 z-10 h-full p-2">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
