import React, { useState } from 'react';
import { supabase, signUp, signIn } from '../services/supabaseClient';
import { BookOpen } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
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
        setTimeout(() => onLoginSuccess(), 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <BookOpen size={24} />
          </div>
          <h1 className="text-2xl font-black text-emerald-900">Quranify</h1>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-center mb-2 text-emerald-900">
          {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
        </h2>
        <p className="text-center text-slate-500 mb-8 font-bold">
          {isSignUp ? 'انضم إلى منصة تعليم القرآن الكريم' : 'رحباً بك في Quranify'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold mb-2 text-right">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none font-bold text-right"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold mb-2 text-right">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none font-bold text-right"
              required
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-lg text-rose-700 text-sm font-bold text-right">
              ❌ {error}
            </div>
          )}

          {/* Success message */}
          {successMsg && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg text-emerald-700 text-sm font-bold text-right">
              ✅ {successMsg}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black text-lg hover:bg-emerald-700 transition-all disabled:opacity-60 shadow-lg"
          >
            {loading ? 'جاري المعالجة...' : isSignUp ? 'إنشاء حساب' : 'دخول'}
          </button>
        </form>

        {/* Toggle signup/signin */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 font-bold mb-4">
            {isSignUp ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-emerald-600 font-black hover:underline mr-2"
            >
              {isSignUp ? 'تسجيل دخول' : 'إنشاء حساب'}
            </button>
          </p>
        </div>

        {/* Guest login option */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onLoginSuccess}
            className="w-full py-3 border-2 border-slate-300 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            متابعة كزائر
          </button>
        </div>
      </div>
    </div>
  );
};
