import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  FileDown,
  Printer,
  Edit2,
  Filter,
  X,
  Check,
  User,
  BookOpen,
  Award,
  Heart,
  Sparkles,
  ShieldCheck,
  Layers,
  Save,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  Student,
  Grade,
  UserProfile,
  SchoolSettings,
  DKNRecord,
  CharacterAssessment,
  SpiritualJourneyRecord
} from '../types';
import { generateReportCardPDF } from '../lib/pdfExporter';
import { exportToCSV } from '../lib/csvExporter';

interface GradesManagementProps {
  students: Student[];
  grades: Grade[];
  dknRecords?: DKNRecord[];
  characterAssessments?: Record<string, CharacterAssessment[]>;
  spiritualJourney?: Record<string, SpiritualJourneyRecord>;
  currentUser: UserProfile;
  settings: SchoolSettings;
  onAddGrade: (gradeData: Partial<Grade>) => Promise<void>;
  onUpdateDKN?: (dknRecord: DKNRecord) => void;
  onUpdateCharacter?: (studentId: string, charData: CharacterAssessment[]) => void;
  onUpdateSpiritual?: (studentId: string, spiritualData: SpiritualJourneyRecord) => void;
}

export const GradesManagement: React.FC<GradesManagementProps> = ({
  students,
  grades,
  dknRecords = [],
  characterAssessments = {},
  spiritualJourney = {},
  currentUser,
  settings,
  onAddGrade,
  onUpdateDKN,
  onUpdateCharacter,
  onUpdateSpiritual
}) => {
  const [activeTab, setActiveTab] = useState<'dkn' | 'character' | 'spiritual'>('dkn');
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [selectedSubject, setSelectedSubject] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedStudentForRapor, setSelectedStudentForRapor] = useState<Student | null>(null);

  // Edit DKN Modal State
  const [editingDKN, setEditingDKN] = useState<DKNRecord | null>(null);
  
  // Edit Character Modal State
  const [editingStudentChar, setEditingStudentChar] = useState<{ student: Student; assessments: CharacterAssessment[] } | null>(null);

  // Edit Spiritual Modal State
  const [editingStudentSpiritual, setEditingStudentSpiritual] = useState<{ student: Student; record: SpiritualJourneyRecord } | null>(null);

  // Form State for New Grade / DKN
  const [formStudentId, setFormStudentId] = useState<string>('');
  const [formSubject, setFormSubject] = useState<string>('');
  const [formUH1, setFormUH1] = useState<number>(85);
  const [formUH2, setFormUH2] = useState<number>(85);
  const [formUH3, setFormUH3] = useState<number>(85);
  const [formMid, setFormMid] = useState<number>(85);
  const [formFinal, setFormFinal] = useState<number>(85);
  const [formNotes, setFormNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Subject List: Use settings.subjects if present, else fallback
  const availableSubjects = settings.subjects && settings.subjects.length > 0
    ? Array.from(new Set(settings.subjects.map(s => s.name)))
    : [
        'Matematika Peminatan',
        'Fisika',
        'Kimia',
        'Biologi',
        'Bahasa Indonesia',
        'Bahasa Inggris',
        'Ekonomi',
        'Sejarah',
        'Pendidikan Agama & Budi Pekerti'
      ];

  const subjectsListWithAll = ['Semua', ...availableSubjects];
  const classesList = ['Semua', 'XII IPA 1', 'XII IPA 2', 'XI IPS 1', 'X IPA 1', 'IX-A SMP', '6-A SD'];

  // Initialize formSubject if empty
  React.useEffect(() => {
    if (!formSubject && availableSubjects.length > 0) {
      setFormSubject(availableSubjects[0]);
    }
  }, [availableSubjects]);

  // Filter Grades
  const filteredGrades = grades.filter(g => {
    const matchClass = selectedClass === 'Semua' || g.className === selectedClass;
    const matchSubject = selectedSubject === 'Semua' || g.subject === selectedSubject;
    const matchSearch =
      g.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if ((currentUser.role === 'parent' || currentUser.role === 'student') && currentUser.studentId) {
      return g.studentId === currentUser.studentId && matchSubject && matchSearch;
    }

    return matchClass && matchSubject && matchSearch;
  });

  // Filter Students for Character and Spiritual Tabs
  const filteredStudents = students.filter(s => {
    const matchClass = selectedClass === 'Semua' || s.className === selectedClass;
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase());

    if ((currentUser.role === 'parent' || currentUser.role === 'student') && currentUser.studentId) {
      return s.id === currentUser.studentId && matchSearch;
    }

    return matchClass && matchSearch;
  });

  const handleSubmitNewGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentId) {
      alert('Pilih siswa terlebih dahulu');
      return;
    }

    setSubmitting(true);
    try {
      const selectedStud = students.find(s => s.id === formStudentId);
      const uhAvg = Math.round((formUH1 + formUH2 + formUH3) / 3);
      const finalKnowledge = parseFloat((uhAvg * 0.3 + formMid * 0.3 + formFinal * 0.4).toFixed(1));

      // Calculate DKN Predikat with KKM 75
      let predikat: 'A' | 'B' | 'C' | 'D' = 'C';
      if (finalKnowledge >= 90) predikat = 'A';
      else if (finalKnowledge >= 80) predikat = 'B';
      else if (finalKnowledge >= 75) predikat = 'C';
      else predikat = 'D';

      let desc = formNotes;
      if (!desc) {
        if (finalKnowledge >= 90) desc = `Sangat terampil dan memahami seluruh materi ${formSubject} dengan nilai sangat memuaskan.`;
        else if (finalKnowledge >= 80) desc = `Memahami sebagian besar konsep ${formSubject} dengan baik dan aktif berdiskusi.`;
        else if (finalKnowledge >= 75) desc = `Memenuhi kriteria ketuntasan minimal (KKM 75) dalam mata pelajaran ${formSubject}.`;
        else desc = `Belum tuntas KKM (75). Memerlukan bimbingan khusus dan perbaikan remedial pada materi ${formSubject}.`;
      }

      await onAddGrade({
        studentId: formStudentId,
        subject: formSubject,
        assignmentScore: uhAvg,
        midExamScore: formMid,
        finalExamScore: formFinal,
        notes: desc
      });

      if (onUpdateDKN && selectedStud) {
        const newDknRecord: DKNRecord = {
          id: `dkn-${Date.now()}`,
          studentId: formStudentId,
          studentName: selectedStud.name,
          className: selectedStud.className,
          educationLevel: selectedStud.educationLevel || 'SMA',
          subject: formSubject,
          kkm: 75,
          uh1: formUH1,
          uh2: formUH2,
          uh3: formUH3,
          uhAverage: uhAvg,
          midExamScore: formMid,
          finalExamScore: formFinal,
          knowledgeScore: finalKnowledge,
          knowledgePredicate: predikat,
          knowledgeDescription: desc,
          semester: settings.currentSemester || 'Ganjil',
          academicYear: settings.academicYear || '2025/2026'
        };
        onUpdateDKN(newDknRecord);
      }

      setShowAddModal(false);
      setFormNotes('');
    } catch (err) {
      alert('Gagal menyimpan nilai');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDKNEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDKN) return;

    const uhAvg = Math.round((editingDKN.uh1 + editingDKN.uh2 + editingDKN.uh3) / 3);
    const knowledge = parseFloat((uhAvg * 0.3 + editingDKN.midExamScore * 0.3 + editingDKN.finalExamScore * 0.4).toFixed(1));
    
    let pred: 'A' | 'B' | 'C' | 'D' = 'C';
    if (knowledge >= 90) pred = 'A';
    else if (knowledge >= 80) pred = 'B';
    else if (knowledge >= 75) pred = 'C';
    else pred = 'D';

    const updated: DKNRecord = {
      ...editingDKN,
      uhAverage: uhAvg,
      knowledgeScore: knowledge,
      knowledgePredicate: pred
    };

    if (onUpdateDKN) {
      onUpdateDKN(updated);
    }
    setEditingDKN(null);
  };

  const handleExportCSV = () => {
    const dataToExport = filteredGrades.map(g => ({
      'Nama Siswa': g.studentName,
      'Kelas': g.className,
      'Mata Pelajaran': g.subject,
      'Nilai Tugas/PH': g.assignmentScore,
      'Nilai UTS/PTS': g.midExamScore,
      'Nilai UAS/PAS': g.finalExamScore,
      'Nilai Pengetahuan': g.finalGrade,
      'Predikat': g.letterGrade,
      'Status KKM (75)': g.finalGrade >= 75 ? 'TUNTAS' : 'REMEDIAL',
      'Semester': g.semester,
      'Tahun Ajaran': g.academicYear,
      'Deskripsi Capaian': g.notes || ''
    }));
    exportToCSV('Data_Nilai_DKN_SIAKAD', dataToExport);
  };

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'teacher' || currentUser.role === 'superadmin';

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-400" />
            Sistem DKN, Rapor Karakter & Spiritual Journey
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan Data Kumpulan Nilai (DKN Pengetahuan KKM 75), Rapor Karakter Profil Pelajar, dan Lembar Spiritual Journey dengan ekspor PDF Rapor Resmi.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-2 transition"
            id="btn-export-csv-grades"
          >
            <FileDown className="w-4 h-4 text-emerald-400" />
            <span>Ekspor CSV DKN</span>
          </button>

          {canEdit && (
            <button
              onClick={() => {
                if (students.length > 0) setFormStudentId(students[0].id);
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition"
              id="btn-add-grade"
            >
              <Plus className="w-4 h-4" />
              <span>Input Nilai DKN Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('dkn')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'dkn'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
          }`}
          id="tab-btn-dkn"
        >
          <BookOpen className="w-4 h-4" />
          <span>DKN & Nilai Pengetahuan (KKM 75)</span>
        </button>

        <button
          onClick={() => setActiveTab('character')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'character'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
          }`}
          id="tab-btn-character"
        >
          <Heart className="w-4 h-4" />
          <span>Lembar Rapor Karakter</span>
        </button>

        <button
          onClick={() => setActiveTab('spiritual')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'spiritual'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
          }`}
          id="tab-btn-spiritual"
        >
          <Sparkles className="w-4 h-4" />
          <span>Spiritual Journey</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa / mapel..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="input-search-grades"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="select-class-filter"
          >
            {classesList.map(c => (
              <option key={c} value={c}>Kelas: {c}</option>
            ))}
          </select>

          {activeTab === 'dkn' && (
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="select-subject-filter"
            >
              {subjectsListWithAll.map(s => (
                <option key={s} value={s}>Mapel: {s}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ========================================================
          TAB 1: DKN & NILAI PENGETAHUAN TABLE
      ======================================================== */}
      {activeTab === 'dkn' && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Standar KKM Kelulusan DKN: <span className="text-amber-400 font-bold">75</span></span>
            </div>
            <div className="text-[11px] text-slate-400">
              Bobot DKN: Tugas/PH (30%) + UTS/PTS (30%) + UAS/PAS (40%) = Nilai Pengetahuan
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 uppercase font-bold text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Nama Siswa</th>
                  <th className="p-3.5">Kelas</th>
                  <th className="p-3.5">Mata Pelajaran</th>
                  <th className="p-3.5 text-center">PH / Tugas (30%)</th>
                  <th className="p-3.5 text-center">PTS (30%)</th>
                  <th className="p-3.5 text-center">PAS (40%)</th>
                  <th className="p-3.5 text-center">Nilai Pengetahuan</th>
                  <th className="p-3.5 text-center">Predikat</th>
                  <th className="p-3.5 text-center">Status KKM</th>
                  <th className="p-3.5 text-right">Aksi Rapor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredGrades.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400">
                      Tidak ada data DKN nilai yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredGrades.map(grade => {
                    const studentObj = students.find(s => s.id === grade.studentId);
                    const isPassed = grade.finalGrade >= 75;

                    return (
                      <tr key={grade.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3.5 font-semibold text-slate-100 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-400 shrink-0" />
                          <div>
                            {grade.studentName}
                            {grade.notes && (
                              <p className="text-[10px] text-slate-400 font-normal line-clamp-1">{grade.notes}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5">{grade.className}</td>
                        <td className="p-3.5 text-blue-300 font-medium">{grade.subject}</td>
                        <td className="p-3.5 text-center font-mono">{grade.assignmentScore}</td>
                        <td className="p-3.5 text-center font-mono">{grade.midExamScore}</td>
                        <td className="p-3.5 text-center font-mono">{grade.finalExamScore}</td>
                        <td className="p-3.5 text-center font-bold text-white bg-slate-800/40 rounded">
                          {grade.finalGrade}
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              grade.letterGrade === 'A'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : grade.letterGrade === 'B'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : grade.letterGrade === 'C'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            Predikat {grade.letterGrade}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              isPassed
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {isPassed ? 'TUNTAS' : 'REMEDIAL'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                if (studentObj) setSelectedStudentForRapor(studentObj);
                              }}
                              className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-[11px] font-semibold border border-blue-500/30 flex items-center gap-1 transition"
                              title="Lihat & Cetak Rapor Digital PDF"
                              id={`btn-rapor-${grade.id}`}
                            >
                              <Printer className="w-3.5 h-3.5" /> Rapor
                            </button>
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
      )}

      {/* ========================================================
          TAB 2: LEMBAR RAPOR KARAKTER (PROFIL PELAJAR)
      ======================================================== */}
      {activeTab === 'character' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-950/30 border border-purple-800/40 rounded-xl text-xs text-purple-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Lembar Penilaian Karakter & Profil Pelajar Pancasila</span>
                <p className="text-[11px] text-purple-300">Penilaian aspek integritas, kedisiplinan, gotong royong, kemandirian, dan adab sopan santun siswa.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map(student => {
              const charList = characterAssessments[student.id] || [
                { id: `c-1`, studentId: student.id, dimension: 'Integritas & Kejujuran', grade: 'SB', description: 'Menunjukkan kejujuran dan etika yang sangat baik.' },
                { id: `c-2`, studentId: student.id, dimension: 'Kedisiplinan & Tanggung Jawab', grade: 'SB', description: 'Hadir tepat waktu dan disiplin mengerjakan tugas.' },
                { id: `c-3`, studentId: student.id, dimension: 'Gotong Royong & Empati', grade: 'BSH', description: 'Aktif bergotong royong dan peduli kepada sesama.' },
                { id: `c-4`, studentId: student.id, dimension: 'Adab & Sopan Santun', grade: 'SB', description: 'Sangat santun kepada guru dan seluruh warga sekolah.' }
              ];

              return (
                <div key={student.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-400" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{student.name}</h4>
                        <p className="text-[11px] text-slate-400">NISN: {student.nisn} • Kelas: {student.className}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStudentForRapor(student)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg text-[11px] font-semibold border border-slate-700 flex items-center gap-1 transition"
                    >
                      <Printer className="w-3 h-3" /> Rapor
                    </button>
                  </div>

                  <div className="space-y-2">
                    {charList.map(item => (
                      <div key={item.id} className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 text-xs">
                        <div className="flex items-center justify-between font-semibold mb-1">
                          <span className="text-purple-300">{item.dimension}</span>
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[10px] font-extrabold border border-purple-500/30">
                            {item.grade === 'SB' ? 'Sangat Baik' : item.grade === 'BSH' ? 'Baik (BSH)' : item.grade}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: SPIRITUAL JOURNEY SHEET
      ======================================================== */}
      {activeTab === 'spiritual' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white text-sm">Lembar Pemantauan Spiritual Journey Siswa</span>
                <p className="text-[11px] text-emerald-300 mt-0.5">
                  1. Ketuntasan Baca Alkitab (Kitab, Pasal & Ayat, Rhema Firman Tuhan)<br />
                  2. Keikutsertaan Kegiatan Ibadah (Hari/Tanggal, Gereja, Pendeta, Tema Firman, Dokumentasi Bukti)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map(student => {
              const sp: SpiritualJourneyRecord = spiritualJourney[student.id] || {
                id: `sp-${student.id}`,
                studentId: student.id,
                studentName: student.name,
                academicYear: settings.academicYear || '2025/2026',
                semester: settings.currentSemester || 'Ganjil',
                bibleBook: 'Injil Yohanes',
                bibleChapterVerse: 'Yohanes 15 : 1 - 8',
                bibleRhema: 'Tinggal di dalam Kristus menghasilkan buah kehidupan yang berlimpah.',
                serviceDayDate: 'Minggu, 3 Agustus 2025',
                serviceChurchName: 'Gereja GKI Nusantara Jakarta',
                servicePastorName: 'Pdt. Yohanes Setiawan, M.Th',
                serviceSermonTopic: 'Menjadi Garam & Terang Dunia di Era Digital',
                serviceDocumentationUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=400'
              };

              return (
                <div key={student.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{student.name}</h4>
                        <p className="text-[11px] text-slate-400">Kelas {student.className} • NISN: {student.nisn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingStudentSpiritual({ student, record: { ...sp } })}
                        className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-[11px] font-semibold border border-emerald-500/30 flex items-center gap-1 transition"
                      >
                        <Edit2 className="w-3 h-3" /> Input Data
                      </button>
                      <button
                        onClick={() => setSelectedStudentForRapor(student)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-semibold border border-slate-700 flex items-center gap-1 transition"
                      >
                        <Printer className="w-3 h-3" /> Rapor
                      </button>
                    </div>
                  </div>

                  {/* Item 1: Ketuntasan Baca Alkitab */}
                  <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
                      <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> 1. Ketuntasan Baca Alkitab
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[10px] font-semibold border border-emerald-800">
                        {sp.bibleBook || 'Belum diisi'}
                      </span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Pasal & Ayat:</span>
                        <span className="font-semibold text-slate-200">{sp.bibleChapterVerse || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Rhema Firman Tuhan:</span>
                        <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 italic">
                          "{sp.bibleRhema || 'Belum ada catatan rhema.'}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item 2: Keikutsertaan Kegiatan Ibadah */}
                  <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
                      <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5" /> 2. Keikutsertaan Kegiatan Ibadah
                      </span>
                      <span className="text-[10px] text-slate-400">{sp.serviceDayDate || 'Tanggal -'}</span>
                    </div>
                    <div className="text-xs space-y-1.5">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block">Gereja / Tempat:</span>
                          <span className="font-semibold text-slate-200">{sp.serviceChurchName || '-'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Pendeta / Pembicara:</span>
                          <span className="font-semibold text-slate-200">{sp.servicePastorName || '-'}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Tema Firman Tuhan:</span>
                        <p className="text-[11px] text-slate-200 font-medium bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                          "{sp.serviceSermonTopic || '-'}"
                        </p>
                      </div>
                      {sp.serviceDocumentationUrl && (
                        <div>
                          <span className="text-slate-400 block text-[10px] mb-1">Dokumentasi Bukti Ikut Ibadah:</span>
                          <a
                            href={sp.serviceDocumentationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 text-[11px] font-semibold rounded-lg border border-blue-800 transition"
                          >
                            📸 Lihat Foto / Bukti Dokumentasi
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL PREVIEW RAPOR DIGITAL COMPREHENSIVE
      ======================================================== */}
      {selectedStudentForRapor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedStudentForRapor(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Custom Kop Surat Preview */}
            <div className="text-center pb-4 border-b-2 border-slate-700 relative">
              <div className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase">
                {settings.letterhead?.line1 || 'YAYASAN PENDIDIKAN NUSANTARA'}
              </div>
              <h3 className="text-lg font-extrabold text-white uppercase tracking-wide my-0.5">
                {settings.letterhead?.line2 || settings.schoolName}
              </h3>
              <p className="text-[11px] text-blue-400 font-bold">
                {settings.letterhead?.line3 || `STATUS: AKREDITASI A (${settings.letterhead?.accreditation || 'UNGGUL'})`}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {settings.letterhead?.address || 'Jl. Pendidikan Nusantara No. 100, Jakarta Pusat'} | Telp: {settings.letterhead?.phone || '021-5551234'}
              </p>
            </div>

            <div className="my-4 text-center">
              <h4 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
                LAPORAN HASIL BELAJAR SISWA (RAPOR DIGITAL RESMI)
              </h4>
              <p className="text-[11px] text-slate-400">Tahun Ajaran {settings.academicYear} • Semester {settings.currentSemester}</p>
            </div>

            {/* Student Biodata Card */}
            <div className="my-4 p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs grid grid-cols-2 gap-2">
              <div><span className="text-slate-400">Nama Siswa:</span> <strong className="text-white">{selectedStudentForRapor.name}</strong></div>
              <div><span className="text-slate-400">NISN / Kelas:</span> <strong className="text-white">{selectedStudentForRapor.nisn} / {selectedStudentForRapor.className}</strong></div>
              <div><span className="text-slate-400">Orang Tua / Wali:</span> <strong className="text-white">{selectedStudentForRapor.parentName}</strong></div>
              <div><span className="text-slate-400">KKM Kelulusan DKN:</span> <strong className="text-amber-400">75 (Tuntas Minimal)</strong></div>
            </div>

            {/* Grade Table DKN Preview */}
            <div className="space-y-2 my-4">
              <div className="flex items-center justify-between text-xs font-bold text-blue-300">
                <span>I. REKAPITULASI DKN & NILAI PENGETAHUAN</span>
                <span>KKM: 75</span>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 border border-slate-800 rounded-xl p-2 bg-slate-950/40">
                {grades
                  .filter(g => g.studentId === selectedStudentForRapor.id)
                  .map(g => (
                    <div key={g.id} className="p-2.5 bg-slate-800/40 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {g.subject}
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${g.finalGrade >= 75 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                            {g.finalGrade >= 75 ? 'TUNTAS' : 'REMEDIAL'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Tugas/PH: {g.assignmentScore} | PTS: {g.midExamScore} | PAS: {g.finalExamScore}
                        </div>
                        <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">{g.notes}</p>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <div className="font-bold text-white text-base">{g.finalGrade}</div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Predikat {g.letterGrade}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Character & Spiritual Summary */}
            <div className="grid grid-cols-2 gap-3 my-4 text-xs">
              <div className="p-3 bg-purple-950/20 border border-purple-800/40 rounded-xl">
                <span className="font-bold text-purple-300 block mb-1">II. Rapor Karakter Profil Pelajar</span>
                <p className="text-[11px] text-slate-300">Sangat Baik dalam Integritas, Disiplin, Gotong Royong, dan Adab Sopan Santun.</p>
              </div>
              <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl">
                <span className="font-bold text-emerald-300 block mb-1">III. Spiritual Journey Sheet</span>
                <p className="text-[11px] text-slate-300">1. Ketuntasan Baca Alkitab & Rhema Firman Tuhan<br />2. Keikutsertaan Kegiatan Ibadah & Dokumentasi Bukti</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Pencetakan Rapor Resmi dengan Kop Surat Sekolah</span>
              <button
                onClick={() => {
                  const studentGrades = grades.filter(g => g.studentId === selectedStudentForRapor.id);
                  const charAssess = characterAssessments[selectedStudentForRapor.id];
                  const spiritualData = spiritualJourney[selectedStudentForRapor.id];

                  generateReportCardPDF(
                    selectedStudentForRapor,
                    studentGrades,
                    settings.schoolName,
                    settings,
                    dknRecords,
                    charAssess,
                    spiritualData
                  );
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition"
                id="btn-download-pdf-rapor"
              >
                <FileDown className="w-4 h-4" /> Unduh PDF Rapor Digital Lengkap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL INPUT NILAI DKN BARU
      ======================================================== */}
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
              <BookOpen className="w-5 h-5 text-blue-400" />
              Input Nilai DKN Akademik Siswa
            </h3>

            <form onSubmit={handleSubmitNewGrade} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pilih Siswa</label>
                <select
                  value={formStudentId}
                  onChange={e => setFormStudentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.className} - NISN: {s.nisn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mata Pelajaran (Custom Mapel Sekolah)</label>
                <select
                  value={formSubject}
                  onChange={e => setFormSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500"
                >
                  {availableSubjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 space-y-2">
                <span className="font-bold text-slate-200 block">Kumpulan Nilai Penilaian Harian (PH/Tugas)</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-0.5">PH 1 / UH 1</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formUH1}
                      onChange={e => setFormUH1(Number(e.target.value))}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-0.5">PH 2 / UH 2</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formUH2}
                      onChange={e => setFormUH2(Number(e.target.value))}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-0.5">PH 3 / UH 3</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formUH3}
                      onChange={e => setFormUH3(Number(e.target.value))}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">PTS / UTS (30%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formMid}
                    onChange={e => setFormMid(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">PAS / UAS (40%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formFinal}
                    onChange={e => setFormFinal(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deskripsi / Catatan Capaian Guru</label>
                <textarea
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Deskripsi otomatis jika dikosongkan..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 h-20"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Nilai DKN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL EDIT SPIRITUAL JOURNEY RECORD
      ======================================================== */}
      {editingStudentSpiritual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative my-8 space-y-4">
            <button
              onClick={() => setEditingStudentSpiritual(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-lg text-white">Input / Edit Spiritual Journey</h3>
                <p className="text-xs text-slate-400">{editingStudentSpiritual.student.name} • Kelas {editingStudentSpiritual.student.className}</p>
              </div>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (onUpdateSpiritual) {
                  onUpdateSpiritual(editingStudentSpiritual.student.id, editingStudentSpiritual.record);
                }
                setEditingStudentSpiritual(null);
              }}
              className="space-y-4 text-xs"
            >
              {/* SECTION 1: KETUNTASAN BACA ALKITAB */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/70 space-y-3">
                <h4 className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> 1. Ketuntasan Baca Alkitab
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Kitab Mana?</label>
                    <input
                      type="text"
                      value={editingStudentSpiritual.record.bibleBook || ''}
                      onChange={e =>
                        setEditingStudentSpiritual({
                          ...editingStudentSpiritual,
                          record: { ...editingStudentSpiritual.record, bibleBook: e.target.value }
                        })
                      }
                      placeholder="Contoh: Injil Yohanes / Kitab Mazmur"
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Pasal dan Ayatnya</label>
                    <input
                      type="text"
                      value={editingStudentSpiritual.record.bibleChapterVerse || ''}
                      onChange={e =>
                        setEditingStudentSpiritual({
                          ...editingStudentSpiritual,
                          record: { ...editingStudentSpiritual.record, bibleChapterVerse: e.target.value }
                        })
                      }
                      placeholder="Contoh: Yohanes 3 : 16 - 21"
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Rhema yang Didapatkan dari Pembacaan</label>
                  <textarea
                    value={editingStudentSpiritual.record.bibleRhema || ''}
                    onChange={e =>
                      setEditingStudentSpiritual({
                        ...editingStudentSpiritual,
                        record: { ...editingStudentSpiritual.record, bibleRhema: e.target.value }
                      })
                    }
                    placeholder="Tuliskan rema / pesan firman Tuhan yang didapatkan dari hasil pembacaan..."
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 h-20"
                    required
                  />
                </div>
              </div>

              {/* SECTION 2: KEGIATAN IBADAH */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/70 space-y-3">
                <h4 className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <Heart className="w-4 h-4" /> 2. Ikut Kegiatan Ibadah
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Hari dan Tanggal</label>
                    <input
                      type="text"
                      value={editingStudentSpiritual.record.serviceDayDate || ''}
                      onChange={e =>
                        setEditingStudentSpiritual({
                          ...editingStudentSpiritual,
                          record: { ...editingStudentSpiritual.record, serviceDayDate: e.target.value }
                        })
                      }
                      placeholder="Contoh: Minggu, 10 Agustus 2025"
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Gereja Mana?</label>
                    <input
                      type="text"
                      value={editingStudentSpiritual.record.serviceChurchName || ''}
                      onChange={e =>
                        setEditingStudentSpiritual({
                          ...editingStudentSpiritual,
                          record: { ...editingStudentSpiritual.record, serviceChurchName: e.target.value }
                        })
                      }
                      placeholder="Contoh: GKI Nusantara / GBI Pusat"
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Pendetanya Siapa?</label>
                    <input
                      type="text"
                      value={editingStudentSpiritual.record.servicePastorName || ''}
                      onChange={e =>
                        setEditingStudentSpiritual({
                          ...editingStudentSpiritual,
                          record: { ...editingStudentSpiritual.record, servicePastorName: e.target.value }
                        })
                      }
                      placeholder="Contoh: Pdt. Yohanes Setiawan, M.Th"
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tema Firman Tuhannya Apa?</label>
                    <input
                      type="text"
                      value={editingStudentSpiritual.record.serviceSermonTopic || ''}
                      onChange={e =>
                        setEditingStudentSpiritual({
                          ...editingStudentSpiritual,
                          record: { ...editingStudentSpiritual.record, serviceSermonTopic: e.target.value }
                        })
                      }
                      placeholder="Contoh: Hidup Berdampak dan Menjadi Terang"
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dokumentasi Bukti Ikut Ibadah (URL Foto / Link)</label>
                  <input
                    type="url"
                    value={editingStudentSpiritual.record.serviceDocumentationUrl || ''}
                    onChange={e =>
                      setEditingStudentSpiritual({
                        ...editingStudentSpiritual,
                        record: { ...editingStudentSpiritual.record, serviceDocumentationUrl: e.target.value }
                      })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudentSpiritual(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Simpan Spiritual Journey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
