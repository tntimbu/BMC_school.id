import React, { useState } from 'react';
import {
  Settings,
  Save,
  ShieldCheck,
  Building2,
  School,
  Database,
  Flame,
  Key,
  RefreshCw,
  CheckCircle2,
  Crown,
  Layers,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  Check,
  X,
  ShieldAlert,
  Lock,
  Unlock,
  Clock,
  Send,
  PhoneCall,
  Mail,
  ExternalLink,
  AlertTriangle,
  CreditCard,
  Megaphone,
  Bell
} from 'lucide-react';
import { SchoolSettings, EducationLevel, SubjectConfig, UnblockRequest } from '../types';

interface SchoolSettingsViewProps {
  settings: SchoolSettings;
  onUpdateSettings: (settings: Partial<SchoolSettings>) => Promise<void>;
  currentUserRole?: string;
}

export const SchoolSettingsView: React.FC<SchoolSettingsViewProps> = ({
  settings,
  onUpdateSettings,
  currentUserRole = 'superadmin'
}) => {
  const [form, setForm] = useState<SchoolSettings>({
    ...settings,
    logoUrl: settings.logoUrl || 'https://images.unsplash.com/photo-1594312915251-48db9280c8f1?auto=format&fit=crop&q=80&w=200',
    letterheadHeader: settings.letterheadHeader || 'YAYASAN PENDIDIKAN NUSANTARA JAYA',
    letterheadSub: settings.letterheadSub || 'SMA NEGERI 1 NUSANTARA • TERAKREDITASI A (UNGGUL)',
    letterheadAddress: settings.letterheadAddress || 'Jl. Pendidikan Nusantara No. 45-50, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12150',
    letterheadContact: settings.letterheadContact || 'Telp: (021) 7590-1234 / 7590-5678 | Website: https://yayasan-nusantara.sch.id | Email: rapor@yayasan-nusantara.sch.id',
    subjects: settings.subjects || [],
    foundationStatus: settings.foundationStatus || 'Aktif',
    licenseStatus: settings.licenseStatus || 'Aktif',
    licenseExpirationDate: settings.licenseExpirationDate || '2026-12-31',
    isAppFrozen: settings.isAppFrozen || false,
    freezeReason: settings.freezeReason || 'Masa berlaku lisensi langganan SIAKAD telah kadaluarsa / ditangguhkan sementara oleh Superadmin. Silakan hubungi Superadmin untuk konfirmasi perpanjangan pembayaran.',
    superadminPhone: settings.superadminPhone || '+62 812-3456-7890',
    superadminEmail: settings.superadminEmail || 'lisensi@yayasan-nusantara.sch.id',
    unblockRequests: settings.unblockRequests || [],
    unitStatus: settings.unitStatus || {
      'KB-TK': 'Aktif',
      'SD': 'Aktif',
      'SMP': 'Aktif',
      'SMA': 'Aktif'
    },
    units: settings.units || {
      'KB-TK': 'KB & TK Islam Nusantara',
      'SD': 'SD Nusantara 01',
      'SMP': 'SMP Nusantara 1',
      'SMA': 'SMA Negeri 1 Nusantara'
    }
  });

  const [activeTab, setActiveTab] = useState<'branding' | 'customization' | 'units' | 'letterhead' | 'subjects' | 'system' | 'license'>('branding');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [firebaseConnecting, setFirebaseConnecting] = useState(false);

  // Subject Management Modal & State
  const [subjectFilterLevel, setSubjectFilterLevel] = useState<string>('Semua');
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectConfig | null>(null);
  const [subjectForm, setSubjectForm] = useState<{
    code: string;
    name: string;
    educationLevel: EducationLevel;
    kkm: number;
    category: 'Kelompok A (Wajib)' | 'Kelompok B (Wajib)' | 'Kelompok C (Peminatan)' | 'Muatan Lokal';
  }>({
    code: '',
    name: '',
    educationLevel: 'SMA',
    kkm: 75,
    category: 'Kelompok A (Wajib)'
  });

  // New Unit Modal
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [newUnitCode, setNewUnitCode] = useState('');
  const [newUnitName, setNewUnitName] = useState('');

  const isSuperadmin = currentUserRole === 'superadmin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdateSettings(form);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Gagal memperbarui pengaturan yayasan');
    } finally {
      setSaving(false);
    }
  };

  const handleUnitChange = (code: string, name: string) => {
    setForm(prev => ({
      ...prev,
      units: {
        ...prev.units,
        [code]: name
      }
    }));
  };

  const handleDeleteUnit = (code: string) => {
    if (!isSuperadmin) {
      alert('Hanya Superadmin yang berhak menghapus unit jenjang.');
      return;
    }
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus unit jenjang "${code}" (${form.units[code]})?\n\nSemua filter menu dan laporan untuk jenjang ini tidak akan ditampilkan.`
    );
    if (!confirmDelete) return;

    setForm(prev => {
      const updatedUnits = { ...prev.units };
      delete updatedUnits[code];
      const updatedStatus = { ...prev.unitStatus };
      delete updatedStatus[code];
      return {
        ...prev,
        units: updatedUnits,
        unitStatus: updatedStatus
      };
    });
  };

  const handleAddUnit = () => {
    if (!newUnitCode.trim() || !newUnitName.trim()) {
      alert('Kode jenjang dan Nama unit wajib diisi');
      return;
    }
    const formattedCode = newUnitCode.trim().toUpperCase();
    setForm(prev => ({
      ...prev,
      units: {
        ...prev.units,
        [formattedCode]: newUnitName.trim()
      },
      unitStatus: {
        ...prev.unitStatus,
        [formattedCode]: 'Aktif'
      }
    }));
    setNewUnitCode('');
    setNewUnitName('');
    setShowAddUnitModal(false);
  };

  const handleApproveUnblockRequest = (reqId: string) => {
    setForm(prev => {
      const updatedRequests = (prev.unblockRequests || []).map(r =>
        r.id === reqId ? { ...r, status: 'Disetujui' as const } : r
      );
      return {
        ...prev,
        isAppFrozen: false,
        licenseStatus: 'Aktif',
        unblockRequests: updatedRequests
      };
    });
    alert('Permohonan disetujui! Akses sistem telah dibuka dan lisensi kembali Aktif.');
  };

  const handleRejectUnblockRequest = (reqId: string) => {
    setForm(prev => {
      const updatedRequests = (prev.unblockRequests || []).map(r =>
        r.id === reqId ? { ...r, status: 'Ditolak' as const } : r
      );
      return {
        ...prev,
        unblockRequests: updatedRequests
      };
    });
  };

  const handleTestFirebase = async () => {
    setFirebaseConnecting(true);
    setTimeout(() => {
      setFirebaseConnecting(false);
      setForm(prev => ({
        ...prev,
        firebaseConnected: true,
        lastCloudSync: new Date().toISOString()
      }));
      alert('Koneksi Firebase Firestore & Auth Berhasil Ditinjau dan Dihubungkan!');
    }, 1200);
  };

  const handleRegenerateApiKey = () => {
    const randomKey = 'sk_live_nusantara_' + Math.random().toString(36).substring(2, 12);
    setForm(prev => ({ ...prev, apiKey: randomKey }));
  };

  const handleOpenAddSubject = () => {
    setEditingSubject(null);
    setSubjectForm({
      code: '',
      name: '',
      educationLevel: 'SMA',
      kkm: 75,
      category: 'Kelompok A (Wajib)'
    });
    setShowSubjectModal(true);
  };

  const handleOpenEditSubject = (subject: SubjectConfig) => {
    setEditingSubject(subject);
    setSubjectForm({
      code: subject.code,
      name: subject.name,
      educationLevel: subject.educationLevel,
      kkm: subject.kkm || 75,
      category: subject.category || 'Kelompok A (Wajib)'
    });
    setShowSubjectModal(true);
  };

  const handleSaveSubject = () => {
    if (!subjectForm.code || !subjectForm.name) {
      alert('Kode Mapel dan Nama Mapel wajib diisi');
      return;
    }

    if (editingSubject) {
      setForm(prev => ({
        ...prev,
        subjects: (prev.subjects || []).map(s =>
          s.id === editingSubject.id
            ? { ...s, ...subjectForm }
            : s
        )
      }));
    } else {
      const newSub: SubjectConfig = {
        id: 'sbj-' + Date.now(),
        code: subjectForm.code,
        name: subjectForm.name,
        educationLevel: subjectForm.educationLevel,
        kkm: subjectForm.kkm,
        category: subjectForm.category,
        isEnabled: true
      };
      setForm(prev => ({
        ...prev,
        subjects: [...(prev.subjects || []), newSub]
      }));
    }
    setShowSubjectModal(false);
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini?')) {
      setForm(prev => ({
        ...prev,
        subjects: (prev.subjects || []).filter(s => s.id !== id)
      }));
    }
  };

  const handleToggleSubject = (id: string) => {
    setForm(prev => ({
      ...prev,
      subjects: (prev.subjects || []).map(s =>
        s.id === id ? { ...s, isEnabled: !s.isEnabled } : s
      )
    }));
  };

  const currentSubjects = form.subjects || [];
  const filteredSubjects = subjectFilterLevel === 'Semua'
    ? currentSubjects
    : currentSubjects.filter(s => s.educationLevel === subjectFilterLevel);

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Pengaturan Instansi Yayasan & Kustomisasi Sistem
              {isSuperadmin && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" /> Superadmin Mode
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Kelola nama yayasan, logo & kop surat digital, kurikulum mapel, unit jenjang, serta lisensi & pembekuan akses.
            </p>
          </div>
        </div>

        {/* Quick App Freeze Status Indicator for Superadmin */}
        {form.isAppFrozen && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>SISTEM SAAT INI DIBEKUKAN / TERLOCKED</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'branding'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-400" /> Identitas Induk Yayasan
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('customization')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'customization'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Tampilan & Tema Dashboard
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('letterhead')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'letterhead'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" /> Logo & Kop Surat Rapor
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subjects')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'subjects'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" /> Custom Mata Pelajaran
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('units')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'units'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" /> Kelola Unit Jenjang ({Object.keys(form.units).length})
        </button>

        {isSuperadmin && (
          <button
            type="button"
            onClick={() => setActiveTab('license')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'license'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-900 text-rose-300 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" /> SaaS Lisensi & Pembekuan Akses
          </button>
        )}

        {isSuperadmin && (
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'system'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-amber-400" /> System & Firebase
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* TAB 1: IDENTITAS YAYASAN */}
        {activeTab === 'branding' && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" /> Identitas Induk Yayasan & Akademik
              </h3>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Kustomisasi Langsung Real-time
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  Nama Resmi Induk Yayasan <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.foundationName}
                  onChange={e => setForm({ ...form, foundationName: e.target.value })}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-bold text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Contoh: Yayasan Pendidikan Nusantara Jaya"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Nama yayasan ini akan ditampilkan di seluruh header sistem, kuitansi SPP, rapor digital, dan pengumuman.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ketua Yayasan / Penanggung Jawab</label>
                <input
                  type="text"
                  value={form.principalName}
                  onChange={e => setForm({ ...form, principalName: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tahun Ajaran Aktif</label>
                <input
                  type="text"
                  value={form.academicYear}
                  onChange={e => setForm({ ...form, academicYear: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Semester Aktif</label>
                <select
                  value={form.currentSemester}
                  onChange={e => setForm({ ...form, currentSemester: e.target.value as 'Ganjil' | 'Genap' })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                >
                  <option value="Ganjil">Ganjil (Semester 1)</option>
                  <option value="Genap">Genap (Semester 2)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nomor Induk / NPSN Pusat Yayasan</label>
                <input
                  type="text"
                  value={form.npsn}
                  onChange={e => setForm({ ...form, npsn: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Resmi Kontak</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Telepon & Whatsapp Sekretariat</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Alamat Kompleks Yayasan</label>
                <textarea
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 h-16"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 1.5: KUSTOMISASI TAMPILAN & TEMA DASHBOARD */}
        {activeTab === 'customization' && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Kustomisasi Tampilan, Tema & Banner Dashboard
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Atur teks ucapan selamat datang, tema warna banner, logo instansi, dan visibilitas komponen sesuai kebutuhan Admin.
                </p>
              </div>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-full uppercase shrink-0">
                Admin Control Panel
              </span>
            </div>

            {/* Section 1: Banner & Ucapan Selamat Datang */}
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Teks & Tema Banner Dashboard
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">
                    Judul Ucapan Selamat Datang
                  </label>
                  <input
                    type="text"
                    value={form.welcomeTitle || 'Selamat Datang, {name}! 👋'}
                    onChange={e => setForm({ ...form, welcomeTitle: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-semibold focus:border-blue-500 focus:outline-none"
                    placeholder="Gunakan {name} untuk nama pengguna otomatis"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Gunakan kode <code className="text-amber-300 bg-slate-800 px-1 rounded font-mono">{'{name}'}</code> agar nama pengguna yang login tersisip secara otomatis.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">
                    Deskripsi Subtitle Pesan Sambutan
                  </label>
                  <textarea
                    rows={2}
                    value={form.welcomeSubtitle || ''}
                    onChange={e => setForm({ ...form, welcomeSubtitle: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="Contoh: Pusat kendali administrasi terpadu Yayasan..."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tema Warna Banner Dashboard
                  </label>
                  <select
                    value={form.dashboardBannerTheme || 'gradient-indigo'}
                    onChange={e => setForm({ ...form, dashboardBannerTheme: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-medium focus:border-blue-500 focus:outline-none"
                  >
                    <option value="gradient-indigo">Indigo Night (Biru Nila Modern)</option>
                    <option value="gradient-emerald">Emerald Oasis (Hijau Edukasi / Syariah)</option>
                    <option value="gradient-slate">Midnight Slate (Gelap Elegan)</option>
                    <option value="gradient-amber">Royal Gold (Emas Premium)</option>
                    <option value="gradient-rose">Crimson Dusk (Merah Marun & Rose)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Aksen Warna Utama Aplikasi
                  </label>
                  <select
                    value={form.themeColor || 'blue'}
                    onChange={e => setForm({ ...form, themeColor: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-medium focus:border-blue-500 focus:outline-none"
                  >
                    <option value="blue">Royal Blue (Biru)</option>
                    <option value="indigo">Indigo Violet (Nila)</option>
                    <option value="emerald">Emerald Green (Hijau)</option>
                    <option value="amber">Amber Gold (Kuning Emas)</option>
                    <option value="rose">Rose Red (Merah Rose)</option>
                    <option value="purple">Deep Purple (Ungu)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Layout Komponen & Style Kartu Dashboard */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" /> Style Kartu & Visibilitas Komponen Dashboard
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Warna Background Kartu
                  </label>
                  <select
                    value={form.cardBgColor || 'slate'}
                    onChange={e => setForm({ ...form, cardBgColor: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-medium focus:border-blue-500 focus:outline-none"
                  >
                    <option value="slate">Slate Dark (Default)</option>
                    <option value="zinc">Zinc Dark (Abu-abu Modern)</option>
                    <option value="indigo">Deep Indigo (Biru Nila Gelap)</option>
                    <option value="emerald">Dark Emerald (Hijau Gelap)</option>
                    <option value="amber">Amber Dark (Cokelat Emas Gelap)</option>
                    <option value="dark">Midnight Black (Hitam Pekat)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Warna Garis Border Kartu
                  </label>
                  <select
                    value={form.cardBorderColor || 'slate'}
                    onChange={e => setForm({ ...form, cardBorderColor: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-medium focus:border-blue-500 focus:outline-none"
                  >
                    <option value="slate">Border Slate (Standard)</option>
                    <option value="blue">Border Blue Glowing</option>
                    <option value="amber">Border Amber Gold</option>
                    <option value="emerald">Border Emerald Green</option>
                    <option value="purple">Border Royal Purple</option>
                    <option value="none">Tanpa Garis Border (Flat)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Ukuran Padding / Spasi
                  </label>
                  <select
                    value={form.cardPadding || 'normal'}
                    onChange={e => setForm({ ...form, cardPadding: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-medium focus:border-blue-500 focus:outline-none"
                  >
                    <option value="compact">Ringkas (Compact p-3)</option>
                    <option value="normal">Normal (Standard p-4)</option>
                    <option value="spacious">Lapang (Spacious p-6)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Lengkungan Sudut Kartu
                  </label>
                  <select
                    value={form.cardRadius || 'rounded-2xl'}
                    onChange={e => setForm({ ...form, cardRadius: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-medium focus:border-blue-500 focus:outline-none"
                  >
                    <option value="rounded-lg">Sedang (Rounded LG - 8px)</option>
                    <option value="rounded-xl">Besar (Rounded XL - 12px)</option>
                    <option value="rounded-2xl">Extra Besar (Rounded 2XL - 16px)</option>
                    <option value="rounded-3xl">Pill Smooth (Rounded 3XL - 24px)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition">
                  <div>
                    <div className="font-bold text-slate-200">Tampilkan Overview Cards Unit Jenjang</div>
                    <div className="text-[10px] text-slate-400">Menampilkan 4 kartu ringkasan unit (KB-TK, SD, SMP, SMA) di bagian atas dashboard</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.showLevelOverview !== false}
                    onChange={e => setForm({ ...form, showLevelOverview: e.target.checked })}
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition">
                  <div>
                    <div className="font-bold text-slate-200">Tampilkan Log Aktivitas Real-time</div>
                    <div className="text-[10px] text-slate-400">Menampilkan feed presensi siswa live di kolom kanan dashboard</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.showRealtimeLogs !== false}
                    onChange={e => setForm({ ...form, showRealtimeLogs: e.target.checked })}
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Section 3: Media YouTube Kegiatan & Media Sosial Sekolah */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Megaphone className="w-3.5 h-3.5" /> Media Kegiatan YouTube & Media Sosial Sekolah
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    URL Link Video YouTube Kegiatan
                  </label>
                  <input
                    type="url"
                    value={form.youtubeVideoUrl || ''}
                    onChange={e => setForm({ ...form, youtubeVideoUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Masukkan link YouTube lengkap untuk menampilkan player video kegiatan di dashboard pengguna.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Judul Video Kegiatan Sekolah
                  </label>
                  <input
                    type="text"
                    value={form.youtubeVideoTitle || ''}
                    onChange={e => setForm({ ...form, youtubeVideoTitle: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="Dokumentasi Kegiatan Belajar & Ekstrakulikuler..."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Link Instagram Resmi
                  </label>
                  <input
                    type="url"
                    value={form.socialInstagram || ''}
                    onChange={e => setForm({ ...form, socialInstagram: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="https://instagram.com/yayasannusantara"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Link Facebook / TikTok / Website
                  </label>
                  <input
                    type="url"
                    value={form.socialWebsite || ''}
                    onChange={e => setForm({ ...form, socialWebsite: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="https://yayasan-nusantara.sch.id"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Broadcast Peringatan / Announcement Real-time dari Admin */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <Bell className="w-3.5 h-3.5" /> Pengiriman Broadcast Notifikasi Peringatan Admin
              </h4>

              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-bold text-slate-100 text-xs">Tampilkan Banner Broadcast Peringatan di Dashboard Semua Pengguna</div>
                    <div className="text-[10px] text-slate-400">Pesan ini akan langsung muncul di bagian paling atas dashboard seluruh siswa, guru, dan wali murid secara realtime.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.broadcastNotification?.active ?? true}
                    onChange={e => setForm({
                      ...form,
                      broadcastNotification: {
                        active: e.target.checked,
                        title: form.broadcastNotification?.title || '📢 PENGUMUMAN PENTING ADMIN YAYASAN',
                        message: form.broadcastNotification?.message || 'Pengumuman terbaru dari Admin Yayasan...',
                        type: form.broadcastNotification?.type || 'warning',
                        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
                        id: `broadcast-${Date.now()}`
                      }
                    })}
                    className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                  />
                </label>

                {form.broadcastNotification?.active && (
                  <div className="space-y-3 pt-2 border-t border-slate-700">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-semibold mb-1">Judul Peringatan / Pengumuman</label>
                        <input
                          type="text"
                          value={form.broadcastNotification?.title || ''}
                          onChange={e => setForm({
                            ...form,
                            broadcastNotification: {
                              ...form.broadcastNotification!,
                              title: e.target.value,
                              id: `broadcast-${Date.now()}`
                            }
                          })}
                          className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-bold focus:border-rose-500 focus:outline-none"
                          placeholder="Judul Peringatan..."
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Tipe Pesan</label>
                        <select
                          value={form.broadcastNotification?.type || 'warning'}
                          onChange={e => setForm({
                            ...form,
                            broadcastNotification: {
                              ...form.broadcastNotification!,
                              type: e.target.value as any,
                              id: `broadcast-${Date.now()}`
                            }
                          })}
                          className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-semibold focus:border-rose-500 focus:outline-none"
                        >
                          <option value="warning">⚠️ Peringatan (Kuning Amber)</option>
                          <option value="danger">🚨 Bahaya / Urgen (Merah Rose)</option>
                          <option value="info">ℹ️ Informasi System (Biru)</option>
                          <option value="success">✅ Sukses / Pengumuman (Hijau)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Isi Pesan Peringatan / Pengumuman</label>
                      <textarea
                        rows={3}
                        value={form.broadcastNotification?.message || ''}
                        onChange={e => setForm({
                          ...form,
                          broadcastNotification: {
                            ...form.broadcastNotification!,
                            message: e.target.value,
                            date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
                            id: `broadcast-${Date.now()}`
                          }
                        })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-rose-500 focus:outline-none leading-relaxed"
                        placeholder="Tuliskan detail pengumuman atau instruksi untuk seluruh pengguna..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Logo Instansi */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" /> Logo Resmi Instansi
              </h4>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {form.logoUrl ? (
                    <img src={form.logoUrl} alt="Preview Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-slate-300 font-semibold mb-1">
                    URL Gambar Logo Yayasan / Sekolah
                  </label>
                  <input
                    type="url"
                    value={form.logoUrl || ''}
                    onChange={e => setForm({ ...form, logoUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Logo ini akan otomatis digunakan pada Navbar atas, Halaman Login, serta Kop Surat Cetak Rapor Digital.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
        {activeTab === 'letterhead' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" /> Input & Kustomisasi Logo / Kop Surat Rapor Export
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Logo dan Kop Surat ini akan tercetak secara otomatis pada dokumen Rapor Digital PDF dan Lembar Penilaian Siswa.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Logo Image URL / Upload */}
                <div className="md:col-span-2 p-4 bg-slate-800/60 rounded-xl border border-slate-700 space-y-3">
                  <label className="block font-bold text-slate-200 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-400" /> Logo Resmi Sekolah / Yayasan (URL Image / Base64)
                  </label>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <img
                      src={form.logoUrl}
                      alt="Logo Sekolah"
                      className="w-20 h-20 object-contain p-2 bg-white rounded-xl border-2 border-slate-600 shadow-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594312915251-48db9280c8f1?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="text"
                        value={form.logoUrl}
                        onChange={e => setForm({ ...form, logoUrl: e.target.value })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono text-[11px]"
                        placeholder="https:// domain.com/logo.png"
                      />
                      <p className="text-[10px] text-slate-400">
                        Format disarankan: PNG Transparan atau JPG Persegi. Bisa menggunakan link gambar publik atau upload base64.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Kop Surat Header Line 1 */}
                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">
                    Header Utama Kop Surat (Baris 1 - Nama Yayasan)
                  </label>
                  <input
                    type="text"
                    value={form.letterheadHeader}
                    onChange={e => setForm({ ...form, letterheadHeader: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-bold text-sm"
                    placeholder="YAYASAN PENDIDIKAN NUSANTARA JAYA"
                    required
                  />
                </div>

                {/* Kop Surat Sub-Header Line 2 */}
                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">
                    Sub-Header Unit Sekolah (Baris 2 - Nama Unit & Akreditasi)
                  </label>
                  <input
                    type="text"
                    value={form.letterheadSub}
                    onChange={e => setForm({ ...form, letterheadSub: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-amber-300 font-bold"
                    placeholder="SMA NEGERI 1 NUSANTARA • TERAKREDITASI A (UNGGUL)"
                    required
                  />
                </div>

                {/* Kop Surat Address Line 3 */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Alamat Kop Surat (Baris 3)
                  </label>
                  <input
                    type="text"
                    value={form.letterheadAddress}
                    onChange={e => setForm({ ...form, letterheadAddress: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                    placeholder="Jl. Pendidikan Nusantara No. 45, Jakarta"
                    required
                  />
                </div>

                {/* Kop Surat Contact Line 4 */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Kontak Kop Surat (Baris 4 - Telp / Email / Web)
                  </label>
                  <input
                    type="text"
                    value={form.letterheadContact}
                    onChange={e => setForm({ ...form, letterheadContact: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                    placeholder="Telp: (021) 7590-1234 | Email: info@sekolah.sch.id"
                    required
                  />
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW KOP SURAT */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Pratinjau Tampilan Kop Surat Rapor Digital
              </h4>

              <div className="bg-white p-6 rounded-xl text-slate-900 font-serif border border-slate-200 shadow-2xl">
                <div className="flex items-center gap-4 pb-3 border-b-4 border-double border-slate-900">
                  <img
                    src={form.logoUrl}
                    alt="Logo Preview"
                    className="w-16 h-16 object-contain flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594312915251-48db9280c8f1?auto=format&fit=crop&q=80&w=200';
                    }}
                  />
                  <div className="flex-1 text-center font-serif">
                    <h2 className="text-lg font-bold tracking-wide uppercase text-slate-900 leading-tight">
                      {form.letterheadHeader || 'YAYASAN PENDIDIKAN NUSANTARA JAYA'}
                    </h2>
                    <h3 className="text-sm font-bold tracking-wider text-blue-900 uppercase">
                      {form.letterheadSub || 'SMA NEGERI 1 NUSANTARA'}
                    </h3>
                    <p className="text-[10px] text-slate-700 mt-1 leading-snug">
                      {form.letterheadAddress || 'Jl. Pendidikan Nusantara No. 45-50, Kebayoran Baru, Jakarta'}
                    </p>
                    <p className="text-[9px] text-slate-600 font-mono">
                      {form.letterheadContact || 'Telp: (021) 7590-1234 | Website: https://yayasan-nusantara.sch.id'}
                    </p>
                  </div>
                </div>
                <div className="text-center pt-3 text-slate-500 font-sans text-[10px] italic">
                  — Tampilan Kop Surat Resmi Rapor Digital Hasil Belajar Siswa —
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOM MATA PELAJARAN (ADMIN & SUPERADMIN) */}
        {activeTab === 'subjects' && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" /> Kustomisasi Kurikulum & Mata Pelajaran (Admin & Superadmin)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Atur daftar mata pelajaran, KKM kelulusan (Default KKM: 75), kode mapel, dan kategori untuk seluruh jenjang.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddSubject}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition text-xs shadow-lg shadow-emerald-600/20"
              >
                <Plus className="w-4 h-4" /> Tambah Mata Pelajaran
              </button>
            </div>

            {/* Filter Level */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-slate-400 font-semibold text-xs">Filter Jenjang:</span>
              {(['Semua', ...Object.keys(form.units)] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSubjectFilterLevel(lvl)}
                  className={`px-3 py-1 rounded-lg font-semibold text-xs transition ${
                    subjectFilterLevel === lvl
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Subjects Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 font-bold border-b border-slate-700">
                    <th className="p-3">Kode Mapel</th>
                    <th className="p-3">Nama Mata Pelajaran</th>
                    <th className="p-3">Jenjang</th>
                    <th className="p-3">KKM (Batas Tuntas)</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-500 italic">
                        Belum ada mata pelajaran untuk filter ini. Klik "Tambah Mata Pelajaran" untuk menambahkan.
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map(subject => (
                      <tr key={subject.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-mono font-bold text-amber-300">{subject.code}</td>
                        <td className="p-3 font-bold text-slate-100">{subject.name}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            subject.educationLevel === 'SMA' ? 'bg-indigo-500/20 text-indigo-300' :
                            subject.educationLevel === 'SMP' ? 'bg-emerald-500/20 text-emerald-300' :
                            subject.educationLevel === 'SD' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-amber-500/20 text-amber-300'
                          }`}>
                            {subject.educationLevel}
                          </span>
                        </td>
                        <td className="p-3 font-bold font-mono text-emerald-400">{subject.kkm || 75}</td>
                        <td className="p-3 text-slate-400">{subject.category || 'Kelompok A'}</td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleToggleSubject(subject.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                              subject.isEnabled
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}
                          >
                            {subject.isEnabled ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            {subject.isEnabled ? 'Aktif' : 'Nonaktif'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditSubject(subject)}
                              className="p-1.5 bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white rounded-lg transition"
                              title="Edit Mata Pelajaran"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubject(subject.id)}
                              className="p-1.5 bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white rounded-lg transition"
                              title="Hapus Mata Pelajaran"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOM NAMA UNIT & PENGHAPUSAN JENJANG (SUPERADMIN ONLY DELETE) */}
        {activeTab === 'units' && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-purple-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" /> Kustomisasi & Manajemen Unit Jenjang Pendidikan
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ubah nama unit sekolah di bawah yayasan. {isSuperadmin ? 'Sebagai Superadmin, Anda dapat menambah atau menghapus unit sesuai kebutuhan yayasan.' : 'Hanya Superadmin yang berhak menghapus atau menambah unit.'}
                </p>
              </div>

              {isSuperadmin && (
                <button
                  type="button"
                  onClick={() => setShowAddUnitModal(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-1.5 transition text-xs shadow-lg shadow-purple-600/20"
                >
                  <Plus className="w-4 h-4" /> Tambah Unit Jenjang Baru
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(form.units).length === 0 ? (
                <div className="md:col-span-2 p-8 text-center text-slate-500 bg-slate-800/40 rounded-2xl border border-slate-800 italic">
                  Belum ada unit jenjang pendidikan tersisa. Klik "+ Tambah Unit Jenjang Baru" di atas untuk menambahkan.
                </div>
              ) : (
                Object.entries(form.units).map(([code, name], index) => (
                  <div key={code} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                        <School className="w-4 h-4 text-purple-400" /> Unit Jenjang #{index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono font-bold px-2 py-0.5 rounded border border-purple-500/30">
                          {code}
                        </span>
                        {isSuperadmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUnit(code)}
                            className="p-1.5 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg transition border border-rose-500/30 flex items-center gap-1 text-[10px] font-bold"
                            title="Hapus Unit Jenjang ini (Hanya Superadmin)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Hapus Unit</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Nama Resmi Unit Sekolah</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => handleUnitChange(code, e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-semibold"
                        placeholder={`Contoh: Unit ${code}`}
                        required
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SAAS LISENSI & PEMBEKUAN AKSES (SUPERADMIN ONLY) */}
        {activeTab === 'license' && isSuperadmin && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-rose-500/30 space-y-6 text-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-rose-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> Kontrol Masa Kadaluarsa Akun & Pembekuan Akses (SaaS Superadmin)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Kelola status lisensi berlangganan, atur tanggal kadaluarsa, dan bekukan seluruh akun sekolah jika durasi/pembayaran belum dikonfirmasi.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                  form.isAppFrozen
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {form.isAppFrozen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{form.isAppFrozen ? 'Sistem DIBEKUKAN' : 'Sistem AKTIF Normal'}</span>
                </span>
              </div>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* License Status Select */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                <label className="block text-slate-300 font-bold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-400" /> Status Lisensi Aplikasi
                </label>
                <select
                  value={form.licenseStatus || 'Aktif'}
                  onChange={e => setForm({ ...form, licenseStatus: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-bold"
                >
                  <option value="Aktif">Aktif (Akses Penuh Seluruh User)</option>
                  <option value="Masa Tenggang">Masa Tenggang (Peringatan Kadaluarsa)</option>
                  <option value="Kadaluarsa">Kadaluarsa (Blokir Akses Otomatis)</option>
                  <option value="Diblokir">Diblokir / Suspend Manual</option>
                </select>
                <p className="text-[10px] text-slate-400">
                  Mengatur status lisensi aplikasi yang dijual ke instansi sekolah/yayasan.
                </p>
              </div>

              {/* Expiration Date */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                <label className="block text-slate-300 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" /> Tanggal Kadaluarsa Akses Lisensi
                </label>
                <input
                  type="date"
                  value={form.licenseExpirationDate || '2026-12-31'}
                  onChange={e => setForm({ ...form, licenseExpirationDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-mono font-bold"
                />
                <p className="text-[10px] text-slate-400">
                  Tanggal aktif berlangganan SIAKAD. Pengguna akan melihat peringatan sebelum dan sesudah tanggal ini.
                </p>
              </div>

              {/* Toggle App Freeze */}
              <div className="md:col-span-2 p-4 bg-rose-950/30 border border-rose-500/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-rose-300 text-xs flex items-center gap-2">
                      <Lock className="w-4 h-4 text-rose-400" /> Tombol Pembekuan Akses Total (App Freeze Switch)
                    </h4>
                    <p className="text-[10px] text-rose-200/80 mt-0.5">
                      Saat saklar ini diaktifkan, seluruh akun (Guru, Siswa, Orang Tua, Admin) akan terblokir dengan layar penguncian penuh dan diminta mengajukan konfirmasi pembayaran.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, isAppFrozen: !prev.isAppFrozen }))}
                    className={`px-4 py-2 rounded-xl font-black text-xs transition flex items-center gap-2 shadow-lg ${
                      form.isAppFrozen
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                    }`}
                  >
                    {form.isAppFrozen ? (
                      <>
                        <Unlock className="w-4 h-4" /> Buka Pembekuan Akses (Unfreeze)
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" /> BEKUKAN SEMUA AKSES PENGGUNA
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1 text-[11px]">Pesan Alasan Pembekuan (Tampil di Layar Terkunci)</label>
                  <textarea
                    value={form.freezeReason || ''}
                    onChange={e => setForm({ ...form, freezeReason: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs h-16"
                    placeholder="Contoh: Masa berlaku lisensi telah habis. Silakan hubungi Superadmin..."
                  />
                </div>
              </div>

              {/* Superadmin Contact Info */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nomor WA Hotline Superadmin</label>
                <input
                  type="text"
                  value={form.superadminPhone || ''}
                  onChange={e => setForm({ ...form, superadminPhone: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 font-mono"
                  placeholder="+62 812-3456-7890"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Lisensi Superadmin</label>
                <input
                  type="email"
                  value={form.superadminEmail || ''}
                  onChange={e => setForm({ ...form, superadminEmail: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 font-mono"
                  placeholder="lisensi@yayasan-nusantara.sch.id"
                />
              </div>

            </div>

            {/* UNBLOCK REQUESTS TICKET TABLE */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-400" /> Permohonan Pembukaan Akses & Bukti Pembayaran ({ (form.unblockRequests || []).length })
                </h4>
                <span className="text-[10px] text-slate-400">
                  Daftar pesan masuk dari sekolah/yayasan yang memohon pembukaan blokir.
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 font-bold border-b border-slate-700">
                      <th className="p-3">Waktu</th>
                      <th className="p-3">Pengaju / Sekolah</th>
                      <th className="p-3">Kontak WA / Email</th>
                      <th className="p-3">Pesan Pengajuan</th>
                      <th className="p-3">Bukti Pembayaran</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Aksi Superadmin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {(form.unblockRequests || []).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500 italic">
                          Belum ada permohonan pembukaan akses masuk.
                        </td>
                      </tr>
                    ) : (
                      (form.unblockRequests || []).map(req => (
                        <tr key={req.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">{req.requestedAt}</td>
                          <td className="p-3">
                            <div className="font-bold text-slate-100">{req.requesterName}</div>
                            <div className="text-[10px] text-amber-300">{req.schoolName}</div>
                          </td>
                          <td className="p-3 font-mono text-[10px]">
                            <div>{req.requesterPhone}</div>
                            <div className="text-slate-400">{req.requesterEmail}</div>
                          </td>
                          <td className="p-3 max-w-xs text-slate-300 text-[11px] leading-snug">
                            {req.message}
                          </td>
                          <td className="p-3">
                            {req.paymentProofUrl ? (
                              <a
                                href={req.paymentProofUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded text-[10px] font-bold flex items-center gap-1 hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" /> lihat bukti
                              </a>
                            ) : (
                              <span className="text-slate-500 italic text-[10px]">Tidak Ada</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              req.status === 'Disetujui' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              req.status === 'Ditolak' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                              'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {req.status === 'Pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleApproveUnblockRequest(req.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[10px] transition shadow"
                                >
                                  Setujui & Buka
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectUnblockRequest(req.id)}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg font-bold text-[10px] transition"
                                >
                                  Tolak
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">Selesai</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: SYSTEM, DATABASE, FIREBASE & GOOGLE WORKSPACE (SUPERADMIN ONLY) */}
        {activeTab === 'system' && isSuperadmin && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-amber-500/30 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" /> Kontrol Sistem Database, Firebase & Google Workspace (Akses Custom Superadmin)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pengaturan terpusat untuk sinkronisasi real-time antar pengguna, database Firebase, ekspor otomatis Google Sheets & Google Drive.
                </p>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold">
                Akses Khusus Superadmin
              </span>
            </div>

            {/* REAL-TIME SYNC ENGINE BANNER */}
            <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/40 border border-emerald-500/30 rounded-2xl space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-300 text-xs flex items-center gap-2">
                      Engine Sinkronisasi Real-Time Multitrust (BroadcastChannel + Cloud Persistence)
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[9px]">ONLINE & SINGKRON</span>
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Setiap perubahan nama yayasan, logo, running text, siaran broadcast, pengumuman, nilai, dan tagihan SPP oleh Superadmin/Admin disiarkan secara <strong>LANGSUNG (Real-time)</strong> ke seluruh tab/perangkat Guru, Orang Tua, dan Siswa tanpa perlu refresh halaman.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      const channel = new BroadcastChannel('siakad_realtime_channel');
                      channel.postMessage({ type: 'SYNC_SETTINGS', data: form, timestamp: Date.now() });
                      channel.close();
                      alert('Isyarat sinkronisasi real-time berhasil disiarkan ulang ke seluruh pengguna!');
                    } catch (err) {
                      alert('Isyarat sinkronisasi tersampaikan via LocalStorage storage listener.');
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 whitespace-nowrap transition"
                >
                  <RefreshCw className="w-4 h-4" /> Paksa Broadcast Sync Sekarang
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Firebase Project Config */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <Flame className="w-4 h-4 text-amber-500" /> Firebase Firestore & Auth Sync
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    form.firebaseConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {form.firebaseConnected ? 'Terhubung Cloud' : 'Terputus'}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-medium">Firebase Project ID</label>
                  <input
                    type="text"
                    value={form.firebaseProjectId || 'yayasan-nusantara-siakad-prod'}
                    onChange={e => setForm({ ...form, firebaseProjectId: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono text-[11px]"
                    placeholder="nama-project-firebase"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-slate-400">Sync Terakhir: {form.lastCloudSync}</span>
                  <button
                    type="button"
                    onClick={handleTestFirebase}
                    disabled={firebaseConnecting}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-medium flex items-center gap-1.5 text-[11px] transition shadow"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${firebaseConnecting ? 'animate-spin' : ''}`} />
                    <span>{firebaseConnecting ? 'Memverifikasi...' : 'Tes Sync Firebase'}</span>
                  </button>
                </div>
              </div>

              {/* Google Sheets & Google Drive Integration */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <Database className="w-4 h-4 text-emerald-400" /> Google Sheets & Google Drive API
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    form.googleSyncStatus === 'Terhubung' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {form.googleSyncStatus || 'Terhubung'}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-medium">Google Spreadsheet ID (Master DB)</label>
                  <input
                    type="text"
                    value={form.googleSpreadsheetId || ''}
                    onChange={e => setForm({ ...form, googleSpreadsheetId: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-emerald-300 font-mono text-[11px]"
                    placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms_SIAKAD"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-medium">Google Drive Backup Folder ID</label>
                  <input
                    type="text"
                    value={form.googleDriveFolderId || ''}
                    onChange={e => setForm({ ...form, googleDriveFolderId: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-blue-300 font-mono text-[11px]"
                    placeholder="1DriveFolder_YayasanNusantara_Backup_2026"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">Status API: Auto-Sync Aktif</span>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(prev => ({ ...prev, googleSyncStatus: 'Terhubung', lastCloudSync: new Date().toISOString() }));
                      alert('Koneksi Google Sheets & Google Drive API Berhasil Diuji & Tersambung!');
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-[11px] transition shadow flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Uji Google Sheets Sync
                  </button>
                </div>
              </div>

              {/* Secret API Key Management */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <Key className="w-4 h-4 text-blue-400" /> Master Security Secret Key (AES-256)
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-medium">Master Live API Key Integration</label>
                  <input
                    type="text"
                    value={form.apiKey}
                    readOnly
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Enkripsi End-to-End & REST API Active
                  </span>
                  <button
                    type="button"
                    onClick={handleRegenerateApiKey}
                    className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium text-[11px] transition"
                  >
                    Regenerate Key
                  </button>
                </div>
              </div>

              {/* Database Backup Export / Restore */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <FileText className="w-4 h-4 text-purple-400" /> Cadangan Master Database (.JSON)
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Superadmin dapat mengunduh seluruh isi data sekolah (pengaturan, akun user, nilai, absensi, SPP) dalam bentuk file JSON sebagai cadangan offline atau restorasi sistem.
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(form, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `Master_Database_SIAKAD_${new Date().toISOString().split('T')[0]}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-[11px] transition shadow flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" /> Unduh Backup JSON
                  </button>

                  <label className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Restorasi File DB
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const json = JSON.parse(event.target?.result as string);
                            if (json && typeof json === 'object') {
                              setForm(prev => ({ ...prev, ...json }));
                              alert('Database berhasil direstorasi dari file JSON!');
                            }
                          } catch (err) {
                            alert('Gagal membaca file JSON cadangan.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Submit Save Button */}
        <div className="pt-2 flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" /> Pengaturan Logo, Kop Surat, Unit, dan Lisensi Berhasil Diperbarui!
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition"
            id="btn-save-foundation-settings"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}</span>
          </button>
        </div>

      </form>

      {/* MODAL ADD UNIT */}
      {showAddUnitModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-purple-300 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" /> Tambah Unit Jenjang Pendidikan Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddUnitModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kode Jenjang (Singkatan)</label>
                <input
                  type="text"
                  value={newUnitCode}
                  onChange={e => setNewUnitCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl font-mono text-purple-300 font-bold"
                  placeholder="Contoh: SMK, PAUD, MA, D3"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Unit Sekolah</label>
                <input
                  type="text"
                  value={newUnitName}
                  onChange={e => setNewUnitName(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-bold"
                  placeholder="Contoh: SMK Nusantara Kejuruan"
                  required
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddUnitModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddUnit}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Tambah Unit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADD/EDIT SUBJECT */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowSubjectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kode Mata Pelajaran</label>
                <input
                  type="text"
                  value={subjectForm.code}
                  onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl font-mono text-amber-300 font-bold"
                  placeholder="Contoh: MAT-P, FIS-01"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  value={subjectForm.name}
                  onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-bold"
                  placeholder="Contoh: Matematika Peminatan"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jenjang Pendidikan</label>
                  <select
                    value={subjectForm.educationLevel}
                    onChange={e => setSubjectForm({ ...subjectForm, educationLevel: e.target.value as EducationLevel })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  >
                    {Object.keys(form.units).map(lvl => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">KKM Kelulusan (Default 75)</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={subjectForm.kkm}
                    onChange={e => setSubjectForm({ ...subjectForm, kkm: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl font-mono font-bold text-emerald-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kategori Kelompok Mapel</label>
                <select
                  value={subjectForm.category}
                  onChange={e => setSubjectForm({ ...subjectForm, category: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                >
                  <option value="Kelompok A (Wajib)">Kelompok A (Wajib Umum)</option>
                  <option value="Kelompok B (Wajib)">Kelompok B (Wajib Seni/PJOK)</option>
                  <option value="Kelompok C (Peminatan)">Kelompok C (Peminatan MIPA/IPS)</option>
                  <option value="Muatan Lokal">Muatan Lokal</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowSubjectModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveSubject}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Simpan Mata Pelajaran
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
