import React, { useState } from 'react';
import {
  Lock,
  AlertTriangle,
  Send,
  MessageSquare,
  PhoneCall,
  Mail,
  ShieldAlert,
  CheckCircle2,
  Clock,
  FileText,
  UserCheck,
  Building2,
  ExternalLink,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { SchoolSettings, UnblockRequest, UserProfile } from '../types';

interface AppFreezeOverlayProps {
  settings: SchoolSettings;
  currentUser: UserProfile;
  onSubmitUnblockRequest: (request: Omit<UnblockRequest, 'id' | 'requestedAt' | 'status'>) => Promise<void>;
  onSwitchToSuperadmin?: () => void;
}

export const AppFreezeOverlay: React.FC<AppFreezeOverlayProps> = ({
  settings,
  currentUser,
  onSubmitUnblockRequest,
  onSwitchToSuperadmin
}) => {
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const superadminWa = settings.superadminPhone || '+6281234567890';
  const superadminEmail = settings.superadminEmail || 'lisensi@yayasan-nusantara.sch.id';
  const cleanWaNumber = superadminWa.replace(/[^0-9]/g, '');

  const waLink = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    `Halo Superadmin SIAKAD, saya ${currentUser.name} (${settings.foundationName}) ingin mengajukan konfirmasi pembayaran dan pembukaan akses lisensi yang terblokir.`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      await onSubmitUnblockRequest({
        requesterName: name || currentUser.name,
        requesterEmail: email || currentUser.email,
        requesterPhone: phone || '08123456789',
        schoolName: settings.foundationName || 'Sekolah / Yayasan',
        message,
        paymentProofUrl: proofUrl || undefined
      });
      setSubmittedSuccess(true);
      setMessage('');
      setProofUrl('');
    } catch (err) {
      alert('Gagal mengirim permohonan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-rose-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto animate-fade-in text-slate-100 font-sans">
        
        {/* Banner Alert Header */}
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-950 p-6 border-b border-rose-700/50 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
            <Lock className="w-64 h-64 text-rose-300" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
            <div className="p-3.5 bg-rose-500/20 border-2 border-rose-400 rounded-2xl shrink-0 animate-pulse">
              <ShieldAlert className="w-10 h-10 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-rose-500 text-white shadow-md">
                  Akses Terblokir / Beku
                </span>
                <span className="text-xs text-rose-200 font-medium">
                  Lisensi Expiration Guard
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                AKSES APLIKASI DIBEKUKAN / MASA LISENSI KADALUARSA
              </h1>
              <p className="text-xs text-rose-200/90 mt-1">
                Layanan SIAKAD Terpadu <strong className="text-white">{settings.foundationName}</strong> sedang dalam pembekuan oleh Superadmin.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* License Status Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-400" /> Nama Instansi / Yayasan
              </span>
              <p className="font-bold text-slate-100 text-sm truncate">{settings.foundationName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Masa Aktif Lisensi Sampai
              </span>
              <p className="font-bold text-amber-300 text-sm font-mono">
                {settings.licenseExpirationDate || 'Expired'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Status Akses
              </span>
              <span className="inline-block px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-xs">
                {settings.licenseStatus || 'Diblokir'}
              </span>
            </div>
          </div>

          {/* Freeze Reason Alert Box */}
          <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-amber-200 space-y-1">
            <h3 className="font-bold text-amber-300 flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Informasi Penonaktifan Akses:
            </h3>
            <p className="text-xs leading-relaxed text-amber-100/90">
              {settings.freezeReason ||
                'Akses aplikasi dihentikan sementara sampai pembayaran lisensi langganan diselesaikan. Semua akun staf, guru, siswa, dan orang tua tidak dapat mengakses modul sistem.'}
            </p>
          </div>

          {/* Quick Communication Hub to Superadmin */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Media Komunikasi Langsung Ke Superadmin
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold flex items-center justify-between transition group shadow-lg"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500 text-slate-950 rounded-lg font-bold">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-white">Hubungi Via WhatsApp</div>
                    <div className="text-[10px] font-mono text-emerald-400">{superadminWa}</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition" />
              </a>

              <a
                href={`mailto:${superadminEmail}?subject=Permohonan%20Pembukaan%20Akses%20SIAKAD%20-%20${encodeURIComponent(settings.foundationName)}`}
                className="p-3.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 rounded-xl text-blue-300 font-bold flex items-center justify-between transition group shadow-lg"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500 text-slate-950 rounded-lg font-bold">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-white">Kirim Email Resmi</div>
                    <div className="text-[10px] font-mono text-blue-300">{superadminEmail}</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-300 group-hover:translate-x-0.5 transition" />
              </a>
            </div>
          </div>

          {/* Interactive Unblock Form */}
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
              <div>
                <h3 className="font-bold text-slate-100 text-xs flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-400" /> Form Pengajuan Pembukaan Akses & Bukti Pembayaran
                </h3>
                <p className="text-[11px] text-slate-400">
                  Isi formulir berikut untuk langsung mengirim tiket permohonan ke Superadmin.
                </p>
              </div>
            </div>

            {submittedSuccess ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-200 space-y-2 text-center animate-fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-300">Permohonan Berhasil Terkirim Ke Superadmin!</h4>
                <p className="text-xs text-emerald-200/90">
                  Tim Superadmin akan memverifikasi bukti pembayaran dan memulihkan akses SIAKAD Anda dalam waktu singkat.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedSuccess(false)}
                  className="mt-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs"
                >
                  Kirim Pesan Lagi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1 text-[11px]">Nama Pengaju</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1 text-[11px]">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1 text-[11px]">Nomor WA / Telepon</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="08123456789"
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1 text-[11px]">
                    Catatan / Pesan Pengajuan <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Contoh: Kami dari bendahara sekolah telah melunasi tagihan lisensi perpanjangan SIAKAD untuk tahun ajaran 2026/2027. Mohon verifikasi dan aktifkan kembali..."
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 h-20 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1 text-[11px] flex items-center justify-between">
                    <span>Link / URL Bukti Transfer Pembayaran (Opsional)</span>
                    <span className="text-[10px] text-slate-400">Image URL / Drive Link</span>
                  </label>
                  <input
                    type="text"
                    value={proofUrl}
                    onChange={e => setProofUrl(e.target.value)}
                    placeholder="https:// image-url.com/bukti-transfer.jpg"
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-[11px]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Mengirim...' : 'Kirim Permohonan Ke Superadmin'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Emergency Login */}
          {onSwitchToSuperadmin && (
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
              <span>Login sebagai Superadmin untuk membuka atau mengkonfigurasi lisensi:</span>
              <button
                type="button"
                onClick={onSwitchToSuperadmin}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold rounded-lg flex items-center gap-1.5 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" /> Switch / Login Superadmin
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
