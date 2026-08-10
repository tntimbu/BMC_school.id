export type UserRole = 'superadmin' | 'admin' | 'teacher' | 'student' | 'parent';
export type EducationLevel = 'KB-TK' | 'SD' | 'SMP' | 'SMA';

export interface UserPermission {
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  isGoogleConnected?: boolean;
  role: UserRole;
  avatarUrl: string;
  studentId?: string; // If role is parent or student
  className?: string;
  educationLevel?: EducationLevel;
  permissions?: UserPermission[];
  status?: 'Aktif' | 'Nonaktif' | 'Diblokir';
}

export interface Student {
  id: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  className: string;
  educationLevel: EducationLevel;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  birthDate: string;
  photoUrl: string;
  status: 'Aktif' | 'Alumni' | 'Cuti' | 'Pindah';
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  educationLevel: EducationLevel;
  subject: string;
  assignmentScore: number;
  midExamScore: number;
  finalExamScore: number;
  finalGrade: number;
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  educationLevel: EducationLevel;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha' | 'Terlambat';
  qrCodeId: string;
  method: 'QR Code' | 'Manual' | 'Fingerprint';
  notes?: string;
}

export interface BankAccountConfig {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  instructions?: string;
  isEnabled: boolean;
}

export interface SubjectConfig {
  id: string;
  code: string;
  name: string;
  educationLevel: EducationLevel;
  kkm: number; // default 75
  category?: 'Kelompok A (Wajib)' | 'Kelompok B (Wajib)' | 'Kelompok C (Peminatan)' | 'Muatan Lokal';
  isEnabled: boolean;
}

export interface RombelConfig {
  id: string;
  name: string; // e.g. "Kelas 1", "Kelas 2", "TK A", "Kelas VII"
  educationLevel: EducationLevel;
  homeroomTeacher: string; // e.g. "Pak Ahmad, S.Pd"
  roomName?: string; // e.g. "Gedung A - R. 101"
  capacity?: number; // default 32
  academicYear?: string;
  notes?: string;
}

export interface DKNRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  educationLevel: EducationLevel;
  subject: string;
  subjectCode?: string;
  kkm: number; // default 75
  uh1?: number;
  uh2?: number;
  uh3?: number;
  uhAverage: number; // Penilaian Harian / Tugas (30%)
  midExamScore: number; // PTS (30%)
  finalExamScore: number; // PAS (40%)
  knowledgeScore: number; // Nilai Pengetahuan Akumulasi
  knowledgePredicate: 'A' | 'B' | 'C' | 'D'; // KKM 75: A>=90, B=83-89, C=75-82, D<75
  knowledgeDescription: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
}

export interface CharacterAssessment {
  id: string;
  studentId: string;
  dimension: string; // e.g., "Beriman & Bertaqwa", "Gotong Royong", "Mandiri", "Bernalar Kritis", "Kreatif", "Kebinekaan Global"
  grade: 'SB' | 'BSH' | 'MB' | 'BB'; // SB=Sangat Berkembang, BSH=Berkembang Sesuai Harapan, MB=Mulai Berkembang, BB=Belum Berkembang
  description: string;
}

export interface SpiritualJourneyRecord {
  id: string;
  studentId: string;
  studentName: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  
  // 1. Ketuntasan Baca Alkitab
  bibleBook?: string; // Kitab mana (misal: Yohanes, Mazmur, Kejadian)
  bibleChapterVerse?: string; // Pasal dan Ayat (misal: Yohanes 3:16-21)
  bibleRhema?: string; // Rhema yang didapatkan dari pembacaannya

  // 2. Keikutsertaan Kegiatan Ibadah
  serviceDayDate?: string; // Hari dan Tanggal (misal: Minggu, 10 Agustus 2025)
  serviceChurchName?: string; // Gereja mana (misal: GKI / GBI / HKBP Nusantara)
  servicePastorName?: string; // Pendeta / Pembicara siapa (misal: Pdt. Yohanes Setiawan, M.Th)
  serviceSermonTopic?: string; // Tema Firman Tuhan (misal: "Hidup Berdampak dan Menjadi Terang")
  serviceDocumentationUrl?: string; // Dokumentasi Bukti Ikut Ibadah (Foto/URL)

  // Backward-compatible fallback fields
  dailyPrayerStatus?: string;
  tahfidzProgress?: string;
  quranRecitation?: string;
  dailySupplication?: string;
  akhlakScore?: string;
  ustadzNotes?: string;
}

export interface VirtualAccountConfig {
  id: string;
  providerName: string;
  vaNumber: string;
  accountHolder: string;
  instructions?: string;
  isEnabled: boolean;
}

export interface QRISConfig {
  id: string;
  merchantName: string;
  qrisCode: string;
  nmid?: string;
  imageUrl?: string;
  instructions?: string;
  isEnabled: boolean;
}

export interface PaymentMethodsSettings {
  bankAccounts: BankAccountConfig[];
  virtualAccounts: VirtualAccountConfig[];
  qris: QRISConfig[];
}

export interface TuitionRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  educationLevel: EducationLevel;
  month: string; // e.g. "Agustus 2026"
  year: number;
  amount: number;
  dueDate: string;
  status: 'Lunas' | 'Belum Lunas' | 'Menunggu Konfirmasi' | 'Ditolak' | 'Terlambat';
  paidAt?: string;
  paymentMethod?: 'Transfer Bank' | 'QRIS' | 'Tunai / Kasir' | 'Virtual Account';
  selectedPaymentDetail?: string;
  proofUrl?: string;
  transactionRef?: string;
  submittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  invoiceNo: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Akademik' | 'Keuangan' | 'Kegiatan' | 'Darurat' | 'PPDB';
  content: string;
  targetAudience: 'Semua' | 'Siswa' | 'Guru' | 'Orang Tua';
  educationLevel: EducationLevel | 'Semua';
  date: string;
  author: string;
  isPinned: boolean;
  priority: 'Normal' | 'Tinggi' | 'Penting';
}

