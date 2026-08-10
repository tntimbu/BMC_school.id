import React, { useState } from 'react';
import {
  Code2,
  Key,
  ShieldCheck,
  CloudCheck,
  FileSpreadsheet,
  FileDown,
  Copy,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Zap
} from 'lucide-react';
import { SchoolSettings, Student, Grade, AttendanceRecord, TuitionRecord, PPDBApplication } from '../types';
import { exportToCSV } from '../lib/csvExporter';
import { generateAttendanceReportPDF, generatePPDBReportPDF } from '../lib/pdfExporter';

interface ThirdPartyAPIExportProps {
  settings: SchoolSettings;
  students: Student[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  tuition: TuitionRecord[];
  ppdb: PPDBApplication[];
  onUpdateApiKey: (newKey: string) => Promise<void>;
}

export const ThirdPartyAPIExport: React.FC<ThirdPartyAPIExportProps> = ({
  settings,
  students,
  grades,
  attendance,
  tuition,
  ppdb,
  onUpdateApiKey
}) => {
  const [copied, setCopied] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loadingApi, setLoadingApi] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(settings.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestApi = async () => {
    setLoadingApi(true);
    try {
      const res = await fetch(`/api/v1/third-party/students?api_key=${settings.apiKey}`);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setApiResponse(JSON.stringify({ error: 'Gagal terhubung ke API endpoint' }, null, 2));
    } finally {
      setLoadingApi(false);
    }
  };

  const handleGenerateNewKey = async () => {
    const newKey = `sk_live_nusantara_${Math.random().toString(36).substring(2, 12)}`;
    await onUpdateApiKey(newKey);
    alert('API Key baru berhasil diterbitkan!');
  };

  const handleExportAllCSV = () => {
    const studentData = students.map(s => ({
      NISN: s.nisn,
      Nama: s.name,
      Kelas: s.className,
      Wali: s.parentName,
      Status: s.status
    }));
    exportToCSV('Export_Seluruh_Data_Siswa_SIAKAD', studentData);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-cyan-400" />
            Integrasi API Pihak Ketiga & Ekspor Data Laporan
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Endpoint REST API aman dengan lisensi token untuk sinkronisasi data Dapodik, E-Rapor, dan sistem eksternal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAllCSV}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition"
          >
            <FileSpreadsheet className="w-4 h-4" /> Ekspor Seluruh Master Data (CSV)
          </button>
        </div>
      </div>

      {/* Security & Cloud Sync Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Enkripsi Data Tingkat Lanjut</div>
            <div className="text-sm font-bold text-white">{settings.encryptionAlgorithm}</div>
            <span className="text-[10px] text-emerald-400 font-medium">Aman & Terenkripsi Enkripsi End-to-End</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <CloudCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Sinkronisasi Awan Lintas Perangkat</div>
            <div className="text-sm font-bold text-white">Status: ONLINE (Real-time Cloud Sync)</div>
            <span className="text-[10px] text-slate-400">Terakhir Sync: {new Date(settings.lastCloudSync).toLocaleTimeString('id-ID')}</span>
          </div>
        </div>

      </div>

      {/* API Key Management & Endpoint Testing */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" /> Kunci Akses API (API Key) & Endpoint REST
          </h3>
          <button
            onClick={handleGenerateNewKey}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Terbitkan Key Baru
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Secret API Key (X-API-KEY)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={settings.apiKey}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs"
              />
              <button
                onClick={handleCopyKey}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold border border-slate-700 flex items-center gap-1.5 shrink-0"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Salin Key'}</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
            <div className="text-slate-500 mb-1">// Endpoint REST API Sinkronisasi Data Siswa:</div>
            <div className="text-emerald-400 font-bold">
              GET /api/v1/third-party/students?api_key={settings.apiKey}
            </div>
          </div>

          <button
            onClick={handleTestApi}
            disabled={loadingApi}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition"
          >
            <Terminal className="w-4 h-4" />
            <span>{loadingApi ? 'Menguji API Endpoint...' : 'Uji Respons API Live'}</span>
          </button>

          {apiResponse && (
            <div className="mt-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Respons JSON Server:</div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-60">
                {apiResponse}
              </pre>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
