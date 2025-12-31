
import React from 'react';
import { 
  Home, 
  Search, 
  BookOpen, 
  Calendar, 
  Award, 
  GraduationCap,
  Sparkles,
  Users,
  BarChart3,
  Settings,
  Trophy,
  Wallet,
  Layout,
  MessageSquare,
  Star,
  CreditCard
} from 'lucide-react';
import { NavItem, UserRole } from './types';

export const NAV_ITEMS: NavItem[] = [
  // Student Items
  { id: 'dashboard', label: 'الرئيسية', icon: <Home size={20} />, roles: ['student'] },
  { id: 'discover', label: 'استكشف المعلمين', icon: <Search size={20} />, roles: ['student'] },
  { id: 'classroom', label: 'الفصل الدراسي', icon: <GraduationCap size={20} />, roles: ['student', 'instructor'] },
  { id: 'leaderboard', label: 'لوحة الصدارة', icon: <Trophy size={20} />, roles: ['student'] },
  { id: 'curriculum', label: 'منهجي الدراسي', icon: <BookOpen size={20} />, roles: ['student'] },
  { id: 'schedule', label: 'جدول الحصص', icon: <Calendar size={20} />, roles: ['student', 'instructor'] },
  { id: 'achievements', label: 'الإنجازات', icon: <Award size={20} />, roles: ['student'] },
  { id: 'ai-tutor', label: 'المساعد الذكي', icon: <Sparkles size={20} />, roles: ['student'] },
  { id: 'chat', label: 'المحادثات', icon: <MessageSquare size={20} />, roles: ['student', 'instructor'] },
  { id: 'lesson-booking', label: 'حجز الدروس', icon: <Calendar size={20} />, roles: ['student', 'instructor'] },
  { id: 'payments', label: 'الدفع', icon: <CreditCard size={20} />, roles: ['student'] },
  
  // Instructor Items
  { id: 'instructor-dashboard', label: 'لوحة التحكم', icon: <Home size={20} />, roles: ['instructor'] },
  { id: 'earnings', label: 'الأرباح', icon: <Wallet size={20} />, roles: ['instructor'] },
  { id: 'my-students', label: 'طلابِي', icon: <Users size={20} />, roles: ['instructor'] },
  
  // Admin Items
  { id: 'admin-dashboard', label: 'نظرة عامة', icon: <BarChart3 size={20} />, roles: ['admin'] },
  { id: 'manage-users', label: 'إدارة المستخدمين', icon: <Users size={20} />, roles: ['admin'] },
  { id: 'platform-settings', label: 'إعدادات المنصة', icon: <Settings size={20} />, roles: ['admin'] },
  { id: 'content-manager', label: 'إدارة المحتوى', icon: <BookOpen size={20} />, roles: ['admin'] },
];

export const INITIAL_CONFIG = {
  primaryColor: '#059669',
  platformFee: 15,
  siteName: 'Quranify',
  maintenanceMode: false
};
