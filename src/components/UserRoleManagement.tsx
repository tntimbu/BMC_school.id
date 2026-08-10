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
  School,
  UserPlus,
  Edit,
  Key,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Mail,
  Trash2
} from 'lucide-react';
import { UserProfile, UserRole, SchoolSettings, EducationLevel } from '../types';

interface UserRoleManagementProps {
  users: UserProfile[];
  currentUser?: UserProfile;
  settings?: SchoolSettings;
  onSelectUser?: (user: UserProfile) => void;
  onToggleBlockUser?: (userId: string, newStatus: 'Aktif' | 'Nonaktif' | 'Diblokir') => void;
  onToggleBlockUnit?: (target: EducationLevel | 'Yayasan', newStatus: 'Aktif' | 'Nonaktif' | 'Diblokir') => void;
  onAddUser?: (newUser: UserProfile) => void;
  onUpdateUser?: (updatedUser: UserProfile) => void;
  onDeleteUser?: (userId: string) => void;
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
  onToggleBlockUnit,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const isSuperadmin = currentUser?.role === 'superadmin';
  const isAdminOrSuper = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';

  // Filter users: if not superadmin, hide superadmin profile completely!
  const visibleUsers = users.filter(u => isSuperadmin || u.role !== 'superadmin');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Form State for Add/Edit
  const [formData, setFormData] = useState<{
    id?: string;
    name: string;
    email: string;
    username: string;
    password: string;
    role: UserRole;
    educationLevel?: EducationLevel;
    className?: string;
    status: 'Aktif' | 'Nonaktif' | 'Diblokir';
    avatarUrl: string;
  }>({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'teacher',
    educationLevel: 'SMA',
    className: 'XII IPA 1',
    status: 'Aktif',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  });

