import React, { useState } from 'react';
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Building2,
  User,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  DoorOpen
} from 'lucide-react';
import { Student, UserProfile, SchoolSettings, EducationLevel, RombelConfig } from '../types';

interface RombelManagementProps {
  students: Student[];
  currentUser: UserProfile;
  settings: SchoolSettings;
  activeLevel: EducationLevel | 'Semua';
  onUpdateSettings: (updated: Partial<SchoolSettings>) => Promise<void>;
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudent: (student: Student) => void;
}

export const RombelManagement: React.FC<RombelManagementProps> = ({
  students,
  currentUser,
  settings,
  activeLevel,
  onUpdateSettings,
  onAddStudent,
  onUpdateStudent
}) => {
  const isAdminOrSuper = currentUser.role === 'superadmin' || currentUser.role === 'admin';

  const [selectedLevelFilter, setSelectedLevelFilter] = useState<EducationLevel | 'Semua'>(activeLevel);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Rombels from settings or fallback to default initial rombels
  const currentRombels: RombelConfig[] = settings.customRombels || [
    { id: 'rmb-sd-1', name: 'Kelas 1', educationLevel: 'SD', homeroomTeacher: 'Pak Ahmad, S.Pd', roomName: 'Gedung SD - R.101', capacity: 30 },
    { id: 'rmb-sd-2', name: 'Kelas 2', educationLevel: 'SD', homeroomTeacher: 'Ibu Ratna, S.Pd', roomName: 'Gedung SD - R.102', capacity: 30 },
    { id: 'rmb-sd-3', name: 'Kelas 3', educationLevel: 'SD', homeroomTeacher: 'Pak Budi, S.Pd', roomName: 'Gedung SD - R.103', capacity: 30 },
    { id: 'rmb-sd-4', name: 'Kelas 4', educationLevel: 'SD', homeroomTeacher: 'Ibu Yuni, S.Pd', roomName: 'Gedung SD - R.201', capacity: 30 },
    { id: 'rmb-sd-5', name: 'Kelas 5', educationLevel: 'SD', homeroomTeacher: 'Pak Hendra, S.Pd', roomName: 'Gedung SD - R.202', capacity: 30 },
    { id: 'rmb-sd-6', name: 'Kelas 6', educationLevel: 'SD', homeroomTeacher: 'Ibu Siti, S.Pd', roomName: 'Gedung SD - R.203', capacity: 30 }
  ];

  // Modal States
  const [showRombelModal, setShowRombelModal] = useState<boolean>(false);
  const [editingRombel, setEditingRombel] = useState<RombelConfig | null>(null);
  
  const [rombelForm, setRombelForm] = useState<{
    name: string;
    educationLevel: EducationLevel;
    homeroomTeacher: string;
    roomName: string;
    capacity: number;
    notes: string;
  }>({
    name: '',
    educationLevel: selectedLevelFilter === 'Semua' ? 'SD' : selectedLevelFilter,
    homeroomTeacher: '',
    roomName: '',
    capacity: 30,
    notes: ''
  });

  // Selected class for viewing details / students roster
  const [selectedRombelForStudents, setSelectedRombelForStudents] = useState<RombelConfig | null>(null);

  // Quick Add Student Modal
  const [showQuickAddStudent, setShowQuickAddStudent] = useState<boolean>(false);
  const [targetRombelForStudent, setTargetRombelForStudent] = useState<RombelConfig | null>(null);
  const [studentForm, setStudentForm] = useState({
    name: '',
    nisn: '',
    gender: 'L' as 'L' | 'P',
    parentName: '',
    parentPhone: '081234567890',
    address: 'Jl. Sekolah No. 1'
  });

  // Filter rombels by level & search query
  const filteredRombels = currentRombels.filter(r => {
    const matchesLevel = selectedLevelFilter === 'Semua' || r.educationLevel === selectedLevelFilter;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.homeroomTeacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.roomName && r.roomName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  const handleOpenAddModal = (defaultLvl?: EducationLevel) => {
    setEditingRombel(null);
    setRombelForm({
      name: '',
      educationLevel: defaultLvl || (selectedLevelFilter === 'Semua' ? 'SD' : selectedLevelFilter),
      homeroomTeacher: '',
      roomName: '',
      capacity: 30,
      notes: ''
    });
    setShowRombelModal(true);
  };

  const handleOpenEditModal = (r: RombelConfig) => {
    setEditingRombel(r);
    setRombelForm({
      name: r.name,
      educationLevel: r.educationLevel,
      homeroomTeacher: r.homeroomTeacher || '',
      roomName: r.roomName || '',
      capacity: r.capacity || 30,
      notes: r.notes || ''
    });
    setShowRombelModal(true);
  };

  const handleSaveRombel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rombelForm.name.trim()) {
      alert('Nama Rombel / Kelas wajib diisi!');
      return;
    }

    let updatedRombels: RombelConfig[];
    if (editingRombel) {
      updatedRombels = currentRombels.map(r =>
        r.id === editingRombel.id
          ? {
              ...r,
              name: rombelForm.name.trim(),
              educationLevel: rombelForm.educationLevel,
              homeroomTeacher: rombelForm.homeroomTeacher.trim(),
              roomName: rombelForm.roomName.trim(),
              capacity: Number(rombelForm.capacity) || 30,
              notes: rombelForm.notes.trim()
            }
          : r
      );
    } else {
      const newRombel: RombelConfig = {
        id: `rmb-${Date.now()}`,
        name: rombelForm.name.trim(),
        educationLevel: rombelForm.educationLevel,
        homeroomTeacher: rombelForm.homeroomTeacher.trim() || 'Belum Ditentukan',
        roomName: rombelForm.roomName.trim() || 'Ruang Klasik',
        capacity: Number(rombelForm.capacity) || 30,
        notes: rombelForm.notes.trim()
      };
      updatedRombels = [...currentRombels, newRombel];
    }

    await onUpdateSettings({ customRombels: updatedRombels });
    setShowRombelModal(false);
  };

  const handleDeleteRombel = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin MENGHAPUS Rombel "${name}"? Data siswa di dalamnya tidak akan terhapus namun kelasnya akan kosong.`)) {
      const updatedRombels = currentRombels.filter(r => r.id !== id);
      await onUpdateSettings({ customRombels: updatedRombels });
    }
  };

  const handleQuickAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRombelForStudent || !studentForm.name.trim()) return;

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      nisn: studentForm.nisn.trim() || `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      name: studentForm.name.trim(),
      gender: studentForm.gender,
      className: targetRombelForStudent.name,
      educationLevel: targetRombelForStudent.educationLevel,
      parentName: studentForm.parentName.trim() || `Orang Tua ${studentForm.name}`,
      parentEmail: `ortu.${Date.now()}@gmail.com`,
      parentPhone: studentForm.parentPhone,
      address: studentForm.address,
      birthDate: '2015-01-01',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      status: 'Aktif'
    };

    onAddStudent(newStudent);
    setShowQuickAddStudent(false);
    setStudentForm({ name: '', nisn: '', gender: 'L', parentName: '', parentPhone: '081234567890', address: 'Jl. Sekolah No. 1' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 rounded-2xl border border-indigo-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Sistem Rombongan Belajar (Rombel) Custom</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Manajemen Rombel & Kelas Sekolah
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Kelola nama kelas custom sesuai jenjang (misal SD: Kelas 1 s.d Kelas 6), alokasi wali kelas, ruang kelas, dan direktori daftar siswa per rombel.
          </p>
        </div>

        {isAdminOrSuper && (
          <button
            onClick={() => handleOpenAddModal()}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition shrink-0"
            id="btn-add-custom-rombel"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Rombel Baru</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Level Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(['Semua', 'KB-TK', 'SD', 'SMP', 'SMA'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevelFilter(lvl)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                selectedLevelFilter === lvl
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <span>{lvl === 'Semua' ? 'Semua Jenjang' : lvl}</span>
              <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.5 rounded-full font-mono">
                {lvl === 'Semua' ? currentRombels.length : currentRombels.filter(r => r.educationLevel === lvl).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kelas, wali kelas, atau ruang..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Rombels Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRombels.length > 0 ? (
          filteredRombels.map(rombel => {
            const classStudents = students.filter(
              s => s.educationLevel === rombel.educationLevel && (s.className === rombel.name || s.className.toLowerCase().includes(rombel.name.toLowerCase()))
            );
            const capacity = rombel.capacity || 30;
            const percentage = Math.min(Math.round((classStudents.length / capacity) * 100), 100);

            return (
              <div
                key={rombel.id}
                className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition shadow-lg space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Card Header Badge & Title */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                        {rombel.educationLevel}
                      </span>
                      {rombel.roomName && (
                        <span className="text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                          <DoorOpen className="w-3 h-3 text-amber-400" /> {rombel.roomName}
                        </span>
                      )}
                    </div>

                    {isAdminOrSuper && (
                      <div className="flex items-center gap-1 opacity-95">
                        <button
                          onClick={() => handleOpenEditModal(rombel)}
                          className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition"
                          title="Edit Rombel"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRombel(rombel.id, rombel.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                          title="Hapus Rombel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Class Name */}
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition">
                      {rombel.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {classStudents.length} / {capacity} Siswa
                    </span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          percentage >= 90 ? 'bg-rose-500' : percentage >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Homeroom Teacher */}
                  <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Wali Kelas:</span>
                      <strong className="text-white truncate block">{rombel.homeroomTeacher || 'Belum Ditentukan'}</strong>
                    </div>
                  </div>

                  {/* Roster Preview */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Anggota Siswa Terdaftar:
                    </span>
                    {classStudents.length > 0 ? (
                      <div className="space-y-1 max-h-28 overflow-y-auto custom-scrollbar pr-1">
                        {classStudents.map(st => (
                          <div key={st.id} className="p-1.5 bg-slate-950/50 rounded-lg border border-slate-800 text-[11px] flex items-center justify-between text-slate-200">
                            <span className="font-medium truncate max-w-[150px]">{st.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">NISN: {st.nisn}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic p-2 bg-slate-950/40 rounded-lg border border-slate-800/60 text-center">
                        Belum ada siswa di kelas ini.
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedRombelForStudents(rombel)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" /> Lihat Roster Rinci
                  </button>

                  {isAdminOrSuper && (
                    <button
                      onClick={() => {
                        setTargetRombelForStudent(rombel);
                        setShowQuickAddStudent(true);
                      }}
                      className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                    >
                      <UserPlus className="w-3 h-3" /> + Siswa Baru
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-12 bg-slate-900/60 rounded-2xl border border-slate-800 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-300">Belum Ada Rombel / Kelas Ditemukan</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Tidak ada data Rombel untuk filter ini. Silakan klik tombol "+ Tambah Rombel Baru" di atas untuk menambahkan nama kelas custom Anda.
            </p>
          </div>
        )}
      </div>

      {/* Modal: Tambah / Edit Rombel Custom */}
      {showRombelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                {editingRombel ? 'Edit Informasi Rombel' : 'Tambah Rombel Custom Baru'}
              </h3>
              <button
                onClick={() => setShowRombelModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRombel} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  Jenjang Pendidikan <span className="text-rose-400">*</span>
                </label>
                <select
                  value={rombelForm.educationLevel}
                  onChange={e => setRombelForm({ ...rombelForm, educationLevel: e.target.value as EducationLevel })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="KB-TK">KB-TK</option>
                  <option value="SD">SD (Sekolah Dasar)</option>
                  <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                  <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  Nama Kelas / Rombel <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kelas 1, Kelas 2, TK A, Kelas VII"
                  value={rombelForm.name}
                  onChange={e => setRombelForm({ ...rombelForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
                <p className="text-[10px] text-slate-500">
                  Isi sesuai penamaan kelas di sekolah Anda (misal untuk SD cukup "Kelas 1", "Kelas 2", "Kelas 3" dst).
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  Nama Wali Kelas
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pak Ahmad, S.Pd / Ibu Ratna, S.Pd"
                  value={rombelForm.homeroomTeacher}
                  onChange={e => setRombelForm({ ...rombelForm, homeroomTeacher: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Ruang / Gedung
                  </label>
                  <input
                    type="text"
                    placeholder="Ruang 101"
                    value={rombelForm.roomName}
                    onChange={e => setRombelForm({ ...rombelForm, roomName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Kapasitas Maksimal
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={rombelForm.capacity}
                    onChange={e => setRombelForm({ ...rombelForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRombelModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
                >
                  {editingRombel ? 'Simpan Perubahan' : 'Buat Rombel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Add Student to Class */}
      {showQuickAddStudent && targetRombelForStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  Tambah Siswa Baru ke {targetRombelForStudent.name}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Jenjang {targetRombelForStudent.educationLevel} • Wali Kelas: {targetRombelForStudent.homeroomTeacher}
                </p>
              </div>
              <button
                onClick={() => setShowQuickAddStudent(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickAddStudentSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  Nama Lengkap Siswa <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama Lengkap..."
                  value={studentForm.name}
                  onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    NISN / Nomor Induk
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 0081234567"
                    value={studentForm.nisn}
                    onChange={e => setStudentForm({ ...studentForm, nisn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Jenis Kelamin
                  </label>
                  <select
                    value={studentForm.gender}
                    onChange={e => setStudentForm({ ...studentForm, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  Nama Orang Tua / Wali
                </label>
                <input
                  type="text"
                  placeholder="Nama Ayah/Ibu..."
                  value={studentForm.parentName}
                  onChange={e => setStudentForm({ ...studentForm, parentName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAddStudent(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
                >
                  Simpan Siswa Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Full Roster Detail View for a Selected Rombel */}
      {selectedRombelForStudents && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4 animate-fade-in max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                  Roster Siswa Rombel: {selectedRombelForStudents.name} ({selectedRombelForStudents.educationLevel})
                </h3>
                <p className="text-xs text-slate-400">
                  Wali Kelas: <strong className="text-slate-200">{selectedRombelForStudents.homeroomTeacher || 'Belum Ditentukan'}</strong> • Ruang: {selectedRombelForStudents.roomName || '-'}
                </p>
              </div>
              <button
                onClick={() => setSelectedRombelForStudents(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {students
                .filter(s => s.educationLevel === selectedRombelForStudents.educationLevel && (s.className === selectedRombelForStudents.name || s.className.toLowerCase().includes(selectedRombelForStudents.name.toLowerCase())))
                .map((st, idx) => (
                  <div key={st.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-white text-xs flex items-center gap-2">
                          <span>{st.name}</span>
                          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{st.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">NISN: {st.nisn} • Wali: {st.parentName} ({st.parentPhone})</p>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {st.status}
                    </span>
                  </div>
                ))}

              {students.filter(s => s.educationLevel === selectedRombelForStudents.educationLevel && (s.className === selectedRombelForStudents.name || s.className.toLowerCase().includes(selectedRombelForStudents.name.toLowerCase()))).length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500 italic">
                  Belum ada siswa yang terdaftar di kelas ini.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400 font-mono">
                Total Siswa: {students.filter(s => s.educationLevel === selectedRombelForStudents.educationLevel && (s.className === selectedRombelForStudents.name || s.className.toLowerCase().includes(selectedRombelForStudents.name.toLowerCase()))).length} Siswa
              </span>
              <button
                onClick={() => setSelectedRombelForStudents(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
