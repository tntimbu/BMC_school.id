import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  Paperclip,
  Image as ImageIcon,
  CheckCheck,
  User,
  Users,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  PhoneCall,
  Video,
  X,
  FileText,
  Clock,
  MessageCircle,
  Filter,
  CheckCircle2,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';
import { UserProfile, ChatConversation, ChatMessage } from '../types';

interface ChatModuleProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  conversations: ChatConversation[];
  onUpdateConversations: (newConversations: ChatConversation[]) => void;
}

export const ChatModule: React.FC<ChatModuleProps> = ({
  currentUser,
  allUsers,
  conversations,
  onUpdateConversations
}) => {
  const [activeChatId, setActiveChatId] = useState<string>(conversations[0]?.id || '');
  const [showMobileChatView, setShowMobileChatView] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('Semua');
  const [chatTypeFilter, setChatTypeFilter] = useState<'all' | 'direct' | 'group'>('all');
  const [messageText, setMessageText] = useState<string>('');
  const [attachment, setAttachment] = useState<{ name: string; url: string; type: 'image' | 'file' } | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const [newGroupTitle, setNewGroupTitle] = useState<string>('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);
  const [callModalInfo, setCallModalInfo] = useState<{ type: 'voice' | 'video'; name: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive or active chat changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChatId, conversations, showMobileChatView]);

  // Active conversation object
  const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];

  // Filter conversations
  const filteredConversations = conversations.filter(chat => {
    // Check if current user is participant
    const isParticipant = chat.participantIds.includes(currentUser.id) || currentUser.role === 'superadmin' || currentUser.role === 'admin';
    if (!isParticipant) return false;

    if (chatTypeFilter === 'direct' && chat.isGroup) return false;
    if (chatTypeFilter === 'group' && !chat.isGroup) return false;

    // Search query match
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      const titleMatch = chat.title?.toLowerCase().includes(query);
      const participantMatch = chat.participants.some(p => p.name.toLowerCase().includes(query) || p.role.toLowerCase().includes(query));
      const messageMatch = chat.messages.some(m => m.text.toLowerCase().includes(query));
      if (!titleMatch && !participantMatch && !messageMatch) return false;
    }

    // Role filter
    if (roleFilter !== 'Semua') {
      const hasRole = chat.participants.some(p => p.role === roleFilter);
      if (!hasRole && !chat.isGroup) return false;
    }

    return true;
  });

  // Get recipient display details for 1-on-1 or group chats
  const getRecipientInfo = (chat: ChatConversation) => {
    if (!chat) {
      return {
        name: 'Pesan Baru',
        role: 'system',
        roleBadge: 'System',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        subtext: 'Pilih percakapan',
        isOnline: false
      };
    }

    if (chat.isGroup) {
      return {
        name: chat.title || 'Grup Diskusi',
        role: 'Group',
        roleBadge: 'Grup Diskusi',
        avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200',
        subtext: `${chat.participants.length} Anggota Terhubung`,
        isOnline: true
      };
    }

    const recipient = chat.participants.find(p => p.id !== currentUser.id) || chat.participants[0];
    const fullProfile = allUsers.find(u => u.id === recipient.id);

    const roleLabels: Record<string, string> = {
      superadmin: 'Superadmin Yayasan',
      admin: 'Admin Operasional',
      teacher: 'Guru / Wali Kelas',
      parent: 'Orang Tua / Wali',
      student: 'Siswa / Murid'
    };

    return {
      name: recipient.name,
      role: recipient.role,
      roleBadge: roleLabels[recipient.role] || recipient.role,
      avatarUrl: recipient.avatarUrl || fullProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      subtext: recipient.studentName ? `Orang Tua dari ${recipient.studentName}` : recipient.className ? `Kelas ${recipient.className}` : fullProfile?.email || 'Akun Terhubung',
      isOnline: recipient.isOnline ?? true
    };
  };

  // Send message
  const handleSendMessage = (textToSend?: string) => {
    const finalContent = textToSend || messageText;
    if (!finalContent.trim() && !attachment) return;
    if (!activeChat) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatarUrl,
      text: finalContent,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      attachmentUrl: attachment?.url,
      attachmentName: attachment?.name,
      attachmentType: attachment?.type,
      isRead: true
    };

    const updatedChats = conversations.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastMessageAt: new Date().toISOString()
        };
      }
      return c;
    });

    onUpdateConversations(updatedChats);
    setMessageText('');
    setAttachment(null);

    // Simulate response from recipient after 1.2s if 1-on-1 chat
    if (!activeChat.isGroup) {
      const recipient = activeChat.participants.find(p => p.id !== currentUser.id);
      if (recipient) {
        setTimeout(() => {
          const autoReplies = [
            'Baik, terima kasih atas informasinya. Saya akan segera tindak lanjuti.',
            'Pesan telah diterima dengan baik. Salam sehat selalu!',
            'Terima kasih banyak atas update catatannya Pak/Bu.',
            'Siap, informasi ini sudah kami catat dalam SIAKAD.'
          ];
          const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

          const autoMsg: ChatMessage = {
            id: `msg-reply-${Date.now()}`,
            senderId: recipient.id,
            senderName: recipient.name,
            senderRole: recipient.role,
            senderAvatar: recipient.avatarUrl,
            text: randomReply,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            isRead: true
          };

          const refreshedChats = updatedChats.map(c => {
            if (c.id === activeChat.id) {
              return {
                ...c,
                messages: [...c.messages, autoMsg],
                lastMessageAt: new Date().toISOString()
              };
            }
            return c;
          });
          onUpdateConversations(refreshedChats);
        }, 1200);
      }
    }
  };

  // Start direct chat
  const handleStartDirectChat = (targetUser: UserProfile) => {
    const existing = conversations.find(c => !c.isGroup && c.participantIds.includes(currentUser.id) && c.participantIds.includes(targetUser.id));

    if (existing) {
      setActiveChatId(existing.id);
      setShowMobileChatView(true);
      setShowNewChatModal(false);
      return;
    }

    const newChat: ChatConversation = {
      id: `chat-${Date.now()}`,
      isGroup: false,
      participantIds: [currentUser.id, targetUser.id],
      participants: [
        {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role,
          avatarUrl: currentUser.avatarUrl,
          isOnline: true
        },
        {
          id: targetUser.id,
          name: targetUser.name,
          role: targetUser.role,
          avatarUrl: targetUser.avatarUrl,
          studentName: targetUser.studentId ? 'Siswa Terhubung' : undefined,
          className: targetUser.className,
          isOnline: true
        }
      ],
      lastMessageAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentUser.role,
          senderAvatar: currentUser.avatarUrl,
          text: `Percakapan dimulai dengan ${targetUser.name}`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          isRead: true
        }
      ]
    };

    onUpdateConversations([newChat, ...conversations]);
    setActiveChatId(newChat.id);
    setShowMobileChatView(true);
    setShowNewChatModal(false);
  };

  // Create Group Chat
  const handleCreateGroupChat = () => {
    if (!newGroupTitle.trim() || selectedGroupMembers.length === 0) return;

    const allMemberIds = [currentUser.id, ...selectedGroupMembers];
    const memberProfiles = allUsers.filter(u => allMemberIds.includes(u.id));

    const newGroup: ChatConversation = {
      id: `chat-group-${Date.now()}`,
      isGroup: true,
      title: newGroupTitle,
      groupCategory: 'Forum Orang Tua',
      participantIds: allMemberIds,
      participants: memberProfiles.map(u => ({
        id: u.id,
        name: u.name,
        role: u.role,
        avatarUrl: u.avatarUrl,
        isOnline: true
      })),
      lastMessageAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentUser.role,
          senderAvatar: currentUser.avatarUrl,
          text: `Grup "${newGroupTitle}" dibuat oleh ${currentUser.name}`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          isRead: true
        }
      ]
    };

    onUpdateConversations([newGroup, ...conversations]);
    setActiveChatId(newGroup.id);
    setShowMobileChatView(true);
    setShowNewChatModal(false);
    setNewGroupTitle('');
    setSelectedGroupMembers([]);
    setIsCreatingGroup(false);
  };

  // Quick preset messages
  const quickPresets = [
    'Selamat pagi Pak/Bu, mohon informasi seputar pembelajaran.',
    'Terima kasih atas bimbingannya untuk putra/putri kami.',
    'Konfirmasi pembayaran SPP dan biaya kegiatan sekolah.',
    'Mohon update Rapor Digital dan hasil Spiritual Journey.',
    'Mohon izin tidak dapat hadir dikarenakan sakit.'
  ];

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* HEADER BANNER */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-blue-400 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight truncate">Media Chat & Pesan SIAKAD</h2>
              <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 rounded-full text-[10px] font-bold border border-emerald-800/80 flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Realtime Terhubung
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-snug">
              Komunikasi langsung antar akun terhubung (Wali Kelas, Guru, Orang Tua/Wali, Siswa, dan Admin).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 justify-between sm:justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs max-w-[200px] min-w-0">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover border border-amber-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block leading-tight">Pengguna:</span>
              <strong className="text-white text-xs block leading-tight truncate">{currentUser.name}</strong>
            </div>
          </div>
          <button
            onClick={() => {
              setShowNewChatModal(true);
              setIsCreatingGroup(false);
            }}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Pesan Baru
          </button>
        </div>
      </div>

      {/* MAIN CHAT CONTAINER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[600px] md:h-[660px]">
        
        {/* LEFT SIDEBAR: CONVERSATIONS LIST */}
        <div className={`lg:col-span-4 border-r border-slate-800 flex flex-col bg-slate-900/90 h-full ${
          showMobileChatView ? 'hidden lg:flex' : 'flex'
        }`}>
          
          {/* SEARCH & FILTERS */}
          <div className="p-3 border-b border-slate-800 space-y-2 bg-slate-900 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Cari pesan atau kontak..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* TAB FILTER DIRECT VS GROUP */}
            <div className="flex items-center justify-between gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-800 text-[11px]">
              <button
                onClick={() => setChatTypeFilter('all')}
                className={`flex-1 py-1 rounded-lg font-semibold transition text-center truncate ${
                  chatTypeFilter === 'all' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua ({conversations.length})
              </button>
              <button
                onClick={() => setChatTypeFilter('direct')}
                className={`flex-1 py-1 rounded-lg font-semibold transition text-center truncate ${
                  chatTypeFilter === 'direct' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pribadi (DM)
              </button>
              <button
                onClick={() => setChatTypeFilter('group')}
                className={`flex-1 py-1 rounded-lg font-semibold transition text-center truncate ${
                  chatTypeFilter === 'group' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Grup Diskusi
              </button>
            </div>

            {/* ROLE FILTER */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] scrollbar-none">
              <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1 whitespace-nowrap">
                <Filter className="w-3 h-3" /> Peran:
              </span>
              {['Semua', 'teacher', 'parent', 'student', 'admin'].map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-2 py-0.5 rounded-md font-semibold shrink-0 transition whitespace-nowrap ${
                    roleFilter === r
                      ? 'bg-slate-700 text-amber-300 border border-amber-400/40'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r === 'Semua'
                    ? 'Semua'
                    : r === 'teacher'
                    ? 'Guru'
                    : r === 'parent'
                    ? 'Orang Tua'
                    : r === 'student'
                    ? 'Siswa'
                    : 'Admin'}
                </button>
              ))}
            </div>
          </div>

          {/* LIST ITEMS */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                <MessageCircle className="w-8 h-8 mx-auto text-slate-600" />
                <p>Tidak ada percakapan ditemukan.</p>
                <button
                  onClick={() => setShowNewChatModal(true)}
                  className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg font-semibold text-xs border border-blue-500/30"
                >
                  + Mulai Percakapan Baru
                </button>
              </div>
            ) : (
              filteredConversations.map(chat => {
                const info = getRecipientInfo(chat);
                const isActive = chat.id === activeChatId;
                const lastMsg = chat.messages[chat.messages.length - 1];

                return (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setShowMobileChatView(true);
                    }}
                    className={`w-full p-3 text-left transition flex items-start gap-3 hover:bg-slate-800/50 ${
                      isActive ? 'bg-blue-950/40 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={info.avatarUrl}
                        alt={info.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      {info.isOnline && (
                        <span className="w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full absolute bottom-0 right-0" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="font-bold text-slate-100 text-xs truncate">{info.name}</h4>
                        <span className="text-[10px] text-slate-500 shrink-0">{lastMsg?.timestamp || ''}</span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                            info.role === 'teacher'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : info.role === 'parent'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : info.role === 'student'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {info.roleBadge}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">{info.subtext}</span>
                      </div>

                      <p className="text-[11px] text-slate-400 truncate">
                        {lastMsg ? (
                          <>
                            {lastMsg.senderId === currentUser.id && <span className="text-blue-400 font-semibold">Anda: </span>}
                            {lastMsg.text}
                          </>
                        ) : (
                          'Belum ada pesan.'
                        )}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT CHAT WINDOW */}
        <div className={`lg:col-span-8 flex flex-col bg-slate-950 h-full ${
          !showMobileChatView ? 'hidden lg:flex' : 'flex'
        }`}>
          {activeChat ? (
            <>
              {/* CHAT WINDOW HEADER */}
              {(() => {
                const info = getRecipientInfo(activeChat);
                return (
                  <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* MOBILE BACK BUTTON */}
                      <button
                        onClick={() => setShowMobileChatView(false)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg lg:hidden shrink-0 flex items-center gap-1 text-xs font-semibold"
                        title="Kembali ke daftar percakapan"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <div className="relative shrink-0">
                        <img
                          src={info.avatarUrl}
                          alt={info.name}
                          className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border border-slate-700"
                        />
                        {info.isOnline && (
                          <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-500 border-2 border-slate-900 rounded-full absolute bottom-0 right-0" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-white text-xs md:text-sm truncate">{info.name}</h3>
                          <span className="px-1.5 py-0.5 bg-blue-950 text-blue-300 rounded text-[9px] md:text-[10px] font-semibold border border-blue-800 shrink-0">
                            {info.roleBadge}
                          </span>
                        </div>
                        <p className="text-[10px] md:text-[11px] text-slate-400 flex items-center gap-1 truncate mt-0.5">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                          <span className="truncate">{info.subtext}</span>
                        </p>
                      </div>
                    </div>

                    {/* CALL SIMULATION BUTTONS */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setCallModalInfo({ type: 'voice', name: info.name })}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                        title="Panggilan Suara SIAKAD"
                      >
                        <PhoneCall className="w-4 h-4 text-emerald-400" />
                      </button>
                      <button
                        onClick={() => setCallModalInfo({ type: 'video', name: info.name })}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                        title="Panggilan Video SIAKAD"
                      >
                        <Video className="w-4 h-4 text-blue-400" />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* MESSAGES BODY */}
              <div className="flex-1 p-3 md:p-4 overflow-y-auto space-y-3 custom-scrollbar bg-slate-950/60 min-h-0">
                <div className="text-center my-1">
                  <span className="px-3 py-1 bg-slate-800/80 text-slate-400 text-[10px] rounded-full border border-slate-700/60 inline-block">
                    🔒 Percakapan ini terenkripsi & tersinkronisasi real-time
                  </span>
                </div>

                {activeChat.messages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {!isMe && (
                        <img
                          src={msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                          alt={msg.senderName}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover border border-slate-800 shrink-0"
                        />
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] p-3 rounded-2xl shadow-md text-xs space-y-1 min-w-0 break-words ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-none'
                        }`}
                      >
                        {!isMe && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 border-b border-slate-700/60 pb-1 mb-1">
                            <span className="truncate">{msg.senderName}</span>
                            <span className="px-1.5 py-0.2 bg-slate-900/80 rounded text-[9px] text-slate-300 shrink-0">
                              {msg.senderRole}
                            </span>
                          </div>
                        )}

                        <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>

                        {/* ATTACHMENT DISPLAY */}
                        {msg.attachmentUrl && (
                          <div className="mt-2 pt-2 border-t border-white/20">
                            {msg.attachmentType === 'image' ? (
                              <img
                                src={msg.attachmentUrl}
                                alt="Attachment"
                                className="max-h-40 rounded-lg object-cover border border-slate-700"
                              />
                            ) : (
                              <a
                                href={msg.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 p-2 bg-slate-900/60 rounded-lg text-blue-200 hover:text-white border border-slate-700 text-[11px] max-w-full min-w-0"
                              >
                                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                                <span className="truncate">{msg.attachmentName || 'Lampiran Berkas'}</span>
                              </a>
                            )}
                          </div>
                        )}

                        <div
                          className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                            isMe ? 'text-blue-200' : 'text-slate-400'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-200 shrink-0" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* QUICK PRESET BUTTONS */}
              <div className="px-3 py-1.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px] shrink-0">
                <span className="text-slate-500 font-bold shrink-0 flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Template:
                </span>
                {quickPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(preset)}
                    className="px-2 py-1 bg-slate-800 hover:bg-blue-900/40 text-slate-300 hover:text-blue-300 border border-slate-700/80 rounded-full shrink-0 transition whitespace-nowrap max-w-[200px] truncate"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>

              {/* ATTACHMENT PREVIEW IF ANY */}
              {attachment && (
                <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-blue-300 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate">Lampiran: <strong>{attachment.name}</strong></span>
                  </div>
                  <button onClick={() => setAttachment(null)} className="text-slate-400 hover:text-white shrink-0 ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* INPUT AREA */}
              <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
                <label
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer transition shrink-0"
                  title="Lampirkan Gambar atau Berkas"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAttachment({
                          name: file.name,
                          url: URL.createObjectURL(file),
                          type: file.type.startsWith('image/') ? 'image' : 'file'
                        });
                      }
                    }}
                  />
                </label>

                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 min-w-0 p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!messageText.trim() && !attachment}
                  className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition shrink-0 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-600" />
              <h3 className="text-white font-bold text-sm">Pilih Percakapan untuk Memulai</h3>
              <p className="text-xs max-w-sm">
                Pilih salah satu kontak terhubung di sebelah kiri atau klik tombol "+ Pesan Baru" untuk memulai obrolan.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* NEW CHAT MODAL */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 md:p-6 text-slate-100 shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowNewChatModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <MessageSquare className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <h3 className="font-bold text-base text-white">Mulai Pesan Baru / Obrolan</h3>
                <p className="text-xs text-slate-400">Pilih akun terhubung dalam SIAKAD Yayasan</p>
              </div>
            </div>

            {/* TAB SELECTOR DIRECT VS GROUP CREATION */}
            <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setIsCreatingGroup(false)}
                className={`flex-1 py-1.5 rounded-lg transition text-center truncate ${
                  !isCreatingGroup ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                1-on-1 (Pesan Langsung)
              </button>
              <button
                onClick={() => setIsCreatingGroup(true)}
                className={`flex-1 py-1.5 rounded-lg transition text-center truncate ${
                  isCreatingGroup ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                + Buat Grup Diskusi Baru
              </button>
            </div>

            {!isCreatingGroup ? (
              /* DIRECT CHAT SELECTION */
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300">Pilih Kontak Akun Terhubung:</label>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950/60 p-1">
                  {allUsers
                    .filter(u => u.id !== currentUser.id)
                    .map(u => (
                      <div
                        key={u.id}
                        onClick={() => handleStartDirectChat(u)}
                        className="p-2.5 flex items-center justify-between hover:bg-slate-800/80 rounded-lg cursor-pointer transition gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0" />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-slate-100 truncate">{u.name}</h5>
                            <span className="text-[10px] text-slate-400 truncate block">{u.email}</span>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            u.role === 'teacher'
                              ? 'bg-amber-950 text-amber-300'
                              : u.role === 'parent'
                              ? 'bg-purple-950 text-purple-300'
                              : u.role === 'student'
                              ? 'bg-blue-950 text-blue-300'
                              : 'bg-emerald-950 text-emerald-300'
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              /* GROUP CHAT CREATION */
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nama Grup / Forum Diskusi:</label>
                  <input
                    type="text"
                    value={newGroupTitle}
                    onChange={e => setNewGroupTitle(e.target.value)}
                    placeholder="Contoh: Forum Wali Murid Kelas XII / Koordinasi Guru"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Pilih Anggota Grup:</label>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-800 rounded-xl bg-slate-950/60 p-2">
                    {allUsers
                      .filter(u => u.id !== currentUser.id)
                      .map(u => {
                        const isSelected = selectedGroupMembers.includes(u.id);
                        return (
                          <div
                            key={u.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedGroupMembers(selectedGroupMembers.filter(id => id !== u.id));
                              } else {
                                setSelectedGroupMembers([...selectedGroupMembers, u.id]);
                              }
                            }}
                            className={`p-2 rounded-lg flex items-center justify-between cursor-pointer border transition gap-2 ${
                              isSelected ? 'bg-blue-950/80 border-blue-500' : 'bg-slate-900 border-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                              <span className="font-semibold text-slate-200 truncate">{u.name} ({u.role})</span>
                            </div>
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-600'}`} />
                          </div>
                        );
                      })}
                  </div>
                </div>

                <button
                  onClick={handleCreateGroupChat}
                  disabled={!newGroupTitle.trim() || selectedGroupMembers.length === 0}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition"
                >
                  Buat Grup Diskusi Baru ({selectedGroupMembers.length} Anggota)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CALL SIMULATION MODAL */}
      {callModalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/40 rounded-full flex items-center justify-center mx-auto animate-pulse">
              {callModalInfo.type === 'voice' ? (
                <PhoneCall className="w-8 h-8 text-emerald-400" />
              ) : (
                <Video className="w-8 h-8 text-blue-400" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {callModalInfo.type === 'voice' ? 'Panggilan Suara SIAKAD' : 'Panggilan Video SIAKAD'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Menghubungkan ke {callModalInfo.name}...</p>
              <span className="inline-block mt-2 px-2.5 py-1 bg-emerald-950 text-emerald-300 rounded text-[10px] font-mono border border-emerald-800">
                Encrypted Peer-to-Peer Signal
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCallModalInfo(null)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition"
              >
                Tutup Panggilan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
