import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  QrCode,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  Save,
  AlertCircle,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  SchoolSettings,
  PaymentMethodsSettings,
  BankAccountConfig,
  VirtualAccountConfig,
  QRISConfig
} from '../types';

interface PaymentMethodSettingsModalProps {
  settings: SchoolSettings;
  onSave: (updatedPaymentSettings: PaymentMethodsSettings) => void;
  onClose: () => void;
}

export const PaymentMethodSettingsModal: React.FC<PaymentMethodSettingsModalProps> = ({
  settings,
  onSave,
  onClose
}) => {
  const defaultSettings: PaymentMethodsSettings = settings.paymentSettings || {
    bankAccounts: [
      {
        id: 'bank-1',
        bankName: 'Bank Mandiri',
        accountNumber: '1270010889201',
        accountHolder: 'Yayasan Pendidikan Nusantara Jaya',
        instructions: 'Transfer tepat sesuai nominal tagihan. Sertakan Nomor Invoice pada berita transfer.',
        isEnabled: true
      },
      {
        id: 'bank-2',
        bankName: 'Bank BCA',
        accountNumber: '8820981234',
        accountHolder: 'Yayasan Pendidikan Nusantara Jaya',
        instructions: 'Transfer melalui m-BCA / ATM BCA. Simpan bukti transfer untuk diunggah.',
        isEnabled: true
      }
    ],
    virtualAccounts: [
      {
        id: 'va-1',
        providerName: 'Mandiri Virtual Account',
        vaNumber: '882090823482341',
        accountHolder: 'SPP SIAKAD Yayasan Nusantara',
        instructions: 'Buka Mandiri Livin -> Bayar -> Multi Payment -> Kode Perusahaan 88209.',
        isEnabled: true
      },
      {
        id: 'va-2',
        providerName: 'BCA Virtual Account',
        vaNumber: '3902108892101',
        accountHolder: 'SPP SIAKAD Yayasan Nusantara',
        instructions: 'Buka m-BCA -> m-Transfer -> BCA Virtual Account -> Masukkan No. VA.',
        isEnabled: true
      }
    ],
    qris: [
      {
        id: 'qris-1',
        merchantName: 'Yayasan Pendidikan Nusantara Jaya (SPP SIAKAD)',
        qrisCode: '00020101021226670016ID.GO.QRIS.WWW0118936009140000882090215ID10202391203930303UMI51440014ID.LINKAJA.WWW5204581253033605802ID5930YAYASAN NUSANTARA JAYA6007JAKARTA6105121506304C7B9',
        nmid: 'ID1020239120393',
        imageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021226670016ID.GO.QRIS.WWW0118936009140000882090215ID10202391203930303UMI51440014ID.LINKAJA.WWW5204581253033605802ID5930YAYASAN%20NUSANTARA%20JAYA6007JAKARTA6105121506304C7B9',
        instructions: 'Scan menggunakan GoPay, OVO, ShopeePay, BCA Mobile, Livin Mandiri, BRImo, atau M-Banking apapun.',
        isEnabled: true
      }
    ]
  };

  const [activeTab, setActiveTab] = useState<'bank' | 'va' | 'qris'>('bank');
  const [bankAccounts, setBankAccounts] = useState<BankAccountConfig[]>(defaultSettings.bankAccounts);
  const [virtualAccounts, setVirtualAccounts] = useState<VirtualAccountConfig[]>(defaultSettings.virtualAccounts);
  const [qrisList, setQrisList] = useState<QRISConfig[]>(defaultSettings.qris);

  // Form states for adding new Bank Account
  const [newBank, setNewBank] = useState<Omit<BankAccountConfig, 'id'>>({
    bankName: '',
    accountNumber: '',
    accountHolder: settings.foundationName || 'Yayasan Pendidikan Nusantara Jaya',
    instructions: 'Transfer tepat sesuai nominal tagihan.',
    isEnabled: true
  });
  const [showAddBank, setShowAddBank] = useState(false);

  // Form states for adding new VA
  const [newVA, setNewVA] = useState<Omit<VirtualAccountConfig, 'id'>>({
    providerName: '',
    vaNumber: '',
    accountHolder: 'SPP SIAKAD ' + (settings.foundationName || 'Yayasan'),
    instructions: 'Selesaikan pembayaran sebelum batas waktu.',
    isEnabled: true
  });
  const [showAddVA, setShowAddVA] = useState(false);

  const handleSaveAll = () => {
    onSave({
      bankAccounts,
      virtualAccounts,
      qris: qrisList
    });
    onClose();
  };

  const handleAddBank = () => {
    if (!newBank.bankName || !newBank.accountNumber) {
      alert('Mohon isi nama bank dan nomor rekening.');
      return;
    }
    const item: BankAccountConfig = {
      ...newBank,
      id: 'bank-' + Date.now()
    };
    setBankAccounts([...bankAccounts, item]);
    setNewBank({
      bankName: '',
      accountNumber: '',
      accountHolder: settings.foundationName || 'Yayasan Pendidikan Nusantara Jaya',
      instructions: 'Transfer tepat sesuai nominal tagihan.',
      isEnabled: true
    });
    setShowAddBank(false);
  };

  const handleAddVA = () => {
    if (!newVA.providerName || !newVA.vaNumber) {
      alert('Mohon isi nama provider dan nomor VA.');
      return;
    }
    const item: VirtualAccountConfig = {
      ...newVA,
      id: 'va-' + Date.now()
    };
    setVirtualAccounts([...virtualAccounts, item]);
    setNewVA({
      providerName: '',
      vaNumber: '',
      accountHolder: 'SPP SIAKAD ' + (settings.foundationName || 'Yayasan'),
      instructions: 'Selesaikan pembayaran sebelum batas waktu.',
      isEnabled: true
    });
    setShowAddVA(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Kustomisasi Metode Pembayaran Sekolah (Admin / Superadmin)
            </h3>
            <p className="text-xs text-slate-400">
              Atur rekening bank, Virtual Account (VA), dan QRIS resmi sekolah yang akan tampil pada seluruh dashboard pengguna.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 ${
              activeTab === 'bank'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Transfer Bank ({bankAccounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('va')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 ${
              activeTab === 'va'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Virtual Account ({virtualAccounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('qris')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 ${
              activeTab === 'qris'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-purple-400" />
            <span>Pengaturan QRIS Resmi</span>
          </button>
        </div>

        {/* TAB 1: Transfer Bank */}
        {activeTab === 'bank' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Daftar Rekening Bank Sekolah / Yayasan</span>
              <button
                onClick={() => setShowAddBank(!showAddBank)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Rekening Bank
              </button>
            </div>

            {/* Add Bank Form */}
            {showAddBank && (
              <div className="p-4 bg-slate-800/80 rounded-xl border border-blue-500/40 space-y-3 text-xs">
                <h4 className="font-bold text-blue-300">Tambah Rekening Bank Baru</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Nama Bank</label>
                    <input
                      type="text"
                      placeholder="e.g. Bank Mandiri / BCA / BRI"
                      value={newBank.bankName}
                      onChange={e => setNewBank({ ...newBank, bankName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Nomor Rekening</label>
                    <input
                      type="text"
                      placeholder="e.g. 1270010889201"
                      value={newBank.accountNumber}
                      onChange={e => setNewBank({ ...newBank, accountNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Atas Nama (Pemilik Rekening)</label>
                  <input
                    type="text"
                    value={newBank.accountHolder}
                    onChange={e => setNewBank({ ...newBank, accountHolder: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Instruksi Pembayaran</label>
                  <input
                    type="text"
                    value={newBank.instructions}
                    onChange={e => setNewBank({ ...newBank, instructions: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowAddBank(false)}
                    className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddBank}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold"
                  >
                    Simpan Bank
                  </button>
                </div>
              </div>
            )}

            {/* List Bank Accounts */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {bankAccounts.map((b, idx) => (
                <div
                  key={b.id}
                  className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{b.bankName}</span>
                      <span className="font-mono text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        {b.accountNumber}
                      </span>
                    </div>
                    <div className="text-slate-300 font-medium">a.n. {b.accountHolder}</div>
                    {b.instructions && <div className="text-[10px] text-slate-400">{b.instructions}</div>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = [...bankAccounts];
                        updated[idx].isEnabled = !updated[idx].isEnabled;
                        setBankAccounts(updated);
                      }}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                        b.isEnabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {b.isEnabled ? 'Aktif' : 'Nonaktif'}
                    </button>
                    <button
                      onClick={() => setBankAccounts(bankAccounts.filter(x => x.id !== b.id))}
                      className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition"
                      title="Hapus Rekening"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Virtual Account */}
        {activeTab === 'va' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Daftar Virtual Account (VA) Bank</span>
              <button
                onClick={() => setShowAddVA(!showAddVA)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Virtual Account
              </button>
            </div>

            {/* Add VA Form */}
            {showAddVA && (
              <div className="p-4 bg-slate-800/80 rounded-xl border border-blue-500/40 space-y-3 text-xs">
                <h4 className="font-bold text-blue-300">Tambah Virtual Account Baru</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Provider / Bank VA</label>
                    <input
                      type="text"
                      placeholder="e.g. Mandiri Virtual Account"
                      value={newVA.providerName}
                      onChange={e => setNewVA({ ...newVA, providerName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Nomor Virtual Account</label>
                    <input
                      type="text"
                      placeholder="e.g. 882090823482341"
                      value={newVA.vaNumber}
                      onChange={e => setNewVA({ ...newVA, vaNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Atas Nama (Label VA)</label>
                  <input
                    type="text"
                    value={newVA.accountHolder}
                    onChange={e => setNewVA({ ...newVA, accountHolder: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowAddVA(false)}
                    className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddVA}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold"
                  >
                    Simpan VA
                  </button>
                </div>
              </div>
            )}

            {/* List VA */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {virtualAccounts.map((va, idx) => (
                <div
                  key={va.id}
                  className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{va.providerName}</span>
                      <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        {va.vaNumber}
                      </span>
                    </div>
                    <div className="text-slate-300 font-medium">Label: {va.accountHolder}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = [...virtualAccounts];
                        updated[idx].isEnabled = !updated[idx].isEnabled;
                        setVirtualAccounts(updated);
                      }}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                        va.isEnabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {va.isEnabled ? 'Aktif' : 'Nonaktif'}
                    </button>
                    <button
                      onClick={() => setVirtualAccounts(virtualAccounts.filter(x => x.id !== va.id))}
                      className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition"
                      title="Hapus VA"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: QRIS Settings */}
        {activeTab === 'qris' && (
          <div className="space-y-4 text-xs">
            {qrisList.map((q, idx) => (
              <div key={q.id} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 flex items-center gap-2 text-sm">
                    <QrCode className="w-4 h-4 text-purple-400" /> Konfigurasi Kode QRIS Resmi Sekolah
                  </span>
                  <button
                    onClick={() => {
                      const updated = [...qrisList];
                      updated[idx].isEnabled = !updated[idx].isEnabled;
                      setQrisList(updated);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                      q.isEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {q.isEnabled ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Nama Merchant QRIS</label>
                    <input
                      type="text"
                      value={q.merchantName}
                      onChange={e => {
                        const updated = [...qrisList];
                        updated[idx].merchantName = e.target.value;
                        setQrisList(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Kode NMID QRIS</label>
                    <input
                      type="text"
                      value={q.nmid || ''}
                      onChange={e => {
                        const updated = [...qrisList];
                        updated[idx].nmid = e.target.value;
                        setQrisList(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Instruksi / Catatan Pembayaran QRIS</label>
                  <input
                    type="text"
                    value={q.instructions || ''}
                    onChange={e => {
                      const updated = [...qrisList];
                      updated[idx].instructions = e.target.value;
                      setQrisList(updated);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-slate-700/60">
                  <div className="p-2 bg-white rounded-xl shrink-0">
                    <img
                      src={q.imageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(q.qrisCode)}`}
                      alt="QRIS Preview"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1 min-w-0 flex-1">
                    <div className="font-bold text-white">Preview QR Code Otomatis</div>
                    <p className="text-slate-400">
                      Sistem akan membuat tampilan QR Code dinamis dan mengizinkan pengguna memindai langsung menggunakan dompet digital apapun (GoPay, OVO, Dana, ShopeePay, M-Banking).
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Tersimpan secara lokal & siap digunakan
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
            >
              Batal
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition"
            >
              <Save className="w-4 h-4" /> Simpan Pengaturan Metode Pembayaran
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
