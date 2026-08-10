import {
  Student,
  Grade,
  AttendanceRecord,
  TuitionRecord,
  Announcement,
  PPDBApplication,
  CalendarEvent,
  NotificationLog,
  SchoolSettings,
  UserProfile,
  SubjectConfig,
  DKNRecord,
  CharacterAssessment,
  SpiritualJourneyRecord
} from '../types';

export const initialSubjects: SubjectConfig[] = [
  // SMA Subjects
  { id: 'sbj-1', code: 'MAT-P', name: 'Matematika Peminatan', educationLevel: 'SMA', kkm: 75, category: 'Kelompok C (Peminatan)', isEnabled: true },
  { id: 'sbj-2', code: 'FIS', name: 'Fisika', educationLevel: 'SMA', kkm: 75, category: 'Kelompok C (Peminatan)', isEnabled: true },
  { id: 'sbj-3', code: 'KIM', name: 'Kimia', educationLevel: 'SMA', kkm: 75, category: 'Kelompok C (Peminatan)', isEnabled: true },
  { id: 'sbj-4', code: 'BIO', name: 'Biologi', educationLevel: 'SMA', kkm: 75, category: 'Kelompok C (Peminatan)', isEnabled: true },
  { id: 'sbj-5', code: 'BIN-SMA', name: 'Bahasa Indonesia', educationLevel: 'SMA', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  { id: 'sbj-6', code: 'BIG-SMA', name: 'Bahasa Inggris', educationLevel: 'SMA', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  { id: 'sbj-7', code: 'PAI-SMA', name: 'Pendidikan Agama & Budi Pekerti', educationLevel: 'SMA', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  { id: 'sbj-8', code: 'PPN-SMA', name: 'Pendidikan Pancasila & Kewarganegaraan', educationLevel: 'SMA', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  { id: 'sbj-9', code: 'SEJ-SMA', name: 'Sejarah Indonesia', educationLevel: 'SMA', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  
  // SMP Subjects
  { id: 'sbj-10', code: 'MAT-SMP', name: 'Matematika', educationLevel: 'SMP', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  { id: 'sbj-11', code: 'IPA-SMP', name: 'IPA Terpadu', educationLevel: 'SMP', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  { id: 'sbj-12', code: 'IPS-SMP', name: 'IPS Terpadu', educationLevel: 'SMP', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  { id: 'sbj-13', code: 'BIN-SMP', name: 'Bahasa Indonesia', educationLevel: 'SMP', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  { id: 'sbj-14', code: 'PAI-SMP', name: 'Pendidikan Agama Islam', educationLevel: 'SMP', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  
  // SD Subjects
  { id: 'sbj-15', code: 'MAT-SD', name: 'Matematika Dasar', educationLevel: 'SD', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  { id: 'sbj-16', code: 'BIN-SD', name: 'Bahasa Indonesia', educationLevel: 'SD', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  { id: 'sbj-17', code: 'IPAS-SD', name: 'IPAS (Sains & Sosial)', educationLevel: 'SD', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  { id: 'sbj-18', code: 'PAI-SD', name: 'Pendidikan Agama Islam', educationLevel: 'SD', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },

  // KB-TK Subjects
  { id: 'sbj-19', code: 'MOT-TK', name: 'Motorik & Keterampilan Halus', educationLevel: 'KB-TK', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  { id: 'sbj-20', code: 'KOG-TK', name: 'Pengembangan Kognitif & Sains', educationLevel: 'KB-TK', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true },
  { id: 'sbj-21', code: 'AGM-TK', name: 'Pembiasaan Moral & Nilai Agama', educationLevel: 'KB-TK', kkm: 75, category: 'Kelompok A (Wajib)', isEnabled: true }
];

export const initialSchoolSettings: SchoolSettings = {
  foundationName: 'Yayasan Pendidikan Nusantara Jaya',
  schoolName: 'SMA Negeri 1 Nusantara (SIAKAD Integrated)',
  logoUrl: 'https://images.unsplash.com/photo-1594312915251-48db9280c8f1?auto=format&fit=crop&q=80&w=200',
  letterheadHeader: 'YAYASAN PENDIDIKAN NUSANTARA JAYA',
  letterheadSub: 'SMA NEGERI 1 NUSANTARA • TERAKREDITASI A (UNGGUL)',
  letterheadAddress: 'Jl. Pendidikan Nusantara No. 45-50, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12150',
  letterheadContact: 'Telp: (021) 7590-1234 / 7590-5678 | Website: https://yayasan-nusantara.sch.id | Email: rapor@yayasan-nusantara.sch.id',
  themeColor: 'blue',
  welcomeTitle: 'Selamat Datang, {name}! 👋',
  welcomeSubtitle: 'Sistem Informasi Akademik Terpadu (SIAKAD) Multi-Jenjang Yayasan. Kelola data siswa, absensi QR, nilai, dan tagihan SPP.',
  dashboardBannerTheme: 'gradient-indigo',
  showLevelOverview: true,
  showRealtimeLogs: true,
  compactDashboardMode: false,
  subjects: initialSubjects,
  units: {
    'KB-TK': 'KB & TK Islam Nusantara',
    'SD': 'SD Nusantara 01',
    'SMP': 'SMP Nusantara 1',
    'SMA': 'SMA Negeri 1 Nusantara'
  },
  unitDetails: {
    'KB-TK': { npsn: '69001234', principalName: 'Hj. Aminah Nur, S.Pd.Aud' },
    'SD': { npsn: '20104321', principalName: 'Drs. H. Mulyadi, M.Pd.' },
    'SMP': { npsn: '20105678', principalName: 'Endang Kusuma, M.Si.' },
    'SMA': { npsn: '20108892', principalName: 'Dr. H. Budi Santoso, M.Pd.' }
  },
  foundationStatus: 'Aktif',
  unitStatus: {
    'KB-TK': 'Aktif',
    'SD': 'Aktif',
    'SMP': 'Aktif',
    'SMA': 'Aktif'
  },
  npsn: '20108892 / YPN-8820',
  address: 'Jl. Pendidikan Nusantara No. 45-50, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12150',
  phone: '(021) 7590-1234 / 7590-5678',
  email: 'sekretariat@yayasan-nusantara.sch.id',
  website: 'https://yayasan-nusantara.sch.id',
  principalName: 'Dr. H. Budi Santoso, M.Pd. (Ketua Yayasan)',
  academicYear: '2025/2026',
  currentSemester: 'Ganjil',
  autoEmailAlerts: true,
  autoPushAlerts: true,
  encryptionAlgorithm: 'AES-256-GCM (Enkripsi End-to-End)',
  lastCloudSync: new Date().toISOString(),
  apiKey: 'sk_live_nusantara_8f9a2b3c4d5e6f7a8b9c0d',
  firebaseProjectId: 'yayasan-nusantara-siakad-prod',
  firebaseConnected: true,
  paymentSettings: {
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
      },
      {
        id: 'bank-3',
        bankName: 'Bank BRI',
        accountNumber: '020601002345308',
        accountHolder: 'Yayasan Pendidikan Nusantara Jaya',
        instructions: 'Transfer via BRImo / ATM BRI. Konfirmasi otomatis melalui admin.',
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
      },
      {
        id: 'va-3',
        providerName: 'BNI Virtual Account',
        vaNumber: '988012348820901',
        accountHolder: 'SPP SIAKAD Yayasan Nusantara',
        instructions: 'Buka BNI Mobile Banking -> Transfer -> Virtual Account Billing.',
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
  },
  licenseStatus: 'Aktif',
  licenseExpirationDate: '2026-12-31',
  isAppFrozen: false,
  freezeReason: 'Masa berlaku lisensi langganan SIAKAD telah kadaluarsa / ditangguhkan sementara oleh Superadmin. Silakan hubungi Superadmin untuk konfirmasi perpanjangan pembayaran.',
  superadminPhone: '+62 812-3456-7890',
  superadminEmail: 'lisensi@yayasan-nusantara.sch.id',
  unblockRequests: [
    {
      id: 'req-101',
      requesterName: 'Drs. H. Mulyadi, M.Pd.',
      requesterEmail: 'mulyadi@yayasan-nusantara.sch.id',
      requesterPhone: '081298765432',
      schoolName: 'Yayasan Pendidikan Nusantara Jaya',
      message: 'Halo Superadmin, kami dari bendahara sekolah telah mentransfer biaya perpanjangan lisensi tahunan SIAKAD. Mohon verifikasi dan aktifkan kembali akses.',
      paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
      requestedAt: '2026-08-09 08:30',
      status: 'Pending'
    }
  ]
};

export const initialUsers: UserProfile[] = [
  {
    id: 'usr-super',
    name: 'Dr. H. Budi Santoso, M.Kom. (Superadmin Yayasan)',
    email: 'superadmin@yayasan-nusantara.sch.id',
    username: 'superadmin',
    password: 'superadmin123',
    role: 'superadmin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    status: 'Aktif',
    isGoogleConnected: true
  },
  {
    id: 'usr-1',
    name: 'Ahmad Fauzi, S.Kom. (Admin Operasional)',
    email: 'admin@yayasan-nusantara.sch.id',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    status: 'Aktif'
  },
  {
    id: 'usr-2',
    name: 'Dra. Siti Rahmawati (Guru Matematika & Pengajar)',
    email: 'siti.rahma@yayasan-nusantara.sch.id',
    username: 'siti',
    password: 'guru123',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    status: 'Aktif'
  },
  {
    id: 'usr-3',
    name: 'Bpk. Hendra Pratama (Orang Tua / Wali Murid)',
    email: 'hendra.pratama@gmail.com',
    username: 'hendra',
    password: 'ortu123',
    role: 'parent',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    studentId: 'std-101',
    status: 'Aktif'
  },
  {
    id: 'usr-4',
    name: 'Muhammad Rizky Pratama (Siswa SMA)',
    email: 'rizky.pratama@siswa.yayasan-nusantara.sch.id',
    username: 'rizky',
    password: 'siswa123',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    studentId: 'std-101',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    status: 'Aktif'
  }
];

export const initialStudents: Student[] = [
  // KB-TK
  {
    id: 'std-kbtk-1',
    nisn: '0181234001',
    name: 'Aisyah Az-Zahra',
    gender: 'P',
    className: 'TK B Bintang',
    educationLevel: 'KB-TK',
    parentName: 'Rian Az-Zahra',
    parentEmail: 'rian.azzahra@gmail.com',
    parentPhone: '081299881122',
    address: 'Jl. Melati No. 5, Kebayoran, Jakarta',
    birthDate: '2021-05-10',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    status: 'Aktif'
  },
  // SD
  {
    id: 'std-sd-1',
    nisn: '0151234002',
    name: 'Rafathar Malik Ahmad',
    gender: 'L',
    className: 'Kelas 4A SD',
    educationLevel: 'SD',
    parentName: 'Raffi Ahmad',
    parentEmail: 'raffi.ahmad@gmail.com',
    parentPhone: '081388776655',
    address: 'Jl. Andalus No. 10, Cilandak, Jakarta',
    birthDate: '2017-08-15',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    status: 'Aktif'
  },
  // SMP
  {
    id: 'std-smp-1',
    nisn: '0111234003',
    name: 'Nayla Amira Putri',
    gender: 'P',
    className: 'Kelas 8B SMP',
    educationLevel: 'SMP',
    parentName: 'Bambang Sukarta',
    parentEmail: 'bambang.s@gmail.com',
    parentPhone: '081577665544',
    address: 'Jl. Kenanga No. 22, Tebet, Jakarta',
    birthDate: '2013-02-20',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    status: 'Aktif'
  },
  // SMA
  {
    id: 'std-101',
    nisn: '0061234501',
    name: 'Muhammad Rizky Pratama',
    gender: 'L',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    parentName: 'Hendra Pratama',
    parentEmail: 'hendra.pratama@gmail.com',
    parentPhone: '081298765432',
    address: 'Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan',
    birthDate: '2008-04-15',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    status: 'Aktif'
  },
  {
    id: 'std-102',
    nisn: '0061234502',
    name: 'Anisa Putri Maharani',
    gender: 'P',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    parentName: 'Bambang Wijaya',
    parentEmail: 'bambang.wijaya@gmail.com',
    parentPhone: '081387654321',
    address: 'Jl. Anggrek No. 8, Cilandak, Jakarta Selatan',
    birthDate: '2008-08-22',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    status: 'Aktif'
  },
  {
    id: 'std-103',
    nisn: '0061234503',
    name: 'Daffa Fabian Kusuma',
    gender: 'L',
    className: 'XII IPA 2',
    educationLevel: 'SMA',
    parentName: 'Surya Kusuma',
    parentEmail: 'surya.kusuma@gmail.com',
    parentPhone: '081576543210',
    address: 'Jl. Mawar No. 45, Tebet, Jakarta Selatan',
    birthDate: '2008-02-10',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    status: 'Aktif'
  }
];

export const initialGrades: Grade[] = [
  // KB-TK
  {
    id: 'grd-kbtk-1',
    studentId: 'std-kbtk-1',
    studentName: 'Aisyah Az-Zahra',
    className: 'TK B Bintang',
    educationLevel: 'KB-TK',
    subject: 'Motorik & Motorik Halus',
    assignmentScore: 92,
    midExamScore: 90,
    finalExamScore: 94,
    finalGrade: 92.0,
    letterGrade: 'A',
    semester: 'Ganjil',
    academicYear: '2025/2026',
    notes: 'Sangat aktif mewarnai dan membentuk origami.'
  },
  // SD
  {
    id: 'grd-sd-1',
    studentId: 'std-sd-1',
    studentName: 'Rafathar Malik Ahmad',
    className: 'Kelas 4A SD',
    educationLevel: 'SD',
    subject: 'Matematika Dasar',
    assignmentScore: 85,
    midExamScore: 88,
    finalExamScore: 90,
    finalGrade: 88.0,
    letterGrade: 'A',
    semester: 'Ganjil',
    academicYear: '2025/2026',
    notes: 'Pemahaman operasi perkalian dan pembagian lancar.'
  },
  // SMP
  {
    id: 'grd-smp-1',
    studentId: 'std-smp-1',
    studentName: 'Nayla Amira Putri',
    className: 'Kelas 8B SMP',
    educationLevel: 'SMP',
    subject: 'IPA Terpadu',
    assignmentScore: 88,
    midExamScore: 85,
    finalExamScore: 89,
    finalGrade: 87.5,
    letterGrade: 'A',
    semester: 'Ganjil',
    academicYear: '2025/2026'
  },
  // SMA
  {
    id: 'grd-1',
    studentId: 'std-101',
    studentName: 'Muhammad Rizky Pratama',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    subject: 'Matematika Peminatan',
    assignmentScore: 88,
    midExamScore: 90,
    finalExamScore: 92,
    finalGrade: 90.2,
    letterGrade: 'A',
    semester: 'Ganjil',
    academicYear: '2025/2026',
    notes: 'Sangat menguasai kalkulus diferensial dan integral.'
  },
  {
    id: 'grd-2',
    studentId: 'std-101',
    studentName: 'Muhammad Rizky Pratama',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    subject: 'Fisika',
    assignmentScore: 85,
    midExamScore: 88,
    finalExamScore: 86,
    finalGrade: 86.3,
    letterGrade: 'A',
    semester: 'Ganjil',
    academicYear: '2025/2026'
  },
  {
    id: 'grd-4',
    studentId: 'std-102',
    studentName: 'Anisa Putri Maharani',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    subject: 'Matematika Peminatan',
    assignmentScore: 95,
    midExamScore: 92,
    finalExamScore: 96,
    finalGrade: 94.5,
    letterGrade: 'A',
    semester: 'Ganjil',
    academicYear: '2025/2026'
  }
];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: 'att-kbtk-1',
    studentId: 'std-kbtk-1',
    studentName: 'Aisyah Az-Zahra',
    className: 'TK B Bintang',
    educationLevel: 'KB-TK',
    date: '2026-08-09',
    time: '07:15:00',
    status: 'Hadir',
    qrCodeId: 'QR-STD-KBTK1',
    method: 'QR Code',
    notes: 'Hadir bersama ibu'
  },
  {
    id: 'att-sd-1',
    studentId: 'std-sd-1',
    studentName: 'Rafathar Malik Ahmad',
    className: 'Kelas 4A SD',
    educationLevel: 'SD',
    date: '2026-08-09',
    time: '06:55:00',
    status: 'Hadir',
    qrCodeId: 'QR-STD-SD1',
    method: 'QR Code'
  },
  {
    id: 'att-smp-1',
    studentId: 'std-smp-1',
    studentName: 'Nayla Amira Putri',
    className: 'Kelas 8B SMP',
    educationLevel: 'SMP',
    date: '2026-08-09',
    time: '06:50:00',
    status: 'Hadir',
    qrCodeId: 'QR-STD-SMP1',
    method: 'QR Code'
  },
  {
    id: 'att-1',
    studentId: 'std-101',
    studentName: 'Muhammad Rizky Pratama',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    date: '2026-08-09',
    time: '06:45:12',
    status: 'Hadir',
    qrCodeId: 'QR-STD-101',
    method: 'QR Code',
    notes: 'Hadir tepat waktu'
  },
  {
    id: 'att-3',
    studentId: 'std-103',
    studentName: 'Daffa Fabian Kusuma',
    className: 'XII IPA 2',
    educationLevel: 'SMA',
    date: '2026-08-09',
    time: '07:22:05',
    status: 'Terlambat',
    qrCodeId: 'QR-STD-103',
    method: 'QR Code',
    notes: 'Terlambat 22 menit - Ban sepeda motor bocor'
  }
];

export const initialTuition: TuitionRecord[] = [
  {
    id: 'spp-kbtk-1',
    studentId: 'std-kbtk-1',
    studentName: 'Aisyah Az-Zahra',
    className: 'TK B Bintang',
    educationLevel: 'KB-TK',
    month: 'Agustus 2026',
    year: 2026,
    amount: 350000,
    dueDate: '2026-08-10',
    status: 'Lunas',
    paidAt: '2026-08-01 09:00:00',
    paymentMethod: 'QRIS',
    invoiceNo: 'INV/2026/08/KBTK01'
  },
  {
    id: 'spp-sd-1',
    studentId: 'std-sd-1',
    studentName: 'Rafathar Malik Ahmad',
    className: 'Kelas 4A SD',
    educationLevel: 'SD',
    month: 'Agustus 2026',
    year: 2026,
    amount: 450000,
    dueDate: '2026-08-10',
    status: 'Lunas',
    paidAt: '2026-08-03 11:30:00',
    paymentMethod: 'Transfer Bank',
    invoiceNo: 'INV/2026/08/SD01'
  },
  {
    id: 'spp-smp-1',
    studentId: 'std-smp-1',
    studentName: 'Nayla Amira Putri',
    className: 'Kelas 8B SMP',
    educationLevel: 'SMP',
    month: 'Agustus 2026',
    year: 2026,
    amount: 550000,
    dueDate: '2026-08-10',
    status: 'Belum Lunas',
    invoiceNo: 'INV/2026/08/SMP01'
  },
  {
    id: 'spp-1',
    studentId: 'std-101',
    studentName: 'Muhammad Rizky Pratama',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    month: 'Agustus 2026',
    year: 2026,
    amount: 650000,
    dueDate: '2026-08-10',
    status: 'Lunas',
    paidAt: '2026-08-02 10:15:00',
    paymentMethod: 'QRIS',
    invoiceNo: 'INV/2026/08/SMA01'
  },
  {
    id: 'spp-3',
    studentId: 'std-103',
    studentName: 'Daffa Fabian Kusuma',
    className: 'XII IPA 2',
    educationLevel: 'SMA',
    month: 'Agustus 2026',
    year: 2026,
    amount: 650000,
    dueDate: '2026-08-10',
    status: 'Belum Lunas',
    invoiceNo: 'INV/2026/08/SMA03'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'anc-1',
    title: 'Rapat Koordinasi Seluruh Unit Yayasan (KB-TK, SD, SMP, SMA)',
    category: 'Akademik',
    content: 'Pemberitahuan kepada seluruh kepala unit dan dewan guru Yayasan Pendidikan Nusantara Jaya mengenai persiapan Ujian Semester Ganjil TA 2025/2026.',
    targetAudience: 'Semua',
    educationLevel: 'Semua',
    date: '2026-08-05',
    author: 'Superadmin Yayasan',
    isPinned: true,
    priority: 'Penting'
  },
  {
    id: 'anc-2',
    title: 'Pembayaran SPP Bulan Agustus - Seluruh Jenjang Pendidikan',
    category: 'Keuangan',
    content: 'Tenggat pembayaran SPP bulan Agustus untuk unit KB-TK, SD, SMP, dan SMA jatuh pada tanggal 10 Agustus 2026 via QRIS, Transfer Bank, atau Virtual Account.',
    targetAudience: 'Orang Tua',
    educationLevel: 'Semua',
    date: '2026-08-01',
    author: 'Bendahara Yayasan',
    isPinned: true,
    priority: 'Tinggi'
  },
  {
    id: 'anc-3',
    title: 'Pendaftaran PPDB Online Gelombang 2 (KB-TK, SD, SMP, SMA)',
    category: 'PPDB',
    content: 'Portal Pendaftaran Peserta Didik Baru (PPDB) terpadu Yayasan telah dibuka untuk seluruh jenjang pendidikan tahun ajaran 2026/2027.',
    targetAudience: 'Semua',
    educationLevel: 'Semua',
    date: '2026-08-07',
    author: 'Panitia PPDB Terpadu Yayasan',
    isPinned: false,
    priority: 'Normal'
  }
];

export const initialPPDB: PPDBApplication[] = [
  {
    id: 'ppdb-1',
    registrationNo: 'PPDB-KBTK-2026-001',
    fullName: 'Kinara Zhafira',
    gender: 'P',
    birthPlaceDate: 'Jakarta, 10 Maret 2022',
    previousSchool: 'PAUD Ceria',
    parentName: 'Dimas Zhafira',
    parentPhone: '081211112222',
    parentEmail: 'dimas@gmail.com',
    status: 'Lolos Berkas',
    examScore: 90.0,
    submittedAt: '2026-08-01 09:30:00',
    chosenMajor: 'TK A',
    educationLevel: 'KB-TK'
  },
  {
    id: 'ppdb-2',
    registrationNo: 'PPDB-SD-2026-002',
    fullName: 'Arsya Al-Fatih',
    gender: 'L',
    birthPlaceDate: 'Jakarta, 18 Juni 2019',
    previousSchool: 'TK Islam Nusantara',
    parentName: 'Hendra Al-Fatih',
    parentPhone: '081399887766',
    parentEmail: 'hendra.f@gmail.com',
    status: 'Diterima',
    examScore: 92.0,
    submittedAt: '2026-08-02 11:15:00',
    chosenMajor: 'Kelas 1 SD',
    educationLevel: 'SD'
  },
  {
    id: 'ppdb-3',
    registrationNo: 'PPDB-SMP-2026-003',
    fullName: 'Tania Nabila Restu',
    gender: 'P',
    birthPlaceDate: 'Bogor, 05 Juli 2013',
    previousSchool: 'SD Nusantara 01',
    parentName: 'Dewi Restu',
    parentEmail: 'dewi.restu@gmail.com',
    parentPhone: '081544332211',
    status: 'Menunggu Verifikasi',
    submittedAt: '2026-08-08 14:00:00',
    chosenMajor: 'Reguler SMP',
    educationLevel: 'SMP'
  },
  {
    id: 'ppdb-4',
    registrationNo: 'PPDB-SMA-2026-004',
    fullName: 'Arya Satria Pratama',
    gender: 'L',
    birthPlaceDate: 'Depok, 18 Oktober 2010',
    previousSchool: 'SMP Nusantara 1',
    parentName: 'Heri Pratama',
    parentEmail: 'heri.p@gmail.com',
    parentPhone: '081399887766',
    status: 'Diterima',
    examScore: 94.0,
    submittedAt: '2026-08-02 11:15:00',
    chosenMajor: 'MIPA (IPA)',
    educationLevel: 'SMA'
  }
];

export const initialCalendar: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Upacara HUT RI ke-81 Seluruh Unit Yayasan',
    startDate: '2026-08-17',
    endDate: '2026-08-17',
    category: 'Kegiatan',
    educationLevel: 'Semua',
    description: 'Upacara bendera gabungan unit KB-TK, SD, SMP, SMA di lapangan utama Yayasan.',
    syncWithGoogle: true
  },
  {
    id: 'cal-2',
    title: 'UTS Ganjil Unit SMP & SMA',
    startDate: '2026-09-15',
    endDate: '2026-09-22',
    category: 'Ujian',
    educationLevel: 'SMA',
    description: 'UTS Ganjil Berbasis Komputer & Smartphone (CBT).',
    syncWithGoogle: true
  },
  {
    id: 'cal-3',
    title: 'Pentas Seni & Bazar Kreativitas KB-TK & SD',
    startDate: '2026-10-10',
    endDate: '2026-10-10',
    category: 'Kegiatan',
    educationLevel: 'KB-TK',
    description: 'Pentas minat bakat anak dan pameran karya siswa.',
    syncWithGoogle: true
  }
];

export const initialNotifications: NotificationLog[] = [
  {
    id: 'notif-1',
    type: 'Email',
    recipient: 'hendra.pratama@gmail.com',
    subject: '[SIAKAD Yayasan] Notifikasi Kehadiran: Muhammad Rizky Pratama',
    body: 'Siswa atas nama Muhammad Rizky Pratama (SMA) telah melakukan scan QR Code absensi masuk pada jam 06:45:12 WIB dengan status HADIR TEPAT WAKTU.',
    sentAt: '2026-08-09 06:45:15',
    status: 'Terkirim',
    triggeredBy: 'Sistem QR Absensi Real-time',
    category: 'Absensi'
  },
  {
    id: 'notif-2',
    type: 'Push Alert',
    recipient: 'raffi.ahmad@gmail.com',
    subject: '⚠️ Laporan Presensi Harian SD',
    body: 'Ananda Rafathar Malik Ahmad (Kelas 4A SD) tercatat HADIR TEPAT WAKTU pada jam 06:55:00 WIB.',
    sentAt: '2026-08-09 06:55:05',
    status: 'Terkirim',
    triggeredBy: 'Auto QR Attendance',
    category: 'Absensi'
  }
];

export const initialDKN: DKNRecord[] = [
  // Student: std-101 (Muhammad Rizky Pratama)
  {
    id: 'dkn-101-1',
    studentId: 'std-101',
    studentName: 'Muhammad Rizky Pratama',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    subject: 'Matematika Peminatan',
    subjectCode: 'MAT-P',
    kkm: 75,
    uh1: 88,
    uh2: 90,
    uh3: 86,
    uhAverage: 88,
    midExamScore: 90,
    finalExamScore: 92,
    knowledgeScore: 90,
    knowledgePredicate: 'A',
    knowledgeDescription: 'Sangat baik dalam menganalisis persamaan fungsi trigonometri, turunan kalkulus, dan penyelesaian matriks orde tinggi.',
    semester: 'Ganjil',
    academicYear: '2025/2026'
  },
  {
    id: 'dkn-101-2',
    studentId: 'std-101',
    studentName: 'Muhammad Rizky Pratama',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    subject: 'Fisika',
    subjectCode: 'FIS',
    kkm: 75,
    uh1: 84,
    uh2: 86,
    uh3: 85,
    uhAverage: 85,
    midExamScore: 88,
    finalExamScore: 86,
    knowledgeScore: 86,
    knowledgePredicate: 'B',
    knowledgeDescription: 'Baik dalam memahami konsep medan magnet, induksi elektromagnetik, serta teori relativitas khusus.',
    semester: 'Ganjil',
    academicYear: '2025/2026'
  },
  {
    id: 'dkn-101-3',
    studentId: 'std-101',
    studentName: 'Muhammad Rizky Pratama',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    subject: 'Kimia',
    subjectCode: 'KIM',
    kkm: 75,
    uh1: 82,
    uh2: 85,
    uh3: 88,
    uhAverage: 85,
    midExamScore: 86,
    finalExamScore: 88,
    knowledgeScore: 87,
    knowledgePredicate: 'B',
    knowledgeDescription: 'Menguasai stoikiometri larutan, reaksi redoks, dan elektrokimia dengan ketelitian yang baik.',
    semester: 'Ganjil',
    academicYear: '2025/2026'
  },
  {
    id: 'dkn-101-4',
    studentId: 'std-101',
    studentName: 'Muhammad Rizky Pratama',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    subject: 'Bahasa Indonesia',
    subjectCode: 'BIN-SMA',
    kkm: 75,
    uh1: 90,
    uh2: 92,
    uh3: 91,
    uhAverage: 91,
    midExamScore: 90,
    finalExamScore: 94,
    knowledgeScore: 92,
    knowledgePredicate: 'A',
    knowledgeDescription: 'Sangat mahir dalam menyusun karya ilmiah, kritik sastra, dan presentasi gagasan ilmiah secara terstruktur.',
    semester: 'Ganjil',
    academicYear: '2025/2026'
  },
  {
    id: 'dkn-101-5',
    studentId: 'std-101',
    studentName: 'Muhammad Rizky Pratama',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    subject: 'Pendidikan Agama & Budi Pekerti',
    subjectCode: 'PAI-SMA',
    kkm: 75,
    uh1: 94,
    uh2: 96,
    uh3: 95,
    uhAverage: 95,
    midExamScore: 94,
    finalExamScore: 96,
    knowledgeScore: 95,
    knowledgePredicate: 'A',
    knowledgeDescription: 'Sangat menguasai ayat-ayat al-Qur\'an tentang toleransi, etika bermasyarakat, dan penerapan fiqih muamalah.',
    semester: 'Ganjil',
    academicYear: '2025/2026'
  },

  // Student: std-102 (Anisa Putri Maharani)
  {
    id: 'dkn-102-1',
    studentId: 'std-102',
    studentName: 'Anisa Putri Maharani',
    className: 'XII IPA 1',
    educationLevel: 'SMA',
    subject: 'Matematika Peminatan',
    subjectCode: 'MAT-P',
    kkm: 75,
    uh1: 95,
    uh2: 94,
    uh3: 96,
    uhAverage: 95,
    midExamScore: 92,
    finalExamScore: 96,
    knowledgeScore: 95,
    knowledgePredicate: 'A',
    knowledgeDescription: 'Istimewa dalam menyelesaikan soal-soal olimpiade kalkulus dan matematika statistik.',
    semester: 'Ganjil',
    academicYear: '2025/2026'
  }
];

export const initialCharacterAssessments: Record<string, CharacterAssessment[]> = {
  'std-101': [
    { id: 'chr-1', studentId: 'std-101', dimension: 'Beriman, Bertakwa & Berakhlak Mulia', grade: 'SB', description: 'Terbiasa bersikap jujur, santun kepada guru dan sesama, serta rajin menjalankan ibadah tepat waktu.' },
    { id: 'chr-2', studentId: 'std-101', dimension: 'Gotong Royong & Kepedulian', grade: 'SB', description: 'Sangat aktif membantu teman dalam diskusi kelompok dan proaktif dalam kegiatan sosial sekolah.' },
    { id: 'chr-3', studentId: 'std-101', dimension: 'Mandiri & Tanggung Jawab', grade: 'BSH', description: 'Mampu menyelesaikan tugas mandiri sesuai waktu dan bertanggung jawab atas tugas kelas.' },
    { id: 'chr-4', studentId: 'std-101', dimension: 'Bernalar Kritis', grade: 'SB', description: 'Menunjukkan kemampuan analisa tajam dalam memecahkan masalah sains dan studi kasus ilmiah.' },
    { id: 'chr-5', studentId: 'std-101', dimension: 'Kreatif & Inovatif', grade: 'BSH', description: 'Mampu mencetuskan gagasan baru dalam proyek sains dan media digital.' }
  ],
  'std-102': [
    { id: 'chr-6', studentId: 'std-102', dimension: 'Beriman, Bertakwa & Berakhlak Mulia', grade: 'SB', description: 'Memiliki akhlak teruji dan disiplin ibadah yang konsisten.' },
    { id: 'chr-7', studentId: 'std-102', dimension: 'Bernalar Kritis', grade: 'SB', description: 'Mampu berpikir logis dan sistematis dalam pemecahan masalah.' }
  ]
};

export const initialSpiritualJourney: Record<string, SpiritualJourneyRecord> = {
  'std-101': {
    id: 'spj-101',
    studentId: 'std-101',
    studentName: 'Muhammad Rizky Pratama',
    academicYear: '2025/2026',
    semester: 'Ganjil',
    bibleBook: 'Injil Yohanes',
    bibleChapterVerse: 'Yohanes 15 : 1 - 8',
    bibleRhema: 'Tinggal di dalam Kristus menghasilkan buah kehidupan yang berlimpah dan memuliakan Bapa. Tanpa Kristus kita tidak dapat berbuat apa-apa.',
    serviceDayDate: 'Minggu, 3 Agustus 2025',
    serviceChurchName: 'Gereja GKI Nusantara Jakarta',
    servicePastorName: 'Pdt. Yohanes Setiawan, M.Th',
    serviceSermonTopic: 'Menjadi Garam & Terang Dunia di Era Digital',
    serviceDocumentationUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=400',
    ustadzNotes: 'Ananda sangat rajin beribadah, konsisten mencatat rhema firman Tuhan, dan memberikan teladan positif bagi teman-temannya.'
  },
  'std-102': {
    id: 'spj-102',
    studentId: 'std-102',
    studentName: 'Anisa Putri Maharani',
    academicYear: '2025/2026',
    semester: 'Ganjil',
    bibleBook: 'Kitab Mazmur',
    bibleChapterVerse: 'Mazmur 23 : 1 - 6',
    bibleRhema: 'Tuhan adalah gembalaku yang baik, aku tidak akan kekurangan dan selalu dalam bimbingan serta perlindungan-Nya sepanjang masa.',
    serviceDayDate: 'Minggu, 3 Agustus 2025',
    serviceChurchName: 'GBI Jemaat Pusat',
    servicePastorName: 'Pdt. David Kusuma, S.Th',
    serviceSermonTopic: 'Keberanian Melangkah Bersama Janji Tuhan',
    serviceDocumentationUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=400',
    ustadzNotes: 'Sangat aktif dalam ibadah pemuda dan konsisten melakukan perenungan firman setiap hari.'
  }
};

export const initialChatConversations: any[] = [
  {
    id: 'chat-1',
    isGroup: false,
    participantIds: ['usr-2', 'usr-3'],
    participants: [
      {
        id: 'usr-2',
        name: 'Dra. Siti Rahmawati',
        role: 'teacher',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        className: 'XII IPA 1',
        isOnline: true,
        lastSeen: 'Baru saja'
      },
      {
        id: 'usr-3',
        name: 'Bpk. Hendra Pratama',
        role: 'parent',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        studentName: 'Muhammad Rizky Pratama',
        className: 'XII IPA 1',
        isOnline: true,
        lastSeen: 'Baru saja'
      }
    ],
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    unreadCount: { 'usr-3': 1, 'usr-2': 0 },
    messages: [
      {
        id: 'msg-101',
        senderId: 'usr-3',
        senderName: 'Bpk. Hendra Pratama',
        senderRole: 'parent',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        text: 'Selamat pagi Ibu Siti Rahmawati. Saya Bpk. Hendra, orang tua dari Rizky (XII IPA 1). Ingin menanyakan perkembangan belajar Matematika Peminatan Rizky.',
        timestamp: '08:15',
        isRead: true
      },
      {
        id: 'msg-102',
        senderId: 'usr-2',
        senderName: 'Dra. Siti Rahmawati',
        senderRole: 'teacher',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        text: 'Selamat pagi Pak Hendra. Alhamdulillah Rizky mengalami peningkatan nilai yang sangat baik pada Ujian Tengah Semester kemarin (Nilai: 88). Keaktifannya di kelas juga luar biasa.',
        timestamp: '08:20',
        isRead: true
      },
      {
        id: 'msg-103',
        senderId: 'usr-3',
        senderName: 'Bpk. Hendra Pratama',
        senderRole: 'parent',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        text: 'Terima kasih banyak Bu Siti atas bimbingannya. Bagaimana dengan catatannya untuk Spiritual Journey dan kedisiplinan shalat di sekolah?',
        timestamp: '08:25',
        isRead: true
      },
      {
        id: 'msg-104',
        senderId: 'usr-2',
        senderName: 'Dra. Siti Rahmawati',
        senderRole: 'teacher',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        text: 'Sangat teratur Pak. Lembar pemantauan Spiritual Journey & Alkitab Rizky terisi tuntas dengan catatan rhema yang sangat berkesan. Bapak juga bisa mengunduh Rapor Digitalnya langsung di menu Nilai SIAKAD.',
        timestamp: '08:30',
        isRead: false
      }
    ]
  },
  {
    id: 'chat-2',
    isGroup: false,
    participantIds: ['usr-1', 'usr-3'],
    participants: [
      {
        id: 'usr-1',
        name: 'Ahmad Fauzi, S.Kom.',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        isOnline: true,
        lastSeen: 'Online'
      },
      {
        id: 'usr-3',
        name: 'Bpk. Hendra Pratama',
        role: 'parent',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        studentName: 'Muhammad Rizky Pratama',
        isOnline: true,
        lastSeen: 'Baru saja'
      }
    ],
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    unreadCount: { 'usr-3': 0, 'usr-1': 0 },
    messages: [
      {
        id: 'msg-201',
        senderId: 'usr-3',
        senderName: 'Bpk. Hendra Pratama',
        senderRole: 'parent',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        text: 'Halo Admin Operasional, saya sudah melakukan pembayaran SPP via Mandiri Virtual Account untuk Rizky. Apakah sudah otomatis terverifikasi?',
        timestamp: 'Kemarin 14:10',
        isRead: true
      },
      {
        id: 'msg-202',
        senderId: 'usr-1',
        senderName: 'Ahmad Fauzi, S.Kom.',
        senderRole: 'admin',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        text: 'Halo Pak Hendra. Pembayaran via Virtual Account & QRIS terverifikasi secara otomatis oleh sistem. Invoice dan kuitansi resminya sudah dapat diunduh pada tab Biaya Pendidikan.',
        timestamp: 'Kemarin 14:15',
        isRead: true
      }
    ]
  },
  {
    id: 'chat-3',
    isGroup: true,
    title: 'Forum Diskusi Wali Murid XII IPA 1',
    groupCategory: 'Forum Orang Tua',
    participantIds: ['usr-2', 'usr-3', 'usr-[student-parent-2]'],
    participants: [
      {
        id: 'usr-2',
        name: 'Dra. Siti Rahmawati (Wali Kelas)',
        role: 'teacher',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        isOnline: true
      },
      {
        id: 'usr-3',
        name: 'Bpk. Hendra Pratama',
        role: 'parent',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        studentName: 'Muhammad Rizky Pratama',
        isOnline: true
      }
    ],
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    unreadCount: {},
    messages: [
      {
        id: 'msg-301',
        senderId: 'usr-2',
        senderName: 'Dra. Siti Rahmawati (Wali Kelas)',
        senderRole: 'teacher',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        text: 'Bapak/Ibu Orang Tua siswa XII IPA 1 yang kami hormati, diingatkan kembali mengenai persiapan Tryout Nasional Pekan Depan. Mohon bantuan untuk memantau waktu belajar putra-putri di rumah.',
        timestamp: '07:45',
        isRead: true
      },
      {
        id: 'msg-302',
        senderId: 'usr-3',
        senderName: 'Bpk. Hendra Pratama',
        senderRole: 'parent',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        text: 'Baik Ibu Wali Kelas, terima kasih informasinya. Kami siap mendukung dan mendampingi putra-putri kami.',
        timestamp: '08:02',
        isRead: true
      }
    ]
  },
  {
    id: 'chat-4',
    isGroup: false,
    participantIds: ['usr-2', 'usr-4'],
    participants: [
      {
        id: 'usr-2',
        name: 'Dra. Siti Rahmawati',
        role: 'teacher',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        isOnline: true
      },
      {
        id: 'usr-4',
        name: 'Muhammad Rizky Pratama',
        role: 'student',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
        className: 'XII IPA 1',
        isOnline: true
      }
    ],
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    unreadCount: {},
    messages: [
      {
        id: 'msg-401',
        senderId: 'usr-4',
        senderName: 'Muhammad Rizky Pratama',
        senderRole: 'student',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
        text: 'Selamat siang Bu Siti. Maaf mengganggu, untuk materi Turunan Fungsi Trigonometri halaman 45 apakah ada soal latihan tambahan?',
        timestamp: 'Kemarin 16:30',
        isRead: true
      },
      {
        id: 'msg-402',
        senderId: 'usr-2',
        senderName: 'Dra. Siti Rahmawati',
        senderRole: 'teacher',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        text: 'Selamat siang Rizky. Bagus sekali semangat belajarnya! Kamu bisa mencoba modul soal nomor 1 sampai 10 di SIAKAD. Nanti jika ada kendala, bisa didiskusikan langsung saat jam istirahat ya.',
        timestamp: 'Kemarin 16:35',
        isRead: true
      }
    ]
  },
  {
    id: 'chat-5',
    isGroup: false,
    participantIds: ['usr-super', 'usr-1'],
    participants: [
      {
        id: 'usr-super',
        name: 'Dr. H. Budi Santoso, M.Kom.',
        role: 'superadmin',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        isOnline: true
      },
      {
        id: 'usr-1',
        name: 'Ahmad Fauzi, S.Kom.',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        isOnline: true
      }
    ],
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    unreadCount: {},
    messages: [
      {
        id: 'msg-501',
        senderId: 'usr-super',
        senderName: 'Dr. H. Budi Santoso, M.Kom.',
        senderRole: 'superadmin',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        text: 'Pak Ahmad, mohon pastikan seluruh data Rapor Digital & Spiritual Journey semester ini disinkronkan secara aman dengan database cloud.',
        timestamp: 'Kemarin 09:00',
        isRead: true
      },
      {
        id: 'msg-502',
        senderId: 'usr-1',
        senderName: 'Ahmad Fauzi, S.Kom.',
        senderRole: 'admin',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        text: 'Siap Pak Ketua Yayasan. Semua modul terenkripsi AES-256-GCM dan fitur cetak PDF serta ekspor API sudah aktif lancar.',
        timestamp: 'Kemarin 09:12',
        isRead: true
      }
    ]
  }
];


