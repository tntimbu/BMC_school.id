import React, { useState } from 'react';
import {
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock,
  FileDown,
  Printer,
  Search,
  Sparkles,
  Send,
  X
} from 'lucide-react';
import { PPDBApplication, UserProfile, SchoolSettings } from '../types';
import { generatePPDBReportPDF } from '../lib/pdfExporter';
import { exportToCSV } from '../lib/csvExporter';

interface PPDBOnlineProps {
  ppdb: PPDBApplication[];
  currentUser: UserProfile;
  settings: SchoolSettings;
  onCreatePPDB: (data: Partial<PPDBApplication>) => Promise<void>;
  onUpdatePPDB: (id: string, data: Partial<PPDBApplication>) => Promise<void>;
}

export const PPDBOnline: React.FC<PPDBOnlineProps> = ({
  ppdb,
  currentUser,
  settings,
  onCreatePPDB,
  onUpdatePPDB
}) => {
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [birthPlaceDate, setBirthPlaceDate] = useState<string>('');
  const [previousSchool, setPreviousSchool] = useState<string>('');
  const [parentName, setParentName] = useState<string>('');
  const [parentPhone, setParentPhone] = useState<string>('');
  const [parentEmail, setParentEmail] = useState<string>('');
  const [chosenMajor, setChosenMajor] = useState<'IPA' | 'IPS' | 'Bahasa' | 'RPL' | 'TKJ'>('IPA');

  const filteredPPDB = ppdb.filter(p =>
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.previousSchool.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreatePPDB({
        fullName,
        gender,
        birthPlaceDate,
        previousSchool,
        parentName,
        parentPhone,
        parentEmail,
        chosenMajor
      });
      setShowApplyModal(false);
      setFullName('');
      setBirthPlaceDate('');
      setPreviousSchool('');
      setParentName('');
      setParentPhone('');
      setParentEmail('');
      alert('Pendaftaran PPDB Online Berhasil Dikirim! Nomor registrasi telah diterbitkan.');
    } catch (err) {
      alert('Gagal mengirim pendaftaran PPDB');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'Lolos Berkas' | 'Diterima' | 'Ditolak') => {
    try {
      await onUpdatePPDB(id, { status });
    } catch (err) {
      alert('Gagal memperbarui status PPDB');
    }
  };

  const handleExportCSV = () => {
    const dataToExport = filteredPPDB.map(p => ({
      'No Registrasi': p.registrationNo,
      'Nama Lengkap': p.fullName,
      'Jenis Kelamin': p.gender,
      'Tempat Tgl Lahir': p.birthPlaceDate,
      'Asal Sekolah': p.previousSchool,
      'Jurusan': p.chosenMajor,
      'Nama Orang Tua': p.parentName,
      'Email': p.parentEmail,
      'Telepon': p.parentPhone,
      'Status PPDB': p.status,
      'Nilai Seleksi': p.examScore || '-'
    }));
    exportToCSV('Data_Pendaftaran_PPDB_2026', dataToExport);
  };

  const canManage = currentUser.role === 'admin' || currentUser.role === 'teacher';

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-emerald-400" />
            Penerimaan Peserta Didik Baru (PPDB Online)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Portal pendaftaran siswa baru secara daring dengan verifikasi berkas dan pengumuman hasil seleksi otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-2 transition"
            id="btn-export-ppdb-csv"
          >
            <FileDown className="w-4 h-4 text-emerald-400" /> Ekspor CSV
          </button>
          <button
            onClick={() => generatePPDBReportPDF(filteredPPDB, settings.schoolName)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-2 transition"
            id="btn-export-ppdb-pdf"
          >
            <Printer className="w-4 h-4 text-blue-400" /> Laporan PDF
          </button>
          <button
            onClick={() => setShowApplyModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition"
            id="btn-open-ppdb-form"
          >
            <UserPlus className="w-4 h-4" /> Form Pendaftaran Baru
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari no. registrasi / nama pendaftar..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-400 hidden sm:block">
          Total Pendaftar: <strong className="text-white">{filteredPPDB.length} Calon Siswa</strong>
        </div>
      </div>

      {/* PPDB Applicants Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 uppercase font-bold text-[10px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">No. Reg</th>
                <th className="p-3.5">Nama Pendaftar</th>
                <th className="p-3.5">Asal Sekolah</th>
                <th className="p-3.5">Jurusan</th>
                <th className="p-3.5">Kontak Wali</th>
                <th className="p-3.5 text-center">Nilai Ujian</th>
                <th className="p-3.5 text-center">Status</th>
                {canManage && <th className="p-3.5 text-right">Verifikasi Admin</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPPDB.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Belum ada data pendaftar PPDB.
                  </td>
                </tr>
              ) : (
                filteredPPDB.map(app => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">{app.registrationNo}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{app.fullName}</div>
                      <div className="text-[10px] text-slate-400">{app.birthPlaceDate} • ({app.gender})</div>
                    </td>
                    <td className="p-3.5 text-slate-200">{app.previousSchool}</td>
                    <td className="p-3.5 font-semibold text-blue-300">{app.chosenMajor}</td>
                    <td className="p-3.5">
                      <div>{app.parentName}</div>
                      <div className="text-[10px] text-slate-400">{app.parentPhone}</div>
                    </td>
                    <td className="p-3.5 text-center font-bold text-white">
                      {app.examScore !== undefined ? app.examScore : '-'}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                          app.status === 'Diterima'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : app.status === 'Lolos Berkas'
                            ? 'bg-blue-500/20 text-blue-300'
                            : app.status === 'Ditolak'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    {canManage && (
                      <td className="p-3.5 text-right space-x-1">
                        {app.status === 'Menunggu Verifikasi' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'Lolos Berkas')}
                            className="px-2 py-1 bg-blue-600/30 hover:bg-blue-600 text-blue-300 rounded text-[10px] font-bold"
                          >
                            Loloskan
                          </button>
                        )}
                        {app.status === 'Lolos Berkas' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'Diterima')}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold"
                          >
                            Terima
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'Ditolak')}
                          className="px-2 py-1 bg-rose-600/30 hover:bg-rose-600 text-rose-300 rounded text-[10px] font-bold"
                        >
                          Tolak
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Pendaftaran PPDB Online Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Formulir Pendaftaran PPDB Online 2026
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap Calon Siswa</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Contoh: Raya Cahya Kamila"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pilihan Jurusan</label>
                  <select
                    value={chosenMajor}
                    onChange={e => setChosenMajor(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  >
                    <option value="IPA">IPA (MIPA)</option>
                    <option value="IPS">IPS (Sosial)</option>
                    <option value="Bahasa">Bahasa & Budaya</option>
                    <option value="RPL">Rekomendasi RPL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tempat & Tanggal Lahir</label>
                <input
                  type="text"
                  value={birthPlaceDate}
                  onChange={e => setBirthPlaceDate(e.target.value)}
                  placeholder="Jakarta, 12 Mei 2011"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Asal Sekolah (SMP / MTs)</label>
                <input
                  type="text"
                  value={previousSchool}
                  onChange={e => setPreviousSchool(e.target.value)}
                  placeholder="SMP Negeri 115 Jakarta"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    placeholder="Nama Orang Tua"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">No. WhatsApp Orang Tua</label>
                  <input
                    type="text"
                    value={parentPhone}
                    onChange={e => setParentPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Orang Tua / Siswa</label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={e => setParentEmail(e.target.value)}
                  placeholder="email.orangtua@gmail.com"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Mengirim...' : 'Kirim Pendaftaran'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
