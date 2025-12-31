import React, { useState } from 'react';
import { Users, BookOpen, BarChart3, Settings, LogOut, TrendingUp, AlertCircle } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const adminStats = [
    { label: 'إجمالي الطلاب', value: '2,450', icon: Users, color: 'bg-blue-100', trend: '+12%' },
    { label: 'إجمالي المعلمين', value: '125', icon: BookOpen, color: 'bg-emerald-100', trend: '+5%' },
    { label: 'الكورسات النشطة', value: '89', icon: BarChart3, color: 'bg-purple-100', trend: '+8%' },
    { label: 'الإيرادات الشهرية', value: '$45,200', icon: TrendingUp, color: 'bg-yellow-100', trend: '+23%' },
  ];

  const recentUsers = [
    { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', type: 'طالب', date: '2025-01-15', status: 'نشط' },
    { id: 2, name: 'الشيخ علي', email: 'teacher@example.com', type: 'معلم', date: '2025-01-14', status: 'نشط' },
    { id: 3, name: 'فاطمة سالم', email: 'fatima@example.com', type: 'طالبة', date: '2025-01-13', status: 'غير نشط' },
  ];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-purple-800 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black quran-font">لوحة الإدارة</h1>
          <button onClick={onLogout} className="flex items-center gap-2 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
            <LogOut size={20} /> تسجيل خروج
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          {[
            { id: 'overview', label: 'النظرة العامة', icon: BarChart3 },
            { id: 'users', label: 'المستخدمون', icon: Users },
            { id: 'courses', label: 'الكورسات', icon: BookOpen },
            { id: 'analytics', label: 'التحليلات', icon: TrendingUp },
            { id: 'settings', label: 'الإعدادات', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-4 font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-600 hover:text-slate-900'
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
            {/* Alert */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-yellow-600" size={20} />
              <p className="text-yellow-700"><strong>تنبيه:</strong> هناك 5 شكاوى من الطلاب بانتظار الرد</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              {adminStats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="text-slate-700" size={24} />
                    </div>
                    <span className="text-sm font-bold text-green-600">{stat.trend}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 quran-font">آخر المستخدمين المسجلين</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-right py-3 px-4 font-bold text-slate-700">الاسم</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-700">البريد الإلكتروني</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-700">النوع</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-700">التاريخ</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-700">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map(user => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4 font-semibold text-slate-900">{user.name}</td>
                        <td className="py-4 px-4 text-slate-600">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.type === 'معلم' || user.type === 'معلمة'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {user.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-600">{user.date}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.status === 'نشط'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* System Health */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 quran-font">صحة النظام</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-slate-700">استخدام الخادم</span>
                      <span className="text-slate-600">45%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-slate-700">سعة الذاكرة</span>
                      <span className="text-slate-600">62%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-slate-700">سعة التخزين</span>
                      <span className="text-slate-600">78%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-red-500 h-3 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 quran-font">آخر الأنشطة</h2>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">✓ تسجيل 3 طلاب جدد - منذ ساعة</p>
                  <p className="text-sm text-slate-600">✓ إنشاء كورس جديد - منذ ساعتين</p>
                  <p className="text-sm text-slate-600">✓ تأكيد معلم جديد - منذ 5 ساعات</p>
                  <p className="text-sm text-slate-600">✓ معالجة دفعة جديدة - منذ يوم</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 quran-font">إدارة المستخدمين</h2>
              <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors">
                إضافة مستخدم
              </button>
            </div>
            <p className="text-slate-600 mb-4">إجمالي المستخدمين: 2,575</p>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 quran-font">إدارة الكورسات</h2>
              <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors">
                إضافة كورس
              </button>
            </div>
            <p className="text-slate-600 mb-4">إجمالي الكورسات: 89</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 quran-font">التحليلات المتقدمة</h2>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-12 rounded-lg text-center">
              <p className="text-slate-700 font-semibold">سيتم تحديث التحليلات قريباً</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 quran-font">إعدادات النظام</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اسم المنصة</label>
                <input type="text" value="Quranify" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الحد الأدنى لرسوم الدرس</label>
                <input type="number" value="10" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">نسبة العمولة (%)</label>
                <input type="number" value="15" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
              </div>
              <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors">
                حفظ الإعدادات
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
