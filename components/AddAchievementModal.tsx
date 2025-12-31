import React, { useState } from 'react';
import { Trophy, X, Zap, Users, Target } from 'lucide-react';

interface AddAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AchievementData) => void;
}

export interface AchievementData {
  name: string;
  description: string;
  icon: string;
  requirement: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const AddAchievementModal: React.FC<AddAchievementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<AchievementData>({
    name: '',
    description: '',
    icon: '🏆',
    requirement: '',
    points: 100,
    rarity: 'common',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'points' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        description: '',
        icon: '🏆',
        requirement: '',
        points: 100,
        rarity: 'common',
      });
      onClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const rarityColors: Record<string, string> = {
    common: 'bg-slate-50 border-slate-200 text-slate-700',
    rare: 'bg-blue-50 border-blue-200 text-blue-700',
    epic: 'bg-purple-50 border-purple-200 text-purple-700',
    legendary: 'bg-amber-50 border-amber-200 text-amber-700',
  };

  const rarityLabels: Record<string, string> = {
    common: 'عادي',
    rare: 'نادر',
    epic: 'إبيك',
    legendary: 'أسطوري',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Trophy size={24} className="text-emerald-600" />
            إضافة إنجاز جديد
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* اسم الإنجاز */}
          <div>
            <label className="block text-sm font-bold mb-2">اسم الإنجاز</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="مثال: حافظ القرآن الكريم"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none text-right"
              required
              disabled={loading}
            />
          </div>

          {/* وصف الإنجاز */}
          <div>
            <label className="block text-sm font-bold mb-2">وصف الإنجاز</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="اكتب وصفاً للإنجاز..."
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none resize-none text-right"
              rows={3}
              required
              disabled={loading}
            />
          </div>

          {/* الرمز */}
          <div>
            <label className="block text-sm font-bold mb-2">الرمز/الإيموجي</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="🏆"
              maxLength="2"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none text-center text-2xl"
              disabled={loading}
            />
            <p className="text-xs text-slate-500 mt-2 text-right">أمثلة: 🏆 🎯 ⭐ 🔥 📚 💡 👑</p>
          </div>

          {/* شرط الحصول */}
          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
              <Target size={16} />
              شرط الحصول على الإنجاز
            </label>
            <textarea
              name="requirement"
              value={formData.requirement}
              onChange={handleChange}
              placeholder="مثال: احفظ القرآن الكريم كاملاً"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none resize-none text-right"
              rows={2}
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* النقاط */}
            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                <Zap size={16} />
                النقاط
              </label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                min="10"
                max="1000"
                step="10"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
                required
                disabled={loading}
              />
            </div>

            {/* الندرة */}
            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                <Users size={16} />
                الندرة
              </label>
              <select
                name="rarity"
                value={formData.rarity}
                onChange={handleChange}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
                disabled={loading}
              >
                <option value="common">عادي</option>
                <option value="rare">نادر</option>
                <option value="epic">إبيك</option>
                <option value="legendary">أسطوري</option>
              </select>
            </div>
          </div>

          {/* معاينة */}
          <div className={`p-4 rounded-lg border-2 ${rarityColors[formData.rarity]}`}>
            <div className="text-center">
              <div className="text-5xl mb-2">{formData.icon}</div>
              <h3 className="font-black text-lg mb-1">{formData.name || 'الإنجاز'}</h3>
              <p className="text-sm opacity-75 mb-3">{formData.description || 'وصف الإنجاز'}</p>
              <div className="flex items-center justify-center gap-2 text-xs font-bold">
                <span>⚡ {formData.points} نقطة</span>
                <span>•</span>
                <span>{rarityLabels[formData.rarity]}</span>
              </div>
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
                'إضافة الإنجاز'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