export interface PPDBApplication {
  id: string;
  registrationNo: string;
  fullName: string;
  gender: 'L' | 'P';
  birthPlaceDate: string;
  previousSchool: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  status: 'Menunggu Verifikasi' | 'Lolos Berkas' | 'Diterima' | 'Ditolak';
  examScore?: number;
  submittedAt: string;
  chosenMajor: string; // e.g., IPA, IPS, Umum, TK, SD
  educationLevel: EducationLevel;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  category: 'Akademik' | 'Ujian' | 'Libur' | 'Rapat' | 'Kegiatan';
  educationLevel: EducationLevel | 'Semua';
  description: string;
  syncWithGoogle: boolean;
}

export interface NotificationLog {
  id: string;
  type: 'Email' | 'Push Alert' | 'System';
  recipient: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'Terkirim' | 'Gagal' | 'Pending';
  triggeredBy: string;
  category: 'Absensi' | 'Keuangan' | 'Pengumuman' | 'Nilai' | 'Sistem' | 'PPDB';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: 'image' | 'file';
  isRead?: boolean;
}

export interface ChatConversation {
  id: string;
  title?: string; // For group chat or recipient name
  isGroup?: boolean;
  participantIds: string[]; // List of user IDs
  participants: {
    id: string;
    name: string;
    role: UserRole;
    avatarUrl: string;
    studentName?: string;
    className?: string;
    isOnline?: boolean;
    lastSeen?: string;
  }[];
  messages: ChatMessage[];
  lastMessageAt: string;
  unreadCount?: Record<string, number>; // key = userId
  groupCategory?: 'Wali Kelas' | 'Pengumuman Guru' | 'Forum Orang Tua' | 'Konsultasi Belajar' | 'Umum';
}

export interface FoundationUnit {
  id: EducationLevel;
  code: EducationLevel;
  name: string; // Custom unit name, e.g. "KB-TK Islam Nusantara"
  npsn: string;
  principalName: string;
}

export interface UnblockRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  schoolName: string;
  message: string;
  paymentProofUrl?: string;
  requestedAt: string;
  status: 'Pending' | 'Disetujui' | 'Ditolak';
}

export interface SchoolSettings {
  foundationName: string; // e.g. "Yayasan Pendidikan Nusantara Jaya"
  schoolName: string; // Active/default school display name
  units: Record<string, string>; // Custom names per level unit (e.g. 'KB-TK', 'SD', 'SMP', 'SMA', 'SMK')
  unitDetails?: Record<string, { npsn: string; principalName: string }>;
  foundationStatus?: 'Aktif' | 'Nonaktif' | 'Diblokir';
  unitStatus?: Record<string, 'Aktif' | 'Nonaktif' | 'Diblokir'>;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  academicYear: string;
  currentSemester: 'Ganjil' | 'Genap';
  autoEmailAlerts: boolean;
  autoPushAlerts: boolean;
  encryptionAlgorithm: string;
  lastCloudSync: string;
  apiKey: string;
  firebaseProjectId?: string;
  firebaseConnected?: boolean;
  googleSpreadsheetId?: string;
  googleDriveFolderId?: string;
  googleServiceAccountEmail?: string;
  googleSyncStatus?: 'Terhubung' | 'Terputus' | 'Sinkronisasi';
  paymentSettings?: PaymentMethodsSettings;
  // Custom Logo & Kop Surat Rapor
  logoUrl?: string;
  letterheadHeader?: string; // Baris 1: Nama Yayasan / Sekolah
  letterheadSub?: string;    // Baris 2: Akreditasi & NPSN
  letterheadAddress?: string;// Baris 3: Alamat Lengkap
  letterheadContact?: string;// Baris 4: Telp / Website / Email
  // Admin Display & Theme Customization
  themeColor?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple';
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  dashboardBannerTheme?: 'gradient-indigo' | 'gradient-emerald' | 'gradient-slate' | 'gradient-amber' | 'gradient-rose';
  showLevelOverview?: boolean;
  showRealtimeLogs?: boolean;
  compactDashboardMode?: boolean;
  // Card Customization by Admin
  cardBgColor?: 'slate' | 'zinc' | 'indigo' | 'emerald' | 'amber' | 'dark';
  cardBorderColor?: 'slate' | 'blue' | 'amber' | 'emerald' | 'purple' | 'none';
  cardPadding?: 'compact' | 'normal' | 'spacious';
  cardRadius?: 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  // Social Media & YouTube Activity
  youtubeVideoUrl?: string;
  youtubeVideoTitle?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialTiktok?: string;
  socialWebsite?: string;
  // Broadcast Warning/Notice from Admin
  broadcastNotification?: {
    active: boolean;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'danger' | 'success';
    date: string;
    id: string;
  };
  // Custom Subjects (Mata Pelajaran) & Rombel (Rombongan Belajar)
  subjects?: SubjectConfig[];
  customRombels?: RombelConfig[];
  // License & Account Expiration Management
  licenseStatus?: 'Aktif' | 'Masa Tenggang' | 'Kadaluarsa' | 'Diblokir';
  licenseExpirationDate?: string;
  isAppFrozen?: boolean;
  freezeReason?: string;
  superadminPhone?: string;
  superadminEmail?: string;
  unblockRequests?: UnblockRequest[];
}
