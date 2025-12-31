import React, { useState } from 'react';
import { Search, X, Filter, MapPin, Star, Clock } from 'lucide-react';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  keyword: string;
  category: string;
  minRating: number;
  maxPrice: number;
  minPrice: number;
  level: string;
  availability: string;
  sortBy: string;
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    category: '',
    minRating: 0,
    maxPrice: 100,
    minPrice: 0,
    level: '',
    availability: '',
    sortBy: 'rating',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: ['minRating', 'maxPrice', 'minPrice'].includes(name) ? Number(value) : value,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      category: '',
      minRating: 0,
      maxPrice: 100,
      minPrice: 0,
      level: '',
      availability: '',
      sortBy: 'rating',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Filter size={24} className="text-emerald-600" />
            بحث متقدم
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSearch} className="p-6 space-y-6">
          {/* كلمة البحث */}
          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
              <Search size={16} />
              كلمة البحث
            </label>
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="ابحث عن معلم أو كورس..."
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none text-right"
            />
          </div>

          {/* الفئة */}
          <div>
            <label className="block text-sm font-bold mb-2">الفئة</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
            >
              <option value="">الكل</option>
              <option value="تجويد">تجويد</option>
              <option value="حفظ">حفظ</option>
              <option value="تفسير">تفسير</option>
              <option value="قراءات">قراءات</option>
              <option value="فقه">فقه</option>
            </select>
          </div>

          {/* المستوى */}
          <div>
            <label className="block text-sm font-bold mb-2">المستوى</label>
            <select
              name="level"
              value={filters.level}
              onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
            >
              <option value="">الكل</option>
              <option value="مبتدئ">مبتدئ</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم">متقدم</option>
            </select>
          </div>

          {/* نطاق السعر */}
          <div>
            <label className="block text-sm font-bold mb-4">نطاق السعر</label>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">الحد الأدنى</label>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">الحد الأقصى</label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    min="0"
                    max="1000"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <span>${filters.minPrice}</span>
                <div className="flex-1 h-2 bg-gradient-to-r from-emerald-300 to-emerald-600 rounded-full" />
                <span>${filters.maxPrice}</span>
              </div>
            </div>
          </div>

          {/* الحد الأدنى للتقييم */}
          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
              <Star size={16} />
              الحد الأدنى للتقييم
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="minRating"
                value={filters.minRating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.5"
                className="flex-1 accent-emerald-600"
              />
              <span className="font-black text-lg text-emerald-600 w-12">{filters.minRating.toFixed(1)}</span>
            </div>
          </div>

          {/* التوفر */}
          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
              <Clock size={16} />
              التوفر
            </label>
            <select
              name="availability"
              value={filters.availability}
              onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
            >
              <option value="">الكل</option>
              <option value="available">متاح الآن</option>
              <option value="busy">مشغول</option>
              <option value="scheduling">يقبل الحجز</option>
            </select>
          </div>

          {/* الترتيب */}
          <div>
            <label className="block text-sm font-bold mb-2">رتب النتائج حسب</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none"
            >
              <option value="rating">التقييم (الأفضل أولاً)</option>
              <option value="price-low">السعر (الأقل أولاً)</option>
              <option value="price-high">السعر (الأعلى أولاً)</option>
              <option value="newest">الأحدث أولاً</option>
              <option value="students">عدد الطلاب (الأكثر أولاً)</option>
            </select>
          </div>

          {/* أزرار الإجراء */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-lg font-black hover:bg-slate-200"
            >
              إعادة تعيين
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-slate-200 text-slate-600 rounded-lg font-black hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-black hover:bg-emerald-700 flex items-center justify-center gap-2"
            >
              <Search size={18} />
              بحث
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
