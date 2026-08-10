import React from 'react';
import { Bell, Mail, Smartphone, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { NotificationLog } from '../types';

interface NotificationCenterProps {
  notifications: NotificationLog[];
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications }) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" />
            Pusat Notifikasi Email Otomatis & Push Alert
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Log riwayat pengiriman email pengingat tenggat waktu, presensi QR Code, dan peringatan keterlambatan.
          </p>
        </div>
      </div>

      {/* Notifications Table Log */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 uppercase font-bold text-[10px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Waktu Kirim</th>
                <th className="p-3.5">Tipe Notifikasi</th>
                <th className="p-3.5">Penerima (Orang Tua / Siswa)</th>
                <th className="p-3.5">Subjek Notifikasi</th>
                <th className="p-3.5">Pemicu Sistem</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Belum ada riwayat notifikasi.
                  </td>
                </tr>
              ) : (
                notifications.map(n => (
                  <tr key={n.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-mono text-slate-400">{n.sentAt}</td>
                    <td className="p-3.5">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                        {n.type === 'Email' ? (
                          <Mail className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Smartphone className="w-4 h-4 text-amber-400" />
                        )}
                        {n.type}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-white">{n.recipient}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                        {n.subject.includes('⚠️') && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        {n.subject}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{n.body}</p>
                    </td>
                    <td className="p-3.5 text-slate-400">{n.triggeredBy}</td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {n.status}
                      </span>
                    </td>
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
