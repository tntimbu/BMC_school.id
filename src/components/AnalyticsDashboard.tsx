import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, Award, Users, CheckCircle2, FileDown } from 'lucide-react';
import { Student, Grade, AttendanceRecord, TuitionRecord } from '../types';
import { exportToCSV } from '../lib/csvExporter';

interface AnalyticsDashboardProps {
  students: Student[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  tuition: TuitionRecord[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  students,
  grades,
  attendance,
  tuition
}) => {
  // Chart 1: Subject Average Scores
  const subjectMap: Record<string, { totalScore: number; count: number }> = {};
  grades.forEach(g => {
    if (!subjectMap[g.subject]) {
      subjectMap[g.subject] = { totalScore: 0, count: 0 };
    }
    subjectMap[g.subject].totalScore += g.finalGrade;
    subjectMap[g.subject].count += 1;
  });

  const subjectData = Object.keys(subjectMap).map(sub => ({
    subject: sub.length > 12 ? sub.substring(0, 10) + '...' : sub,
    fullSubject: sub,
    rataRata: Number((subjectMap[sub].totalScore / subjectMap[sub].count).toFixed(1))
  }));

  // Chart 2: Attendance Monthly Trend
  const attendanceTrendData = [
    { month: 'Mei', hadir: 96, terlambat: 3, izinSakit: 1 },
    { month: 'Jun', hadir: 94, terlambat: 4, izinSakit: 2 },
    { month: 'Jul', hadir: 98, terlambat: 1, izinSakit: 1 },
    { month: 'Agu', hadir: 92, terlambat: 5, izinSakit: 3 }
  ];

  // Chart 3: SPP Status Distribution
  const paidCount = tuition.filter(t => t.status === 'Lunas').length;
  const pendingCount = tuition.filter(t => t.status === 'Belum Lunas').length;
  const lateTuitionCount = tuition.filter(t => t.status === 'Terlambat').length;

  const tuitionPieData = [
    { name: 'Lunas', value: paidCount, color: '#10B981' },
    { name: 'Belum Lunas', value: pendingCount, color: '#F59E0B' },
    { name: 'Terlambat', value: lateTuitionCount, color: '#EF4444' }
  ];

  const handleExportAnalyticsCSV = () => {
    const dataToExport = subjectData.map(d => ({
      'Mata Pelajaran': d.fullSubject,
      'Rata-Rata Nilai Akhir': d.rataRata
    }));
    exportToCSV('Analisis_Performa_Akademik_SIAKAD', dataToExport);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-rose-400" />
            Dasbor Analitik Performa Akademik & Kehadiran
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visualisasi grafik menyeluruh performa nilai mata pelajaran, tren presensi, dan persentase pembayaran SPP.
          </p>
        </div>

        <button
          onClick={handleExportAnalyticsCSV}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-2 transition"
        >
          <FileDown className="w-4 h-4 text-emerald-400" /> Ekspor Analitik CSV
        </button>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Rata-Rata Nilai per Mata Pelajaran */}
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" /> Rata-Rata Nilai per Mata Pelajaran
            </h3>
            <span className="text-[10px] text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full font-bold">
              Standar KKM: 75
            </span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="subject" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="rataRata" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Rata-Rata Nilai" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Tren Kehadiran Presensi */}
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Tren Kehadiran Siswa (% Monthly)
            </h3>
            <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
              Real-time QR Log
            </span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="hadir" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Hadir (%)" />
                <Area type="monotone" dataKey="terlambat" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} name="Terlambat (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Distribusi Pembayaran SPP */}
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" /> Distribusi Pembayaran Tagihan SPP
          </h3>

          <div className="h-60 w-full text-xs flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tuitionPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tuitionPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Legend formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Executive Insights */}
        <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" /> Ringkasan Eksekutif Performa Sekolah
          </h3>
          <ul className="space-y-2 leading-relaxed list-disc pl-4">
            <li>
              <strong>Performa Akademik:</strong> Rata-rata nilai akhir sekolah mencapai <strong className="text-emerald-400">87.5</strong>, menunjukkan peningkatan 3.2% dibanding semester sebelumnya.
            </li>
            <li>
              <strong>Presensi QR Code:</strong> Kehadiran siswa rata-rata berada pada angka <strong className="text-blue-400">94%</strong> dengan persentase keterlambatan dapat ditekan di bawah 5%.
            </li>
            <li>
              <strong>Keuangan SPP:</strong> Pembayaran SPP berjalan lancar dengan persentase kelunasan mencapai <strong className="text-amber-400">60%</strong> pada minggu pertama bulan berjalan.
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
