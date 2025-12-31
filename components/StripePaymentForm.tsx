import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  teacherId: string;
  studentId: string;
  lessonId?: string;
  onSuccess?: () => void;
}

export const StripePaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  teacherId,
  studentId,
  lessonId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData({ ...formData, cardNumber: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setFormData({ ...formData, cardExpiry: formatted });
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData({ ...formData, cardCvc: value });
  };

  const validateForm = () => {
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      setError('رقم البطاقة غير صحيح (16 رقم مطلوب)');
      return false;
    }
    if (!formData.cardName.trim()) {
      setError('اسم حامل البطاقة مطلوب');
      return false;
    }
    if (!formData.cardExpiry.match(/^\d{2}\/\d{2}$/)) {
      setError('تاريخ انتهاء الصلاحية غير صحيح (MM/YY)');
      return false;
    }
    if (!formData.cardCvc.match(/^\d{3,4}$/)) {
      setError('رمز CVV غير صحيح (3-4 أرقام)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // في تطبيق حقيقي، ستكون هناك اتصال بـ Stripe backend
      // للآن، نحاكي معالجة الدفع
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // محاكاة نجاح الدفع 95% من الوقت
      if (Math.random() > 0.05) {
        setSuccess(true);
        setFormData({ cardNumber: '', cardName: '', cardExpiry: '', cardCvc: '' });
        onSuccess?.();

        // إخفاء رسالة النجاح بعد 3 ثواني
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('فشل معالجة الدفع. يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      setError('خطأ في معالجة الدفع');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-3">
          <CheckCircle className="text-emerald-600" size={48} />
        </div>
        <h3 className="text-lg font-black text-emerald-700 mb-2">تم الدفع بنجاح</h3>
        <p className="text-emerald-600 mb-4">شكراً لك! تم تأكيد عملية الدفع</p>
        <p className="text-sm text-emerald-600">رسالة تأكيد ستُرسل إلى بريدك الإلكتروني</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center gap-2 pb-4 border-b-2 border-slate-100">
        <CreditCard className="text-emerald-600" size={24} />
        <h3 className="text-xl font-black">معلومات الدفع</h3>
      </div>

      {error && (
        <div className="flex gap-3 bg-rose-50 border-2 border-rose-200 text-rose-700 p-4 rounded-lg">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span className="font-bold">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* اسم حامل البطاقة */}
        <div>
          <label className="block text-sm font-bold mb-2">اسم حامل البطاقة</label>
          <input
            type="text"
            value={formData.cardName}
            onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
            placeholder="أحمد علي"
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none text-right"
            disabled={loading}
          />
        </div>

        {/* رقم البطاقة */}
        <div>
          <label className="block text-sm font-bold mb-2">رقم البطاقة</label>
          <input
            type="text"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="4242 4242 4242 4242"
            maxLength="19"
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none font-mono text-center"
            disabled={loading}
          />
          <p className="text-xs text-slate-500 mt-1">رقم اختباري: 4242 4242 4242 4242</p>
        </div>

        {/* تاريخ الانتهاء و CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">الصلاحية</label>
            <input
              type="text"
              value={formData.cardExpiry}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              maxLength="5"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none font-mono text-center"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">CVV</label>
            <input
              type="text"
              value={formData.cardCvc}
              onChange={handleCvcChange}
              placeholder="123"
              maxLength="4"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none font-mono text-center"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* ملخص الدفع */}
      <div className="bg-slate-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between">
          <span className="font-bold">إجمالي المبلغ:</span>
          <span className="text-lg font-black text-emerald-600">{amount} ريال</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Lock size={16} />
          <span>دفع آمن 100%</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-black text-white flex items-center justify-center gap-2 ${
          loading
            ? 'bg-slate-400 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
        }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            جاري معالجة الدفع...
          </>
        ) : (
          <>
            <Lock size={20} />
            دفع {amount} ريال
          </>
        )}
      </button>

      <p className="text-xs text-slate-500 text-center">
        بالضغط على الدفع، أوافق على شروط الخدمة وسياسة الخصوصية
      </p>
    </form>
  );
};

// مكون Stripe Info
export const StripeInfo = () => {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-sm text-blue-700">
      <p className="font-bold mb-2">ملاحظة تطويرية:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>هذا النموذج محاكاة كاملة لعملية الدفع</li>
        <li>لتفعيل Stripe الحقيقي، ستحتاج إلى:
          <ul className="list-circle list-inside ml-4 mt-1">
            <li>حساب Stripe (stripe.com)</li>
            <li>مفتاح API من Stripe</li>
            <li>Backend endpoint لمعالجة Intents</li>
            <li>مكتبة @stripe/react-stripe-js</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
