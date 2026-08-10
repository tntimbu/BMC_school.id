import React, { useState, useEffect } from 'react';
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
  initialNotifications,
  initialDKN,
  initialCharacterAssessments,
  initialSpiritualJourney,
  initialChatConversations
} from './data/mockData';
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
  EducationLevel,
  PaymentMethodsSettings,
  DKNRecord,
  CharacterAssessment,
  SpiritualJourneyRecord,
  ChatConversation,
  UnblockRequest
} from './types';

import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { GradesManagement } from './components/GradesManagement';
import { QRAttendance } from './components/QRAttendance';
import { TuitionManagement } from './components/TuitionManagement';
import { ChatModule } from './components/ChatModule';
import { PPDBOnline } from './components/PPDBOnline';
import { AnnouncementsBoard } from './components/AnnouncementsBoard';
import { SchoolCalendar } from './components/SchoolCalendar';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { NotificationCenter } from './components/NotificationCenter';
import { UserRoleManagement } from './components/UserRoleManagement';
import { ThirdPartyAPIExport } from './components/ThirdPartyAPIExport';
import { SchoolSettingsView } from './components/SchoolSettingsView';
import { BottomNavigation } from './components/BottomNavigation';
import { AppFreezeOverlay } from './components/AppFreezeOverlay';
import { LoginPage } from './components/LoginPage';
import { UserProfileModal } from './components/UserProfileModal';
import { ShieldCheck, Activity, Lock, Cloud, Cpu, Crown, ShieldAlert } from 'lucide-react';

