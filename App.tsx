
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal } from './components/Modal';
import { ContactForm } from './components/ContactForm';
import { SupabaseDebugPanel } from './components/SupabaseDebugPanel';
import { LoginPage } from './components/LoginPage';
import { RatingReview } from './components/RatingReview';
import { ChatBox } from './components/ChatBox';
import { CalendarScheduler } from './components/CalendarScheduler';
import { StripePaymentForm, StripeInfo } from './components/StripePaymentForm';
import { EditProfileModal } from './components/EditProfileModal';
import { CreateCourseModal } from './components/CreateCourseModal';
import { AddLessonModal } from './components/AddLessonModal';
import { AddAchievementModal } from './components/AddAchievementModal';
import { AdvancedSearchModal } from './components/AdvancedSearchModal';
import { getTeachers, getStudents, getCourses } from './services/supabaseClient';
import { 
  Menu, X, Search, Bell, Star, BookOpen, Calendar, 
  Award, Play, MessageSquare, Send, Sparkles, User, 
  Settings, LogOut, ChevronRight, Mic, Video, Share2, 
  MoreVertical, Clock, CheckCircle, GraduationCap,
  TrendingUp, Trophy, Zap, Heart, MicOff, Volume2, 
  BarChart3, Users, Wallet, Plus, Edit, Trash2, 
  Check, AlertTriangle, ShieldCheck, Globe, Filter,
  ArrowUpRight, ArrowDownLeft, Layout, Layers, 
  Lock, Monitor, Presentation, CreditCard, Activity, 
  ShieldAlert, Eye, Medal, Target, Flame
} from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { NAV_ITEMS, INITIAL_CONFIG } from './constants';
import { StatCard } from './components/StatCard';
import { askQuranifyAI } from './services/geminiService';
import { UserRole, TeacherProfile, StudentProfile, Course, Achievement, ScheduleItem, PlatformConfig } from './types';

