import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string, metadata: any = {}) => {
  return supabase.auth.signUp({ email, password, options: { data: metadata } });
};

export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return supabase.auth.getUser();
};

// Database helpers
export const getTeachers = async () => {
  return supabase.from('teachers').select('*');
};

export const getStudents = async () => {
  return supabase.from('students').select('*');
};

export const getCourses = async () => {
  return supabase.from('courses').select('*');
};

export const addTeacher = async (data: any) => {
  return supabase.from('teachers').insert([data]);
};

export const addStudent = async (data: any) => {
  return supabase.from('students').insert([data]);
};

export const addCourse = async (data: any) => {
  return supabase.from('courses').insert([data]);
};

export const addContactMessage = async (data: { name: string; email: string; message: string }) => {
  return supabase.from('contact_messages').insert([data]);
};

export const getContactMessages = async () => {
  return supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
};

// Reviews helpers
export const getReviews = async (teacherId?: string) => {
  let query = supabase.from('reviews').select('*');
  if (teacherId) query = query.eq('teacher_id', teacherId);
  return query.order('created_at', { ascending: false });
};

export const addReview = async (data: { teacher_id: string; student_id: string; rating: number; comment: string }) => {
  return supabase.from('reviews').insert([data]);
};

// Chat helpers
export const getMessages = async (userId: string) => {
  return supabase
    .from('chat_messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });
};

export const sendMessage = async (data: { sender_id: string; receiver_id: string; message: string }) => {
  return supabase.from('chat_messages').insert([data]);
};

export const subscribeToMessages = (userId: string, callback: (msg: any) => void) => {
  return supabase
    .channel(`messages:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `receiver_id=eq.${userId}`,
      },
      (payload) => callback(payload.new)
    )
    .subscribe();
};

// Lesson booking helpers
export const getLessonBookings = async (userId?: string) => {
  let query = supabase.from('lesson_bookings').select('*');
  if (userId) query = query.or(`teacher_id.eq.${userId},student_id.eq.${userId}`);
  return query.order('scheduled_time', { ascending: true });
};

export const addLessonBooking = async (data: any) => {
  return supabase.from('lesson_bookings').insert([data]);
};

export const updateLessonBooking = async (id: string, data: any) => {
  return supabase.from('lesson_bookings').update(data).eq('id', id);
};

// Payment helpers
export const createPayment = async (data: any) => {
  return supabase.from('payments').insert([data]);
};

export const getPayments = async (studentId?: string) => {
  let query = supabase.from('payments').select('*');
  if (studentId) query = query.eq('student_id', studentId);
  return query.order('created_at', { ascending: false });
};
