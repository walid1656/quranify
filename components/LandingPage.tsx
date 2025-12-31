import React from 'react';
import { ArrowRight, BookOpen, Users, Award, Globe } from 'lucide-react';

interface LandingPageProps {
  onStudentSignup: () => void;
  onTeacherLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStudentSignup, onTeacherLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="text-emerald-600" size={28} />
            <h1 className="text-2xl font-bold text-emerald-900 quran-font">قرآنيفاي</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={onStudentSignup} className="px-6 py-2 text-emerald-600 font-semibold hover:bg-emerald-50 rounded-lg transition">
              تسجيل الدخول
            </button>
            <button onClick={onTeacherLogin} className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition">
              دخول المعلم
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-emerald-900 mb-4 quran-font">منصة تعليم القرآن الكريم</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          تعلم القرآن الكريم مع أفضل المعلمين بطرق حديثة وتفاعلية
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={onStudentSignup} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 flex items-center gap-2">
            ابدأ التعلم الآن <ArrowRight size={20} />
          </button>
          <button onClick={onTeacherLogin} className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 font-bold rounded-lg hover:bg-emerald-50">
            أكون معلماً
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-emerald-900 mb-12 quran-font">لماذا قرآنيفاي؟</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: "معلمون محترفون", desc: "معلمون متخصصون في تعليم القرآن" },
              { icon: BookOpen, title: "منهج شامل", desc: "مناهج متعددة للحفظ والتجويد" },
              { icon: Award, title: "شهادات معترف", desc: "شهادات رسمية بعد الانتهاء" },
              { icon: Globe, title: "تعليم أونلاين", desc: "تعلم من أي مكان وفي أي وقت" }
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 hover:shadow-lg rounded-xl transition">
                <feature.icon className="text-emerald-600 mx-auto mb-3" size={32} />
                <h4 className="font-bold text-emerald-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-emerald-900 mb-12 quran-font">معلمونا</h3>
          <p className="text-center text-gray-600 mb-8">نخبة من أفضل معلمي القرآن الكريم مع خبرات متنوعة</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "محمد أحمد", specialty: "حفظ القرآن", rating: 4.9 },
              { name: "فاطمة علي", specialty: "تجويد", rating: 4.8 },
              { name: "عمر محمود", specialty: "القراءات", rating: 4.7 }
            ].map((teacher, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
                <div className="w-16 h-16 bg-emerald-200 rounded-full mx-auto mb-4"></div>
                <h4 className="font-bold text-emerald-900">{teacher.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{teacher.specialty}</p>
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className={j < Math.floor(teacher.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{teacher.rating} ⭐</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4 quran-font">جاهز لبدء رحلتك في تعلم القرآن؟</h3>
          <p className="text-lg mb-8 opacity-90">
            انضم لآلاف الطلاب الذين بدأوا تعلمهم معنا
          </p>
          <button onClick={onStudentSignup} className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-gray-100">
            سجل الآن مجاناً
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-8 text-center">
        <p className="quran-font">© 2025 قرآنيفاي - منصة تعليم القرآن الكريم</p>
      </footer>
    </div>
  );
};
