import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, BookOpen } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface TeacherLoginProps {
  onLoginSuccess: (email: string) => void;
  onBackToLanding: () => void;
}

export const TeacherLogin: React.FC<TeacherLoginProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (authError) throw new Error(authError.message);

      // Check if user is a teacher or admin
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user!.id)
        .single();

      if (userError || !userData || (userData.role !== 'teacher' && userData.role !== 'admin')) {
        throw new Error('ليس لديك صلاحية الدخول كمعلم');
      }

      onLoginSuccess(email);
    } catch (err: any) {
      setError(err.message || 'خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="text-emerald-600" size={32} />
            <h1 className="text-3xl font-bold text-emerald-900 quran-font">قرآنيفاي</h1>
          </div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">دخول المعلمين</h2>
          <p className="text-gray-600">أدخل بيانات حسابك للمتابعة</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
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
                placeholder="your@email.com"
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 mb-4"
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={onBackToLanding}
            className="w-full text-emerald-600 font-semibold py-2 rounded-lg hover:bg-emerald-50"
          >
            العودة للصفحة الرئيسية
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-emerald-100 rounded-lg text-sm text-emerald-900">
          <p className="font-semibold mb-2">بيانات تجريبية:</p>
          <p>walid.genidy@gmail.com</p>
          <p>Admin123@@123</p>
        </div>
      </div>
    </div>
  );
};
