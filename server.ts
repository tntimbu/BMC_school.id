import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  initialSchoolSettings,
  initialUsers,
  initialStudents,
  initialGrades,
  initialAttendance,
  initialTuition,
  initialAnnouncements,
  initialPPDB,
  initialCalendar,
  initialNotifications
} from './src/data/mockData.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Database file path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Memory DB with persistent backup
interface DatabaseSchema {
  settings: typeof initialSchoolSettings;
  users: typeof initialUsers;
  students: typeof initialStudents;
  grades: typeof initialGrades;
  attendance: typeof initialAttendance;
  tuition: typeof initialTuition;
  announcements: typeof initialAnnouncements;
  ppdb: typeof initialPPDB;
  calendar: typeof initialCalendar;
  notifications: typeof initialNotifications;
}

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading db.json, starting fresh:', err);
  }

  const initialDb: DatabaseSchema = {
    settings: initialSchoolSettings,
    users: initialUsers,
    students: initialStudents,
    grades: initialGrades,
    attendance: initialAttendance,
    tuition: initialTuition,
    announcements: initialAnnouncements,
    ppdb: initialPPDB,
    calendar: initialCalendar,
    notifications: initialNotifications
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db.settings.lastCloudSync = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}

let db = loadDatabase();

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString(), school: db.settings.schoolName });
});

// Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(db.settings);
});

app.post('/api/settings', (req: Request, res: Response) => {
  db.settings = { ...db.settings, ...req.body, lastCloudSync: new Date().toISOString() };
  saveDatabase(db);
  res.json(db.settings);
});

// Students CRUD
app.get('/api/students', (_req: Request, res: Response) => {
  res.json(db.students);
});

app.post('/api/students', (req: Request, res: Response) => {
  const newStudent = {
    id: `std-${Date.now()}`,
    status: 'Aktif' as const,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    ...req.body
  };
  db.students.unshift(newStudent);

  // Generate initial SPP invoice for the student
  const newTuition = {
    id: `spp-${Date.now()}`,
    studentId: newStudent.id,
    studentName: newStudent.name,
    className: newStudent.className,
    educationLevel: newStudent.educationLevel || 'SMA',
    month: 'Agustus 2026',
    year: 2026,
    amount: 650000,
    dueDate: '2026-08-10',
    status: 'Belum Lunas' as const,
    invoiceNo: `INV/2026/08/${Math.floor(100 + Math.random() * 900)}`
  };
  db.tuition.unshift(newTuition);

  saveDatabase(db);
  res.status(201).json(newStudent);
});

app.put('/api/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.students.findIndex(s => s.id === id);
  if (index !== -1) {
    db.students[index] = { ...db.students[index], ...req.body };
    saveDatabase(db);
    res.json(db.students[index]);
  } else {
    res.status(404).json({ error: 'Siswa tidak ditemukan' });
  }
});

app.delete('/api/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.students = db.students.filter(s => s.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// Grades
app.get('/api/grades', (_req: Request, res: Response) => {
  res.json(db.grades);
});

app.post('/api/grades', (req: Request, res: Response) => {
  const { studentId, subject, assignmentScore, midExamScore, finalExamScore, semester, academicYear, notes } = req.body;
  const student = db.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(400).json({ error: 'Siswa tidak ditemukan' });
  }

  const assign = Number(assignmentScore) || 0;
  const mid = Number(midExamScore) || 0;
  const final = Number(finalExamScore) || 0;
  const finalGrade = Number(((assign * 0.3) + (mid * 0.3) + (final * 0.4)).toFixed(1));

  let letterGrade: 'A' | 'B' | 'C' | 'D' | 'E' = 'E';
  if (finalGrade >= 85) letterGrade = 'A';
  else if (finalGrade >= 75) letterGrade = 'B';
  else if (finalGrade >= 65) letterGrade = 'C';
  else if (finalGrade >= 55) letterGrade = 'D';

  const newGrade = {
    id: `grd-${Date.now()}`,
    studentId,
    studentName: student.name,
    className: student.className,
    educationLevel: student.educationLevel || 'SMA',
    subject,
    assignmentScore: assign,
    midExamScore: mid,
    finalExamScore: final,
    finalGrade,
    letterGrade,
    semester: semester || 'Ganjil',
    academicYear: academicYear || db.settings.academicYear,
    notes
  };

  db.grades.unshift(newGrade);

  // Send auto notification log
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    type: 'Email',
    recipient: student.parentEmail,
    subject: `[SIAKAD] Pembaruan Nilai ${subject}: ${student.name}`,
    body: `Nilai baru untuk mata pelajaran ${subject} telah diinput. Nilai Akhir: ${finalGrade} (${letterGrade}).`,
    sentAt: new Date().toLocaleString('id-ID'),
    status: 'Terkirim',
    triggeredBy: 'Sistem Nilai Otomatis',
    category: 'Nilai'
  });

  saveDatabase(db);
  res.status(201).json(newGrade);
});

