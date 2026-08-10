import React from 'react';
import {
  LayoutDashboard,
  QrCode,
  GraduationCap,
  MessageSquare,
  Menu,
  CreditCard,
  Settings,
  UserCheck
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
  const isParentOrStudent = currentUser.role === 'parent' || currentUser.role === 'student';

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Home',
      icon: LayoutDashboard,
    },
    {
      id: 'attendance' as ActiveTab,
      label: 'Absensi QR',
      icon: QrCode,
    },
    {
      id: 'grades' as ActiveTab,
      label: 'Nilai',
      icon: GraduationCap,
    },
    {
      id: 'chat' as ActiveTab,
      label: 'Media Chat',
      icon: MessageSquare,
      badge: true,
    },
    ...(isParentOrStudent
      ? [
          {
            id: 'tuition' as ActiveTab,
            label: 'SPP',
            icon: CreditCard,
          }
        ]
      : [
          {
            id: 'settings' as ActiveTab,
            label: 'Pengaturan',
            icon: Settings,
          }
        ]),
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 shadow-2xl px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-amber-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id={`mobile-bottom-nav-${item.id}`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-400'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-amber-300 font-bold' : 'text-slate-400 font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
              )}
            </button>
          );
        })}

        {/* Menu / Lainnya Button */}
        <button
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition-all active:scale-95"
          id="mobile-bottom-nav-menu"
          aria-label="Lainnya"
        >
          <Menu className="w-5 h-5 text-slate-400" />
          <span className="text-[10px] mt-0.5 tracking-tight text-slate-400 font-medium">
            Lainnya
          </span>
        </button>
      </div>
    </nav>
  );
};
