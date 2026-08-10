import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Pin,
  Calendar,
  User,
  Send,
  X,
  BellRing
} from 'lucide-react';
import { Announcement, UserProfile } from '../types';

interface AnnouncementsBoardProps {
  announcements: Announcement[];
  currentUser: UserProfile;
  onCreateAnnouncement: (data: Partial<Announcement>) => Promise<void>;
}

export const AnnouncementsBoard: React.FC<AnnouncementsBoardProps> = ({
  announcements,
  currentUser,
  onCreateAnnouncement
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Form State
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<'Akademik' | 'Keuangan' | 'Kegiatan' | 'Darurat' | 'PPDB'>('Akademik');
  const [content, setContent] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<'Semua' | 'Siswa' | 'Guru' | 'Orang Tua'>('Semua');
  const [priority, setPriority] = useState<'Normal' | 'Tinggi' | 'Penting'>('Normal');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const categories = ['Semua', 'Akademik', 'Keuangan', 'Kegiatan', 'Darurat', 'PPDB'];

  const filtered = announcements.filter(
    a => selectedCategory === 'Semua' || a.category === selectedCategory
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreateAnnouncement({
        title,
        category,
        content,
        targetAudience,
        priority,
        author: currentUser.name
      });
      setShowAddModal(false);
      setTitle('');
      setContent('');
      alert('Pengumuman sekolah berhasil diterbitkan dan dinotifikasikan!');
    } catch (err) {
      alert('Gagal menerbitkan pengumuman');
    } finally {
      setSubmitting(false);
    }
  };

  const canPublish = currentUser.role === 'admin' || currentUser.role === 'teacher';

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-400" />
            Pengumuman & Informasi Resmi Sekolah
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pusat berita resmi sekolah dengan penyiaran notifikasi ke seluruh akun terdaftar.
          </p>
        </div>

        {canPublish && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/30 flex items-center gap-2 transition"
            id="btn-add-announcement"
          >
            <Plus className="w-4 h-4" /> Buat Pengumuman Baru
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filtered.map(anc => (
          <div
            key={anc.id}
            className={`p-5 rounded-2xl border transition-all ${
              anc.isPinned
                ? 'bg-slate-900/90 border-amber-500/50 shadow-lg shadow-amber-500/5'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {anc.isPinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      <Pin className="w-3 h-3 text-amber-400" /> Pinned
                    </span>
                  )}
                  <span className="text-[10px] font-bold uppercase bg-slate-800 text-blue-300 border border-slate-700 px-2 py-0.5 rounded-full">
                    {anc.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full">
                    Target: {anc.targetAudience}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">{anc.title}</h3>
              </div>

              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase shrink-0 ${
                  anc.priority === 'Penting'
                    ? 'bg-rose-500/20 text-rose-300'
                    : anc.priority === 'Tinggi'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {anc.priority}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed my-3 whitespace-pre-line">
              {anc.content}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" /> {anc.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> {anc.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Announcement */}
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
              <BellRing className="w-5 h-5 text-amber-400" />
              Publikasikan Pengumuman Baru
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Ujian Akhir Semester..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Keuangan">Keuangan</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Darurat">Darurat</option>
                    <option value="PPDB">PPDB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target</label>
                  <select
                    value={targetAudience}
                    onChange={e => setTargetAudience(e.target.value as any)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  >
                    <option value="Semua">Semua</option>
                    <option value="Siswa">Siswa</option>
                    <option value="Guru">Guru</option>
                    <option value="Orang Tua">Orang Tua</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prioritas</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Penting">Penting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Isi Pengumuman</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Tuliskan isi informasi secara rinci..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 h-28"
                  required
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-lg shadow-amber-600/30 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Menerbitkan...' : 'Terbitkan & Broadcast'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