// Attendance & QR Code Scanning
app.get('/api/attendance', (_req: Request, res: Response) => {
  res.json(db.attendance);
});

app.post('/api/attendance', (req: Request, res: Response) => {
  const { studentId, qrCodeId, status, notes, method } = req.body;
  
  let student = db.students.find(s => s.id === studentId || `QR-STD-${s.id.split('-')[1]}` === qrCodeId || s.nisn === qrCodeId);
  
  if (!student) {
    return res.status(404).json({ error: 'Siswa tidak terdaftar dalam sistem QR' });
  }

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0];

  let attStatus = status || 'Hadir';
  if (!status) {
    // If check in after 07:15:00, automatically mark Terlambat
    const hour = now.getHours();
    const min = now.getMinutes();
    if (hour > 7 || (hour === 7 && min > 15)) {
      attStatus = 'Terlambat';
    }
  }

  const newRecord = {
    id: `att-${Date.now()}`,
    studentId: student.id,
    studentName: student.name,
    className: student.className,
    educationLevel: student.educationLevel || 'SMA',
    date: dateStr,
    time: timeStr,
    status: attStatus,
    qrCodeId: qrCodeId || `QR-STD-${student.id.split('-')[1]}`,
    method: method || 'QR Code',
    notes: notes || (attStatus === 'Terlambat' ? 'Terlambat jam masuk' : 'Presensi berhasil')
  };

  db.attendance.unshift(newRecord);

  // Trigger Automatic Email / Push Alert for Parents (Early Warning)
  const isLateOrAbsent = attStatus === 'Terlambat' || attStatus === 'Alpha' || attStatus === 'Sakit';
  const notifType = isLateOrAbsent ? 'Push Alert' : 'Email';

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    type: notifType,
    recipient: student.parentEmail,
    subject: isLateOrAbsent
      ? `⚠️ [Peringatan Dini] Kehadiran: ${student.name} (${attStatus})`
      : `[SIAKAD] Presensi Harian: ${student.name}`,
    body: `Siswa ${student.name} (Kelas ${student.className}) tercatat presensi ${attStatus} pada tanggal ${dateStr} jam ${timeStr}. Catatan: ${newRecord.notes}`,
    sentAt: new Date().toLocaleString('id-ID'),
    status: 'Terkirim',
    triggeredBy: 'Real-time QR Attendance Scanner',
    category: 'Absensi'
  });

  saveDatabase(db);
  res.status(201).json({ record: newRecord, alertTriggered: isLateOrAbsent });
});

// Tuition / SPP
app.get('/api/tuition', (_req: Request, res: Response) => {
  res.json(db.tuition);
});

app.post('/api/tuition/pay/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { paymentMethod } = req.body;
  const record = db.tuition.find(t => t.id === id);

  if (!record) {
    return res.status(404).json({ error: 'Tagihan tidak ditemukan' });
  }

  record.status = 'Lunas';
  record.paidAt = new Date().toLocaleString('id-ID');
  record.paymentMethod = paymentMethod || 'QRIS';

  const student = db.students.find(s => s.id === record.studentId);
  if (student) {
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      type: 'Email',
      recipient: student.parentEmail,
      subject: `[Bukti Pembayaran] SPP ${record.month} Lunas: ${student.name}`,
      body: `Terima kasih! Pembayaran SPP bulan ${record.month} sebesar Rp ${record.amount.toLocaleString('id-ID')} atas nama ${student.name} telah DITERIMA dan LUNAS. No. Invoice: ${record.invoiceNo}.`,
      sentAt: new Date().toLocaleString('id-ID'),
      status: 'Terkirim',
      triggeredBy: 'Sistem Pembayaran SPP',
      category: 'Keuangan'
    });
  }

  saveDatabase(db);
  res.json(record);
});

// PPDB Online Applications
app.get('/api/ppdb', (_req: Request, res: Response) => {
  res.json(db.ppdb);
});

