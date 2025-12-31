import React, { useState } from 'react';
import { BookOpen, X, Zap, Users, Clock } from 'lucide-react';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CourseData) => void;
}

export interface CourseData {
  title: string;
  description: string;
  category: string;
  lessonsCount: number;
  price: number;
  duration: string;
  level: string;
  image?: string;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CourseData>({
    title: '',
    description: '',
    category: '',
    lessonsCount: 10,
    price: 99,
    duration: '4 أسابيع',
    level: 'مبتدئ',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'lessonsCount' || name === 'price' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        category: '',
        lessonsCount: 10,
        price: 99,
        duration: '4 أسابيع',
        level: 'مبتدئ',
      });
      onClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <BookOpen size={24} className="text-emerald-600" />
            إنشاء كورس جديد
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* عنوان الكورس */}
          <div>
            <label className="block text-sm font-bold mb-2">عنوان الكورس</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثال: تعلم التجويد من الصفر"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none text-right"
              required
              disabled={loading}
            />
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-sm font-bold mb-2">وصف الكورس</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="اكتب وصفاً مفصلاً للكورس..."
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none resize-none text-right"
              rows={4}
              required
              disabled={loading}
            />
          </div>

          {/* الفئة */}
          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
              <Zap size={16} />
              الفئة
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
              required
              disabled={loading}
            >
              <option value="">اختر فئة</option>
              <option value="تجويد">تجويد</option>
              <option value="حفظ">حفظ</option>
              <option value="تفسير">تفسير</option>
              <option value="قراءات">قراءات</option>
              <option value="فقه">فقه</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* المستوى */}
            <div>
              <label className="block text-sm font-bold mb-2">المستوى</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
                disabled={loading}
              >
                <option value="مبتدئ">مبتدئ</option>
                <option value="متوسط">متوسط</option>
                <option value="متقدم">متقدم</option>
              </select>
            </div>

            {/* السعر */}
            <div>
              <label className="block text-sm font-bold mb-2">السعر ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="10"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* عدد الدروس */}
            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                <Users size={16} />
                عدد الدروس
              </label>
              <input
                type="number"
                name="lessonsCount"
                value={formData.lessonsCount}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
                required
                disabled={loading}
              />
            </div>

            {/* المدة */}
            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                <Clock size={16} />
                المدة الزمنية
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="مثال: 4 أسابيع"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none text-right"
                disabled={loading}
              />
            </div>
          </div>

          {/* أزرار الإجراء */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-lg font-black hover:bg-slate-200 disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-black hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                'إنشاء الكورس'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
