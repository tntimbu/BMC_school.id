import React from 'react';
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
  Crown
} from 'lucide-react';
import { Student, Grade, AttendanceRecord, TuitionRecord, PPDBApplication, Announcement, UserProfile, SchoolSettings, EducationLevel } from '../types';
import { ActiveTab } from './Sidebar';

interface DashboardOverviewProps {
  students: Student[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  tuition: TuitionRecord[];
  ppdb: PPDBApplication[];
  announcements: Announcement[];
  currentUser: UserProfile;
  settings: SchoolSettings;
  activeLevel?: EducationLevel | 'Semua';
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  students,
  grades,
  attendance,
  tuition,
  ppdb,
  announcements,
  currentUser,
  settings,
  activeLevel = 'Semua',
  onNavigate
}) => {
  // Filter data by active level
  const filteredStudents = activeLevel === 'Semua' ? students : students.filter(s => s.educationLevel === activeLevel);
  const filteredGrades = activeLevel === 'Semua' ? grades : grades.filter(g => g.educationLevel === activeLevel);
  const filteredAttendance = activeLevel === 'Semua' ? attendance : attendance.filter(a => a.educationLevel === activeLevel);
  const filteredTuition = activeLevel === 'Semua' ? tuition : tuition.filter(t => t.educationLevel === activeLevel);

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
  const tuitionPaidPercent = filteredTuition.length > 0 ? Math.round((paidTuitionCount / filteredTuition.length) * 100) : 0;
  const overdueTuitionCount = filteredTuition.filter(t => t.status === 'Belum Lunas' || t.status === 'Terlambat').length;

  const isParentOrStudent = currentUser.role === 'parent' || currentUser.role === 'student';

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
    isParentOrStudent
      ? 'Pantau perkembangan nilai akademik, presensi QR Code real-time, dan status tagihan SPP putra/putri Anda secara transparan.'
      : 'Pusat kendali administrasi terpadu Yayasan untuk seluruh jenjang (KB-TK, SD, SMP, SMA) dengan sinkronisasi Cloud & enkripsi AES-256.'
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Welcome Banner */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${bannerGradient} p-4 sm:p-6 text-white shadow-xl border`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider flex items-center gap-1 shrink-0 max-w-[220px] sm:max-w-none truncate">
                <Building2 className="w-3 h-3 text-amber-400 shrink-0" /> <span className="truncate">{settings.foundationName}</span>
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium truncate">• {settings.principalName}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white leading-tight break-words">
              {welcomeGreeting}
            </h2>
            <p className="text-[11px] sm:text-sm text-blue-200 mt-1 max-w-2xl leading-relaxed">
              {welcomeSub}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap pt-1 md:pt-0">
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
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400 shrink-0" /> Unit Pendidikan Under {settings.foundationName}
            </h3>
            <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Tampilan: {activeLevel === 'Semua' ? 'Semua Jenjang' : activeLevel}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {levelsList.map(lvl => {
              const count = students.filter(s => s.educationLevel === lvl.key).length;
              const customName = settings.units[lvl.key] || lvl.label;
              const isSelected = activeLevel === lvl.key;

              return (
                <div
                  key={lvl.key}
                  className={`p-2.5 sm:p-4 rounded-xl border transition-all min-w-0 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1 sm:mb-1.5">
                    <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded border shrink-0 ${lvl.bg} ${lvl.text} ${lvl.border}`}>
                      {lvl.key}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-400 font-semibold shrink-0">{count} Siswa</span>
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-sm truncate" title={customName}>
                    {customName}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 sm:mt-1 truncate">
                    Status: TA {settings.academicYear}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        
        {/* Total Students */}
        <div className="p-3 sm:p-5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 min-w-0">
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
        <div className="p-3 sm:p-5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 min-w-0">
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
        <div className="p-3 sm:p-5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 min-w-0">
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
        <div className="p-3 sm:p-5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 min-w-0">
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

      {/* Main Content Grid: Recent Announcements & Attendance / Tuition Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Announcements */}
        <div className="lg:col-span-2 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 truncate">
              <Megaphone className="w-4 h-4 text-amber-400 shrink-0" /> Pengumuman Resmi Yayasan & Sekolah
            </h3>
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
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 truncate">
              <Bell className="w-4 h-4 text-rose-400 shrink-0" /> Log Aktivitas Real-time
            </h3>
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

      </div>

    </div>
  );
};
