import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, BookOpen, ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface TeacherAuthProps {
  onLoginSuccess: () => void;
  onBackToLanding: () => void;
}

export const TeacherAuth: React.FC<TeacherAuthProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw new Error(authError.message);

      // Verify user is teacher/admin
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user!.id)
        .single();

      if (userError || !userData || (userData.role !== 'teacher' && userData.role !== 'admin')) {
        throw new Error('ليس لديك صلاحية الدخول كمعلم');
      }

      setSuccess('تم تسجيل الدخول بنجاح!');
      setTimeout(onLoginSuccess, 1500);
    } catch (err: any) {
      setError(err.message || 'خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw new Error(authError.message);

      setSuccess('تم التسجيل بنجاح! سيتم مراجعة حسابك قريباً');
      setTimeout(() => setAuthTab('signin'), 2500);
    } catch (err: any) {
      setError(err.message || 'خطأ في التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            <ArrowLeft size={20} /> العودة
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="text-emerald-600" size={28} />
            <h1 className="text-2xl font-bold text-emerald-900 quran-font">قرآنيفاي</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex gap-0 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setAuthTab('signin')}
              className={`flex-1 py-3 font-semibold rounded transition ${
                authTab === 'signin'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              دخول
            </button>
            <button
              onClick={() => setAuthTab('signup')}
              className={`flex-1 py-3 font-semibold rounded transition ${
                authTab === 'signup'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              تسجيل جديد
            </button>
          </div>

          {/* Form */}
          <form onSubmit={authTab === 'signin' ? handleSignIn : handleSignUp} className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-emerald-900 mb-2">
              {authTab === 'signin' ? 'مرحباً بالمعلمين' : 'انضم للمعلمين'}
            </h2>
            <p className="text-gray-600 mb-6">
              {authTab === 'signin'
                ? 'أدخل بيانات حسابك للوصول إلى لوحة التحكم'
                : 'سجل كمعلم وابدأ تدريس الطلاب'}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            {/* Name Field (Sign Up Only) */}
            {authTab === 'signup' && (
              <div className="mb-4">
                <label className="block text-emerald-900 font-semibold mb-2">الاسم الكامل</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="د. أحمد محمد"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
            )}

            {/* Specialization (Sign Up Only) */}
            {authTab === 'signup' && (
              <div className="mb-4">
                <label className="block text-emerald-900 font-semibold mb-2">التخصص</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                >
                  <option value="">اختر التخصص</option>
                  <option value="تجويد">تجويد</option>
                  <option value="حفظ">حفظ</option>
                  <option value="تفسير">تفسير</option>
                  <option value="قراءات">قراءات</option>
                  <option value="تأسيس">تأسيس</option>
                </select>
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="block text-emerald-900 font-semibold mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@email.com"
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-emerald-900 font-semibold mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition mb-4"
            >
              {loading
                ? authTab === 'signin'
                  ? 'جاري تسجيل الدخول...'
                  : 'جاري التسجيل...'
                : authTab === 'signin'
                ? 'دخول'
                : 'إنشاء حساب'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-900">
            <p className="font-semibold mb-2">🔐 بيانات تجريبية (معلم):</p>
            <p>البريد: walid.genidy@gmail.com</p>
            <p>كلمة المرور: Admin123@@123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
