import React from 'react';
import { BookOpen, Users, Award, ArrowRight, Star, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewTeachers: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewTeachers }) => {
  const teachers = [
    { id: 1, name: 'الشيخ أحمد', specialization: 'تجويد', rating: 4.9 },
    { id: 2, name: 'الشيخ محمد', specialization: 'حفظ', rating: 4.8 },
    { id: 3, name: 'الشيخة فاطمة', specialization: 'تفسير', rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50" dir="rtl">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-black text-emerald-600 quran-font">Quranify</h1>
          <div className="flex gap-4">
            <button onClick={onViewTeachers} className="px-6 py-2 text-emerald-600 font-bold hover:bg-emerald-50 rounded-lg">
              المعلمون
            </button>
            <button onClick={onGetStarted} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors">
              ابدأ الآن
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-black text-slate-900 quran-font leading-tight">
              تعلم القرآن الكريم بطريقة حديثة
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              منصة تعليمية متكاملة لتعلم القرآن الكريم مع معلمين متخصصين في التجويد والحفظ والتفسير
            </p>
            <div className="flex gap-4">
              <button onClick={onGetStarted} className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 flex items-center gap-2 transition-all hover:scale-105">
                ابدأ التعلم <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-colors">
                اعرف أكثر
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl p-8 text-white space-y-4 shadow-2xl">
            <BookOpen size={60} />
            <h3 className="text-2xl font-black quran-font">تجويد متقن</h3>
            <p className="text-emerald-50">تعلم أصول التجويد من معلمين متخصصين</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-4xl font-black text-center text-slate-900 mb-16 quran-font">لماذا Quranify؟</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'معلمون متخصصون', desc: 'فريق من الشيوخ والمعلمات المؤهلين' },
              { icon: Award, title: 'شهادات معتمدة', desc: 'احصل على شهادات عند إنهائك للكورسات' },
              { icon: BookOpen, title: 'محتوى غني', desc: 'آلاف الدروس والمحاضرات المتنوعة' },
            ].map((feature, i) => (
              <div key={i} className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                <feature.icon size={40} className="text-emerald-600 mb-4" />
                <h4 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h3 className="text-4xl font-black text-center text-slate-900 mb-16 quran-font">معلمونا المتميزون</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {teachers.map(teacher => (
            <div key={teacher.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-slate-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Users size={32} className="text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{teacher.name}</h4>
              <p className="text-emerald-600 font-semibold mb-3">{teacher.specialization}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(teacher.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'} />
                ))}
                <span className="text-sm text-slate-600 mr-2">{teacher.rating}</span>
              </div>
              <button onClick={onGetStarted} className="w-full mt-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors">
                احجز درس
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10K+', label: 'طالب' },
              { number: '50+', label: 'معلم' },
              { number: '500+', label: 'درس' },
              { number: '4.8★', label: 'التقييم' },
            ].map((stat, i) => (
              <div key={i}>
                <h4 className="text-4xl font-black mb-2">{stat.number}</h4>
                <p className="text-emerald-50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h3 className="text-4xl font-black text-slate-900 mb-4 quran-font">هل أنت مستعد للبدء؟</h3>
        <p className="text-xl text-slate-600 mb-8">انضم الآن واستمتع بتجربة تعليمية متميزة</p>
        <button onClick={onGetStarted} className="px-12 py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 text-lg transition-all hover:scale-105">
          ابدأ الآن مجاناً
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400">© 2025 Quranify - منصة تعليم القرآن الكريم</p>
        </div>
      </footer>
    </div>
  );
};
