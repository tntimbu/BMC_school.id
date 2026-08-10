import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Student,
  Grade,
  AttendanceRecord,
  TuitionRecord,
  PPDBApplication,
  SchoolSettings,
  DKNRecord,
  CharacterAssessment,
  SpiritualJourneyRecord
} from '../types';

export function generateReportCardPDF(
  student: Student,
  grades: Grade[],
  schoolName: string,
  settings?: SchoolSettings,
  dknRecords?: DKNRecord[],
  characterAssessments?: CharacterAssessment[],
  spiritualJourney?: SpiritualJourneyRecord
) {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Colors
  const primaryColor = [30, 58, 138]; // Deep Blue
  const darkTextColor = [30, 41, 59];

  // ==========================================
  // PAGE 1: KOP SURAT & RAPOR NILAI PENGETAHUAN (DKN)
  // ==========================================

  // Kop Surat Header
  const letterheadLine1 = settings?.letterheadHeader || 'YAYASAN PENDIDIKAN NUSANTARA JAYA';
  const letterheadLine2 = settings?.letterheadSub || settings?.schoolName || schoolName || 'SMAN 1 NUSANTARA';
  const letterheadAddress = settings?.letterheadAddress || settings?.address || 'Jl. Pendidikan Nusantara No. 100, Jakarta Pusat';
  const letterheadContact = settings?.letterheadContact || `Telp: ${settings?.phone || '021-5551234'} | Email: ${settings?.email || 'info@sekolah.sch.id'}`;

  // Kop Surat Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(letterheadLine1.toUpperCase(), 105, 12, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text(letterheadLine2.toUpperCase(), 105, 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(letterheadAddress, 105, 24, { align: 'center' });
  doc.text(letterheadContact, 105, 28, { align: 'center' });

  // Double Decorative Line for Kop Surat
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.8);
  doc.line(14, 34, 196, 34);
  doc.setLineWidth(0.2);
  doc.line(14, 35.2, 196, 35.2);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('LAPORAN HASIL BELAJAR SISWA (RAPOR DIGITAL)', 105, 41, { align: 'center' });

  // Student Info Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 44, 182, 22, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  doc.text(`Nama Siswa    : ${student.name}`, 18, 50);
  doc.text(`NISN / Class  : ${student.nisn} / ${student.className}`, 18, 55);
  doc.text(`Orang Tua/Wali : ${student.parentName}`, 18, 60);

  doc.text(`Tingkat / Semester : ${student.educationLevel} / ${settings?.currentSemester || 'Ganjil'}`, 115, 50);
  doc.text(`Tahun Ajaran        : ${settings?.academicYear || '2025/2026'}`, 115, 55);
  doc.text(`KKM Kelulusan       : 75 (Tuntas Minimal)`, 115, 60);

  // Table Data: Nilai Pengetahuan DKN
  // Map grades / DKN
  const tableData = grades.map((g, index) => {
    // Determine KKM Status
    const isPassing = g.finalGrade >= 75;
    const statusStr = isPassing ? 'TUNTAS' : 'REMEDIAL';
    
    // Description text
    let desc = g.notes;
    if (!desc || desc.trim() === '') {
      if (g.finalGrade >= 90) {
        desc = `Sangat terampil dan memahami seluruh kompetensi mata pelajaran ${g.subject} dengan predikat sangat baik.`;
      } else if (g.finalGrade >= 80) {
        desc = `Memahami sebagian besar materi ${g.subject} dengan baik dan aktif dalam tugas harian.`;
      } else if (g.finalGrade >= 75) {
        desc = `Memenuhi batas kriteria ketuntasan minimal (KKM 75) dalam mata pelajaran ${g.subject}.`;
      } else {
        desc = `Belum mencapai batas KKM (75). Memerlukan pendampingan dan perbaikan remedial materi ${g.subject}.`;
      }
    }

    return [
      index + 1,
      g.subject,
      g.finalGrade,
      g.letterGrade,
      statusStr,
      desc
    ];
  });

  autoTable(doc, {
    startY: 69,
    head: [['No', 'Mata Pelajaran', 'Nilai Pengetahuan', 'Predikat', 'Status KKM (75)', 'Deskripsi Capaian Kompetensi']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 42, fontStyle: 'bold' },
      2: { halign: 'center', cellWidth: 26, fontStyle: 'bold' },
      3: { halign: 'center', cellWidth: 18, fontStyle: 'bold' },
      4: { halign: 'center', cellWidth: 26, fontStyle: 'bold' },
      5: { cellWidth: 'auto', fontSize: 7.5 }
    },
    styles: { fontSize: 8, cellPadding: 2.5 }
  });

  let finalY = (doc as any).lastAutoTable.finalY || 130;

  // Average Score & Summary
  const avgScore = grades.length > 0
    ? (grades.reduce((acc, g) => acc + g.finalGrade, 0) / grades.length).toFixed(1)
    : '0';

  const totalPassed = grades.filter(g => g.finalGrade >= 75).length;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Rata-Rata Nilai Akhir Pengetahuan: ${avgScore}`, 14, finalY + 6);
  doc.text(`Status Ketuntasan: ${totalPassed}/${grades.length} Mata Pelajaran Tuntas (>= 75)`, 115, finalY + 6);

  // Signatures on Page 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Orang Tua / Wali Siswa,', 25, finalY + 18);
  doc.text('Wali Kelas,', 140, finalY + 18);

  doc.text(`( ${student.parentName} )`, 25, finalY + 36);
  doc.text(`( Dra. Siti Rahmawati, M.Pd )`, 140, finalY + 36);

  // ==========================================
  // PAGE 2: LEMBAR RAPOR KARAKTER & SPIRITUAL JOURNEY
  // ==========================================
  doc.addPage();

  // Page 2 Kop Header Mini
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(`${letterheadLine2.toUpperCase()} - LAPORAN PERKEMBANGAN KARAKTER & SPIRITUAL`, 105, 12, { align: 'center' });
  doc.setLineWidth(0.4);
  doc.line(14, 15, 196, 15);

  // Student Bar Page 2
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nama: ${student.name}  |  NISN: ${student.nisn}  |  Kelas: ${student.className}  |  TA: ${settings?.academicYear || '2025/2026'}`, 14, 20);

  // Section 1: LEMBAR RAPOR KARAKTER (PROFIL PELAJAR)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text('I. LEMBAR PENILAIAN KARAKTER & PROFIL PELAJAR', 14, 27);

  const charAssess = characterAssessments && characterAssessments.length > 0 ? characterAssessments : [
    { dimension: 'Integritas & Kejujuran', grade: 'SB', description: 'Menunjukkan kejujuran tinggi dalam ujian dan bersikap terbuka.' },
    { dimension: 'Kedisiplinan & Tanggung Jawab', grade: 'SB', description: 'Selalu hadir tepat waktu dan menyelesaikan tugas sesuai tenggat.' },
    { dimension: 'Gotong Royong & Empati', grade: 'BSH', description: 'Aktif berkolaborasi dalam kerja kelompok dan peduli pada teman.' },
    { dimension: 'Kemandirian & Nalar Kritis', grade: 'SB', description: 'Mampu memecahkan masalah mandiri dan menyampaikan pendapat objektif.' },
    { dimension: 'Adab, Sopan Santun & Etika', grade: 'SB', description: 'Sangat santun kepada guru, karyawan, dan sesama siswa.' }
  ];

  const charTableData = charAssess.map((c: any, i: number) => [
    i + 1,
    c.dimension || c.aspect || 'Dimensi Karakter',
    c.grade === 'SB' ? 'Sangat Baik (SB)' : c.grade === 'BSH' ? 'Baik (BSH)' : c.grade || c.rating || 'Sangat Baik',
    c.description || c.notes || '-'
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['No', 'Aspek Karakter & Sikap', 'Predikat / Rating', 'Catatan Perkembangan Karakter']],
    body: charTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 50, fontStyle: 'bold' },
      2: { halign: 'center', cellWidth: 32, fontStyle: 'bold' },
      3: { cellWidth: 'auto', fontSize: 7.5 }
    },
    styles: { fontSize: 8, cellPadding: 2.5 }
  });

  let charFinalY = (doc as any).lastAutoTable.finalY || 80;

  // Section 2: LEMBAR SPIRITUAL JOURNEY
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text('II. LEMBAR PEMANTAUAN SPIRITUAL JOURNEY', 14, charFinalY + 8);

  const spData = spiritualJourney || {
    bibleBook: 'Injil Yohanes',
    bibleChapterVerse: 'Yohanes 15 : 1 - 8',
    bibleRhema: 'Tinggal di dalam Kristus menghasilkan buah kehidupan yang berlimpah dan memuliakan Bapa.',
    serviceDayDate: 'Minggu, 3 Agustus 2025',
    serviceChurchName: 'Gereja GKI Nusantara Jakarta',
    servicePastorName: 'Pdt. Yohanes Setiawan, M.Th',
    serviceSermonTopic: 'Menjadi Garam & Terang Dunia di Era Digital',
    serviceDocumentationUrl: 'Tercantum (Foto Lampiran Kehadiran Ada)'
  };

  const spiritualTableData = [
    // Group 1: Ketuntasan Baca Alkitab
    ['1', 'Ketuntasan Baca Alkitab', `Kitab: ${spData.bibleBook || '-'}\nPasal & Ayat: ${spData.bibleChapterVerse || '-'}`, `Rhema Firman Tuhan:\n"${spData.bibleRhema || '-'}"`],
    
    // Group 2: Keikutsertaan Kegiatan Ibadah
    ['2', 'Keikutsertaan Kegiatan Ibadah', `Hari & Tgl: ${spData.serviceDayDate || '-'}\nGereja: ${spData.serviceChurchName || '-'}\nPendeta: ${spData.servicePastorName || '-'}`, `Tema Firman Tuhan:\n"${spData.serviceSermonTopic || '-'}"\n\nDokumentasi: ${spData.serviceDocumentationUrl ? 'Ada (Bukti Lampiran Terverifikasi)' : 'Belum Melampirkan'}`]
  ];

  autoTable(doc, {
    startY: charFinalY + 11,
    head: [['No', 'Kategori Spiritual Journey', 'Rincian & Informasi', 'Hasil Perenungan / Catatan Bukti']],
    body: spiritualTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [16, 185, 129], // Emerald
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 48, fontStyle: 'bold' },
      2: { cellWidth: 55, fontSize: 7.5 },
      3: { cellWidth: 'auto', fontSize: 7.5 }
    },
    styles: { fontSize: 8, cellPadding: 3 }
  });

  let spiritualFinalY = (doc as any).lastAutoTable.finalY || 150;

  // Signatures & Approval Box
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  doc.text('Mengetahui,', 14, spiritualFinalY + 8);
  doc.text('Pembimbing Spiritual / Guru Agama,', 14, spiritualFinalY + 13);
  doc.text('Wali Kelas,', 140, spiritualFinalY + 13);

  doc.text('( Ust. Ahmad Fauzi, S.Ag )', 14, spiritualFinalY + 30);
  doc.text('( Dra. Siti Rahmawati, M.Pd )', 140, spiritualFinalY + 30);

  doc.setFont('helvetica', 'bold');
  doc.text('Mengetahui / Menyetujui:', 105, spiritualFinalY + 36, { align: 'center' });
  doc.text('Kepala Sekolah SMAN 1 Nusantara', 105, spiritualFinalY + 40, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.text('( Dr. H. Bambang Soeprapto, M.M )', 105, spiritualFinalY + 54, { align: 'center' });
  doc.text('NIP. 19750812 200003 1 002', 105, spiritualFinalY + 58, { align: 'center' });

  // Save PDF
  doc.save(`Rapor_Digital_${student.name.replace(/\s+/g, '_')}_${student.className}.pdf`);
}