app.post('/api/ppdb', (req: Request, res: Response) => {
  const newApp = {
    id: `ppdb-${Date.now()}`,
    registrationNo: `PPDB-2026-${Math.floor(100 + Math.random() * 900)}`,
    status: 'Menunggu Verifikasi' as const,
    submittedAt: new Date().toLocaleString('id-ID'),
    ...req.body
  };

  db.ppdb.unshift(newApp);

  // Send Confirmation Email
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    type: 'Email',
    recipient: newApp.parentEmail,
    subject: `[PPDB Online] Pendaftaran Calon Siswa: ${newApp.fullName}`,
    body: `Pendaftaran PPDB atas nama ${newApp.fullName} dengan Nomor Registrasi ${newApp.registrationNo} berhasil dikirim. Silakan pantau pengumuman secara berkala.`,
    sentAt: new Date().toLocaleString('id-ID'),
    status: 'Terkirim',
    triggeredBy: 'Sistem PPDB Online',
    category: 'PPDB'
  });

  saveDatabase(db);
  res.status(201).json(newApp);
});

app.put('/api/ppdb/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.ppdb.findIndex(p => p.id === id);
  if (index !== -1) {
    db.ppdb[index] = { ...db.ppdb[index], ...req.body };
    saveDatabase(db);
    res.json(db.ppdb[index]);
  } else {
    res.status(404).json({ error: 'Aplikasi PPDB tidak ditemukan' });
  }
});

// Announcements
app.get('/api/announcements', (_req: Request, res: Response) => {
  res.json(db.announcements);
});

app.post('/api/announcements', (req: Request, res: Response) => {
  const newAnnouncement = {
    id: `anc-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    isPinned: false,
    priority: 'Normal' as const,
    ...req.body
  };

  db.announcements.unshift(newAnnouncement);

  // Broadcast Notification
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    type: 'Push Alert',
    recipient: 'Semua Pengguna Terdaftar',
    subject: `📢 Pengumuman Baru: ${newAnnouncement.title}`,
    body: newAnnouncement.content.substring(0, 150) + '...',
    sentAt: new Date().toLocaleString('id-ID'),
    status: 'Terkirim',
    triggeredBy: 'Publikasi Pengumuman',
    category: 'Pengumuman'
  });

  saveDatabase(db);
  res.status(201).json(newAnnouncement);
});

// Calendar Events & Google Sync Simulator
app.get('/api/calendar', (_req: Request, res: Response) => {
  res.json(db.calendar);
});

app.post('/api/calendar', (req: Request, res: Response) => {
  const newEvent = {
    id: `cal-${Date.now()}`,
    syncWithGoogle: true,
    ...req.body
  };
  db.calendar.push(newEvent);
  saveDatabase(db);
  res.status(201).json(newEvent);
});

// Notifications
app.get('/api/notifications', (_req: Request, res: Response) => {
  res.json(db.notifications);
});

// Third Party API Integration Endpoint (Simulated Webhook / External Sync API)
app.get('/api/v1/third-party/students', (req: Request, res: Response) => {
  const authHeader = req.headers['x-api-key'] || req.query.api_key;
  if (authHeader !== db.settings.apiKey && authHeader !== 'demo-key') {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key x-api-key' });
  }

  res.json({
    school: db.settings.schoolName,
    npsn: db.settings.npsn,
    totalStudents: db.students.length,
    students: db.students.map(s => ({
      nisn: s.nisn,
      name: s.name,
      className: s.className,
      status: s.status
    }))
  });
});

// Analytics Aggregation
app.get('/api/analytics', (_req: Request, res: Response) => {
  const totalStudents = db.students.length;
  const totalGrades = db.grades.length;
  const avgSchoolGrade = totalGrades > 0
    ? Number((db.grades.reduce((acc, g) => acc + g.finalGrade, 0) / totalGrades).toFixed(1))
    : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = db.attendance.filter(a => a.date === todayStr);
  const presentCount = todayAttendance.filter(a => a.status === 'Hadir').length;
  const lateCount = todayAttendance.filter(a => a.status === 'Terlambat').length;

  const totalTuitionCount = db.tuition.length;
  const paidTuitionCount = db.tuition.filter(t => t.status === 'Lunas').length;
  const tuitionRate = totalTuitionCount > 0 ? Math.round((paidTuitionCount / totalTuitionCount) * 100) : 0;

  res.json({
    totalStudents,
    avgSchoolGrade,
    presentToday: presentCount + lateCount,
    presentRate: totalStudents > 0 ? Math.round(((presentCount + lateCount) / totalStudents) * 100) : 92,
    tuitionPaidRate: tuitionRate,
    totalPPDB: db.ppdb.length,
    unpaidCount: db.tuition.filter(t => t.status === 'Belum Lunas' || t.status === 'Terlambat').length
  });
});

// ----------------------------------------------------
// VITE OR STATIC MIDDLEWARE
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SIAKAD Smart School] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
