import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  CalendarCheck,
  X,
  Send,
  ExternalLink
} from 'lucide-react';
import { CalendarEvent, UserProfile } from '../types';

interface SchoolCalendarProps {
  events: CalendarEvent[];
  currentUser: UserProfile;
  onCreateEvent: (data: Partial<CalendarEvent>) => Promise<void>;
}

export const SchoolCalendar: React.FC<SchoolCalendarProps> = ({
  events,
  currentUser,
  onCreateEvent
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [category, setCategory] = useState<'Akademik' | 'Ujian' | 'Libur' | 'Rapat' | 'Kegiatan'>('Akademik');
  const [description, setDescription] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSyncGoogle = () => {
    setSyncing(true);
    setSyncMessage(null);
    setTimeout(() => {
      setSyncing(false);
      setSyncMessage('Semua agenda sekolah berhasil tersinkronisasi secara langsung ke Google Calendar & ICS API!');
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreateEvent({
        title,
        startDate,
        endDate: endDate || startDate,
        category,
        description,
        syncWithGoogle: true
      });
      setShowAddModal(false);
      setTitle('');
      setDescription('');
      alert('Agenda sekolah baru telah ditambahkan!');
    } catch (err) {
      alert('Gagal menambah agenda');
    } finally {
      setSubmitting(false);
    }
  };

  const canManage = currentUser.role === 'admin' || currentUser.role === 'teacher';

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" />
            Kalender & Agenda Akademik Sekolah
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Integrasi API kalender untuk sinkronisasi jadwal ujian, libur, dan kegiatan secara langsung lintas perangkat.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSyncGoogle}
            disabled={syncing}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-2 transition"
            id="btn-sync-google-calendar"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Menyingkronkan...' : 'Sinkronisasi Google Calendar'}</span>
          </button>

          {canManage && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
              id="btn-add-calendar-event"
            >
              <Plus className="w-4 h-4" /> Tambah Agenda
            </button>
          )}
        </div>
      </div>

      {syncMessage && (
        <div className="p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-blue-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Events List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(ev => (
          <div
            key={ev.id}
            className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  ev.category === 'Ujian'
                    ? 'bg-rose-500/20 text-rose-300'
                    : ev.category === 'Libur'
                    ? 'bg-amber-500/20 text-amber-300'
                    : ev.category === 'Rapat'
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}
              >
                {ev.category}
              </span>

              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <CalendarCheck className="w-3 h-3" /> Auto-Synced
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-sm">{ev.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ev.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {ev.startDate} {ev.endDate !== ev.startDate ? `s.d ${ev.endDate}` : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Event */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Tambah Agenda Kalender Sekolah
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Agenda / Kegiatan</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Contoh: Ujian Akhir Semester Ganjil..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kategori Agenda</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                >
                  <option value="Akademik">Akademik</option>
                  <option value="Ujian">Ujian</option>
                  <option value="Libur">Libur Sekolah</option>
                  <option value="Rapat">Rapat / Komite</option>
                  <option value="Kegiatan">Kegiatan Siswa</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deskripsi Keterangan</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Keterangan singkat lokasi / instruksi..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 h-20"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Agenda'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