export function generateAttendanceReportPDF(records: AttendanceRecord[], schoolName: string) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(schoolName, 14, 18);
  doc.setFontSize(12);
  doc.text('LAPORAN REKAPITULASI KEHADIRAN PRESENSI QR CODE', 14, 26);
  doc.setFontSize(9);
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 32);

  const tableData = records.map((r, i) => [
    i + 1,
    r.date,
    r.time,
    r.studentName,
    r.className,
    r.status,
    r.method,
    r.notes || '-'
  ]);

  autoTable(doc, {
    startY: 38,
    head: [['No', 'Tanggal', 'Jam', 'Nama Siswa', 'Kelas', 'Status', 'Metode', 'Keterangan']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42] }
  });

  doc.save(`Laporan_Presensi_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function generateTuitionReceiptPDF(tuition: TuitionRecord, schoolName: string) {
  const doc = new jsPDF();

  doc.setDrawColor(203, 213, 225);
  doc.rect(10, 10, 190, 120);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(schoolName.toUpperCase(), 15, 25);
  doc.setFontSize(11);
  doc.text('BUKTI PEMBAYARAN BIAYA PENDIDIKAN / SPP', 15, 32);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`No. Invoice : ${tuition.invoiceNo}`, 130, 25);
  doc.text(`Tanggal     : ${tuition.paidAt || new Date().toLocaleDateString('id-ID')}`, 130, 32);

  doc.line(15, 36, 195, 36);

  doc.text(`Telah diterima dari : ${tuition.studentName}`, 15, 46);
  doc.text(`Kelas               : ${tuition.className}`, 15, 53);
  doc.text(`Untuk Pembayaran    : SPP Bulan ${tuition.month}`, 15, 60);
  doc.text(`Metode Pembayaran   : ${tuition.paymentMethod || 'QRIS / Kasir'}`, 15, 67);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`JUMLAH: Rp ${tuition.amount.toLocaleString('id-ID')}`, 15, 80);
  doc.text(`STATUS : ${tuition.status.toUpperCase()}`, 130, 80);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Kasir / Bendahara Sekolah,', 135, 95);
  doc.text('( SMAN 1 Nusantara Finance )', 130, 118);

  doc.save(`Kwitansi_SPP_${tuition.invoiceNo.replace(/\//g, '_')}.pdf`);
}

export function generatePPDBReportPDF(applicants: PPDBApplication[], schoolName: string) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(schoolName, 14, 18);
  doc.setFontSize(12);
  doc.text('LAPORAN HASIL PENDAFTARAN PPDB ONLINE 2026', 14, 26);

  const tableData = applicants.map((p, i) => [
    i + 1,
    p.registrationNo,
    p.fullName,
    p.previousSchool,
    p.chosenMajor,
    p.examScore || '-',
    p.status
  ]);

  autoTable(doc, {
    startY: 32,
    head: [['No', 'No Reg', 'Nama Pendaftar', 'Asal Sekolah', 'Jurusan', 'Nilai Ujian', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] }
  });

  doc.save(`Laporan_PPDB_${new Date().toISOString().split('T')[0]}.pdf`);
}

