import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  QrCode,
  CreditCard,
  UserPlus,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  FileText,
  Megaphone,
  Bell,
  Building2,
  School,
  Layers,
  Crown,
  RefreshCw,
  Video,
  Instagram,
  Facebook,
  Globe,
  X,
  Radio,
  ExternalLink,
  Calendar,
  Plus,
  Edit,
  Save,
  Send,
  Info,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { Student, Grade, AttendanceRecord, TuitionRecord, PPDBApplication, Announcement, UserProfile, SchoolSettings, EducationLevel, CalendarEvent } from '../types';
import { ActiveTab } from './Sidebar';

interface DashboardOverviewProps {
  students: Student[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  tuition: TuitionRecord[];
  ppdb: PPDBApplication[];
  announcements: Announcement[];
  events?: CalendarEvent[];
  currentUser: UserProfile;
  settings: SchoolSettings;
  activeLevel?: EducationLevel | 'Semua';
  onNavigate: (tab: ActiveTab) => void;
  onUpdateSettings?: (updated: Partial<SchoolSettings>) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  students,
  grades,
  attendance,
  tuition,
  ppdb,
  announcements,
  events = [],
  currentUser,
  settings,
  activeLevel = 'Semua',
  onNavigate,
  onUpdateSettings
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefreshToast, setShowRefreshToast] = useState(false);
  const [dismissBroadcast, setDismissBroadcast] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Broadcast Form State
  const [alertTitle, setAlertTitle] = useState(settings.broadcastNotification?.title || '');
  const [alertMessage, setAlertMessage] = useState(settings.broadcastNotification?.message || '');
  const [alertType, setAlertType] = useState<'warning' | 'danger' | 'info' | 'success'>(
    settings.broadcastNotification?.type || 'warning'
  );
  const [alertActive, setAlertActive] = useState(settings.broadcastNotification?.active ?? true);

  // Sync state whenever broadcast notification changes remotely
  useEffect(() => {
    if (settings.broadcastNotification) {
      setAlertTitle(settings.broadcastNotification.title || '');
      setAlertMessage(settings.broadcastNotification.message || '');
      setAlertType(settings.broadcastNotification.type || 'warning');
      setAlertActive(settings.broadcastNotification.active ?? true);
    }
  }, [settings.broadcastNotification]);