export default function App() {
  // Helper function to broadcast state sync across browser windows/tabs
  const broadcastStateSync = (type: string, data: any) => {
    try {
      const channel = new BroadcastChannel('siakad_realtime_channel');
      channel.postMessage({ type, data, timestamp: Date.now() });
      channel.close();
    } catch (err) {}
  };

  const [settings, setSettings] = useState<SchoolSettings>(() => {
    try {
      const saved = localStorage.getItem('siakad_school_settings');
      if (saved) return { ...initialSchoolSettings, ...JSON.parse(saved) };
    } catch (err) {}
    return initialSchoolSettings;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('siakad_users');
      if (saved) {
        const parsed: UserProfile[] = JSON.parse(saved);
        // Merge with initialUsers to guarantee standard default accounts are always up-to-date
        const merged = initialUsers.map(initU => {
          const match = parsed.find(p => p.id === initU.id || p.role === initU.role);
          return match
            ? { ...match, email: initU.email, username: initU.username, password: initU.password, status: 'Aktif' }
            : initU;
        });
        const nonDefaults = parsed.filter(p => !initialUsers.some(initU => initU.id === p.id));
        return [...merged, ...nonDefaults];
      }
    } catch (err) {}
    return initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedUserId = sessionStorage.getItem('siakad_current_user_id');
      if (savedUserId) {
        const savedUsers = localStorage.getItem('siakad_users');
        const allUsers = savedUsers ? JSON.parse(savedUsers) : initialUsers;
        const found = allUsers.find((u: UserProfile) => u.id === savedUserId);
        if (found) return found;
      }
    } catch (err) {}
    return null;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem('siakad_current_user_id', currentUser.id);
      } else {
        sessionStorage.removeItem('siakad_current_user_id');
      }
    } catch (err) {}
  }, [currentUser]);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const handleSaveProfile = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleAddUser = (newUser: UserProfile) => {
    setUsers(prev => [newUser, ...prev]);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('siakad_students');
      if (saved) return JSON.parse(saved);
    } catch (err) {}
    return initialStudents;
  });

  const [grades, setGrades] = useState<Grade[]>(() => {
    try {
      const saved = localStorage.getItem('siakad_grades');
      if (saved) return JSON.parse(saved);
    } catch (err) {}
    return initialGrades;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('siakad_attendance');
      if (saved) return JSON.parse(saved);
    } catch (err) {}
    return initialAttendance;
  });

  const [tuition, setTuition] = useState<TuitionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('siakad_tuition');
      if (saved) return JSON.parse(saved);
    } catch (err) {}
    return initialTuition;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('siakad_announcements');
      if (saved) return JSON.parse(saved);
    } catch (err) {}
    return initialAnnouncements;
  });

  const [ppdb, setPpdb] = useState<PPDBApplication[]>(() => {
    try {
      const saved = localStorage.getItem('siakad_ppdb');
      if (saved) return JSON.parse(saved);
    } catch (err) {}
    return initialPPDB;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('siakad_events');
      if (saved) return JSON.parse(saved);
    } catch (err) {}
    return initialCalendar;
  });

  const [notifications, setNotifications] = useState<NotificationLog[]>(() => {
    try {
      const saved = localStorage.getItem('siakad_notifications');
      if (saved) return JSON.parse(saved);
    } catch (err) {}
    return initialNotifications;
  });

  const [dknGrades, setDknGrades] = useState<DKNRecord[]>(initialDKN);
  const [characterAssessments, setCharacterAssessments] = useState<Record<string, CharacterAssessment[]>>(initialCharacterAssessments);
  const [spiritualJourney, setSpiritualJourney] = useState<Record<string, SpiritualJourneyRecord>>(initialSpiritualJourney);
  const [conversations, setConversations] = useState<ChatConversation[]>(initialChatConversations);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeLevel, setActiveLevel] = useState<EducationLevel | 'Semua'>('Semua');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  // Persistence & Real-time Synchronization Effects
  useEffect(() => {
    try {
      localStorage.setItem('siakad_school_settings', JSON.stringify(settings));
      broadcastStateSync('SYNC_SETTINGS', settings);
    } catch (err) {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('siakad_users', JSON.stringify(users));
      broadcastStateSync('SYNC_USERS', users);
    } catch (err) {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('siakad_students', JSON.stringify(students));
      broadcastStateSync('SYNC_STUDENTS', students);
    } catch (err) {}
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('siakad_grades', JSON.stringify(grades));
      broadcastStateSync('SYNC_GRADES', grades);
    } catch (err) {}
  }, [grades]);

  useEffect(() => {
    try {
      localStorage.setItem('siakad_attendance', JSON.stringify(attendance));
      broadcastStateSync('SYNC_ATTENDANCE', attendance);
    } catch (err) {}
  }, [attendance]);

  useEffect(() => {
    try {
      localStorage.setItem('siakad_tuition', JSON.stringify(tuition));
      broadcastStateSync('SYNC_TUITION', tuition);
    } catch (err) {}
  }, [tuition]);

  useEffect(() => {
    try {
      localStorage.setItem('siakad_announcements', JSON.stringify(announcements));
      broadcastStateSync('SYNC_ANNOUNCEMENTS', announcements);
    } catch (err) {}
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem('siakad_ppdb', JSON.stringify(ppdb));
      broadcastStateSync('SYNC_PPDB', ppdb);
    } catch (err) {}
  }, [ppdb]);

  useEffect(() => {
    try {
      localStorage.setItem('siakad_events', JSON.stringify(events));
      broadcastStateSync('SYNC_EVENTS', events);
    } catch (err) {}
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('siakad_notifications', JSON.stringify(notifications));
      broadcastStateSync('SYNC_NOTIFICATIONS', notifications);
    } catch (err) {}
  }, [notifications]);

  // Realtime BroadcastChannel & Storage Event Multi-Tab Listener
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('siakad_realtime_channel');
      channel.onmessage = (event) => {
        const { type, data } = event.data || {};
        if (!type || !data) return;
        if (type === 'SYNC_SETTINGS') setSettings(data);
        else if (type === 'SYNC_USERS') setUsers(data);
        else if (type === 'SYNC_STUDENTS') setStudents(data);
        else if (type === 'SYNC_GRADES') setGrades(data);
        else if (type === 'SYNC_ATTENDANCE') setAttendance(data);
        else if (type === 'SYNC_TUITION') setTuition(data);
        else if (type === 'SYNC_ANNOUNCEMENTS') setAnnouncements(data);
        else if (type === 'SYNC_PPDB') setPpdb(data);
        else if (type === 'SYNC_EVENTS') setEvents(data);
        else if (type === 'SYNC_NOTIFICATIONS') setNotifications(data);
      };
    } catch (err) {}

    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (e.key === 'siakad_school_settings') setSettings(parsed);
        else if (e.key === 'siakad_users') setUsers(parsed);
        else if (e.key === 'siakad_students') setStudents(parsed);
        else if (e.key === 'siakad_grades') setGrades(parsed);
        else if (e.key === 'siakad_attendance') setAttendance(parsed);
        else if (e.key === 'siakad_tuition') setTuition(parsed);
        else if (e.key === 'siakad_announcements') setAnnouncements(parsed);
        else if (e.key === 'siakad_ppdb') setPpdb(parsed);
        else if (e.key === 'siakad_events') setEvents(parsed);
        else if (e.key === 'siakad_notifications') setNotifications(parsed);
      } catch (err) {}
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handlers for state updates with automatic logging
  const handleAddGrade = async (gradeData: Partial<Grade>) => {
    const student = students.find(s => s.id === gradeData.studentId);
    const assignment = gradeData.assignmentScore || 0;
    const mid = gradeData.midExamScore || 0;
    const final = gradeData.finalExamScore || 0;
    const finalScore = parseFloat((assignment * 0.3 + mid * 0.3 + final * 0.4).toFixed(1));
    let letter: 'A' | 'B' | 'C' | 'D' | 'E' = 'C';
    if (finalScore >= 85) letter = 'A';
    else if (finalScore >= 75) letter = 'B';
    else if (finalScore >= 65) letter = 'C';
    else if (finalScore >= 50) letter = 'D';
    else letter = 'E';

    const level = student?.educationLevel || (activeLevel === 'Semua' ? 'SMA' : activeLevel);

    const newGrade: Grade = {
      id: `grd-${Date.now()}`,
      studentId: gradeData.studentId || '',
      studentName: student?.name || 'Siswa',
      className: student?.className || 'XII IPA 1',
      educationLevel: level,
      subject: gradeData.subject || 'Matematika Peminatan',
      assignmentScore: assignment,
      midExamScore: mid,
      finalExamScore: final,
      finalGrade: finalScore,
      letterGrade: letter,
      semester: settings.currentSemester,
      academicYear: settings.academicYear,
      notes: gradeData.notes
    };

    setGrades(prev => [newGrade, ...prev]);

    if (settings.autoEmailAlerts && student) {
      const newNotif: NotificationLog = {
        id: `notif-${Date.now()}`,
        type: 'Email',
        recipient: student.parentEmail,
        subject: `[${settings.foundationName}] Notifikasi Nilai Baru: ${newGrade.subject}`,
        body: `Pemberitahuan: Nilai mata pelajaran ${newGrade.subject} (${level}) untuk ${student.name} telah diunggah. Nilai Akhir: ${finalScore} (Predikat ${letter}).`,
        sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'Terkirim',
        triggeredBy: 'Sistem Nilai Akademik',
        category: 'Nilai'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const handleScanAttendance = async (qrCodeId: string, statusOverride?: string, notesOverride?: string) => {
    const student = students.find(s => `QR-STD-${s.id.split('-')[1]}` === qrCodeId) || students[0];
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    const status = (statusOverride as any) || (now.getHours() > 7 || (now.getHours() === 7 && now.getMinutes() > 15) ? 'Terlambat' : 'Hadir');

    const newAtt: AttendanceRecord = {
      id: `att-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      educationLevel: student.educationLevel || 'SMA',
      date: dateStr,
      time: timeStr,
      status: status as any,
      qrCodeId: qrCodeId,
      method: 'QR Code',
      notes: notesOverride || (status === 'Terlambat' ? 'Terlambat presensi QR' : 'Hadir tepat waktu')
    };

    setAttendance(prev => [newAtt, ...prev]);

    let alertTriggered = false;
    if (status === 'Terlambat' && settings.autoPushAlerts) {
      alertTriggered = true;
      const alertNotif: NotificationLog = {
        id: `notif-${Date.now()}`,
        type: 'Push Alert',
        recipient: student.parentEmail,
        subject: `⚠️ Peringatan Keterlambatan: ${student.name}`,
        body: `Peringatan Dini Real-time: Siswa ${student.name} (${student.className} - ${student.educationLevel}) tercatat TERLAMBAT hadir pada ${dateStr} jam ${timeStr} WIB.`,
        sentAt: `${dateStr} ${timeStr}`,
        status: 'Terkirim',
        triggeredBy: 'Early Warning QR Attendance',
        category: 'Absensi'
      };
      setNotifications(prev => [alertNotif, ...prev]);
    }

    return { record: newAtt, alertTriggered };
  };

  const handlePayTuition = async (id: string, method: string) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setTuition(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            status: 'Lunas',
            paidAt: timeStr,
            paymentMethod: method as any
          };
        }
        return t;
      })
    );

    const tRecord = tuition.find(t => t.id === id);
    if (tRecord && settings.autoEmailAlerts) {
      const student = students.find(s => s.id === tRecord.studentId);
      const payNotif: NotificationLog = {
        id: `notif-${Date.now()}`,
        type: 'Email',
        recipient: student?.parentEmail || 'orangtua@gmail.com',
        subject: `[${settings.foundationName}] Konfirmasi Pembayaran SPP Lunas - ${tRecord.invoiceNo}`,
        body: `Terima kasih! Pembayaran SPP bulan ${tRecord.month} sebesar Rp ${tRecord.amount.toLocaleString('id-ID')} atas nama ${tRecord.studentName} (${tRecord.educationLevel}) telah dibayar dan diverifikasi oleh pihak sekolah.`,
        sentAt: timeStr,
        status: 'Terkirim',
        triggeredBy: 'Payment Gateway Auto-Confirmation',
        category: 'Keuangan'
      };
      setNotifications(prev => [payNotif, ...prev]);
    }
  };

  const handleSubmitPaymentProof = (
    id: string,
    details: {
      method: string;
      selectedDetail: string;
      transactionRef: string;
      proofUrl?: string;
    }
  ) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setTuition(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            status: 'Menunggu Konfirmasi',
            paymentMethod: details.method as any,
            selectedPaymentDetail: details.selectedDetail,
            transactionRef: details.transactionRef,
            proofUrl: details.proofUrl,
            submittedAt: timeStr
          };
        }
        return t;
      })
    );

    const tRecord = tuition.find(t => t.id === id);
    if (tRecord) {
      const newNotif: NotificationLog = {
        id: `notif-${Date.now()}`,
        type: 'System',
        recipient: 'sekretariat@yayasan-nusantara.sch.id',
        subject: `[Pengajuan SPP] ${tRecord.studentName} (${tRecord.month})`,
        body: `Pembayaran SPP sebesar Rp ${tRecord.amount.toLocaleString('id-ID')} atas nama ${tRecord.studentName} (${tRecord.className}) telah diajukan via ${details.method} (${details.selectedDetail}) dengan Ref: ${details.transactionRef}. Menunggu verifikasi Admin/Superadmin.`,
        sentAt: timeStr,
        status: 'Terkirim',
        triggeredBy: 'Portal Pembayaran SPP Siswa',
        category: 'Keuangan'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const handleVerifyTuition = (
    id: string,
    status: 'Lunas' | 'Ditolak',
    verifierName: string,
    notes?: string
  ) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setTuition(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            status,
            paidAt: status === 'Lunas' ? timeStr : t.paidAt,
            verifiedBy: verifierName,
            verifiedAt: timeStr,
            rejectionReason: status === 'Ditolak' ? notes : undefined
          };
        }
        return t;
      })
    );

    const tRecord = tuition.find(t => t.id === id);
    if (tRecord) {
      const student = students.find(s => s.id === tRecord.studentId);
      const notifSubject = status === 'Lunas'
        ? `[VERIFIKASI SEKOLAH LUNAS] Pembayaran SPP ${tRecord.studentName} (${tRecord.month})`
        : `[DITOLAK SEKOLAH] Pembayaran SPP ${tRecord.studentName} (${tRecord.month})`;

      const notifBody = status === 'Lunas'
        ? `Notifikasi Resmi: Tagihan SPP atas nama ${tRecord.studentName} (${tRecord.month}) sebesar Rp ${tRecord.amount.toLocaleString('id-ID')} telah dibayar dan SUDAH DIVERIFIKASI oleh pihak sekolah (${verifierName}) pada ${timeStr}.`
        : `Pembayaran SPP ${tRecord.studentName} (${tRecord.month}) ditolak oleh ${verifierName}. Alasan: ${notes || '-'}. Silakan hubungi tata usaha atau ajukan ulang.`;

      const notif: NotificationLog = {
        id: `notif-${Date.now()}`,
        type: 'Email',
        recipient: student?.parentEmail || 'orangtua@gmail.com',
        subject: notifSubject,
        body: notifBody,
        sentAt: timeStr,
        status: 'Terkirim',
        triggeredBy: `Verifikasi Manual Admin (${verifierName})`,
        category: 'Keuangan'
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const handleSavePaymentSettings = (updatedPaymentSettings: PaymentMethodsSettings) => {
    setSettings(prev => ({
      ...prev,
      paymentSettings: updatedPaymentSettings
    }));
  };

  const handleAddPPDB = async (appData: Partial<PPDBApplication>) => {
    const level = appData.educationLevel || (activeLevel === 'Semua' ? 'SMA' : activeLevel);
    const newApp: PPDBApplication = {
      id: `ppdb-${Date.now()}`,
      registrationNo: `PPDB-${level}-2026-00${ppdb.length + 1}`,
      fullName: appData.fullName || 'Calon Siswa Baru',
      gender: appData.gender || 'L',
      birthPlaceDate: appData.birthPlaceDate || 'Jakarta, 01 Jan 2011',
      previousSchool: appData.previousSchool || 'Sekolah Asal',
      parentName: appData.parentName || 'Orang Tua',
      parentPhone: appData.parentPhone || '081234567890',
      parentEmail: appData.parentEmail || 'orangtua@gmail.com',
      status: 'Menunggu Verifikasi',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      chosenMajor: appData.chosenMajor || 'Reguler',
      educationLevel: level
    };
    setPpdb(prev => [newApp, ...prev]);
  };

  const handleUpdatePPDBStatus = async (id: string, status: string) => {
    setPpdb(prev =>
      prev.map(p => (p.id === id ? { ...p, status: status as any } : p))
    );
  };

  const handleAddAnnouncement = async (ancData: Partial<Announcement>) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newAnc: Announcement = {
      id: `anc-${Date.now()}`,
      title: ancData.title || 'Pengumuman Baru Yayasan',
      category: ancData.category || 'Akademik',
      content: ancData.content || '',
      targetAudience: ancData.targetAudience || 'Semua',
      educationLevel: ancData.educationLevel || (activeLevel === 'Semua' ? 'Semua' : activeLevel),
      date: new Date().toISOString().split('T')[0],
      author: currentUser.name,
      isPinned: ancData.isPinned || false,
      priority: ancData.priority || 'Normal'
    };
    setAnnouncements(prev => [newAnc, ...prev]);

    // Dispatch automatic system notification log
    const notifLog: NotificationLog = {
      id: `notif-${Date.now()}`,
      type: 'Push Alert',
      recipient: `Audience: ${newAnc.targetAudience} (${newAnc.educationLevel})`,
      subject: `[PENGUMUMAN] ${newAnc.title}`,
      body: `${newAnc.content} - Dipublikasikan oleh ${newAnc.author}`,
      sentAt: timeStr,
      status: 'Terkirim',
      triggeredBy: `Penyiaran Pengumuman oleh ${newAnc.author}`,
      category: 'Pengumuman'
    };
    setNotifications(prev => [notifLog, ...prev]);
  };

  const handleAddCalendarEvent = async (eventData: Partial<CalendarEvent>) => {
    const newEv: CalendarEvent = {
      id: `cal-${Date.now()}`,
      title: eventData.title || 'Agenda Baru Yayasan',
      startDate: eventData.startDate || new Date().toISOString().split('T')[0],
      endDate: eventData.endDate || new Date().toISOString().split('T')[0],
      category: eventData.category || 'Akademik',
      educationLevel: eventData.educationLevel || (activeLevel === 'Semua' ? 'Semua' : activeLevel),
      description: eventData.description || '',
      syncWithGoogle: true
    };
    setEvents(prev => [newEv, ...prev]);
  };

  const handleUpdateSettings = async (updated: Partial<SchoolSettings>) => {
    setSettings(prev => ({ ...prev, ...updated }));
  };

  const handleRequestUnblock = async (reqData: Omit<UnblockRequest, 'id' | 'requestedAt' | 'status'>) => {
    const newReq: UnblockRequest = {
      id: `req-${Date.now()}`,
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Pending',
      ...reqData
    };
    setSettings(prev => ({
      ...prev,
      unblockRequests: [newReq, ...(prev.unblockRequests || [])]
    }));
  };

  const handleToggleBlockUser = (userId: string, newStatus: 'Aktif' | 'Nonaktif' | 'Diblokir') => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleToggleBlockUnit = (target: EducationLevel | 'Yayasan', newStatus: 'Aktif' | 'Nonaktif' | 'Diblokir') => {
    if (target === 'Yayasan') {
      setSettings(prev => ({ ...prev, foundationStatus: newStatus }));
    } else {
      setSettings(prev => ({
        ...prev,
        unitStatus: {
          ...(prev.unitStatus || { 'KB-TK': 'Aktif', 'SD': 'Aktif', 'SMP': 'Aktif', 'SMA': 'Aktif' }),
          [target]: newStatus
        }
      }));
    }
  };

  // Render Login Page if user is not logged in
  if (!currentUser) {
    return (
      <LoginPage
        users={users}
        onLogin={u => setCurrentUser(u)}
        onRegister={nu => setUsers(prev => [nu, ...prev])}
      />
    );
  }

  // Status checks for blocked unit or foundation
  const isCurrentFoundationBlocked = settings.foundationStatus === 'Diblokir';
  const isCurrentUnitBlocked = activeLevel !== 'Semua' && settings.unitStatus?.[activeLevel] === 'Diblokir';
  const isUserBlocked = currentUser.status === 'Diblokir' || currentUser.status === 'Nonaktif';

  // Global App Freeze Screen for Non-Superadmin Users
  if (settings.isAppFrozen && currentUser.role !== 'superadmin') {
    return (
      <AppFreezeOverlay
        settings={settings}
        currentUser={currentUser}
        onSubmitUnblockRequest={handleRequestUnblock}
        onSwitchToSuperadmin={() => {
          const superadmin = users.find(u => u.role === 'superadmin');
          if (superadmin) setCurrentUser(superadmin);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col selection:bg-blue-600 selection:text-white pb-16 md:pb-0">
      
      {/* Top Navigation Bar */}
      <Navbar
        settings={settings}
        currentUser={currentUser}
        users={users}
        onLogout={() => setCurrentUser(null)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        activeLevel={activeLevel}
        onSelectLevel={lvl => setActiveLevel(lvl)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        language={language}
        onToggleLanguage={() => setLanguage(l => (l === 'id' ? 'en' : 'id'))}
        notifications={notifications}
        onOpenMobileSidebar={() => setMobileOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex w-full px-3 sm:px-5 lg:px-6 py-4 gap-4 sm:gap-5">
        
        {/* Left High-Density Compact Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={tab => setActiveTab(tab)}
          currentUser={currentUser}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Content Module View Area */}
        <main className="flex-1 min-w-0 space-y-4">

          {/* Blocked User Warning Alert */}
          {isUserBlocked && (
            <div className="p-4 bg-rose-500/20 border border-rose-500/40 rounded-2xl flex items-center justify-between text-xs text-rose-200 animate-fade-in">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <span className="font-bold">Akses Akun Dibatasi / Diblokir oleh Superadmin!</span>
                  <p className="text-[11px] text-rose-300">Akun ({currentUser.name}) saat ini berstatus {currentUser.status}. Sebagian fitur dibatasi.</p>
                </div>
              </div>
              {currentUser.role === 'superadmin' && (
                <button
                  onClick={() => handleToggleBlockUser(currentUser.id, 'Aktif')}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-[11px] shrink-0"
                >
                  Buka Blokir Diri
                </button>
              )}
            </div>
          )}

          {/* Blocked Foundation / Unit Alert Banner */}
          {(isCurrentFoundationBlocked || isCurrentUnitBlocked) && (
            <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-between text-xs text-amber-200 animate-fade-in">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold">
                    Peringatan Pembatasan Superadmin: {isCurrentFoundationBlocked ? 'Induk Yayasan Diblokir' : `Unit Sekolah ${activeLevel} Diblokir`}
                  </span>
                  <p className="text-[11px] text-amber-300">
                    Sistem dalam mode proteksi. Hanya Superadmin yang memiliki wewenang mengaktifkan kembali layanan ini.
                  </p>
                </div>
              </div>
              {currentUser.role === 'superadmin' && (
                <button
                  onClick={() => {
                    if (isCurrentFoundationBlocked) handleToggleBlockUnit('Yayasan', 'Aktif');
                    if (isCurrentUnitBlocked && activeLevel !== 'Semua') handleToggleBlockUnit(activeLevel, 'Aktif');
                  }}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-[11px] shrink-0"
                >
                  Buka Blokir Sekarang
                </button>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardOverview
              students={students}
              grades={grades}
              attendance={attendance}
              tuition={tuition}
              ppdb={ppdb}
              announcements={announcements}
              events={events}
              currentUser={currentUser}
              settings={settings}
              activeLevel={activeLevel}
              onNavigate={tab => setActiveTab(tab)}
              onUpdateSettings={handleUpdateSettings}
            />
          )}

          {activeTab === 'grades' && (
            <GradesManagement
              students={activeLevel === 'Semua' ? students : students.filter(s => s.educationLevel === activeLevel)}
              grades={activeLevel === 'Semua' ? grades : grades.filter(g => g.educationLevel === activeLevel)}
              dknRecords={dknGrades}
              characterAssessments={characterAssessments}
              spiritualJourney={spiritualJourney}
              currentUser={currentUser}
              settings={settings}
              onAddGrade={handleAddGrade}
              onUpdateDKN={dkn => setDknGrades(prev => [dkn, ...prev.filter(d => d.id !== dkn.id)])}
              onUpdateCharacter={(studentId, chars) => setCharacterAssessments(prev => ({ ...prev, [studentId]: chars }))}
              onUpdateSpiritual={(studentId, sp) => setSpiritualJourney(prev => ({ ...prev, [studentId]: sp }))}
            />
          )}

          {activeTab === 'attendance' && (
            <QRAttendance
              students={activeLevel === 'Semua' ? students : students.filter(s => s.educationLevel === activeLevel)}
              attendance={activeLevel === 'Semua' ? attendance : attendance.filter(a => a.educationLevel === activeLevel)}
              currentUser={currentUser}
              settings={settings}
              onScanAttendance={handleScanAttendance}
            />
          )}

          {activeTab === 'tuition' && (
            <TuitionManagement
              tuition={activeLevel === 'Semua' ? tuition : tuition.filter(t => t.educationLevel === activeLevel)}
              students={activeLevel === 'Semua' ? students : students.filter(s => s.educationLevel === activeLevel)}
              currentUser={currentUser}
              settings={settings}
              onPayTuition={handlePayTuition}
              onSubmitPaymentProof={handleSubmitPaymentProof}
              onVerifyTuition={handleVerifyTuition}
              onSavePaymentSettings={handleSavePaymentSettings}
            />
          )}

          {activeTab === 'chat' && (
            <ChatModule
              currentUser={currentUser}
              allUsers={users}
              conversations={conversations}
              onUpdateConversations={setConversations}
            />
          )}

          {activeTab === 'ppdb' && (
            <PPDBOnline
              ppdb={activeLevel === 'Semua' ? ppdb : ppdb.filter(p => p.educationLevel === activeLevel)}
              currentUser={currentUser}
              onAddApplication={handleAddPPDB}
              onUpdateStatus={handleUpdatePPDBStatus}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsBoard
              announcements={activeLevel === 'Semua' ? announcements : announcements.filter(a => a.educationLevel === 'Semua' || a.educationLevel === activeLevel)}
              currentUser={currentUser}
              onAddAnnouncement={handleAddAnnouncement}
            />
          )}

          {activeTab === 'calendar' && (
            <SchoolCalendar
              events={activeLevel === 'Semua' ? events : events.filter(e => e.educationLevel === 'Semua' || e.educationLevel === activeLevel)}
              currentUser={currentUser}
              onAddEvent={handleAddCalendarEvent}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              students={activeLevel === 'Semua' ? students : students.filter(s => s.educationLevel === activeLevel)}
              grades={activeLevel === 'Semua' ? grades : grades.filter(g => g.educationLevel === activeLevel)}
              attendance={activeLevel === 'Semua' ? attendance : attendance.filter(a => a.educationLevel === activeLevel)}
              tuition={activeLevel === 'Semua' ? tuition : tuition.filter(t => t.educationLevel === activeLevel)}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationCenter notifications={notifications} />
          )}

          {activeTab === 'roles' && (
            <UserRoleManagement
              users={users}
              currentUser={currentUser}
              settings={settings}
              onSelectUser={u => setCurrentUser(u)}
              onToggleBlockUser={handleToggleBlockUser}
              onToggleBlockUnit={handleToggleBlockUnit}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {activeTab === 'api-export' && (
            <ThirdPartyAPIExport
              settings={settings}
              students={students}
              grades={grades}
              attendance={attendance}
              tuition={tuition}
              onRegenerateKey={() => {
                const newKey = `sk_live_yayasan_${Math.random().toString(36).substring(2, 15)}`;
                setSettings(s => ({ ...s, apiKey: newKey }));
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SchoolSettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              currentUserRole={currentUser.role}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Floating Quick Navigation Bar */}
      <BottomNavigation
        activeTab={activeTab}
        onSelectTab={tab => {
          setActiveTab(tab);
          setMobileOpen(false);
        }}
        currentUser={currentUser}
        onOpenMobileMenu={() => setMobileOpen(true)}
      />

      {/* User Self-Service Profile Modal */}
      {currentUser && (
        <UserProfileModal
          currentUser={currentUser}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onSaveProfile={handleSaveProfile}
        />
      )}

    </div>
  );
}