  const toggleShowPassword = (userId: string) => {
    setShowPasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      password: '',
      role: 'teacher',
      educationLevel: 'SMA',
      className: 'XII IPA 1',
      status: 'Aktif',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    });
    setShowAddModal(true);
  };

  const openEditModal = (u: UserProfile) => {
    setEditingUser(u);
    setFormData({
      id: u.id,
      name: u.name,
      email: u.email,
      username: u.username || '',
      password: u.password || '',
      role: u.role,
      educationLevel: u.educationLevel || 'SMA',
      className: u.className || 'XII IPA 1',
      status: u.status || 'Aktif',
      avatarUrl: u.avatarUrl
    });
  };

  const handleSaveUserForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim() || !formData.password.trim()) {
      alert('Mohon isi Nama, Username, dan Password!');
      return;
    }

    if (editingUser) {
      // Update existing user
      const updated: UserProfile = {
        ...editingUser,
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: formData.role,
        educationLevel: formData.educationLevel,
        className: formData.className,
        status: formData.status,
        avatarUrl: formData.avatarUrl
      };
      if (onUpdateUser) onUpdateUser(updated);
      setEditingUser(null);
    } else {
      // Add new user
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: formData.name,
        email: formData.email || `${formData.username}@yayasan-nusantara.sch.id`,
        username: formData.username,
        password: formData.password,
        role: formData.role,
        educationLevel: formData.educationLevel,
        className: formData.className,
        status: formData.status,
        avatarUrl: formData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
      };
      if (onAddUser) onAddUser(newUser);
      setShowAddModal(false);
    }
  };

  const handleResetPassword = (u: UserProfile) => {
    const newPass = `pass${Math.floor(1000 + Math.random() * 9000)}`;
    if (confirm(`Reset password untuk ${u.name}? Password baru: ${newPass}`)) {
      const updated: UserProfile = { ...u, password: newPass };
      if (onUpdateUser) onUpdateUser(updated);
    }
  };

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
            Manajemen Pengguna, Peran & Hak Akses (Role-Based Access Control)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isSuperadmin
              ? 'Akses Penuh Superadmin: Buat & kelola akun, username, password, matriks izin, serta blokir unit sekolah.'
              : isAdminOrSuper
              ? 'Akses Hak Penuh Admin: Anda memiliki wewenang penuh untuk membuat, menambah, dan mengubah username & password seluruh pengguna.'
              : 'Tampilan Peran Operasional Admin'}
          </p>
        </div>

        {isAdminOrSuper && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Tambah Pengguna Baru
          </button>
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

      {/* Users Selector & Credentials Management Grid */}
      <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" /> Kelola Username, Password & Akun Terdaftar ({visibleUsers.length} Akun)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Admin & Superadmin memiliki hak penuh membuat, mengubah username, dan mereset password pengguna.
            </p>
          </div>
          {isAdminOrSuper && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition self-start sm:self-auto"
            >
              <UserPlus className="w-3.5 h-3.5" /> + Tambah Pengguna
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleUsers.map(u => {
            const rBadge = roleBadges[u.role] || { label: u.role, icon: User, style: 'bg-slate-800 text-slate-300' };
            const Icon = rBadge.icon;
            const isSelected = currentUser?.id === u.id;
            const userStatus = u.status || 'Aktif';
            const isUserBlocked = userStatus === 'Diblokir' || userStatus === 'Nonaktif';
            const showPass = !!showPasswords[u.id];

            return (
              <div
                key={u.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800/90'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      onClick={() => onSelectUser && onSelectUser(u)}
                      className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1"
                      title="Klik untuk beralih simulasi login"
                    >
                      <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/50 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-white text-xs truncate">{u.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{u.email}</div>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded shrink-0 ${
                      isUserBlocked
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {userStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <div className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 ${rBadge.style}`}>
                      <Icon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{rBadge.label}</span>
                    </div>

                    {u.educationLevel && (
                      <span className="text-[9px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        Unit {u.educationLevel}
                      </span>
                    )}
                  </div>

                  {/* USERNAME & PASSWORD BOX FOR ADMIN / SUPERADMIN */}
                  {isAdminOrSuper && (
                    <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-700/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1 font-semibold">
                          <User className="w-3 h-3 text-amber-400" /> Username:
                        </span>
                        <span className="font-bold text-amber-300 font-mono">{u.username || '-'}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1 font-semibold">
                          <Lock className="w-3 h-3 text-emerald-400" /> Password:
                        </span>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="font-bold text-emerald-300">
                            {showPass ? (u.password || '******') : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleShowPassword(u.id)}
                            className="p-0.5 text-slate-400 hover:text-slate-200"
                            title="Tampilkan / Sembunyikan Password"
                          >
                            {showPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ADMIN & SUPERADMIN ACTION BUTTONS */}
                {isAdminOrSuper && (
                  <div className="pt-2 border-t border-slate-700/60 flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(u)}
                      className="flex-1 py-1.5 px-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition"
                    >
                      <Edit className="w-3 h-3" /> Edit Credential
                    </button>

                    <button
                      onClick={() => handleResetPassword(u)}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition"
                      title="Reset Password Pengguna"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset
                    </button>

                    {isAdminOrSuper && u.role !== 'superadmin' && onDeleteUser && (
                      <button
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin MENGHAPUS akun pengguna "${u.name}" (${u.email})?`)) {
                            onDeleteUser(u.id);
                          }
                        }}
                        className="p-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-[10px] font-bold flex items-center justify-center transition"
                        title="Hapus Akun Pengguna"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
                  
                  {/* Superadmin Column */}
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

      {/* MODAL FOR ADD / EDIT USER BY ADMIN & SUPERADMIN */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
            
            <div className="p-5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {editingUser ? 'Edit Credential & Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Otoritas Penuh Admin & Superadmin dalam mengelola Username & Password
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                }}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserForm} className="p-5 space-y-4 overflow-y-auto flex-1">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nama Lengkap Pengguna</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:border-blue-500 focus:outline-none"
                  placeholder="Contoh: Dra. Tri Astuti, M.Pd."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">Username Login</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-amber-500/50 rounded-xl text-xs text-amber-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
                    placeholder="username..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1">Password Login</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                    placeholder="password..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Alamat Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                  placeholder="email@domain.sch.id"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Peran / Hak Akses (Role)</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:border-blue-500 focus:outline-none"
                  >
                    <option value="admin">Admin Operasional</option>
                    <option value="teacher">Guru / Pendidik</option>
                    <option value="student">Siswa / Murid</option>
                    <option value="parent">Orang Tua / Wali</option>
                    {isSuperadmin && <option value="superadmin">Superadmin Yayasan</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Jenjang Pendidikan</label>
                  <select
                    value={formData.educationLevel}
                    onChange={e => setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:border-blue-500 focus:outline-none"
                  >
                    <option value="KB-TK">KB-TK</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status Akun</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                    <option value="Diblokir">Diblokir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Kelas / Ruang (Opsional)</label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={e => setFormData({ ...formData, className: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Contoh: XII IPA 1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL Foto Profil / Avatar</label>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 focus:border-blue-500 focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition"
                >
                  <Save className="w-4 h-4" /> Simpan Akun Pengguna
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