  const [refreshTime, setRefreshTime] = useState(() =>
    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  const isAdminOrSuper = currentUser.role === 'admin' || currentUser.role === 'superadmin';

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setShowRefreshToast(true);
      setTimeout(() => setShowRefreshToast(false), 3500);
    }, 650);
  };

  const handleSaveBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertMessage.trim()) {
      alert('Mohon isi Judul dan Pesan Alert!');
      return;
    }

    const updatedBroadcast = {
      active: alertActive,
      title: alertTitle,
      message: alertMessage,
      type: alertType,
      date: new Date().toISOString().split('T')[0]
    };

    if (onUpdateSettings) {
      onUpdateSettings({ broadcastNotification: updatedBroadcast });
    }

    setShowBroadcastModal(false);
    setDismissBroadcast(false);
    alert('Alert Pemberitahuan Dashboard berhasil disebarkan!');
  };

  const handleDeleteBroadcast = () => {
    if (window.confirm('Apakah Anda yakin ingin MENGHAPUS / MATIKAN peringatan broadcast ini secara permanen untuk seluruh pengguna?')) {
      const emptyBroadcast = {
        active: false,
        title: '',
        message: '',
        type: 'warning' as const,
        date: ''
      };

      if (onUpdateSettings) {
        onUpdateSettings({ broadcastNotification: emptyBroadcast });
      }

      setAlertActive(false);
      setAlertTitle('');
      setAlertMessage('');
      setDismissBroadcast(true);
      setShowBroadcastModal(false);
    }
  };

  // Filter data by active level
  const filteredStudents = activeLevel === 'Semua' ? students : students.filter(s => s.educationLevel === activeLevel);
  const filteredGrades = activeLevel === 'Semua' ? grades : grades.filter(g => g.educationLevel === activeLevel);
  const filteredAttendance = activeLevel === 'Semua' ? attendance : attendance.filter(a => a.educationLevel === activeLevel);
  const filteredTuition = activeLevel === 'Semua' ? tuition : tuition.filter(t => t.educationLevel === activeLevel);
  const filteredEvents = activeLevel === 'Semua' ? events : events.filter(e => e.educationLevel === 'Semua' || e.educationLevel === activeLevel);

  // Stats Calculations
  const totalStudents = filteredStudents.length;
  
  const avgGrade = filteredGrades.length > 0
    ? (filteredGrades.reduce((acc, g) => acc + g.finalGrade, 0) / filteredGrades.length).toFixed(1)
    : '0';

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAtt = filteredAttendance.filter(a => a.date === todayStr);
  const presentCount = todayAtt.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length;
  const lateCount = todayAtt.filter(a => a.status === 'Terlambat').length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / Math.max(1, totalStudents)) * 100) : 100;

  const paidTuitionCount = filteredTuition.filter(t => t.status === 'Lunas').length;
  const overdueTuitionCount = filteredTuition.filter(t => t.status === 'Belum Lunas' || t.status === 'Terlambat').length;
  const tuitionPaidPercent = filteredTuition.length > 0 ? Math.round((paidTuitionCount / filteredTuition.length) * 100) : 0;

  const levelsList: { key: EducationLevel; label: string; bg: string; text: string; border: string }[] = [
    { key: 'KB-TK', label: 'KB & TK', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    { key: 'SD', label: 'Sekolah Dasar (SD)', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    { key: 'SMP', label: 'Sekolah Menengah Pertama (SMP)', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    { key: 'SMA', label: 'Sekolah Menengah Atas (SMA)', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' }
  ];

  const bannerGradient = {
    'gradient-indigo': 'from-blue-950 via-indigo-900 to-slate-900 border-blue-800/40',
    'gradient-emerald': 'from-emerald-950 via-teal-900 to-slate-900 border-emerald-800/40',
    'gradient-slate': 'from-slate-900 via-slate-800 to-zinc-900 border-slate-700/50',
    'gradient-amber': 'from-amber-950 via-yellow-900 to-slate-900 border-amber-800/40',
    'gradient-rose': 'from-rose-950 via-pink-900 to-slate-900 border-rose-800/40'
  }[settings.dashboardBannerTheme || 'gradient-indigo'] || 'from-blue-950 via-indigo-900 to-slate-900 border-blue-800/40';

  const welcomeGreeting = settings.welcomeTitle
    ? settings.welcomeTitle.replace('{name}', currentUser.name)
    : `Selamat Datang, ${currentUser.name}! 👋`;

  const welcomeSub = settings.welcomeSubtitle || (
    'Pusat kendali informasi terpadu Yayasan untuk seluruh jenjang (KB-TK, SD, SMP, SMA) dengan rekap nilai, presensi QR, agenda, dan status SPP real-time.'
  );

  // Card Styling YouTube-style Rules
  const cardBgClass = {
    slate: 'bg-slate-900',
    zinc: 'bg-zinc-900',
    indigo: 'bg-indigo-950/90',
    emerald: 'bg-emerald-950/90',
    amber: 'bg-amber-950/90',
    dark: 'bg-slate-950'
  }[settings.cardBgColor || 'slate'] || 'bg-slate-900';

  const cardBorderClass = {
    slate: 'border-slate-800',
    blue: 'border-blue-500/40 shadow-blue-500/5',
    amber: 'border-amber-500/40 shadow-amber-500/5',
    emerald: 'border-emerald-500/40 shadow-emerald-500/5',
    purple: 'border-purple-500/40 shadow-purple-500/5',
    none: 'border-transparent'
  }[settings.cardBorderColor || 'slate'] || 'border-slate-800';

  const cardPaddingClass = {
    compact: 'p-2.5 sm:p-3.5',
    normal: 'p-3.5 sm:p-5',
    spacious: 'p-5 sm:p-7'
  }[settings.cardPadding || 'normal'] || 'p-3.5 sm:p-5';

  const cardRadiusClass = settings.cardRadius || 'rounded-2xl';

  const combinedCardStyle = `${cardBgClass} ${cardBorderClass} ${cardPaddingClass} ${cardRadiusClass} border shadow-xl transition-all duration-200`;

  // Parse YouTube Embed URL
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    }
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
  };

  // Reset dismiss state whenever settings/broadcast alert changes
  useEffect(() => {
    setDismissBroadcast(false);
  }, [settings.broadcastNotification?.date, settings.broadcastNotification?.title, settings.broadcastNotification?.message]);

  const youtubeEmbedUrl = getYouTubeEmbedUrl(settings.youtubeVideoUrl);

  const broadcastAlert = settings.broadcastNotification;

  const broadcastStyles = {
    warning: 'bg-amber-950/90 border-amber-500/60 text-amber-100 shadow-amber-500/10',
    danger: 'bg-rose-950/90 border-rose-500/60 text-rose-100 shadow-rose-500/10',
    info: 'bg-blue-950/90 border-blue-500/60 text-blue-100 shadow-blue-500/10',
    success: 'bg-emerald-950/90 border-emerald-500/60 text-emerald-100 shadow-emerald-500/10'
  }[broadcastAlert?.type || 'warning'];

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Toast Notification for Manual Refresh */}
      {showRefreshToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-400 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>Data Dashboard Berhasil Diperbarui! (Cloud Sync Active)</span>
        </div>
      )}

      {/* Admin Button to create/edit broadcast when card is dismissed or inactive */}
      {isAdminOrSuper && (dismissBroadcast || !broadcastAlert?.active) && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setDismissBroadcast(false);
              setShowBroadcastModal(true);
            }}
            className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 rounded-xl flex items-center gap-2 shadow-md transition"
          >
            <Radio className="w-4 h-4 text-amber-400" />
            <span>{broadcastAlert?.active ? 'Tampilkan / Edit Broadcast Alert' : '+ Buat Alert Broadcast baru'}</span>
          </button>
        </div>
      )}

      {/* Broadcast Alert Banner Card for ALL Users */}
      {!dismissBroadcast && broadcastAlert?.active && (
        <div className={`p-4 sm:p-5 rounded-2xl border ${broadcastStyles} shadow-2xl relative overflow-hidden transition-all animate-in fade-in duration-200`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="p-2 rounded-xl bg-white/10 shrink-0 mt-0.5">
                <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 border border-white/20 uppercase tracking-wider">
                    {broadcastAlert?.date || new Date().toISOString().split('T')[0]}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40">
                    Sistem Broadcast Admin & Superadmin
                  </span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight leading-snug break-words">
                  {broadcastAlert?.title}
                </h3>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-95 break-words">
                  {broadcastAlert?.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isAdminOrSuper && (
                <>
                  <button
                    onClick={() => setShowBroadcastModal(true)}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold border border-amber-500/40 rounded-xl flex items-center gap-1.5 shadow-md transition shrink-0"
                    id="btn-edit-broadcast"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Alert</span>
                  </button>
                  <button
                    onClick={handleDeleteBroadcast}
                    className="px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 text-xs font-bold border border-rose-500/50 rounded-xl flex items-center gap-1.5 shadow-md transition shrink-0"
                    id="btn-delete-broadcast"
                    title="Hapus Broadcast Permanen Untuk Semua Pengguna"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setDismissBroadcast(true)}
                className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition shrink-0 cursor-pointer"
                aria-label="Tutup Notifikasi Kartu"
                title="Tutup Notifikasi Kartu Ini"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Alert Admin Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-400" />
                Kirim Alert Notification Dashboard (Admin/Superadmin)
              </h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Alert Pemberitahuan</label>
                <input
                  type="text"
                  value={alertTitle}
                  onChange={e => setAlertTitle(e.target.value)}
                  placeholder="Contoh: ⚠️ Pengumuman Libur Nasional & Penyesuaian Jam Belajar"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Isi Pesan Alert Dashboard</label>
                <textarea
                  value={alertMessage}
                  onChange={e => setAlertMessage(e.target.value)}
                  placeholder="Tuliskan isi ringkasan pesan penting yang akan tampil pada kartu alert semua pengguna..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white h-24"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipe Tampilan Alert</label>
                  <select
                    value={alertType}
                    onChange={e => setAlertType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium"
                  >
                    <option value="warning">Peringatan (Kuning/Amber)</option>
                    <option value="danger">Darurat / Penting (Merah)</option>
                    <option value="info">Informasi (Biru)</option>
                    <option value="success">Pengumuman Sukses (Hijau)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Publikasi</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer text-slate-200 font-medium">
                    <input
                      type="checkbox"
                      checked={alertActive}
                      onChange={e => setAlertActive(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700 focus:ring-amber-500"
                    />
                    <span>Tampilkan di Dashboard</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                {broadcastAlert?.active ? (
                  <button
                    type="button"
                    onClick={handleDeleteBroadcast}
                    className="px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl font-bold flex items-center gap-1.5 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Broadcast</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBroadcastModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Sebarkan Alert Card</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Welcome Banner */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${bannerGradient} p-4 sm:p-6 text-white shadow-xl border`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider flex items-center gap-1 shrink-0 max-w-[220px] sm:max-w-none truncate">
                <Building2 className="w-3 h-3 text-amber-400 shrink-0" /> <span className="truncate">{settings.foundationName}</span>
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium truncate">• {settings.principalName}</span>
              
              {/* Realtime Sync Status Badge */}
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Sync Realtime ({refreshTime})</span>
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white leading-tight break-words">
              {welcomeGreeting}
            </h2>
            <p className="text-[11px] sm:text-sm text-blue-200 mt-1 max-w-2xl leading-relaxed">
              {welcomeSub}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap pt-1 md:pt-0">
            {/* Refresh Data Button */}
            <button
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-slate-800/90 hover:bg-slate-800 text-amber-300 border border-slate-700/80 hover:border-amber-500/40 rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition whitespace-nowrap active:scale-95 disabled:opacity-60"
              id="btn-refresh-dashboard"
              title="Refresh Data & Sinkronkan Ulang"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              onClick={() => onNavigate('attendance')}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition whitespace-nowrap"
              id="btn-quick-qr-scan"
            >
              <QrCode className="w-4 h-4 shrink-0" />
              <span>Scan QR Presensi</span>
            </button>
            
            <button
              onClick={() => onNavigate('grades')}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition whitespace-nowrap"
              id="btn-quick-grades"
            >
              <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Lihat Nilai</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Units Overview Cards - Multi-Jenjang Yayasan */}
      {settings.showLevelOverview !== false && (
        <div className={`${combinedCardStyle} space-y-4`}>
          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-800 pb-3">
            <div className="min-w-0">
              <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 truncate">
                <Layers className="w-4 h-4 text-amber-400 shrink-0" /> Unit Pendidikan {settings.foundationName}
              </h3>
              <p className="text-[10px] text-slate-400 truncate">
                Rangkuman statistik jumlah siswa & status operasional per jenjang pendidikan
              </p>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg shrink-0">
              Tampilan: {activeLevel === 'Semua' ? 'Semua Jenjang' : activeLevel}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {levelsList.map(lvl => {
              const count = students.filter(s => s.educationLevel === lvl.key).length;
              const customName = settings.units[lvl.key] || lvl.label;
              const isSelected = activeLevel === lvl.key;

              return (
                <div
                  key={lvl.key}
                  className={`p-3 sm:p-4 rounded-xl transition-all min-w-0 bg-slate-800/60 border ${
                    isSelected
                      ? 'border-amber-500 ring-1 ring-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                      : 'border-slate-700/70 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${lvl.bg} ${lvl.text} ${lvl.border}`}>
                      {lvl.key}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-300 font-bold shrink-0">{count} Siswa</span>
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-sm truncate" title={customName}>
                    {customName}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 truncate">
                    Status: TA {settings.academicYear}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metric Cards Grid with Custom Admin Styling */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        
        {/* Total Students */}
        <div className={`${combinedCardStyle} flex items-center justify-between gap-2 min-w-0 h-full`}>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 block truncate">Total Siswa ({activeLevel})</span>
            <div className="text-lg sm:text-2xl font-extrabold text-white mt-0.5 sm:mt-1 leading-tight">{totalStudents}</div>
            <span className="text-[10px] sm:text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5 sm:mt-1 font-medium truncate">
              <TrendingUp className="w-3 h-3 shrink-0" /> 100% Terdaftar
            </span>
          </div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Academic Average */}
        <div className={`${combinedCardStyle} flex items-center justify-between gap-2 min-w-0 h-full`}>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 block truncate">Rata-Rata Nilai</span>
            <div className="text-lg sm:text-2xl font-extrabold text-white mt-0.5 sm:mt-1 leading-tight">{avgGrade} <span className="text-[10px] sm:text-xs text-slate-400 font-normal">/100</span></div>
            <span className="text-[10px] sm:text-[11px] text-blue-400 flex items-center gap-1 mt-0.5 sm:mt-1 font-medium truncate">
              <GraduationCap className="w-3 h-3 shrink-0" /> Predikat A/B
            </span>
          </div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Attendance Rate */}
        <div className={`${combinedCardStyle} flex items-center justify-between gap-2 min-w-0 h-full`}>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 block truncate">Presensi Hari Ini</span>
            <div className="text-lg sm:text-2xl font-extrabold text-white mt-0.5 sm:mt-1 leading-tight">{attendanceRate}%</div>
            <span className="text-[10px] sm:text-[11px] text-amber-400 flex items-center gap-1 mt-0.5 sm:mt-1 font-medium truncate">
              <Clock className="w-3 h-3 shrink-0" /> {lateCount} Terlambat
            </span>
          </div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <QrCode className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Tuition Payment Status */}
        <div className={`${combinedCardStyle} flex items-center justify-between gap-2 min-w-0 h-full`}>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 block truncate">Pelunasan SPP</span>
            <div className="text-lg sm:text-2xl font-extrabold text-white mt-0.5 sm:mt-1 leading-tight">{tuitionPaidPercent}%</div>
            <span className="text-[10px] sm:text-[11px] text-rose-400 flex items-center gap-1 mt-0.5 sm:mt-1 font-medium truncate">
              <AlertTriangle className="w-3 h-3 shrink-0" /> {overdueTuitionCount} Belum Lunas
            </span>
          </div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

      </div>

      {/* Kalender & Agenda Sekolah Dashboard Card */}
      <div className={`${combinedCardStyle} space-y-4`}>
        <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-800 pb-3">
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 truncate">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" /> Kalender & Agenda Kegiatan Sekolah
            </h3>
            <p className="text-[10px] text-slate-400 truncate">
              Jadwal akademik, ujian, rapat, dan hari libur resmi {settings.foundationName} ({activeLevel})
            </p>
          </div>
          <button
            onClick={() => onNavigate('calendar')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Lihat Kalender Lengkap</span> <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Agenda Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {filteredEvents.length > 0 ? (
            filteredEvents.slice(0, 3).map(ev => {
              const categoryColor = {
                Akademik: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                Ujian: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                Libur: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                Rapat: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                Kegiatan: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }[ev.category] || 'bg-slate-800 text-slate-300 border-slate-700';

              return (
                <div
                  key={ev.id}
                  className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 hover:border-slate-500 transition flex flex-col justify-between gap-2.5 min-w-0"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase truncate ${categoryColor}`}>
                        {ev.category} • {ev.educationLevel}
                      </span>
                      <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                        {ev.startDate === ev.endDate ? ev.startDate : `${ev.startDate} s/d ${ev.endDate}`}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-xs sm:text-sm leading-snug line-clamp-1">{ev.title}</h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{ev.description || 'Tidak ada deskripsi tambahan.'}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-700/50 flex items-center justify-between">
                    <span>Tersinkronisasi Kalender Cloud</span>
                    <span className="text-emerald-400 font-semibold">● Aktif</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full p-6 text-center text-slate-400 text-xs bg-slate-800/30 rounded-xl border border-slate-700/40">
              Belum ada agenda kegiatan untuk jenjang ini.
            </div>
          )}
        </div>
      </div>

      {/* Media Sosial & YouTube Video Kegiatan Sekolah Section */}
      <div className={`${combinedCardStyle} space-y-4`}>
        <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-800 pb-3">
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 truncate">
              <Video className="w-4 h-4 text-rose-500 shrink-0" /> Media & Galeri Kegiatan Sekolah
            </h3>
            <p className="text-[10px] text-slate-400 truncate">
              Dokumentasi aktivitas siswa, ekstrakulikuler, dan liputan resmi {settings.foundationName}
            </p>
          </div>

          {/* Social Media Links Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {settings.socialInstagram && (
              <a
                href={settings.socialInstagram}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/20 text-[11px] font-semibold flex items-center gap-1 transition"
              >
                <Instagram className="w-3.5 h-3.5" /> Instagram
              </a>
            )}
            {settings.socialWebsite && (
              <a
                href={settings.socialWebsite}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 text-[11px] font-semibold flex items-center gap-1 transition"
              >
                <Globe className="w-3.5 h-3.5" /> Website Resmi
              </a>
            )}
          </div>
        </div>

        {/* Video Player & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          <div className="lg:col-span-2 relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
            {youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={settings.youtubeVideoTitle || 'Video Kegiatan Sekolah'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                <Video className="w-12 h-12 text-slate-600" />
                <p className="text-xs font-semibold">Video kegiatan belum diset oleh Admin</p>
                <p className="text-[10px] text-slate-600">Admin dapat mengatur URL YouTube pada Pengaturan -&gt; Custom Tampilan</p>
              </div>
            )}
          </div>

          <div className="space-y-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 text-xs">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider inline-block">
              Video Unggulan Admin
            </span>
            <h4 className="font-bold text-slate-100 text-sm leading-snug">
              {settings.youtubeVideoTitle || 'Dokumentasi Kegiatan Belajar & Ekstrakulikuler Unggulan'}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Video ini ditampilkan secara otomatis untuk memberikan gambaran kegiatan belajar mengajar, sarana prasarana, serta prestasi siswa-siswi di seluruh jenjang.
            </p>
            {settings.youtubeVideoUrl && (
              <a
                href={settings.youtubeVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold underline pt-1"
              >
                <span>Buka di YouTube</span> <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Announcements & Attendance / Tuition Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Announcements */}
        <div className={`lg:col-span-2 ${combinedCardStyle} space-y-4 min-w-0`}>
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="min-w-0">
              <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 truncate">
                <Megaphone className="w-4 h-4 text-amber-400 shrink-0" /> Pengumuman Resmi Yayasan & Sekolah
              </h3>
              <p className="text-[10px] text-slate-400 truncate">
                Informasi penting, edaran, dan agenda kegiatan sekolah
              </p>
            </div>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-semibold shrink-0"
            >
              <span>Lihat Semua</span> <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map(anc => (
              <div
                key={anc.id}
                className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2 hover:border-slate-600 transition min-w-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 truncate">
                    {anc.category} • {anc.educationLevel}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0">{anc.date}</span>
                </div>
                <h4 className="font-bold text-white text-xs sm:text-sm leading-snug line-clamp-1">{anc.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{anc.content}</p>
                <div className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-700/50 truncate">
                  Dipublikasikan oleh: <span className="text-slate-300 font-medium">{anc.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Realtime Logs */}
        {settings.showRealtimeLogs !== false && (
          <div className={`${combinedCardStyle} space-y-4 min-w-0`}>
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 truncate">
                  <Bell className="w-4 h-4 text-rose-400 shrink-0" /> Log Aktivitas Real-time
                </h3>
                <p className="text-[10px] text-slate-400 truncate">
                  Pantauan kehadiran siswa & presensi QR Code
                </p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </div>

            <div className="space-y-2.5 text-xs">
              {filteredAttendance.slice(0, 4).map(att => (
                <div
                  key={att.id}
                  className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex items-center justify-between gap-2 min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-200 truncate">{att.studentName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{att.className} ({att.educationLevel}) • {att.time}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                    att.status === 'Hadir' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {att.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
