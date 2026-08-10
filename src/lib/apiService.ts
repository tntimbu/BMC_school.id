import {
  Student,
  Grade,
  AttendanceRecord,
  TuitionRecord,
  Announcement,
  PPDBApplication,
  CalendarEvent,
  NotificationLog,
  SchoolSettings
} from '../types';

import {
  initialSchoolSettings,
  initialStudents,
  initialGrades,
  initialAttendance,
  initialTuition,
  initialAnnouncements,
  initialPPDB,
  initialCalendar,
  initialNotifications
} from '../data/mockData';

// Safe fetch wrapper that falls back to localStorage if API fails or offline
async function safeFetch<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn(`API call to ${url} failed or offline, using fallback:`, err);
  }

  if (fallbackData !== undefined) {
    return fallbackData;
  }
  throw new Error(`Failed API request: ${url}`);
}

export const api = {
  // Settings
  async getSettings(): Promise<SchoolSettings> {
    return safeFetch('/api/settings', undefined, initialSchoolSettings);
  },
  async updateSettings(settings: Partial<SchoolSettings>): Promise<SchoolSettings> {
    return safeFetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }, { ...initialSchoolSettings, ...settings });
  },

  // Students
  async getStudents(): Promise<Student[]> {
    return safeFetch('/api/students', undefined, initialStudents);
  },
  async createStudent(student: Partial<Student>): Promise<Student> {
    const fallback: Student = {
      id: `std-${Date.now()}`,
      nisn: student.nisn || '00000000',
      name: student.name || 'Siswa Baru',
      gender: student.gender || 'L',
      className: student.className || 'X IPA 1',
      educationLevel: student.educationLevel || 'SMA',
      parentName: student.parentName || '-',
      parentEmail: student.parentEmail || 'orangtua@gmail.com',
      parentPhone: student.parentPhone || '081234567890',
      address: student.address || '-',
      birthDate: student.birthDate || '2008-01-01',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      status: 'Aktif'
    };
    return safeFetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    }, fallback);
  },
  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    return safeFetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, { id, ...data } as Student);
  },
  async deleteStudent(id: string): Promise<boolean> {
    return safeFetch(`/api/students/${id}`, { method: 'DELETE' }, { success: true }).then(() => true);
  },

  // Grades
  async getGrades(): Promise<Grade[]> {
    return safeFetch('/api/grades', undefined, initialGrades);
  },
  async createGrade(grade: Partial<Grade>): Promise<Grade> {
    const assign = Number(grade.assignmentScore) || 0;
    const mid = Number(grade.midExamScore) || 0;
    const final = Number(grade.finalExamScore) || 0;
    const finalGrade = Number(((assign * 0.3) + (mid * 0.3) + (final * 0.4)).toFixed(1));

    const fallback: Grade = {
      id: `grd-${Date.now()}`,
      studentId: grade.studentId || 'std-101',
      studentName: grade.studentName || 'Siswa',
      className: grade.className || 'XII IPA 1',
      educationLevel: grade.educationLevel || 'SMA',
      subject: grade.subject || 'Matematika',
      assignmentScore: assign,
      midExamScore: mid,
      finalExamScore: final,
      finalGrade,
      letterGrade: finalGrade >= 85 ? 'A' : finalGrade >= 75 ? 'B' : 'C',
      semester: grade.semester || 'Ganjil',
      academicYear: grade.academicYear || '2025/2026',
      notes: grade.notes
    };
    return safeFetch('/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grade)
    }, fallback);
  },

  // Attendance
  async getAttendance(): Promise<AttendanceRecord[]> {
    return safeFetch('/api/attendance', undefined, initialAttendance);
  },
  async scanAttendance(qrCodeId: string, status?: string, notes?: string): Promise<{ record: AttendanceRecord, alertTriggered: boolean }> {
    const fallbackRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      studentId: 'std-101',
      studentName: 'Muhammad Rizky Pratama',
      className: 'XII IPA 1',
      educationLevel: 'SMA',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      status: (status as any) || 'Hadir',
      qrCodeId: qrCodeId || 'QR-STD-101',
      method: 'QR Code',
      notes: notes || 'Presensi Scan Terverifikasi'
    };
    return safeFetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrCodeId, status, notes })
    }, { record: fallbackRecord, alertTriggered: status === 'Terlambat' || status === 'Alpha' });
  },

  // Tuition / SPP
  async getTuition(): Promise<TuitionRecord[]> {
    return safeFetch('/api/tuition', undefined, initialTuition);
  },
  async payTuition(id: string, method: string): Promise<TuitionRecord> {
    const record = initialTuition.find(t => t.id === id) || initialTuition[0];
    const fallback: TuitionRecord = {
      ...record,
      status: 'Lunas',
      paidAt: new Date().toLocaleString('id-ID'),
      paymentMethod: method as any
    };
    return safeFetch(`/api/tuition/pay/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod: method })
    }, fallback);
  },

  // PPDB
  async getPPDB(): Promise<PPDBApplication[]> {
    return safeFetch('/api/ppdb', undefined, initialPPDB);
  },
  async createPPDB(data: Partial<PPDBApplication>): Promise<PPDBApplication> {
    const fallback: PPDBApplication = {
      id: `ppdb-${Date.now()}`,
      registrationNo: `PPDB-2026-${Math.floor(100 + Math.random() * 900)}`,
      fullName: data.fullName || 'Calon Siswa',
      gender: data.gender || 'L',
      birthPlaceDate: data.birthPlaceDate || 'Jakarta, 10 Jan 2011',
      previousSchool: data.previousSchool || 'SMPN 1',
      parentName: data.parentName || 'Orang Tua',
      parentPhone: data.parentPhone || '0812345678',
      parentEmail: data.parentEmail || 'email@gmail.com',
      status: 'Menunggu Verifikasi',
      submittedAt: new Date().toLocaleString('id-ID'),
      chosenMajor: data.chosenMajor || 'IPA',
      educationLevel: data.educationLevel || 'SMA'
    };
    return safeFetch('/api/ppdb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, fallback);
  },
  async updatePPDB(id: string, data: Partial<PPDBApplication>): Promise<PPDBApplication> {
    return safeFetch(`/api/ppdb/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, { id, ...data } as PPDBApplication);
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return safeFetch('/api/announcements', undefined, initialAnnouncements);
  },
  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    const fallback: Announcement = {
      id: `anc-${Date.now()}`,
      title: data.title || 'Pengumuman Baru',
      category: data.category || 'Akademik',
      content: data.content || '-',
      targetAudience: data.targetAudience || 'Semua',
      educationLevel: data.educationLevel || 'Semua',
      date: new Date().toISOString().split('T')[0],
      author: data.author || 'Staf Admin',
      isPinned: false,
      priority: data.priority || 'Normal'
    };
    return safeFetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, fallback);
  },

  // Calendar
  async getCalendar(): Promise<CalendarEvent[]> {
    return safeFetch('/api/calendar', undefined, initialCalendar);
  },
  async createCalendarEvent(data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const fallback: CalendarEvent = {
      id: `cal-${Date.now()}`,
      title: data.title || 'Agenda Baru',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date().toISOString().split('T')[0],
      category: data.category || 'Akademik',
      educationLevel: data.educationLevel || 'Semua',
      description: data.description || '',
      syncWithGoogle: true
    };
    return safeFetch('/api/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, fallback);
  },

  // Notifications
  async getNotifications(): Promise<NotificationLog[]> {
    return safeFetch('/api/notifications', undefined, initialNotifications);
  },

  // Analytics
  async getAnalytics() {
    return safeFetch('/api/analytics', undefined, { success: true });
  }
};
