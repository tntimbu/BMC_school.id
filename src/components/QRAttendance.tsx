import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  QrCode,
  Scan,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Printer,
  FileDown,
  UserCheck,
  Calendar,
  X,
  Sparkles,
  Zap
} from 'lucide-react';
import { Student, AttendanceRecord, UserProfile, SchoolSettings } from '../types';
import { generateAttendanceReportPDF } from '../lib/pdfExporter';
import { exportToCSV } from '../lib/csvExporter';

interface QRAttendanceProps {
  students: Student[];
  attendance: AttendanceRecord[];
  currentUser: UserProfile;
  settings: SchoolSettings;
  onScanAttendance: (qrCodeId: string, status?: string, notes?: string) => Promise<{ record: AttendanceRecord, alertTriggered: boolean }>;
}

export const QRAttendance: React.FC<QRAttendanceProps> = ({
  students,
  attendance,
  currentUser,
  settings,
  onScanAttendance
}) => {
  const [selectedStudentForQR, setSelectedStudentForQR] = useState<Student | null>(null);
  const [scanningStudentId, setScanningStudentId] = useState<string>(students[0]?.id || '');
  const [scanStatusOverride, setScanStatusOverride] = useState<string>('Hadir');
  const [scanNotes, setScanNotes] = useState<string>('');
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanSuccessResult, setScanSuccessResult] = useState<{ record: AttendanceRecord, alertTriggered: boolean } | null>(null);

  const [dateFilter, setDateFilter] = useState<string>('');
  const [classFilter, setClassFilter] = useState<string>('Semua');

  const filteredAttendance = attendance.filter(a => {
    const matchClass = classFilter === 'Semua' || a.className === classFilter;
    const matchDate = !dateFilter || a.date === dateFilter;

    if ((currentUser.role === 'parent' || currentUser.role === 'student') && currentUser.studentId) {
      return a.studentId === currentUser.studentId && matchClass && matchDate;
    }
    return matchClass && matchDate;
  });

  const handleSimulateScan = async () => {
    const student = students.find(s => s.id === scanningStudentId);
    if (!student) return;

    setScanning(true);
    try {
      const qrId = `QR-STD-${student.id.split('-')[1]}`;
      const res = await onScanAttendance(qrId, scanStatusOverride, scanNotes);
      setScanSuccessResult(res);
      setScanNotes('');
    } catch (err) {
      alert('Gagal memproses presensi QR Code');
    } finally {
      setScanning(false);
    }
  };

  const handleExportCSV = () => {
    const dataToExport = filteredAttendance.map(a => ({
      'Tanggal': a.date,
      'Jam Scan': a.time,
      'Nama Siswa': a.studentName,
      'Kelas': a.className,
      'Status': a.status,
      'Metode': a.method,
      'Kode QR ID': a.qrCodeId,
      'Catatan': a.notes || ''
    }));
    exportToCSV('Laporan_Presensi_QR_SIAKAD', dataToExport);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <QrCode className="w-6 h-6 text-indigo-400" />
            Sistem Absensi Kehadiran QR Code Real-time
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Presensi siswa otomatis melalui kartu ID ber-QR code dengan pengiriman notifikasi terintegrasi ke orang tua.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-2 transition"
            id="btn-export-attendance-csv"
          >
            <FileDown className="w-4 h-4 text-emerald-400" /> Ekspor CSV
          </button>
          <button
            onClick={() => generateAttendanceReportPDF(filteredAttendance, settings.schoolName)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
            id="btn-export-attendance-pdf"
          >
            <Printer className="w-4 h-4" /> Unduh Laporan PDF
          </button>
        </div>
      </div>

      {/* Main Scanner Section & Student Cards Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scanner Simulation Panel */}
        <div className="lg:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scan className="w-4 h-4 text-indigo-400" /> Simulator Mesin Presensi QR Code
            </h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" /> Live Terminal
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pilih Siswa Presensi</label>
                <select
                  value={scanningStudentId}
                  onChange={e => setScanningStudentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-indigo-500"
                  id="select-scan-student"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Status Kehadiran</label>
                <select
                  value={scanStatusOverride}
                  onChange={e => setScanStatusOverride(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-indigo-500"
                  id="select-scan-status"
                >
                  <option value="Hadir">Hadir (Tepat Waktu)</option>
                  <option value="Terlambat">Terlambat (&gt;07:15 WIB)</option>
                  <option value="Izin">Izin (Disertai Alasan)</option>
                  <option value="Sakit">Sakit (Surat Dokter)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Catatan Presensi (Opsional)</label>
              <input
                type="text"
                value={scanNotes}
                onChange={e => setScanNotes(e.target.value)}
                placeholder="Contoh: Ban sepeda motor bocor / Izin lomba..."
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              />
            </div>

            <button
              onClick={handleSimulateScan}
              disabled={scanning}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
              id="btn-submit-qr-scan"
            >
              <Scan className="w-5 h-5" />
              <span>{scanning ? 'Memproses Presensi...' : 'Simulasi Scan Barcode / Kartu QR'}</span>
            </button>
          </div>

          {/* Success Scan Feedback Alert */}
          {scanSuccessResult && (
            <div
              className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                scanSuccessResult.alertTriggered
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
              }`}
            >
              {scanSuccessResult.alertTriggered ? (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold text-sm">
                  Presensi Terverifikasi: {scanSuccessResult.record.studentName} ({scanSuccessResult.record.status})
                </div>
                <p className="text-[11px] leading-relaxed">
                  Presensi berhasil dicatat pada jam {scanSuccessResult.record.time} WIB.
                  {scanSuccessResult.alertTriggered && (
                    <strong className="block text-amber-300 mt-1">
                      ⚠️ Push Alert & Email Peringatan Dini telah terkirim secara otomatis ke wali murid!
                    </strong>
                  )}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Print Student ID Badge with QR Code */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Cetak Kartu ID QR Siswa
          </h3>
          <p className="text-xs text-slate-400">
            Pilih siswa untuk melihat dan mencetak Kartu ID Pelajar resmi ber-QR Code untuk absensi harian.
          </p>

          <select
            value={selectedStudentForQR?.id || ''}
            onChange={e => {
              const s = students.find(std => std.id === e.target.value);
              if (s) setSelectedStudentForQR(s);
            }}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
            id="select-qr-card-student"
          >
            <option value="">-- Pilih Siswa Cetak Kartu --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.className})</option>
            ))}
          </select>

          {selectedStudentForQR && (
            <div className="p-4 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700 text-center space-y-3 shadow-xl">
              <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                {settings.schoolName}
              </div>
              <img
                src={selectedStudentForQR.photoUrl}
                alt={selectedStudentForQR.name}
                className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-blue-500 shadow-md"
              />
              <div>
                <div className="font-bold text-white text-sm">{selectedStudentForQR.name}</div>
                <div className="text-xs text-slate-300">{selectedStudentForQR.className} • NISN: {selectedStudentForQR.nisn}</div>
              </div>

              <div className="p-3 bg-white rounded-xl inline-block shadow-md">
                <QRCodeCanvas
                  value={`QR-STD-${selectedStudentForQR.id.split('-')[1]}`}
                  size={120}
                  level="H"
                />
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                ID: QR-STD-{selectedStudentForQR.id.split('-')[1]}
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-4 h-4 text-blue-400" /> Cetak Kartu ID Pelajar
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Attendance History Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-800/60 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            Riwayat Presensi Harian Real-time
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200 text-xs"
            >
              <option value="Semua">Semua Kelas</option>
              <option value="XII IPA 1">XII IPA 1</option>
              <option value="XII IPA 2">XII IPA 2</option>
              <option value="XI IPS 1">XI IPS 1</option>
              <option value="X IPA 1">X IPA 1</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 uppercase font-bold text-[10px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Tanggal & Waktu</th>
                <th className="p-3.5">Nama Siswa</th>
                <th className="p-3.5">Kelas</th>
                <th className="p-3.5 text-center">Metode</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Tidak ada riwayat presensi yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-mono text-slate-300">
                      <div>{a.date}</div>
                      <div className="text-[10px] text-slate-400">{a.time} WIB</div>
                    </td>
                    <td className="p-3.5 font-semibold text-white">{a.studentName}</td>
                    <td className="p-3.5">{a.className}</td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
                        {a.method}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                          a.status === 'Hadir'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : a.status === 'Terlambat'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 italic">{a.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
