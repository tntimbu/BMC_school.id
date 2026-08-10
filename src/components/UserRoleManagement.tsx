import React, { useState } from 'react';
import {
  ShieldAlert,
  UserCheck,
  Lock,
  Crown,
  Building2,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  User,
  GraduationCap,
  Users,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Layers,
  School
} from 'lucide-react';
import { UserProfile, UserRole, SchoolSettings, EducationLevel } from '../types';

interface UserRoleManagementProps {
  users: UserProfile[];
  currentUser?: UserProfile;
  settings?: SchoolSettings;
  onSelectUser?: (user: UserProfile) => void;
  onToggleBlockUser?: (userId: string, newStatus: 'Aktif' | 'Nonaktif' | 'Diblokir') => void;
  onToggleBlockUnit?: (target: EducationLevel | 'Yayasan', newStatus: 'Aktif' | 'Nonaktif' | 'Diblokir') => void;
}

interface RolePermissionRule {
  module: string;
  superadmin: { read: boolean; write: boolean; delete: boolean };
  admin: { read: boolean; write: boolean; delete: boolean };
  teacher: { read: boolean; write: boolean; delete: boolean };
  student: { read: boolean; write: boolean; delete: boolean };
  parent: { read: boolean; write: boolean; delete: boolean };
}

export const UserRoleManagement: React.FC<UserRoleManagementProps> = ({
  users,
  currentUser,
  settings,
  onSelectUser,
  onToggleBlockUser,
  onToggleBlockUnit
}) => {
  const isSuperadmin = currentUser?.role === 'superadmin';

  // Filter users: if not superadmin, hide superadmin profile completely!
  const visibleUsers = users.filter(u => isSuperadmin || u.role !== 'superadmin');

  const [permissions, setPermissions] = useState<RolePermissionRule[]>([
    {
      module: 'Kontrol Database & Firebase System',
      superadmin: { read: true, write: true, delete: true },
      admin: { read: true, write: false, delete: false },
      teacher: { read: false, write: false, delete: false },
      student: { read: false, write: false, delete: false },
      parent: { read: false, write: false, delete: false }
    },
    {
      module: 'Kustomisasi Nama Yayasan & Unit',
      superadmin: { read: true, write: true, delete: true },
      admin: { read: true, write: true, delete: false },
      teacher: { read: true, write: false, delete: false },
      student: { read: true, write: false, delete: false },
      parent: { read: true, write: false, delete: false }
    },
    {
      module: 'Manajemen Nilai & Rapor Digital',
      superadmin: { read: true, write: true, delete: true },
      admin: { read: true, write: true, delete: true },
      teacher: { read: true, write: true, delete: false },
      student: { read: true, write: false, delete: false },
      parent: { read: true, write: false, delete: false }
    },
    {
      module: 'Presensi QR Code Real-time',
      superadmin: { read: true, write: true, delete: true },
      admin: { read: true, write: true, delete: true },
      teacher: { read: true, write: true, delete: false },
      student: { read: true, write: false, delete: false },
      parent: { read: true, write: false, delete: false }
    },
    {
      module: 'Keuangan & Tagihan SPP',
      superadmin: { read: true, write: true, delete: true },
      admin: { read: true, write: true, delete: true },
      teacher: { read: false, write: false, delete: false },
      student: { read: true, write: true, delete: false },
      parent: { read: true, write: true, delete: false }
    },
    {
      module: 'Pendaftaran PPDB Online',
      superadmin: { read: true, write: true, delete: true },
      admin: { read: true, write: true, delete: true },
      teacher: { read: true, write: true, delete: false },
      student: { read: true, write: false, delete: false },
      parent: { read: true, write: false, delete: false }
    },
    {
      module: 'Pengumuman & Agenda Yayasan',
      superadmin: { read: true, write: true, delete: true },
      admin: { read: true, write: true, delete: true },
      teacher: { read: true, write: true, delete: false },
      student: { read: true, write: false, delete: false },
      parent: { read: true, write: false, delete: false }
    }
  ]);

  const togglePerm = (moduleIndex: number, role: UserRole, permType: 'read' | 'write' | 'delete') => {
    const updated = [...permissions];
    if (updated[moduleIndex][role]) {
      updated[moduleIndex][role][permType] = !updated[moduleIndex][role][permType];
      setPermissions(updated);
    }
  };

  const roleBadges: Record<UserRole, { label: string; icon: any; style: string }> = {
    superadmin: {
      label: 'Superadmin (Akses Penuh)',
      icon: Crown,
      style: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    admin: {
      label: 'Admin Operasional',
      icon: ShieldCheck,
      style: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    teacher: {
      label: 'Guru / Pendidik',
      icon: GraduationCap,
      style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    student: {
      label: 'Siswa / Murid',
      icon: User,
      style: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    parent: {
      label: 'Orang Tua / Wali',
      icon: Users,
      style: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    }
  };

  const unitsList: { key: EducationLevel; name: string }[] = [
    { key: 'KB-TK', name: settings?.units['KB-TK'] || 'KB & TK Islam Nusantara' },
    { key: 'SD', name: settings?.units['SD'] || 'SD Nusantara 01' },
    { key: 'SMP', name: settings?.units['SMP'] || 'SMP Nusantara 1' },
    { key: 'SMA', name: settings?.units['SMA'] || 'SMA Negeri 1 Nusantara' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-400" />
            Manajemen Peran & Akses Pemblokiran (Role-Based Access Control)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isSuperadmin
              ? 'Akses Penuh Superadmin: Anda dapat melihat seluruh akun, mengubah matriks izin, serta memblokir/menonaktifkan akun atau unit sekolah.'
              : 'Tampilan Peran Operasional Admin: Superadmin terlindungi & tidak terekspos dalam daftar akun.'}
          </p>
        </div>

        {isSuperadmin && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0">
            <Crown className="w-4 h-4 text-amber-400" /> Mode Superadmin Aktif
          </div>
        )}
      </div>

      {/* SUPERADMIN EXCLUSIVE CONTROL: Block / Suspend Foundation or Units */}
      {isSuperadmin && settings && (
        <div className="p-5 bg-slate-900 rounded-2xl border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Ban className="w-4 h-4 text-amber-400" /> Otoritas Superadmin: Kontrol Akses & Pemblokiran Sekolah / Unit
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Superadmin dapat membekukan / memblokir layanan seluruh Yayasan atau unit jenjang tertentu jika terjadi kondisi khusus.
              </p>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold uppercase">
              Otoritas Tertinggi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            
            {/* Foundation Level Control */}
            <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-400" /> Induk Yayasan
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    settings.foundationStatus === 'Diblokir'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : settings.foundationStatus === 'Nonaktif'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {settings.foundationStatus || 'Aktif'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 truncate">{settings.foundationName}</p>
              </div>

              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-700/60">
                {settings.foundationStatus === 'Diblokir' ? (
                  <button
                    onClick={() => onToggleBlockUnit && onToggleBlockUnit('Yayasan', 'Aktif')}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Buka Blokir
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleBlockUnit && onToggleBlockUnit('Yayasan', 'Diblokir')}
                    className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition"
                  >
                    <Ban className="w-3.5 h-3.5" /> Blokir Yayasan
                  </button>
                )}
              </div>
            </div>

            {/* 4 Education Units Control */}
            {unitsList.map(u => {
              const uStatus = settings.unitStatus?.[u.key] || 'Aktif';
              const isUnitBlocked = uStatus === 'Diblokir';

              return (
                <div key={u.key} className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-xs flex items-center gap-1">
                        <School className="w-3.5 h-3.5 text-blue-400" /> Unit {u.key}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isUnitBlocked
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {uStatus}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">{u.name}</p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-700/60">
                    {isUnitBlocked ? (
                      <button
                        onClick={() => onToggleBlockUnit && onToggleBlockUnit(u.key, 'Aktif')}
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Buka Blokir
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleBlockUnit && onToggleBlockUnit(u.key, 'Diblokir')}
                        className="w-full py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                      >
                        <Ban className="w-3.5 h-3.5" /> Blokir Unit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* Users Selector Grid */}
      <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" /> Daftar Akun Pengguna Terdaftar ({visibleUsers.length} Akun)
            </h3>
            {!isSuperadmin && (
              <p className="text-[11px] text-amber-400 mt-0.5">
                * Profil Superadmin disembunyikan secara otomatis demi keamanan sistem.
              </p>
            )}
          </div>
          <span className="text-[11px] text-slate-400">Klik kartu untuk beralih simulasi login</span>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSuperadmin ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3`}>
          {visibleUsers.map(u => {
            const rBadge = roleBadges[u.role] || { label: u.role, icon: User, style: 'bg-slate-800 text-slate-300' };
            const Icon = rBadge.icon;
            const isSelected = currentUser?.id === u.id;
            const userStatus = u.status || 'Aktif';
            const isUserBlocked = userStatus === 'Diblokir' || userStatus === 'Nonaktif';

            return (
              <div
                key={u.id}
                className={`p-3.5 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div onClick={() => onSelectUser && onSelectUser(u)} className="cursor-pointer space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatarUrl} alt={u.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-xs truncate flex items-center justify-between gap-1">
                        <span className="truncate">{u.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{u.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <div className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 justify-center ${rBadge.style}`}>
                      <Icon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{rBadge.label}</span>
                    </div>

                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isUserBlocked
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {userStatus}
                    </span>
                  </div>
                </div>

                {/* Superadmin Quick Block Button for Account */}
                {isSuperadmin && u.role !== 'superadmin' && (
                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
                    {isUserBlocked ? (
                      <button
                        onClick={() => onToggleBlockUser && onToggleBlockUser(u.id, 'Aktif')}
                        className="w-full py-1 px-2 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded text-[10px] font-bold flex items-center justify-center gap-1 transition"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Aktifkan Akun
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleBlockUser && onToggleBlockUser(u.id, 'Diblokir')}
                        className="w-full py-1 px-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded text-[10px] font-bold flex items-center justify-center gap-1 transition"
                      >
                        <Ban className="w-3 h-3" /> Blokir Akun Ini
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" /> Matriks Hak Akses Modul Sistem (Read / Write / Delete)
          </h3>
          <span className="text-[10px] text-slate-400">R = Read • W = Write • D = Delete</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/40 uppercase font-bold text-[10px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Modul Layanan Yayasan</th>
                {isSuperadmin && <th className="p-3.5 text-center text-amber-400">Superadmin</th>}
                <th className="p-3.5 text-center">Admin</th>
                <th className="p-3.5 text-center">Guru</th>
                <th className="p-3.5 text-center">Siswa</th>
                <th className="p-3.5 text-center">Orang Tua</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {permissions.map((rule, idx) => (
                <tr key={rule.module} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-bold text-white">{rule.module}</td>
                  
                  {/* Superadmin Column - Only visible when logged in as Superadmin */}
                  {isSuperadmin && (
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-bold text-[10px] inline-flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-400" /> Full Access
                      </span>
                    </td>
                  )}

                  {/* Admin */}
                  <td className="p-3.5 text-center space-x-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">R</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">W</span>
                  </td>

                  {/* Teacher */}
                  <td className="p-3.5 text-center space-x-1">
                    <button
                      onClick={() => togglePerm(idx, 'teacher', 'read')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        rule.teacher.read ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      R
                    </button>
                    <button
                      onClick={() => togglePerm(idx, 'teacher', 'write')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        rule.teacher.write ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      W
                    </button>
                  </td>

                  {/* Student */}
                  <td className="p-3.5 text-center space-x-1">
                    <button
                      onClick={() => togglePerm(idx, 'student', 'read')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        rule.student.read ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      R
                    </button>
                    <button
                      onClick={() => togglePerm(idx, 'student', 'write')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        rule.student.write ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      W
                    </button>
                  </td>

                  {/* Parent */}
                  <td className="p-3.5 text-center space-x-1">
                    <button
                      onClick={() => togglePerm(idx, 'parent', 'read')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        rule.parent.read ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      R
                    </button>
                    <button
                      onClick={() => togglePerm(idx, 'parent', 'write')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        rule.parent.write ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      W
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
