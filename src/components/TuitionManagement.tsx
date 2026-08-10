import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  FileDown,
  QrCode,
  DollarSign,
  Send,
  X,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  Settings,
  Eye,
  XCircle,
  Sparkles,
  Info,
  BadgeCheck
} from 'lucide-react';
import {
  TuitionRecord,
  UserProfile,
  SchoolSettings,
  Student,
  PaymentMethodsSettings
} from '../types';
import { generateTuitionReceiptPDF } from '../lib/pdfExporter';
import { exportToCSV } from '../lib/csvExporter';
import { PaymentMethodSettingsModal } from './PaymentMethodSettingsModal';

interface TuitionManagementProps {
  tuition: TuitionRecord[];
  students: Student[];
  currentUser: UserProfile;
  settings: SchoolSettings;
  onPayTuition: (id: string, method: string) => Promise<void>;
  onSubmitPaymentProof?: (
    id: string,
    details: {
      method: string;
      selectedDetail: string;
      transactionRef: string;
      proofUrl?: string;
    }
  ) => void;
  onVerifyTuition?: (
    id: string,
    status: 'Lunas' | 'Ditolak',
    verifierName: string,
    notes?: string
  ) => void;
  onSavePaymentSettings?: (updatedSettings: PaymentMethodsSettings) => void;
}

