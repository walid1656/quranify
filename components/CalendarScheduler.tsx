import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, X } from 'lucide-react';
import { getLessonBookings, addLessonBooking, updateLessonBooking } from '../services/supabaseClient';

interface LessonBooking {
  id: string;
  teacher_id: string;
  student_id: string;
  scheduled_time: string;
  duration_minutes: number;
  status: string;
  lesson_link?: string;
  notes?: string;
}

interface Props {
  userId: string;
  userRole: 'teacher' | 'student';
  teachers?: any[];
}

export const CalendarScheduler: React.FC<Props> = ({ userId, userRole, teachers = [] }) => {
  const [bookings, setBookings] = useState<LessonBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    teacher_id: '',
    scheduled_time: '',
    duration_minutes: 60,
    notes: '',
  });

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await getLessonBookings(userId);
      if (!error && data) setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await addLessonBooking({
        teacher_id: formData.teacher_id || undefined,
        student_id: userRole === 'student' ? userId : undefined,
        scheduled_time: formData.scheduled_time,
        duration_minutes: formData.duration_minutes,
        notes: formData.notes,
        status: 'pending',
      });

      if (!error) {
        setFormData({ teacher_id: '', scheduled_time: '', duration_minutes: 60, notes: '' });
        setShowForm(false);
        fetchBookings();
        alert('تم حجز الدرس بنجاح');
      }
    } catch (err) {
      console.error('Error booking lesson:', err);
      alert('فشل حجز الدرس');
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await updateLessonBooking(bookingId, { status: newStatus });
      if (!error) {
        fetchBookings();
        alert('تم تحديث حالة الدرس');
      }
    } catch (err) {
      console.error('Error updating booking:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="text-emerald-600" size={24} />
          <h2 className="text-2xl font-black">جدول الدروس</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700"
        >
          <Plus size={20} />
          حجز درس
        </button>
      </div>

      {/* Booking Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black">حجز درس جديد</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {userRole === 'student' && (
            <div>
              <label className="block text-sm font-bold mb-2">اختر معلم</label>
              <select
                value={formData.teacher_id}
                onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
              >
                <option value="">-- اختر معلم --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2">التاريخ والوقت</label>
            <input
              type="datetime-local"
              value={formData.scheduled_time}
              onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">المدة (دقيقة)</label>
            <input
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
              min="30"
              max="180"
              step="30"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">ملاحظات</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="أضف أي ملاحظات..."
              className="w-full p-3 border border-slate-200 rounded-lg resize-none"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-black hover:bg-emerald-700"
          >
            حجز الآن
          </button>
        </form>
      )}

      {/* Bookings List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-slate-500 py-8">جاري التحميل...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-slate-500 py-8">لا توجد دروس محجوزة</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className={`p-4 rounded-lg border-2 ${getStatusColor(booking.status)}`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span className="font-bold">
                    {new Date(booking.scheduled_time).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span className="font-bold">
                    {new Date(booking.scheduled_time).toLocaleTimeString('ar-SA', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">المدة: {booking.duration_minutes} دقيقة</span>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-white bg-opacity-50">
                    {booking.status === 'pending' && 'قيد الانتظار'}
                    {booking.status === 'confirmed' && 'مؤكد'}
                    {booking.status === 'completed' && 'مكتمل'}
                    {booking.status === 'cancelled' && 'ملغى'}
                  </span>
                </div>
              </div>

              {booking.notes && <p className="text-sm mb-3">{booking.notes}</p>}

              {userRole === 'teacher' && booking.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(booking.id, 'confirmed')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded font-bold text-sm hover:bg-emerald-700"
                  >
                    تأكيد
                  </button>
                  <button
                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                    className="px-4 py-2 bg-rose-600 text-white rounded font-bold text-sm hover:bg-rose-700"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
