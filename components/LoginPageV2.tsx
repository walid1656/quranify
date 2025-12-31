import React, { useState } from 'react';
import { supabase, signUp, signIn } from '../services/supabaseClient';
import { BookOpen, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (role: 'student' | 'teacher' | 'admin') => void;
  onBack: () => void;
}

export const LoginPageV2: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [role, setRole] = useState<'student' | 'teacher' | 'admin' | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Admin credentials
  const ADMIN_ACCOUNTS = [
    { email: 'walid.genidy@gmail.com', password: 'Admin123@@123' },
    { email: 'sohila.esmatt93@gmail.com', password: 'Admin123@@123' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      // Check for admin
      const isAdmin = ADMIN_ACCOUNTS.some(acc => acc.email === email && acc.password === password);
      if (isAdmin) {
        setSuccessMsg('تم تسجيل دخول الإدارة بنجاح!');
        setTimeout(() => onLoginSuccess('admin'), 1000);
        return;
      }

      if (isSignUp) {
        const { error: err } = await signUp(email, password);
        if (err) throw err;
        setSuccessMsg('تم التسجيل بنجاح! تحقق من بريدك الإلكتروني.');
        setEmail('');
        setPassword('');
      } else {
        const { error: err } = await signIn(email, password);
        if (err) throw err;
        setSuccessMsg('تم تسجيل الدخول بنجاح!');
        setTimeout(() => onLoginSuccess(role || 'student'), 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-800 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <BookOpen size={24} />
            </div>
            <h1 className="text-2xl font-black text-emerald-600 quran-font">Quranify</h1>
          </div>

          <h2 className="text-2xl font-bold text-center text-slate-900 mb-8 quran-font">اختر نوع الحساب</h2>

          <div className="space-y-4">
            <button onClick={() => setRole('student')} className="w-full p-6 border-2 border-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors text-center group">
              <h3 className="text-lg font-bold text-emerald-600 mb-2 quran-font">طالب</h3>
              <p className="text-sm text-slate-600">ابدأ رحلتك في تعلم القرآن</p>
            </button>

            <button onClick={() => setRole('teacher')} className="w-full p-6 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-colors text-center">
              <h3 className="text-lg font-bold text-blue-600 mb-2 quran-font">معلم</h3>
              <p className="text-sm text-slate-600">علّم الطلاب وطوّر مسيرتك</p>
            </button>

            <button onClick={() => setRole('admin')} className="w-full p-6 border-2 border-purple-600 rounded-xl hover:bg-purple-50 transition-colors text-center">
              <h3 className="text-lg font-bold text-purple-600 mb-2 quran-font">إدارة</h3>
              <p className="text-sm text-slate-600">إدارة المنصة والمستخدمين</p>
            </button>
          </div>

          <button onClick={onBack} className="w-full mt-6 py-3 text-emerald-600 font-bold hover:bg-emerald-50 rounded-lg transition-colors">
            ← العودة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-800 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
            <BookOpen size={24} />
          </div>
          <h1 className="text-2xl font-black text-emerald-600 quran-font">Quranify</h1>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2 quran-font">
          {role === 'student' ? 'دخول الطالب' : role === 'teacher' ? 'دخول المعلم' : 'دخول الإدارة'}
        </h2>
        <p className="text-center text-slate-600 mb-8">
          {isSignUp ? 'أنشئ حساباً جديداً' : 'سجّل الدخول إلى حسابك'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'جاري...' : isSignUp ? 'التسجيل' : 'دخول'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="text-center mb-6">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-emerald-600 font-bold hover:underline"
          >
            {isSignUp ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
          </button>
        </div>

        <button
          onClick={() => setRole(null)}
          className="w-full py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors"
        >
          اختر نوع حساب آخر
        </button>
      </div>
    </div>
  );
};