export const TuitionManagement: React.FC<TuitionManagementProps> = ({
  tuition,
  students,
  currentUser,
  settings,
  onPayTuition,
  onSubmitPaymentProof,
  onVerifyTuition,
  onSavePaymentSettings
}) => {
  const isAdminOrSuper = currentUser.role === 'admin' || currentUser.role === 'superadmin';

  const [selectedRecordForPayment, setSelectedRecordForPayment] = useState<TuitionRecord | null>(null);
  const [selectedRecordForVerification, setSelectedRecordForVerification] = useState<TuitionRecord | null>(null);

  // Modal for payment settings configuration
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Payment method selection in payment modal
  const [paymentCategory, setPaymentCategory] = useState<'QRIS' | 'Virtual Account' | 'Transfer Bank' | 'Tunai / Kasir'>('Transfer Bank');
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<number>(0);
  const [transactionRefInput, setTransactionRefInput] = useState<string>('');
  const [proofNoteInput, setProofNoteInput] = useState<string>('');

  // Rejection modal state
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');
  const [showRejectionForm, setShowRejectionForm] = useState<boolean>(false);

  const [processing, setProcessing] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const paymentConfig: PaymentMethodsSettings = settings.paymentSettings || {
    bankAccounts: [
      {
        id: 'bank-1',
        bankName: 'Bank Mandiri',
        accountNumber: '1270010889201',
        accountHolder: settings.foundationName || 'Yayasan Pendidikan Nusantara Jaya',
        instructions: 'Transfer tepat sesuai nominal. Cantumkan Nomor Invoice pada berita transfer.',
        isEnabled: true
      },
      {
        id: 'bank-2',
        bankName: 'Bank BCA',
        accountNumber: '8820981234',
        accountHolder: settings.foundationName || 'Yayasan Pendidikan Nusantara Jaya',
        instructions: 'Transfer via m-BCA / ATM BCA. Simpan bukti transfer.',
        isEnabled: true
      }
    ],
    virtualAccounts: [
      {
        id: 'va-1',
        providerName: 'Mandiri Virtual Account',
        vaNumber: '882090823482341',
        accountHolder: 'SPP SIAKAD Yayasan Nusantara',
        instructions: 'Livin Mandiri -> Bayar -> Multi Payment -> 88209.',
        isEnabled: true
      },
      {
        id: 'va-2',
        providerName: 'BCA Virtual Account',
        vaNumber: '3902108892101',
        accountHolder: 'SPP SIAKAD Yayasan Nusantara',
        instructions: 'm-BCA -> Transfer -> BCA Virtual Account.',
        isEnabled: true
      }
    ],
    qris: [
      {
        id: 'qris-1',
        merchantName: (settings.foundationName || 'Yayasan Nusantara') + ' (SPP SIAKAD)',
        qrisCode: '00020101021226670016ID.GO.QRIS.WWW0118936009140000882090215ID10202391203930303UMI51440014ID.LINKAJA.WWW5204581253033605802ID5930YAYASAN NUSANTARA JAYA6007JAKARTA6105121506304C7B9',
        nmid: 'ID1020239120393',
        imageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021226670016ID.GO.QRIS.WWW0118936009140000882090215ID10202391203930303UMI51440014ID.LINKAJA.WWW5204581253033605802ID5930YAYASAN%20NUSANTARA%20JAYA6007JAKARTA6105121506304C7B9',
        instructions: 'Scan menggunakan M-Banking atau e-Wallet apapun (GoPay, OVO, Dana, ShopeePay, BCA, Livin, BRImo).',
        isEnabled: true
      }
    ]
  };

  const activeBankList = paymentConfig.bankAccounts.filter(b => b.isEnabled);
  const activeVAList = paymentConfig.virtualAccounts.filter(v => v.isEnabled);
  const activeQRISList = paymentConfig.qris.filter(q => q.isEnabled);

  const filteredTuition = tuition.filter(t => {
    const matchStatus = filterStatus === 'Semua' || t.status === filterStatus;
    if ((currentUser.role === 'parent' || currentUser.role === 'student') && currentUser.studentId) {
      return t.studentId === currentUser.studentId && matchStatus;
    }
    return matchStatus;
  });

  const totalCollected = tuition
    .filter(t => t.status === 'Lunas')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalPendingVerification = tuition.filter(t => t.status === 'Menunggu Konfirmasi').length;

  const totalPendingAmount = tuition
    .filter(t => t.status !== 'Lunas')
    .reduce((acc, t) => acc + t.amount, 0);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Submit payment from user side
  const handleExecutePaymentSubmission = async () => {
    if (!selectedRecordForPayment) return;

    let selectedDetailStr = '';
    if (paymentCategory === 'Transfer Bank' && activeBankList[selectedAccountIndex]) {
      const b = activeBankList[selectedAccountIndex];
      selectedDetailStr = `${b.bankName} - ${b.accountNumber} (a.n. ${b.accountHolder})`;
    } else if (paymentCategory === 'Virtual Account' && activeVAList[selectedAccountIndex]) {
      const v = activeVAList[selectedAccountIndex];
      selectedDetailStr = `${v.providerName} - No. VA: ${v.vaNumber}`;
    } else if (paymentCategory === 'QRIS' && activeQRISList[0]) {
      const q = activeQRISList[0];
      selectedDetailStr = `QRIS Merchant: ${q.merchantName} (NMID: ${q.nmid || '-'})`;
    } else {
      selectedDetailStr = 'Kasir / Tata Usaha Sekolah';
    }

    const refNo = transactionRefInput.trim() || `TRX-${Date.now().toString().slice(-6)}`;

    setProcessing(true);
    try {
      if (onSubmitPaymentProof) {
        onSubmitPaymentProof(selectedRecordForPayment.id, {
          method: paymentCategory,
          selectedDetail: selectedDetailStr,
          transactionRef: refNo,
          proofUrl: proofNoteInput
        });
      } else {
        await onPayTuition(selectedRecordForPayment.id, paymentCategory);
      }

      const successText = `Pembayaran SPP Bulan ${selectedRecordForPayment.month} atas nama ${selectedRecordForPayment.studentName} BERHASIL DIKIRIM! Status saat ini: MENUNGGU VERIFIKASI SEKOLAH.`;
      setToastMessage(successText);
      setSelectedRecordForPayment(null);
      setTransactionRefInput('');
      setProofNoteInput('');
    } catch (err) {
      alert('Gagal memproses pengiriman pembayaran.');
    } finally {
      setProcessing(false);
    }
  };

  // Admin approves payment
  const handleApproveVerification = (item: TuitionRecord) => {
    if (onVerifyTuition) {
      onVerifyTuition(item.id, 'Lunas', currentUser.name);
    }
    const msg = `Notifikasi: Tagihan SPP atas nama ${item.studentName} (${item.month}) sebesar Rp ${item.amount.toLocaleString('id-ID')} telah dibayar dan SUDAH DIVERIFIKASI oleh pihak sekolah (${currentUser.name})!`;
    setToastMessage(msg);
    setSelectedRecordForVerification(null);
  };

  // Admin rejects payment
  const handleRejectVerification = (item: TuitionRecord) => {
    if (!rejectionReasonInput.trim()) {
      alert('Mohon tuliskan alasan penolakan pembayaran.');
      return;
    }
    if (onVerifyTuition) {
      onVerifyTuition(item.id, 'Ditolak', currentUser.name, rejectionReasonInput);
    }
    setToastMessage(`Pembayaran SPP atas nama ${item.studentName} ditolak. Alasan: ${rejectionReasonInput}`);
    setShowRejectionForm(false);
    setRejectionReasonInput('');
    setSelectedRecordForVerification(null);
  };

  const handleExportCSV = () => {
    const dataToExport = filteredTuition.map(t => ({
      'No Invoice': t.invoiceNo,
      'Nama Siswa': t.studentName,
      'Kelas': t.className,
      'Bulan / Tahun': `${t.month} ${t.year}`,
      'Jumlah SPP': t.amount,
      'Jatuh Tempo': t.dueDate,
      'Status': t.status,
      'Metode Pembayaran': t.paymentMethod || '-',
      'Rincian Rekening/VA': t.selectedPaymentDetail || '-',
      'No Referensi Transaksi': t.transactionRef || '-',
      'Diverifikasi Oleh': t.verifiedBy || '-',
      'Tanggal Bayar': t.paidAt || '-'
    }));
    exportToCSV('Laporan_Pembayaran_SPP_SIAKAD', dataToExport);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs text-emerald-200 animate-fade-in shadow-xl">
          <div className="flex items-center gap-2.5">
            <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="font-semibold">{toastMessage}</div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-400" />
            Manajemen Biaya Pendidikan & Verifikasi SPP
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sistem pembayaran terpadu via Transfer Bank, Virtual Account, dan QRIS dengan alur verifikasi resmi oleh Admin / Superadmin.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAdminOrSuper && (
            <button
              onClick={() => setShowSettingsModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition"
              id="btn-customize-payment-methods"
            >
              <Settings className="w-4 h-4 text-amber-200" />
              <span>Atur Metode Pembayaran (Bank, VA, QRIS)</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-2 transition"
            id="btn-export-tuition-csv"
          >
            <FileDown className="w-4 h-4 text-emerald-400" /> Ekspor CSV Keuangan
          </button>
        </div>
      </div>

      {/* Admin Verification Alert Bar (If any pending verification) */}
      {isAdminOrSuper && totalPendingVerification > 0 && (
        <div className="p-4 bg-amber-500/15 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 shrink-0">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <span className="font-bold text-amber-300 text-sm">
                {totalPendingVerification} Pembayaran SPP Menunggu Verifikasi Sekolah!
              </span>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Silakan periksa dan verifikasi bukti transfer pembayaran dari siswa/orang tua agar status tagihan menjadi LUNAS.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterStatus('Menunggu Konfirmasi')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shrink-0 shadow flex items-center gap-1.5 transition"
          >
            <Eye className="w-4 h-4" /> Lihat {totalPendingVerification} Pembayaran
          </button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Total SPP Terkumpul</div>
            <div className="text-lg font-bold text-white">Rp {totalCollected.toLocaleString('id-ID')}</div>
            <span className="text-[10px] text-emerald-400 font-medium">Tercatat Transparan</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl relative">
            <Clock className="w-6 h-6" />
            {totalPendingVerification > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Menunggu Verifikasi</div>
            <div className="text-lg font-bold text-amber-300">{totalPendingVerification} Tagihan</div>
            <span className="text-[10px] text-amber-400 font-medium">Memerlukan Persetujuan Admin</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Total Belum Lunas</div>
            <div className="text-lg font-bold text-white">Rp {totalPendingAmount.toLocaleString('id-ID')}</div>
            <span className="text-[10px] text-rose-400 font-medium">Sistem Pengingat Aktif</span>
          </div>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['Semua', 'Menunggu Konfirmasi', 'Lunas', 'Belum Lunas', 'Terlambat', 'Ditolak'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 flex items-center gap-1.5 ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{st}</span>
              {st === 'Menunggu Konfirmasi' && totalPendingVerification > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold">
                  {totalPendingVerification}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tuition Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 uppercase font-bold text-[10px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Invoice</th>
                <th className="p-3.5">Nama Siswa</th>
                <th className="p-3.5">Bulan Tagihan</th>
                <th className="p-3.5">Jumlah SPP</th>
                <th className="p-3.5">Metode & Ref</th>
                <th className="p-3.5 text-center">Status Pembayaran</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTuition.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ada data tagihan SPP sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredTuition.map(item => {
                  const isPending = item.status === 'Menunggu Konfirmasi';
                  const isPaid = item.status === 'Lunas';
                  const isRejected = item.status === 'Ditolak';

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-mono text-blue-300 font-semibold">{item.invoiceNo}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{item.studentName}</div>
                        <div className="text-[10px] text-slate-400">{item.className} ({item.educationLevel})</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-200">{item.month}</td>
                      <td className="p-3.5 font-bold text-white">Rp {item.amount.toLocaleString('id-ID')}</td>
                      
                      <td className="p-3.5">
                        {item.paymentMethod ? (
                          <div className="space-y-0.5 text-[11px]">
                            <span className="font-semibold text-amber-300">{item.paymentMethod}</span>
                            {item.selectedPaymentDetail && (
                              <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                                {item.selectedPaymentDetail}
                              </div>
                            )}
                            {item.transactionRef && (
                              <div className="text-[10px] font-mono text-emerald-400">
                                Ref: {item.transactionRef}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">- Belum Dibayar -</span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase inline-flex items-center gap-1 ${
                            isPaid
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                              : isRejected
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : item.status === 'Terlambat'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {isPending && <Clock className="w-3 h-3 text-amber-400" />}
                          {isPaid && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          {isRejected && <XCircle className="w-3 h-3 text-rose-400" />}
                          <span>{item.status}</span>
                        </span>
                        {isPaid && item.verifiedBy && (
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            Diverifikasi oleh: <strong className="text-slate-300">{item.verifiedBy}</strong>
                          </div>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPaid ? (
                            <button
                              onClick={() => generateTuitionReceiptPDF(item, settings.schoolName)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg font-semibold border border-slate-700 flex items-center gap-1 transition"
                              title="Cetak Kwitansi PDF"
                              id={`btn-kwitansi-${item.id}`}
                            >
                              <Printer className="w-3.5 h-3.5" /> Kwitansi
                            </button>
                          ) : isPending && isAdminOrSuper ? (
                            <button
                              onClick={() => setSelectedRecordForVerification(item)}
                              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold shadow flex items-center gap-1 transition"
                              id={`btn-verifikasi-${item.id}`}
                            >
                              <ShieldCheck className="w-3.5 h-3.5" /> Verifikasi Pembayaran
                            </button>
                          ) : isPending && !isAdminOrSuper ? (
                            <span className="text-[11px] text-amber-400 font-semibold italic bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                              Proses Verifikasi Sekolah
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedRecordForPayment(item)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow flex items-center gap-1 transition"
                              id={`btn-bayar-${item.id}`}
                            >
                              <CreditCard className="w-3.5 h-3.5" /> Bayar SPP
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER PAYMENT MODAL */}
      {selectedRecordForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedRecordForPayment(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold flex items-center gap-2 mb-1 text-white">
              <CreditCard className="w-5 h-5 text-amber-400" />
              Pembayaran SPP Bulan {selectedRecordForPayment.month}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Siswa: <strong>{selectedRecordForPayment.studentName}</strong> • {selectedRecordForPayment.className}
            </p>

            {/* Nominal summary */}
            <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs mb-4 space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Tagihan SPP ({selectedRecordForPayment.month}):</span>
                <span className="font-bold text-white">Rp {selectedRecordForPayment.amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Biaya Layanan:</span>
                <span className="text-emerald-400 font-bold">Rp 0 (Gratis)</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between text-sm">
                <span className="font-bold text-white">Total Transfer:</span>
                <span className="font-extrabold text-blue-400 text-base">
                  Rp {selectedRecordForPayment.amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Payment Category Tabs */}
            <div className="space-y-3 mb-4">
              <label className="block text-xs text-slate-300 font-bold uppercase tracking-wider">
                Pilih Metode Pembayaran
              </label>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'Transfer Bank', label: 'Transfer Bank', icon: CreditCard, count: activeBankList.length },
                  { id: 'Virtual Account', label: 'Virtual Account', icon: Building2, count: activeVAList.length },
                  { id: 'QRIS', label: 'QRIS Instant', icon: QrCode, count: activeQRISList.length },
                  { id: 'Tunai / Kasir', label: 'Kasir Sekolah', icon: DollarSign, count: 1 }
                ].map(m => {
                  const Icon = m.icon;
                  const isSelected = paymentCategory === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setPaymentCategory(m.id as any);
                        setSelectedAccountIndex(0);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white font-bold ring-1 ring-blue-500'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate">{m.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Selected Category Details */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs mb-4 space-y-3">
              
              {/* Category: Transfer Bank */}
              {paymentCategory === 'Transfer Bank' && (
                <div className="space-y-3">
                  <label className="block font-semibold text-slate-300">Pilih Rekening Bank Sekolah:</label>
                  <div className="space-y-2">
                    {activeBankList.map((b, idx) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedAccountIndex(idx)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                          selectedAccountIndex === idx
                            ? 'bg-blue-900/30 border-blue-500 ring-1 ring-blue-500'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white text-sm">{b.bankName}</div>
                          <div className="font-mono text-amber-300 font-bold mt-0.5">{b.accountNumber}</div>
                          <div className="text-[10px] text-slate-400">a.n. {b.accountHolder}</div>
                        </div>

                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleCopy(b.accountNumber);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-[10px] font-bold border border-slate-700 flex items-center gap-1 shrink-0"
                        >
                          {copiedText === b.accountNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedText === b.accountNumber ? 'Tersalin' : 'Salin Rek'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  {activeBankList[selectedAccountIndex]?.instructions && (
                    <p className="text-[10px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      💡 {activeBankList[selectedAccountIndex].instructions}
                    </p>
                  )}
                </div>
              )}

              {/* Category: Virtual Account */}
              {paymentCategory === 'Virtual Account' && (
                <div className="space-y-3">
                  <label className="block font-semibold text-slate-300">Pilih Provider Virtual Account:</label>
                  <div className="space-y-2">
                    {activeVAList.map((v, idx) => (
                      <div
                        key={v.id}
                        onClick={() => setSelectedAccountIndex(idx)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                          selectedAccountIndex === idx
                            ? 'bg-emerald-900/30 border-emerald-500 ring-1 ring-emerald-500'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white text-sm">{v.providerName}</div>
                          <div className="font-mono text-emerald-300 font-bold mt-0.5">{v.vaNumber}</div>
                          <div className="text-[10px] text-slate-400">Label: {v.accountHolder}</div>
                        </div>

                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleCopy(v.vaNumber);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-[10px] font-bold border border-slate-700 flex items-center gap-1 shrink-0"
                        >
                          {copiedText === v.vaNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedText === v.vaNumber ? 'Tersalin' : 'Salin VA'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  {activeVAList[selectedAccountIndex]?.instructions && (
                    <p className="text-[10px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      💡 {activeVAList[selectedAccountIndex].instructions}
                    </p>
                  )}
                </div>
              )}

              {/* Category: QRIS */}
              {paymentCategory === 'QRIS' && activeQRISList[0] && (
                <div className="text-center space-y-2">
                  <div className="font-bold text-white text-sm">{activeQRISList[0].merchantName}</div>
                  <div className="text-[10px] text-slate-400">NMID: {activeQRISList[0].nmid}</div>

                  <div className="p-3 bg-white rounded-2xl inline-block my-1 shadow-lg">
                    <img
                      src={activeQRISList[0].imageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(activeQRISList[0].qrisCode)}`}
                      alt="QRIS Sekolah"
                      className="w-40 h-40 object-contain mx-auto"
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                    {activeQRISList[0].instructions}
                  </p>
                </div>
              )}

              {/* Category: Kasir */}
              {paymentCategory === 'Tunai / Kasir' && (
                <div className="space-y-2">
                  <div className="font-bold text-white">Pembayaran Langsung di Lokasi Sekolah</div>
                  <p className="text-slate-400 text-[11px]">
                    Silakan kunjungi Loket Bendahara / Tata Usaha {settings.schoolName} pada jam kerja (07:30 - 15:00 WIB) untuk membayar tunai dan mendapatkan kwitansi fisik.
                  </p>
                </div>
              )}

            </div>

            {/* Input Form for Ref & Proof */}
            <div className="space-y-3 mb-5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nomor Referensi Transaksi / Kode Bukti Transfer <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: TRX-BCA-981231 atau No. Struk Transfer"
                  value={transactionRefInput}
                  onChange={e => setTransactionRefInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Catatan Tambahan / Link Bukti Transfer (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Diberitahukan dari rekening a.n. Bapak Hendra"
                  value={proofNoteInput}
                  onChange={e => setProofNoteInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Submit Button */}
            <button
              onClick={handleExecutePaymentSubmission}
              disabled={processing}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
              id="btn-confirm-payment"
            >
              <Send className="w-4 h-4" />
              <span>{processing ? 'Mengirimkan Bukti...' : 'Kirim Pembayaran untuk Diverifikasi Sekolah'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ADMIN PAYMENT VERIFICATION MODAL */}
      {selectedRecordForVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative my-8">
            <button
              onClick={() => {
                setSelectedRecordForVerification(null);
                setShowRejectionForm(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
              <h3 className="text-lg font-bold text-white">
                Verifikasi Pembayaran SPP Sekolah
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Pemeriksaan Bukti Transfer Pembayaran SPP siswa oleh Admin / Superadmin.
            </p>

            {/* Invoice Info Card */}
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-2 mb-4">
              <div className="flex justify-between border-b border-slate-700/60 pb-2">
                <span className="text-slate-400">Nomor Invoice:</span>
                <span className="font-mono font-bold text-blue-300">{selectedRecordForVerification.invoiceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nama Siswa:</span>
                <span className="font-bold text-white">{selectedRecordForVerification.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kelas / Unit:</span>
                <span className="text-slate-200">{selectedRecordForVerification.className} ({selectedRecordForVerification.educationLevel})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bulan Tagihan:</span>
                <span className="text-slate-200 font-semibold">{selectedRecordForVerification.month}</span>
              </div>
              <div className="flex justify-between text-sm pt-1 border-t border-slate-700/60">
                <span className="font-bold text-slate-300">Nominal Tagihan:</span>
                <span className="font-extrabold text-emerald-400">
                  Rp {selectedRecordForVerification.amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Transfer Details Card */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-2 mb-5">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-400" /> Detail Pembayaran yang Diajukan
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Metode Dipilih:</span>
                <span className="font-bold text-white">{selectedRecordForVerification.paymentMethod || 'Transfer Bank'}</span>
              </div>
              {selectedRecordForVerification.selectedPaymentDetail && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Rekening Tujuan:</span>
                  <span className="text-slate-200 text-right">{selectedRecordForVerification.selectedPaymentDetail}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">No. Referensi Transaksi:</span>
                <span className="font-mono text-emerald-300 font-bold">{selectedRecordForVerification.transactionRef || '-'}</span>
              </div>
              {selectedRecordForVerification.proofUrl && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Catatan/Bukti:</span>
                  <span className="text-slate-300 italic">{selectedRecordForVerification.proofUrl}</span>
                </div>
              )}
            </div>

            {/* Rejection Input Form if toggled */}
            {showRejectionForm ? (
              <div className="space-y-3 mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs">
                <label className="block font-bold text-rose-300">
                  Tuliskan Alasan Penolakan Pembayaran:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nominal transfer tidak sesuai atau dana belum masuk rekening"
                  value={rejectionReasonInput}
                  onChange={e => setRejectionReasonInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowRejectionForm(false)}
                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleRejectVerification(selectedRecordForVerification)}
                    className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold"
                  >
                    Konfirmasi Penolakan
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowRejectionForm(true)}
                  className="flex-1 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <XCircle className="w-4 h-4" /> Tolak Pembayaran
                </button>
                <button
                  onClick={() => handleApproveVerification(selectedRecordForVerification)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" /> Setujui & Verifikasi
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* SETTINGS MODAL FOR CUSTOM PAYMENT METHODS */}
      {showSettingsModal && onSavePaymentSettings && (
        <PaymentMethodSettingsModal
          settings={settings}
          onSave={onSavePaymentSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

    </div>
  );
};
