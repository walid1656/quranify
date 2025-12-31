
import React from 'react';

export type UserRole = 'student' | 'instructor' | 'admin';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

export interface TeacherProfile {
  id: string;
  name: string;
  rating: number;
  sessionsCount: number;
  hourlyRate: number;
  specialization: string;
  avatar: string;
  bio: string;
  status: 'pending' | 'active' | 'suspended';
  earnings: number;
  joinedDate: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  progress: number;
  status: 'active' | 'inactive';
  assignedInstructorId?: string;
  points: number;
  level: number;
  streak: number;
  rank?: number;
}

export interface Course {
  id: string;
  title: string;
  progress: number;
  nextLesson: string;
  icon: React.ReactNode;
  category: string;
  lessonsCount: number;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  date?: string;
  progress?: number;
  total?: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  instructor: string;
  student?: string;
  type: 'live' | 'review' | 'exam';
  day: number; // 1-31 for the calendar view
}

export interface PlatformConfig {
  primaryColor: string;
  secondaryColor: string;
  platformFee: number;
  siteName: string;
  maintenanceMode: boolean;
  allowGuestBrowsing: boolean;
}
