import React, { useState } from 'react';
import { User, Mail, Phone, BookOpen, Calendar, X } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProfileData) => void;
  initialData?: ProfileData;
}

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  specialization: string;
  joinedDate: string;
  avatar?: string;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {
    name: '',
    email: '',
    phone: '',
    bio: '',
    specialization: '',
    joinedDate: new Date().toISOString().split('T')[0],
  },
}) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
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
            <User size={24} className="text-emerald-600" />
            تعديل الملف الشخصي
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* الاسم */}
          <div>
            <label className="block text-sm font-bold mb-2">الاسم الكامل</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل اسمك"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none text-right"
              required
              disabled={loading}
            />
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
              <Mail size={16} />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none text-right"
              required
              disabled={loading}
            />
          </div>

          {/* الهاتف */}
          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
              <Phone size={16} />
              رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+966501234567"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none text-right"
              disabled={loading}
            />
          </div>

          {/* التخصص */}
          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
              <BookOpen size={16} />
              التخصص
            </label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
              disabled={loading}
            >
              <option value="">اختر التخصص</option>
              <option value="تجويد">تجويد</option>
              <option value="حفظ">حفظ</option>
              <option value="تفسير">تفسير</option>
              <option value="قراءات">قراءات</option>
              <option value="فقه">فقه</option>
            </select>
          </div>

          {/* النبذة الشخصية */}
          <div>
            <label className="block text-sm font-bold mb-2">النبذة الشخصية</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="اكتب نبذة عن نفسك..."
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none resize-none"
              rows={4}
              disabled={loading}
            />
          </div>

          {/* تاريخ الانضمام */}
          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
              <Calendar size={16} />
              تاريخ الانضمام
            </label>
            <input
              type="date"
              name="joinedDate"
              value={formData.joinedDate}
              onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
              disabled={loading}
            />
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
                  جاري الحفظ...
                </>
              ) : (
                'حفظ التغييرات'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
