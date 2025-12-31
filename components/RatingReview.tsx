import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getReviews, addReview } from '../services/supabaseClient';

interface Review {
  id: string;
  teacher_id: string;
  student_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Props {
  teacherId: string;
  studentId?: string;
  canReview?: boolean;
}

export const RatingReview: React.FC<Props> = ({ teacherId, studentId, canReview = false }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [teacherId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await getReviews(teacherId);
      if (!error && data) setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !comment.trim()) return;
    setSubmitting(true);

    try {
      const { error } = await addReview({
        teacher_id: teacherId,
        student_id: studentId,
        rating,
        comment,
      });
      if (!error) {
        setComment('');
        setRating(5);
        fetchReviews();
        alert('تم إضافة التقييم بنجاح');
      }
    } catch (err) {
      console.error('Error adding review:', err);
      alert('فشل إضافة التقييم');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="space-y-6">
      {/* Average Rating */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-black text-amber-600">{avgRating}</div>
          <div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={20}
                  className={i <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                />
              ))}
            </div>
            <p className="text-sm text-slate-600 font-bold mt-2">
              {reviews.length} تقييم
            </p>
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      {canReview && studentId && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <h3 className="font-black text-lg">اترك تقييمك</h3>

          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-bold mb-3">التقييم</label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  className="transition-all"
                >
                  <Star
                    size={32}
                    className={i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-bold mb-2">التعليق</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب رأيك..."
              className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-emerald-200 outline-none"
              rows={3}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-black hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? 'جاري الإرسال...' : 'أرسل التقييم'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        <h3 className="font-black text-lg">التقييمات ({reviews.length})</h3>
        {loading ? (
          <p className="text-slate-500">جاري التحميل...</p>
        ) : reviews.length === 0 ? (
          <p className="text-slate-500 text-center py-6">لا توجد تقييمات بعد</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(review.created_at).toLocaleDateString('ar-SA')}
                </span>
              </div>
              <p className="text-sm text-slate-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
