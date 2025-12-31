import React, { useState, useEffect } from 'react';
import { LogOut, BarChart3, Users, BookOpen, MessageSquare, Calendar, Settings } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface TeacherDashboardProps {
  email: string;
  onLogout: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ email, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    lessons: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, [email]);

  const fetchTeacherData = async () => {
    try {
      const { data: teacher } = await supabase
        .from('teachers')
        .select('id, students_count, courses_count')
        .eq('email', email)
        .single();

      if (teacher) {
        setStats({
          students: teacher.students_count || 0,
          courses: teacher.courses_count || 0,
          lessons: (teacher.students_count || 0) * 5,
          earnings: (teacher.students_count || 0) * 50
        });
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="animate-spin">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900 quran-font">لوحة التحكم</h1>
            <p className="text-gray-600">{email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <LogOut size={20} /> تسجيل الخروج
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
            { id: 'students', label: 'الطلاب', icon: Users },
            { id: 'courses', label: 'الدورات', icon: BookOpen },
            { id: 'messages', label: 'الرسائل', icon: MessageSquare },
            { id: 'schedule', label: 'الجدول', icon: Calendar },
            { id: 'settings', label: 'الإعدادات', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-semibold flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: 'عدد الطلاب', value: stats.students, color: 'emerald' },
                { label: 'الدورات', value: stats.courses, color: 'blue' },
                { label: 'الدروس', value: stats.lessons, color: 'purple' },
                { label: 'الأرباح', value: `$${stats.earnings}`, color: 'yellow' }
              ].map((stat, i) => (
                <div key={i} className={`bg-${stat.color}-50 border-2 border-${stat.color}-200 rounded-xl p-6`}>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className={`text-3xl font-bold text-${stat.color}-600 mt-2`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold text-emerald-900 mb-4">نشاط الطلاب</h3>
              <div className="space-y-3">
                {[
                  { name: 'محمود علي', action: 'أنهى درس الفاتحة', time: 'منذ 2 ساعة' },
                  { name: 'فريدة أحمد', action: 'بدأت درس البقرة', time: 'منذ 3 ساعات' },
                  { name: 'عمر محمد', action: 'حقق 95% في الاختبار', time: 'منذ 5 ساعات' }
                ].map((activity, i) => (
                  <div key={i} className="flex justify-between p-3 border-b">
                    <div>
                      <p className="font-semibold">{activity.name}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">قائمة الطلاب</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2">
                  <tr>
                    <th className="text-right py-3">الاسم</th>
                    <th className="text-right py-3">المستوى</th>
                    <th className="text-right py-3">التقدم</th>
                    <th className="text-right py-3">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'محمود علي', level: 'متقدم', progress: 85 },
                    { name: 'فريدة أحمد', level: 'متوسط', progress: 60 }
                  ].map((student, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-3">{student.name}</td>
                      <td className="py-3">{student.level}</td>
                      <td className="py-3">
                        <div className="w-32 bg-gray-200 rounded h-2">
                          <div className="bg-emerald-600 h-2 rounded" style={{width: `${student.progress}%`}}></div>
                        </div>
                      </td>
                      <td className="py-3">
                        <button className="text-emerald-600 hover:underline">عرض</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">الدورات</h3>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 mb-6">
              + إضافة دورة جديدة
            </button>
            <div className="space-y-4">
              {['دورة الحفظ المتقدم', 'دورة التجويد الأساسية'].map((course, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <h4 className="font-bold text-emerald-900">{course}</h4>
                  <p className="text-sm text-gray-600 mt-2">15 طالب نشط</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">الرسائل</h3>
            <p className="text-gray-600">لا توجد رسائل جديدة</p>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">جدول الدروس</h3>
            <p className="text-gray-600">لا توجد دروس مجدولة</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">الإعدادات</h3>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">تحرير الملف الشخصي</button>
          </div>
        )}
      </main>
    </div>
  );
};