// --- Global Utilities for Gemini Live API ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const App: React.FC = () => {
  // --- Authentication State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- Core Application State ---
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [config, setConfig] = useState<PlatformConfig>({
    ...INITIAL_CONFIG,
    secondaryColor: '#f1f5f9',
    allowGuestBrowsing: true
  });

  // --- Database State (fetched from Supabase) ---
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch data from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, studentsRes, coursesRes] = await Promise.all([
          getTeachers(),
          getStudents(),
          getCourses(),
        ]);

        if (teachersRes.data) {
          setTeachers(teachersRes.data.map(t => ({
            id: t.id,
            name: t.name,
            rating: t.rating,
            sessionsCount: t.sessions_count,
            hourlyRate: t.hourly_rate,
            specialization: t.specialization,
            avatar: 'https://picsum.photos/seed/' + t.name.replace(/\s+/g, '') + '/200',
            bio: t.bio,
            status: t.status,
            earnings: t.earnings,
            joinedDate: t.joined_date,
          })));
        }

        if (studentsRes.data) {
          setStudents(studentsRes.data.map(s => ({
            id: s.id,
            name: s.name,
            avatar: 'https://picsum.photos/seed/' + s.name.replace(/\s+/g, '') + '/100',
            joinedDate: s.joined_date,
            progress: s.progress,
            status: s.status,
            points: s.points,
            level: s.level,
            streak: s.streak,
            rank: s.rank,
          })));
        }

        if (coursesRes.data) {
          setCourses(coursesRes.data.map(c => ({
            id: c.id,
            title: c.title,
            progress: c.progress,
            nextLesson: c.next_lesson,
            icon: <BookOpen />,
            category: c.category,
            lessonsCount: c.lessons_count,
            description: c.description,
          })));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setDataLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { id: 'sch1', time: '04:00 م', title: 'حصة تجويد مباشرة', instructor: 'د. أحمد السقا', type: 'live', day: 15 },
    { id: 'sch2', time: '08:30 م', title: 'مراجعة الجزء الثلاثون', instructor: 'دراسة ذاتية', type: 'review', day: 18 },
  ]);

  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(50);

  // --- Advanced Features State ---
  const [selectedTeacherForChat, setSelectedTeacherForChat] = useState<string>('');
  const [selectedTeacherForReview, setSelectedTeacherForReview] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLessonForPayment, setSelectedLessonForPayment] = useState<{ amount: number; teacherId: string }>({ amount: 100, teacherId: '' });
  
  // --- Modals State ---
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showAddAchievementModal, setShowAddAchievementModal] = useState(false);
  const [showAdvancedSearchModal, setShowAdvancedSearchModal] = useState(false);
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState<string>('');

  // --- Voice AI (Gemini Live) State ---
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // --- Classroom State ---
  const [isClassActive, setIsClassActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Sidebar Logic ---
  const filteredNavItems = useMemo(() => {
    return NAV_ITEMS.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  // Role Switching Logic
  useEffect(() => {
    const defaultTabs: Record<UserRole, string> = {
      student: 'dashboard',
      instructor: 'instructor-dashboard',
      admin: 'admin-dashboard'
    };
    setActiveTab(defaultTabs[userRole]);
  }, [userRole]);

  // --- Gemini Voice Interface Implementation ---
  const startVoiceChat = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: "أنت 'نور'، مساعد إسلامي حكيم. تحدث العربية بلباقة وهدوء وساعد الطالب في الحفظ والتجويد.",
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsLiveActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const src = ctx.createBufferSource();
              src.buffer = buffer;
              src.connect(ctx.destination);
              src.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(src);
            }
            if (message.serverContent?.inputTranscription) {
              setTranscription(message.serverContent.inputTranscription.text);
            }
          },
          onclose: () => setIsLiveActive(false),
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { console.error("Voice Chat Init Error:", err); }
  };

  const stopVoiceChat = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsLiveActive(false);
  };

  // --- Modal Handlers ---
  const handleEditProfile = async (data: any) => {
    console.log('Profile updated:', data);
    alert('تم تحديث الملف الشخصي بنجاح!');
  };

  const handleCreateCourse = async (data: any) => {
    console.log('Course created:', data);
    alert('تم إنشاء الكورس بنجاح!');
  };

  const handleAddLesson = async (data: any) => {
    console.log('Lesson added:', data);
    alert('تم إضافة الدرس بنجاح!');
  };

  const handleAddAchievement = async (data: any) => {
    console.log('Achievement added:', data);
    alert('تم إضافة الإنجاز بنجاح!');
  };

  const handleAdvancedSearch = (filters: any) => {
    console.log('Search filters:', filters);
    alert(`جاري البحث عن ${filters.keyword}...`);
  };

  // --- Rendering Engines ---

  // 1. Student Views
  const renderStudentDashboard = () => (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="bg-emerald-900 rounded-xl p-4 text-white relative overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-3">
          <div>
            <h2 className="text-lg font-bold mb-2 quran-font">مرحباً، {students[0].name}</h2>
            <p className="text-emerald-100 opacity-80 max-w-lg mb-3 leading-relaxed text-xs">أنت تحرز تقدماً رائعاً في حفظ سورة البقرة. لقد حافظت على نشاطك لمدة 7 أيام متتالية!</p>
            <div className="flex gap-2">
              <button onClick={() => setActiveTab('classroom')} className="bg-white text-emerald-900 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-transform shadow-lg">
                <Play size={20} fill="currentColor" /> ابدأ الدرس الآن
              </button>
              <button className="bg-emerald-800/50 backdrop-blur text-white px-8 py-4 rounded-2xl font-black border border-emerald-700 flex items-center gap-2">
                <Target size={20} /> التحدي اليومي
              </button>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 min-w-[240px] shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-emerald-900 shadow-xl"><Medal size={24} /></div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-300">المستوى الحالي</div>
                <div className="text-2xl font-black">المستوى {students[0].level}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                <span>التقدم للمستوى 13</span>
                <span>{students[0].points % 500} / 500 XP</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ width: `${(students[0].points % 500) / 5}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <StatCard label="رصيد النقاط" value={`${students[0].points} XP`} color="emerald" icon={<Zap className="fill-current" />} />
        <StatCard label="سلسلة النشاط" value={`${students[0].streak} أيام`} color="amber" icon={<Flame className="fill-current" />} />
        <StatCard label="الترتيب العالمي" value={`#${students[0].rank}`} color="blue" icon={<Trophy />} />
        <StatCard label="الأوسمة" value="12" color="rose" icon={<Award />} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button onClick={() => setShowEditProfileModal(true)} className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center group">
          <User className="w-6 h-6 mx-auto mb-2 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold">تعديل الملف</span>
        </button>
        <button onClick={() => setShowAdvancedSearchModal(true)} className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center group">
          <Search className="w-6 h-6 mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold">بحث متقدم</span>
        </button>
        <button onClick={() => setActiveTab('lesson-booking')} className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center group">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-600 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold">حجز درس</span>
        </button>
        <button onClick={() => setActiveTab('chat')} className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center group">
          <MessageSquare className="w-6 h-6 mx-auto mb-2 text-rose-600 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold">محادثات</span>
        </button>
        <button onClick={() => setActiveTab('payments')} className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center group">
          <CreditCard className="w-6 h-6 mx-auto mb-2 text-amber-600 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold">الدفع</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-black">دوراتك الحالية</h3>
              <button onClick={() => setActiveTab('curriculum')} className="text-emerald-600 font-bold text-sm hover:underline">عرض الكل</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courses.slice(0, 2).map(c => (
                <div key={c.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 group hover:border-emerald-500 transition-all shadow-sm hover:bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform text-xs">{c.icon}</div>
                    <div className="text-right">
                      <span className="block text-base font-black text-emerald-600">{c.progress}%</span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">الإكمال</span>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold mb-1">{c.title}</h4>
                  <p className="text-[10px] text-slate-500 mb-3">التالي: {c.nextLesson}</p>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col">
          <h3 className="text-sm font-black mb-3 flex items-center gap-1"><Trophy className="text-amber-500 w-4 h-4" /> الصدارة</h3>
          <div className="space-y-2 flex-1">
            {students.slice().sort((a, b) => b.points - a.points).slice(0, 4).map((s, i) => (
              <div key={s.id} className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-xs ${s.id === 's1' ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'text-slate-400'}`}>
                  {i + 1}
                </div>
                <img src={s.avatar} className="w-8 h-8 rounded-lg object-cover border border-white shadow-sm" />
                <div className="flex-1">
                  <div className="font-bold text-[11px] text-slate-800">{s.name} {s.id === 's1' && <span className="text-[8px] bg-emerald-600 text-white px-1 py-0.5 rounded ml-1 font-black">أنت</span>}</div>
                  <div className="text-[8px] text-slate-400 font-bold">{s.points} XP</div>
                </div>
                {i === 0 && <Medal className="text-amber-400" size={20} />}
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('leaderboard')} className="w-full py-2 mt-3 bg-slate-50 text-slate-600 rounded-lg font-black text-xs hover:bg-slate-100 transition-all border border-slate-100">عرض الترتيب</button>
        </div>
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="text-center">
        <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-500 mx-auto mb-6 shadow-xl shadow-amber-500/10">
          <Trophy size={40} />
        </div>
        <h2 className="text-4xl font-black mb-4">أبطال القرآن</h2>
        <p className="text-slate-500 font-bold">المنافسة الشريفة في سبيل الإتقان والحفظ.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-16">
        {/* Silver - 2nd Place */}
        <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 text-center relative shadow-sm h-fit">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center font-black text-white shadow-lg border-4 border-white">2</div>
          <img src={students[1].avatar} className="w-24 h-24 rounded-[2rem] mx-auto mb-6 border-4 border-slate-100 shadow-xl" />
          <h4 className="text-xl font-black mb-2">{students[1].name}</h4>
          <div className="text-indigo-600 font-black mb-4">{students[1].points} XP</div>
          <div className="text-[10px] font-black uppercase text-slate-400">المستوى {students[1].level}</div>
        </div>

        {/* Gold - 1st Place */}
        <div className="bg-white p-12 rounded-[3.5rem] border-4 border-amber-100 text-center relative shadow-2xl scale-110 z-10">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center font-black text-white shadow-2xl border-4 border-white animate-bounce">1</div>
          <img src={students[3].avatar} className="w-32 h-32 rounded-[2.5rem] mx-auto mb-6 border-4 border-amber-50 shadow-2xl" />
          <h4 className="text-2xl font-black mb-2">{students[3].name}</h4>
          <div className="text-emerald-600 font-black text-xl mb-4">{students[3].points} XP</div>
          <div className="px-6 py-2 bg-amber-400 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-400/30">ملك القراءة</div>
        </div>

        {/* Bronze - 3rd Place */}
        <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 text-center relative shadow-sm h-fit">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center font-black text-white shadow-lg border-4 border-white">3</div>
          <img src="https://picsum.photos/seed/user5/100" className="w-24 h-24 rounded-[2rem] mx-auto mb-6 border-4 border-orange-50 shadow-xl" />
          <h4 className="text-xl font-black mb-2">زياد عادل</h4>
          <div className="text-indigo-600 font-black mb-4">5,200 XP</div>
          <div className="text-[10px] font-black uppercase text-slate-400">المستوى 14</div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b">
            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <th className="p-8">الترتيب</th>
              <th className="p-8">الطالب</th>
              <th className="p-8">المستوى</th>
              <th className="p-8">النقاط الإجمالية</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.slice().sort((a, b) => b.points - a.points).map((s, idx) => (
              <tr key={s.id} className={`hover:bg-slate-50 transition-colors ${s.id === 's1' ? 'bg-emerald-50/50' : ''}`}>
                <td className="p-8 font-black text-slate-400">#{idx + 1}</td>
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <img src={s.avatar} className="w-12 h-12 rounded-xl shadow-md border-2 border-white" />
                    <div>
                      <div className="font-black text-slate-800">{s.name} {s.id === 's1' && <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full ml-1">أنت</span>}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">منذ {s.joinedDate}</div>
                    </div>
                  </div>
                </td>
                <td className="p-8 font-black text-slate-600">{s.level}</td>
                <td className="p-8 font-black text-emerald-600">{s.points} XP</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-black mb-4">خزانة الأوسمة</h2>
        <p className="text-slate-500 font-bold">كل آية تحفظها، وكل دقيقة تلتزم بها، تقربك من وسام جديد.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {[
          { id: 'a1', title: 'قارئ مجتهد', desc: 'أتممت 10 ساعات من الحفظ المتواصل', icon: <Flame className="text-orange-500" />, unlocked: true, date: '12 مايو 2024', progress: 10, total: 10 },
          { id: 'a2', title: 'مرتل متقن', desc: 'حصلت على تقييم 5 نجوم في 5 حصص تجويد', icon: <Star className="text-yellow-500" />, unlocked: true, date: '15 مايو 2024', progress: 5, total: 5 },
          { id: 'a3', title: 'حارس الكتاب', desc: 'حفظت أول جزئين من القرآن الكريم', icon: <ShieldCheck className="text-emerald-500" />, unlocked: false, progress: 1.2, total: 2 },
          { id: 'a4', title: 'طالب عالمي', desc: 'تفاعلت مع معلمين من 3 دول مختلفة', icon: <Globe className="text-blue-500" />, unlocked: true, date: '18 مايو 2024', progress: 3, total: 3 },
          { id: 'a5', title: 'السلسلة الذهبية', desc: 'حافظ على سلسلة نشاط لمدة 30 يوماً', icon: <Zap className="text-amber-500" />, unlocked: false, progress: 7, total: 30 },
          { id: 'a6', title: 'صوت الملائكة', desc: 'سجل 10 مقاطع صوتية صحيحة للتسميع', icon: <Mic className="text-rose-500" />, unlocked: false, progress: 4, total: 10 },
        ].map((a, i) => (
          <div key={i} className={`p-10 rounded-[3.5rem] border-2 transition-all flex flex-col items-center text-center group hover:-translate-y-2 ${a.unlocked ? 'bg-white border-emerald-50 shadow-xl' : 'bg-slate-50 border-slate-100 grayscale opacity-70'}`}>
            <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-8 transition-all ${a.unlocked ? 'bg-emerald-50 shadow-xl shadow-emerald-100 group-hover:scale-110' : 'bg-slate-200'}`}>
              {React.cloneElement(a.icon as any, { size: 40, fill: a.unlocked ? 'currentColor' : 'none' })}
            </div>
            <h4 className="text-2xl font-black mb-3">{a.title}</h4>
            <p className="text-xs text-slate-500 font-bold mb-8 leading-relaxed px-4">{a.desc}</p>
            
            {!a.unlocked && (
              <div className="w-full px-6 mb-8">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                  <span>التقدم</span>
                  <span>{Math.round((a.progress / a.total) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: `${(a.progress / a.total) * 100}%` }} />
                </div>
              </div>
            )}

            <div className="mt-auto w-full">
              {a.unlocked ? (
                <div className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20">مكتمل - {a.date}</div>
              ) : (
                <div className="px-6 py-3 bg-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest">قيد التنفيذ</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- Other View Functions (Discover, Classroom, Instructor, Admin) ---
  const renderDiscover = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 space-y-8 h-fit bg-white p-8 rounded-[2rem] border">
          <div className="flex items-center gap-2 font-black text-slate-800"><Filter size={20} /> تصفية النتائج</div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">السعر (أقصى)</label>
            <input type="range" min="10" max="100" value={priceRange} onChange={e => setPriceRange(Number(e.target.value))} className="w-full accent-emerald-600" />
            <div className="flex justify-between mt-2 font-bold text-xs text-slate-500"><span>$10</span><span>${priceRange}</span></div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">التخصص</label>
            {['تجويد', 'حفظ', 'تفسير', 'قراءات'].map(spec => (
              <label key={spec} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 checked:bg-emerald-600 transition-all" />
                <span className="text-sm font-bold text-slate-600 group-hover:text-emerald-600">{spec}</span>
              </label>
            ))}
          </div>
        </aside>
        <div className="flex-1 space-y-6">
          <div className="bg-white p-4 rounded-2xl border flex items-center gap-4"><Search className="text-slate-400" /><input placeholder="ابحث عن معلم..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none w-full font-bold" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teachers.filter(t => t.name.includes(searchQuery) && t.hourlyRate <= priceRange).map(t => (
              <div key={t.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex flex-col sm:flex-row gap-8 hover:shadow-2xl transition-all group">
                <img src={t.avatar} className="w-24 h-24 rounded-3xl object-cover shadow-xl border-4 border-white" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-amber-500 mb-1"><Star size={14} fill="currentColor" /><span className="font-bold text-sm">{t.rating}</span></div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors cursor-pointer" onClick={() => setSelectedTeacherForReview(t.id)}>{t.name}</h3>
                  <p className="text-emerald-600 text-xs font-bold mb-4">{t.specialization}</p>
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-2xl font-black text-slate-800">${t.hourlyRate}<span className="text-[10px] text-slate-400">/ساعة</span></span>
                    <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-700 transition-colors">احجز الآن</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedTeacherForReview && (
            <Modal 
              isOpen={!!selectedTeacherForReview} 
              onClose={() => setSelectedTeacherForReview('')}
              title={`تقييمات ${teachers.find(t => t.id === selectedTeacherForReview)?.name || ''}`}
            >
              <div className="max-h-96 overflow-y-auto">
                <RatingReview 
                  teacherId={selectedTeacherForReview}
                  studentId="current-student"
                  canReview={true}
                />
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );

  const renderInstructorDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <h2 className="text-4xl font-bold mb-4">أهلاً، د. أحمد</h2>
        <p className="text-indigo-100 opacity-80 max-w-lg mb-8 leading-relaxed">لديك 4 حصص قادمة اليوم. إجمالي أرباحك هذا الشهر: $1,240</p>
        <button onClick={() => setActiveTab('schedule')} className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
          <Calendar size={20} /> عرض الجدول اليومي
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="إجمالي الطلاب" value={students.length} color="blue" icon={<Users />} />
        <StatCard label="ساعات التدريس" value="320" color="emerald" icon={<Clock />} />
        <StatCard label="الأرباح المعلقة" value="$450" color="amber" icon={<Wallet />} />
        <StatCard label="التقييم العام" value="4.9" color="rose" icon={<Star />} />
      </div>
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200">
        <h3 className="text-2xl font-black mb-8">الطلاب النشطون</h3>
        <div className="space-y-4">
          {students.map(s => (
            <div key={s.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-500 transition-all cursor-pointer">
              <div className="flex items-center gap-6">
                <img src={s.avatar} className="w-14 h-14 rounded-2xl shadow-md border-2 border-white" />
                <div>
                  <div className="font-black text-lg text-slate-800">{s.name}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">انضم في {s.joinedDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">التقدم</div>
                  <div className="font-bold text-emerald-600">{s.progress}%</div>
                </div>
                <button className="p-4 bg-white text-slate-400 rounded-2xl hover:text-indigo-600 shadow-sm border border-slate-100 transition-all"><MessageSquare size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl h-64">
          <div><Wallet className="mb-4 opacity-50" size={32} /><h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-2">الرصيد الكلي</h3><div className="text-5xl font-black">$15,400.00</div></div>
          <button className="w-full py-4 bg-white text-emerald-900 rounded-2xl font-black text-sm">سحب الأرباح</button>
        </div>
        <div className="bg-white rounded-[2.5rem] border p-10 flex flex-col justify-between shadow-sm h-64">
          <div><ArrowUpRight className="text-emerald-500 mb-4" size={32} /><h3 className="text-sm font-bold text-slate-400 uppercase mb-2">أرباح هذا الشهر</h3><div className="text-4xl font-black text-slate-800">$1,240.50</div></div>
          <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">+12% عن الشهر الماضي</div>
        </div>
        <div className="bg-white rounded-[2.5rem] border p-10 flex flex-col justify-between shadow-sm h-64">
          <div><Clock className="text-blue-500 mb-4" size={32} /><h3 className="text-sm font-bold text-slate-400 uppercase mb-2">إجمالي الجلسات</h3><div className="text-4xl font-black text-slate-800">1,240</div></div>
          <div className="text-xs font-bold text-slate-400">بمتوسط 40 حصة/شهر</div>
        </div>
      </div>
      <div className="bg-white rounded-[2.5rem] border p-10">
        <h3 className="text-xl font-black mb-8">تاريخ المعاملات</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm"><ArrowDownLeft size={24} /></div>
                <div><div className="font-bold">حصة مباشرة - أحمد علي</div><div className="text-xs text-slate-400">12 مايو 2024 • 04:00 م</div></div>
              </div>
              <div className="text-right">
                <div className="font-black text-slate-800">+$25.00</div>
                <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">مكتملة</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="إجمالي الإيرادات" value="$54,200" color="emerald" icon={<TrendingUp />} />
        <StatCard label="المعلمون النشطون" value={teachers.filter(t => t.status === 'active').length} color="blue" icon={<Users />} />
        <StatCard label="الطلاب المسجلون" value={students.length} color="amber" icon={<GraduationCap />} />
        <StatCard label="طلبات الانضمام" value={teachers.filter(t => t.status === 'pending').length} color="rose" icon={<ShieldCheck />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200">
          <div className="flex justify-between items-center mb-10"><h3 className="text-2xl font-black">تحليلات المنصة</h3><BarChart3 className="text-slate-300" /></div>
          <div className="h-64 flex items-end gap-3 px-4 border-b border-l">
            {[40, 60, 45, 90, 75, 100, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-emerald-500 rounded-t-xl hover:bg-emerald-600 transition-all cursor-pointer relative group" style={{ height: `${h}%` }}>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">${h * 10}0</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"><span>سبت</span><span>أحد</span><span>اثنين</span><span>ثلاثاء</span><span>أربعاء</span><span>خميس</span><span>جمعة</span></div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200">
          <h3 className="text-2xl font-black mb-10">إعدادات سريعة</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-4"><ShieldAlert className="text-amber-500" /><div><div className="font-black text-sm">وضع الصيانة</div><div className="text-[10px] text-slate-400">إغلاق المنصة للصيانة</div></div></div>
              <button onClick={() => setConfig({...config, maintenanceMode: !config.maintenanceMode})} className={`w-12 h-6 rounded-full transition-colors relative ${config.maintenanceMode ? 'bg-amber-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.maintenanceMode ? 'right-7' : 'right-1'}`} /></button>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">رسوم المنصة (%)</label>
              <input type="number" value={config.platformFee} onChange={e => setConfig({...config, platformFee: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اللون الأساسي</label>
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl border-4 border-white shadow-lg" style={{ backgroundColor: config.primaryColor }} />
                <input type="color" value={config.primaryColor} onChange={e => setConfig({...config, primaryColor: e.target.value})} className="flex-1 h-14 p-2 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderManageUsers = () => (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-10 border-b bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
        <h2 className="text-2xl font-black">إدارة المستخدمين</h2>
        <div className="flex gap-2">
          <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-500 hover:border-emerald-500 transition-colors">الطلاب</button>
          <button className="px-6 py-2 bg-emerald-600 border border-emerald-600 rounded-xl font-black text-xs text-white shadow-lg">المعلمون</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="p-8 border-b">الاسم</th>
              <th className="p-8 border-b">التخصص/الدور</th>
              <th className="p-8 border-b">الحالة</th>
              <th className="p-8 border-b">تاريخ الانضمام</th>
              <th className="p-8 border-b text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {teachers.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-8"><div className="flex items-center gap-4"><img src={t.avatar} className="w-10 h-10 rounded-xl" /><span className="font-bold text-slate-700">{t.name}</span></div></td>
                <td className="p-8 font-bold text-xs text-indigo-600">{t.specialization}</td>
                <td className="p-8"><span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${t.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{t.status === 'active' ? 'نشط' : 'بانتظار المراجعة'}</span></td>
                <td className="p-8 text-xs font-bold text-slate-400">{t.joinedDate}</td>
                <td className="p-8 text-left"><button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 transition-all"><Edit size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderClassroom = () => (
    <div className="h-full flex flex-col items-center justify-center space-y-12 animate-in slide-in-from-bottom-10 duration-700">
      <div className="w-full max-w-5xl aspect-video bg-slate-950 rounded-[3rem] relative overflow-hidden shadow-2xl border-8 border-slate-900 group">
        {!isClassActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 text-white z-20">
            <div onClick={() => setIsClassActive(true)} className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mb-8 cursor-pointer hover:scale-110 transition-transform shadow-2xl shadow-emerald-600/50">
              <Play size={48} fill="currentColor" />
            </div>
            <h2 className="text-4xl font-black mb-4">دخول الفصل الدراسي المباشر</h2>
            <p className="text-slate-400 text-lg">د. أحمد السقا ينتظرك في القاعة الافتراضية</p>
          </div>
        ) : (
          <div className="h-full relative">
            <img src="https://picsum.photos/seed/quran-class/1280/720" className="w-full h-full object-cover opacity-80" />
            <div className="absolute top-10 right-10 flex gap-4">
              <div className="bg-rose-600 text-white px-6 py-2 rounded-full text-xs font-black animate-pulse flex items-center gap-2"><div className="w-2 h-2 bg-white rounded-full" /> مباشر الآن</div>
              <div className="bg-black/50 backdrop-blur px-6 py-2 rounded-full text-white text-xs font-black border border-white/10 tracking-widest">00:45:12</div>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-6 bg-slate-900/80 backdrop-blur-2xl p-6 rounded-[3rem] border border-white/10 shadow-2xl">
              <button className="p-4 bg-white/10 text-white rounded-full hover:bg-emerald-600 transition-all"><Mic size={24} /></button>
              <button className="p-4 bg-white/10 text-white rounded-full hover:bg-emerald-600 transition-all"><Video size={24} /></button>
              <button className="p-4 bg-white/10 text-white rounded-full hover:bg-emerald-600 transition-all"><Share2 size={24} /></button>
              <button className="p-4 bg-white/10 text-white rounded-full hover:bg-emerald-600 transition-all"><Monitor size={24} /></button>
              <div className="w-px h-10 bg-white/20 mx-2" />
              <button onClick={() => setIsClassActive(false)} className="px-12 bg-rose-600 text-white rounded-full font-black text-sm hover:bg-rose-700 transition-all shadow-xl">مغادرة</button>
            </div>
            <div className="absolute bottom-10 right-10 w-48 aspect-video bg-slate-800 rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/seed/student/200" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-[8px] text-white font-bold">أنت</div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-xl w-full max-w-5xl text-center">
        <h3 className="quran-font text-6xl mb-12 text-slate-800">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</h3>
        <p className="quran-font text-4xl leading-[2.8] text-slate-700 max-w-4xl mx-auto">
          الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۞ الرَّحْمَنِ الرَّحِيمِ ۞ مَالِكِ يَوْمِ الدِّينِ ۞ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۞ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
        </p>
        <div className="mt-16 flex gap-8 justify-center">
          <button className="flex flex-col items-center gap-3 p-8 bg-emerald-50 rounded-[2.5rem] text-emerald-600 hover:bg-emerald-100 transition-all group w-48 shadow-sm">
            <Sparkles size={36} className="group-hover:scale-110 transition-transform" /><span className="text-[10px] font-black uppercase tracking-widest">تحليل التجويد</span>
          </button>
          <button className="flex flex-col items-center gap-3 p-8 bg-blue-50 rounded-[2.5rem] text-blue-600 hover:bg-blue-100 transition-all group w-48 shadow-sm">
            <Volume2 size={36} className="group-hover:scale-110 transition-transform" /><span className="text-[10px] font-black uppercase tracking-widest">تسميع صوتي</span>
          </button>
          <button className="flex flex-col items-center gap-3 p-8 bg-amber-50 rounded-[2.5rem] text-amber-600 hover:bg-amber-100 transition-all group w-48 shadow-sm">
            <Monitor size={36} className="group-hover:scale-110 transition-transform" /><span className="text-[10px] font-black uppercase tracking-widest">سبورة تفاعلية</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="bg-white rounded-[3rem] border p-12 animate-in fade-in duration-500 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-10">
        <h2 className="text-4xl font-black">الجدول الأسبوعي</h2>
        <div className="flex gap-4 p-2 bg-slate-50 border rounded-2xl">
          <button className="px-8 py-3 rounded-xl font-black text-xs text-slate-400">أسبوعي</button>
          <button className="px-8 py-3 bg-white text-emerald-600 rounded-xl font-black text-xs shadow-xl border border-emerald-50">شهري</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-6">
        {['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(day => (
          <div key={day} className="text-center py-6 bg-slate-50 rounded-2xl font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">{day}</div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className={`h-48 p-6 border rounded-[2.5rem] relative group hover:border-emerald-500 transition-all flex flex-col ${i + 1 === 15 ? 'border-emerald-500 bg-emerald-50/20' : 'bg-white border-slate-50'}`}>
            <span className={`text-lg font-black ${i + 1 === 15 ? 'text-emerald-600' : 'text-slate-200'}`}>{i + 1}</span>
            {i + 1 === 15 && (
              <div className="mt-auto p-4 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/20"><div className="text-[8px] font-black uppercase mb-1">حصة مباشرة</div><div className="text-[10px] font-black truncate">د. أحمد السقا</div></div>
            )}
            {i + 1 === 18 && (
              <div className="mt-auto p-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100"><div className="text-[10px] font-black truncate text-center">مراجعة عامة</div></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAiTutor = () => (
    <div className="h-[calc(100vh-220px)] flex flex-col items-center justify-center space-y-12 animate-in zoom-in-95 duration-700">
      <div className={`w-80 h-80 rounded-full flex items-center justify-center relative transition-all duration-1000 ${isLiveActive ? 'scale-110 shadow-[0_0_120px_rgba(5,150,105,0.4)]' : 'bg-white shadow-2xl border-2 border-slate-50'}`} style={{ backgroundColor: isLiveActive ? config.primaryColor : 'white' }}>
        {isLiveActive ? (
          <>
            <div className="absolute inset-0 rounded-full border-8 border-emerald-400 animate-ping opacity-20" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-300 animate-pulse opacity-40" />
            <Sparkles className="text-white w-32 h-32 animate-pulse" />
          </>
        ) : (
          <Mic className="text-slate-200 w-32 h-32 group-hover:scale-110 transition-transform" />
        )}
      </div>
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black">{isLiveActive ? 'نور يستمع إليك...' : 'تحدث مع نور صوتياً'}</h2>
        {isLiveActive && transcription && (
          <div className="mt-4 px-8 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 font-bold quran-font text-2xl animate-in slide-in-from-bottom-5">
            {transcription}
          </div>
        )}
        <p className="text-slate-500 max-w-lg mx-auto leading-[2] font-bold">أول مساعد إسلامي ذكي يدعم المحادثة الصوتية المباشرة لتصحيح التلاوة وتفسير الآيات بذكاء اصطناعي فائق.</p>
      </div>
      <button onClick={isLiveActive ? stopVoiceChat : startVoiceChat} className="px-20 py-8 rounded-[3rem] font-black text-2xl text-white shadow-2xl transition-all active:scale-95 flex items-center gap-6 group" style={{ backgroundColor: isLiveActive ? '#e11d48' : config.primaryColor }}>
        {isLiveActive ? <><MicOff size={32} /> إنهاء الجلسة</> : <><Mic size={32} className="group-hover:scale-110 transition-transform" /> ابدأ التحدث الآن</>}
      </button>
    </div>
  );

  const renderContentManager = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10"><h2 className="text-3xl font-black">إدارة المحتوى</h2><button className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black flex items-center gap-3 shadow-2xl shadow-emerald-600/30 active:scale-95 transition-all"><Plus size={24} /> إضافة دورة جديدة</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(c => (
          <div key={c.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden flex flex-col group hover:shadow-2xl transition-all border-transparent hover:border-emerald-100">
            <div className="h-44 bg-slate-50 flex items-center justify-center relative p-10 overflow-hidden"><div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent" /><div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-2xl group-hover:scale-110 transition-transform z-10">{c.icon}</div></div>
            <div className="p-10 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6"><span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl uppercase tracking-widest">{c.category}</span><span className="text-xs font-bold text-slate-400">{c.lessonsCount} درس</span></div>
              <h4 className="text-2xl font-black mb-4 text-slate-800">{c.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-10 flex-1">{c.description}</p>
              <div className="flex gap-4 pt-10 border-t border-slate-100">
                <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"><Edit size={16} /> تعديل</button>
                <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-rose-600 border border-transparent hover:border-rose-100 transition-all"><Trash2 size={20} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <div className="min-h-screen flex flex-col bg-slate-50 font-['Cairo']" style={{ '--primary-custom': config.primaryColor } as any}>
      {/* Simulation Toggle (Demo Purposes) */}
      <div className="fixed bottom-8 left-8 z-50 flex bg-white/90 backdrop-blur p-3 rounded-full shadow-2xl border gap-2">
        {(['student', 'instructor', 'admin'] as UserRole[]).map(r => (
          <button key={r} onClick={() => setUserRole(r)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${userRole === r ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}>{r}</button>
        ))}
      </div>

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="px-2 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md" style={{ backgroundColor: config.primaryColor }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900">{config.siteName}</h1>
              <span className="text-[8px] font-black uppercase tracking-[0.15em]" style={{ color: config.primaryColor }}>{userRole} portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex items-center gap-2 w-56 group focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
              <Search size={14} className="text-slate-400" />
              <input placeholder="بحث عام..." className="bg-transparent border-none outline-none font-bold text-xs w-full" />
            </div>
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <Bell size={16} />
              </div>
              <div className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white shadow-sm" />
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
              <img src="https://picsum.photos/seed/me/100" className="w-8 h-8 rounded-lg border-2 border-white shadow-md" />
              <button className="p-1 text-slate-400 hover:text-rose-600 font-black transition-all">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-slate-100 bg-white/50 backdrop-blur overflow-x-auto">
          <div className="px-2 sm:px-4 flex gap-1">
            {filteredNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-4 py-2.5 font-black text-xs whitespace-nowrap border-b-2 transition-all ${
                  activeTab === item.id
                    ? 'text-white border-b-2'
                    : 'text-slate-400 border-b-2 border-transparent hover:text-emerald-600'
                }`}
                style={activeTab === item.id ? { color: config.primaryColor, borderBottomColor: config.primaryColor } : {}}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {dataLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
              <p className="text-slate-600 font-bold">جاري تحميل البيانات...</p>
            </div>
          </div>
        ) : (
        <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 min-h-full">
          {/* Universal Render Logic */}
          {activeTab === 'dashboard' && renderStudentDashboard()}
          {activeTab === 'discover' && renderDiscover()}
          {activeTab === 'classroom' && renderClassroom()}
          {activeTab === 'leaderboard' && renderLeaderboard()}
          {activeTab === 'curriculum' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
              {courses.map(c => (
                <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col group hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">{c.icon}</div>
                  <h3 className="text-base font-black mb-1">{c.title}</h3>
                  <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase tracking-widest">{c.category} • {c.lessonsCount} درس</p>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-1">{c.description}</p>
                  <div className="mt-auto space-y-3 pt-6 border-t border-slate-50">
                    <div className="flex justify-between items-end mb-1"><span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">معدل الإكمال</span><span className="text-base font-black text-emerald-600">{c.progress}%</span></div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c.progress}%` }} /></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'achievements' && renderAchievements()}
          {activeTab === 'ai-tutor' && renderAiTutor()}
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border p-6 space-y-4">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><MessageSquare className="text-emerald-600" /> المحادثات</h2>
                
                {teachers.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">اختر معلم للمحادثة</label>
                    <select 
                      value={selectedTeacherForChat}
                      onChange={(e) => setSelectedTeacherForChat(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg"
                    >
                      <option value="">-- اختر معلم --</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {selectedTeacherForChat && (
                  <ChatBox 
                    currentUserId="current-user" 
                    otherUserId={selectedTeacherForChat}
                  />
                )}
              </div>
            </div>
          )}
          {activeTab === 'lesson-booking' && (
            <div className="max-w-4xl mx-auto">
              <CalendarScheduler 
                userId="current-user" 
                userRole={userRole}
                teachers={teachers}
              />
            </div>
          )}
          {activeTab === 'payments' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl border p-6 space-y-6">
                <h2 className="text-2xl font-black flex items-center gap-3"><CreditCard className="text-emerald-600" /> معالجة الدفع</h2>
                <StripeInfo />
                <StripePaymentForm 
                  amount={selectedLessonForPayment.amount} 
                  teacherId={selectedLessonForPayment.teacherId || teachers[0]?.id || ''}
                  studentId="current-student"
                  onSuccess={() => alert('تم الدفع بنجاح!')}
                />
              </div>
            </div>
          )}
          {activeTab === 'instructor-dashboard' && renderInstructorDashboard()}
          {activeTab === 'earnings' && renderEarnings()}
          {activeTab === 'my-students' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              {students.map(s => (
                <div key={s.id} className="bg-white rounded-[3rem] border p-10 shadow-sm hover:shadow-2xl transition-all group flex flex-col">
                  <div className="flex items-start justify-between mb-8">
                    <div className="relative"><img src={s.avatar} className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform" /><div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white" /></div>
                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600"><MoreVertical size={20} /></button>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">{s.name}</h3>
                  <p className="text-xs text-slate-400 font-bold mb-10 tracking-widest uppercase">منضم منذ {s.joinedDate}</p>
                  <div className="space-y-4 flex-1 mb-10">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-1"><span className="text-slate-400">التقدم الكلي</span><span className="text-emerald-600">{s.progress}%</span></div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.progress}%` }} /></div>
                  </div>
                  <div className="flex gap-4"><button className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-lg hover:bg-emerald-700 active:scale-95 transition-all">مراسلة</button><button className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs border border-slate-100 hover:bg-slate-100 transition-all">عرض التقارير</button></div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'admin-dashboard' && renderAdminDashboard()}
          {activeTab === 'manage-users' && renderManageUsers()}
          {activeTab === 'content-manager' && renderContentManager()}
          {activeTab === 'platform-settings' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
               <div className="bg-white rounded-[3rem] border p-12 shadow-sm">
                  <h2 className="text-3xl font-black mb-12 flex items-center gap-3"><Settings className="text-emerald-600" /> الإعدادات العامة</h2>
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4"><label className="block text-xs font-black text-slate-400 uppercase tracking-widest">اسم المنصة</label><input value={config.siteName} onChange={e => setConfig({...config, siteName: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:border-emerald-500 transition-all font-bold" /></div>
                      <div className="space-y-4"><label className="block text-xs font-black text-slate-400 uppercase tracking-widest">رسوم المنصة (%)</label><input type="number" value={config.platformFee} onChange={e => setConfig({...config, platformFee: Number(e.target.value)})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:border-emerald-500 transition-all font-bold" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4"><label className="block text-xs font-black text-slate-400 uppercase tracking-widest">لون الهوية</label><div className="flex gap-4"><div className="w-16 h-16 rounded-2xl shadow-lg" style={{ backgroundColor: config.primaryColor }} /><input type="color" value={config.primaryColor} onChange={e => setConfig({...config, primaryColor: e.target.value})} className="h-16 flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-2 cursor-pointer" /></div></div>
                      <div className="space-y-4"><label className="block text-xs font-black text-slate-400 uppercase tracking-widest">حالة المنصة</label><div className={`p-5 rounded-[1.5rem] border flex items-center justify-between transition-all ${config.maintenanceMode ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}><div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-white shadow-sm">{config.maintenanceMode ? <AlertTriangle className="text-amber-600" /> : <CheckCircle className="text-emerald-600" />}</div><div><div className="font-black text-sm text-slate-800">{config.maintenanceMode ? 'وضع الصيانة نشط' : 'المنصة تعمل بشكل طبيعي'}</div></div></div><button onClick={() => setConfig({...config, maintenanceMode: !config.maintenanceMode})} className={`w-14 h-8 rounded-full transition-all relative ${config.maintenanceMode ? 'bg-amber-500' : 'bg-emerald-500'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${config.maintenanceMode ? 'right-7' : 'right-1'}`} /></button></div></div>
                    </div>
                    <div className="pt-10 border-t flex justify-end gap-4"><button className="px-10 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black">إعادة تعيين</button><button className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-2xl shadow-emerald-600/30">حفظ الإعدادات</button></div>
                  </div>
               </div>
            </div>
          )}
        </div>
        )}
      </main>

      {/* Debug Panel - shows Supabase connection status */}
      <SupabaseDebugPanel />

      {/* Demo floating button to open modal form */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => { setActiveTab('dashboard'); setIsModalOpen(true); }}
          className="bg-emerald-600 text-white px-4 py-3 rounded-full font-black shadow-lg">نموذج</button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="مثال - نموذج الاتصال">
        <ContactForm onSubmit={() => setIsModalOpen(false)} />
      </Modal>

      {/* Modals */}
      <EditProfileModal 
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        onSubmit={handleEditProfile}
      />

      <CreateCourseModal 
        isOpen={showCreateCourseModal}
        onClose={() => setShowCreateCourseModal(false)}
        onSubmit={handleCreateCourse}
      />

      <AddLessonModal 
        isOpen={showAddLessonModal}
        onClose={() => setShowAddLessonModal(false)}
        onSubmit={handleAddLesson}
        courseTitle={selectedCourseForLesson}
      />

      <AddAchievementModal 
        isOpen={showAddAchievementModal}
        onClose={() => setShowAddAchievementModal(false)}
        onSubmit={handleAddAchievement}
      />

      <AdvancedSearchModal 
        isOpen={showAdvancedSearchModal}
        onClose={() => setShowAdvancedSearchModal(false)}
        onSearch={handleAdvancedSearch}
      />
        </div>
      )}
    </>
  );
};

export default App;
