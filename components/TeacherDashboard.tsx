import React, { useState } from 'react';
import { Users, Calendar, Award, MessageSquare, BarChart3, Settings, LogOut } from 'lucide-react';

interface TeacherDashboardProps {
  onLogout: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const teacherStats = [
    { label: 'الطلاب النشطون', value: '45', icon: Users, color: 'bg-blue-100' },
    { label: 'الدروس هذا الأسبوع', value: '12', icon: Calendar, color: 'bg-emerald-100' },
    { label: 'التقييم', value: '4.9★', icon: Award, color: 'bg-yellow-100' },
    { label: 'الرسائل', value: '23', icon: MessageSquare, color: 'bg-purple-100' },
  ];

  const upcomingLessons = [
    { id: 1, student: 'أحمد محمد', time: '02:00 PM', subject: 'تجويد', status: 'confirmed' },
    { id: 2, student: 'فاطمة علي', time: '03:30 PM', subject: 'حفظ', status: 'pending' },
    { id: 3, student: 'محمود حسن', time: '05:00 PM', subject: 'تفسير', status: 'confirmed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-emerald-600 quran-font">لوحة المعلم</h1>
          <button onClick={onLogout} className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg">
            <LogOut size={20} /> تسجيل خروج
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          {[
            { id: 'overview', label: 'النظرة العامة', icon: BarChart3 },
            { id: 'lessons', label: 'الدروس المجدولة', icon: Calendar },
            { id: 'students', label: 'الطلاب', icon: Users },
            { id: 'messages', label: 'الرسائل', icon: MessageSquare },
            { id: 'settings', label: 'الإعدادات', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-4 font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              {teacherStats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                    <stat.icon className="text-slate-700" size={24} />
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Upcoming Lessons */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 quran-font">الدروس القادمة</h2>
              <div className="space-y-4">
                {upcomingLessons.map(lesson => (
                  <div key={lesson.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-900">{lesson.student}</h4>
                      <p className="text-sm text-slate-600">{lesson.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{lesson.time}</p>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        lesson.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {lesson.status === 'confirmed' ? 'مؤكد' : 'قيد الانتظار'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 quran-font">إحصائيات الأداء</h2>
              <div className="bg-gradient-to-r from-emerald-100 to-blue-100 p-8 rounded-lg text-center">
                <p className="text-slate-600 mb-4">معدل رضا الطلاب: 94%</p>
                <div className="w-full bg-white rounded-full h-4">
                  <div className="bg-emerald-500 h-4 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 quran-font">جدول الدروس</h2>
            <div className="space-y-4">
              {upcomingLessons.map(lesson => (
                <div key={lesson.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{lesson.student}</h4>
                    <p className="text-emerald-600 font-semibold">{lesson.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-lg">{lesson.time}</p>
                    <button className="mt-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors">
                      بدء الدرس
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 quran-font">قائمة الطلاب</h2>
            <p className="text-slate-600">45 طالب نشط هذا الشهر</p>
            <button className="mt-4 px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors">
              عرض جميع الطلاب
            </button>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 quran-font">الرسائل</h2>
            <p className="text-slate-600">لديك 23 رسالة جديدة</p>
            <button className="mt-4 px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors">
              عرض جميع الرسائل
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 quran-font">الإعدادات</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الموضوعات المتخصص فيها</label>
                <input type="text" value="التجويد - الحفظ" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">السعر بالساعة</label>
                <input type="number" value="50" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
              </div>
              <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors">
                حفظ التغييرات
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
