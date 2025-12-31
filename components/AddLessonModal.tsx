import React, { useState } from 'react';
import { Play, X, Calendar, Clock, Link as LinkIcon } from 'lucide-react';

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LessonData) => void;
  courseTitle?: string;
}

export interface LessonData {
  title: string;
  description: string;
  videoUrl?: string;
  duration: number;
  content: string;
  date: string;
  order: number;
}

export const AddLessonModal: React.FC<AddLessonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  courseTitle = 'الكورس',
}) => {
  const [formData, setFormData] = useState<LessonData>({
    title: '',
    description: '',
    videoUrl: '',
    duration: 45,
    content: '',
    date: new Date().toISOString().split('T')[0],
    order: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['duration', 'order'].includes(name) ? Number(value) : value,
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
        videoUrl: '',
        duration: 45,
        content: '',
        date: new Date().toISOString().split('T')[0],
        order: 1,
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
            <Play size={24} className="text-emerald-600" />
            إضافة درس إلى {courseTitle}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* عنوان الدرس */}
          <div>
            <label className="block text-sm font-bold mb-2">عنوان الدرس</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثال: مقدمة في التجويد"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none text-right"
              required
              disabled={loading}
            />
          </div>

          {/* وصف الدرس */}
          <div>
            <label className="block text-sm font-bold mb-2">وصف الدرس</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="اكتب وصفاً قصيراً للدرس..."
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none resize-none text-right"
              rows={3}
              disabled={loading}
            />
          </div>

          {/* محتوى الدرس */}
          <div>
            <label className="block text-sm font-bold mb-2">محتوى الدرس</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="اكتب محتوى الدرس بالتفصيل..."
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none resize-none text-right"
              rows={5}
              required
              disabled={loading}
            />
          </div>

          {/* رابط الفيديو */}
          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
              <LinkIcon size={16} />
              رابط الفيديو (اختياري)
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none text-right"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* رقم ترتيب الدرس */}
            <div>
              <label className="block text-sm font-bold mb-2">ترتيب الدرس</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
                required
                disabled={loading}
              />
            </div>

            {/* مدة الدرس */}
            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                <Clock size={16} />
                المدة (دقيقة)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="5"
                max="300"
                step="5"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
                required
                disabled={loading}
              />
            </div>

            {/* التاريخ */}
            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                <Calendar size={16} />
                التاريخ
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
                required
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
                  جاري الإضافة...
                </>
              ) : (
                'إضافة الدرس'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
