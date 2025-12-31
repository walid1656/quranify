# 💳 تفعيل Stripe - دليل مفصل

## 📋 المقدمة

الحالية المكون `StripePaymentForm.tsx` يحتوي على **محاكاة دفع كاملة**.

هذا الدليل يشرح كيفية تفعيل **Stripe الحقيقي** للمدفوعات الفعلية.

---

## 🔑 الخطوة 1: إنشاء حساب Stripe

### 1.1 افتح موقع Stripe

```
https://stripe.com
```

### 1.2 اضغط "Sign Up" أو "Get Started"

### 1.3 ملء البيانات:

```
- البريد الإلكتروني: your-email@example.com
- كلمة المرور: قوية جداً
- البلد: Saudi Arabia 🇸🇦
- نوع الحساب: Platform or Marketplace
```

### 1.4 أكمل التحقق من البريد

---

## 🔐 الخطوة 2: الحصول على المفاتيح

### 2.1 انتقل إلى Stripe Dashboard

### 2.2 اضغط على "Developers" في الأعلى

### 2.3 اختر "API Keys"

### 2.4 انسخ المفاتيح:

```
Publishable Key:  pk_test_XXXXXXXXXXXXXXXX
Secret Key:       sk_test_XXXXXXXXXXXXXXXX

(هناك نسخة test لـ التطوير)
(وهناك نسخة live للإنتاج)
```

### ⚠️ تنبيه أمان:

```
🔴 لا تشارك Secret Key مع أحد
🟢 Publishable Key آمن للمشاركة
🟡 احفظ المفاتيح في مكان آمن
```

---

## 🛠️ الخطوة 3: التثبيت والإعدادات

### 3.1 ثبت مكتبات Stripe

```bash
npm install @stripe/react-stripe-js @stripe/stripe-js
```

### 3.2 أضف المفاتيح إلى `.env.local`

```env
# .env.local

# Test Keys (للتطوير)
VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXXXXX
VITE_STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXX

# سيتم تغييرها إلى Live Keys عند الإنتاج
```

### 3.3 تحديث `vite-env.d.ts`

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GOOGLE_GENAI_KEY: string
  readonly VITE_STRIPE_PUBLIC_KEY: string        // ← جديد
  readonly VITE_STRIPE_SECRET_KEY: string        // ← جديد
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 💻 الخطوة 4: تحديث StripePaymentForm.tsx

### 4.1 استيراد مكتبات Stripe

```typescript
// في أعلى الملف
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
```

### 4.2 كود جديد للمكون

```typescript
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, AlertCircle, CheckCircle, Lock } from 'lucide-react';

// تحميل Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// مكون الدفع الرئيسي
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

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInside 
        amount={amount}
        teacherId={teacherId}
        studentId={studentId}
        onSuccess={onSuccess}
      />
    </Elements>
  );
};

// مكون الداخلي (يستخدم Stripe hooks)
const PaymentFormInside: React.FC<PaymentFormProps> = ({
  amount,
  teacherId,
  studentId,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe غير محمل بعد');
      return;
    }

    setLoading(true);

    try {
      // 1. إنشاء Payment Intent من Backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // بالفلوس
          currency: 'sar',
          studentId,
          teacherId,
        }),
      });

      const { clientSecret } = await response.json();

      // 2. تأكيد الدفع
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            // بيانات إضافية
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSuccess(true);
        onSuccess?.();
        // حفظ البيانات في Supabase
        await fetch('/api/save-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stripe_payment_id: result.paymentIntent.id,
            amount,
            student_id: studentId,
            teacher_id: teacherId,
          }),
        });
      }
    } catch (err) {
      setError('خطأ في معالجة الدفع');
    } finally {
      setLoading(false);
    }
  };

  // الـ UI باقي نفسها
  if (success) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6 text-center">
        <CheckCircle className="text-emerald-600 mx-auto mb-3" size={48} />
        <h3 className="text-lg font-black text-emerald-700 mb-2">تم الدفع بنجاح</h3>
        <p className="text-emerald-600 mb-4">شكراً لك! تم تأكيد عملية الدفع</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-5">
      <div className="flex items-center gap-2 pb-4 border-b-2">
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
        <div>
          <label className="block text-sm font-bold mb-2">بيانات البطاقة</label>
          <div className="p-3 border border-slate-200 rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#1e293b',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

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
        disabled={loading || !stripe}
        className={`w-full py-3 rounded-lg font-black text-white flex items-center justify-center gap-2 ${
          loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
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
    </form>
  );
};
```

---

## 🔧 الخطوة 5: إنشاء Backend Endpoints

### 5.1 `api/create-payment-intent`

```javascript
// معالج Stripe الخادم (Node.js + Express)

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createPaymentIntent(req, res) {
  const { amount, currency, studentId, teacherId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // بالفلوس
      currency: currency,
      metadata: {
        studentId,
        teacherId,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

### 5.2 `api/save-payment`

```javascript
// حفظ بيانات الدفع في Supabase

import { supabase } from '../services/supabaseClient';

export async function savePayment(req, res) {
  const { stripe_payment_id, amount, student_id, teacher_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          stripe_payment_id,
          amount,
          student_id,
          teacher_id,
          status: 'completed',
          currency: 'SAR',
        },
      ]);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

---

## 🧪 الخطوة 6: الاختبار

### بيانات اختبار Stripe:

```
رقم البطاقة:     4242 4242 4242 4242
التاريخ:        12/25 (أي مستقبلي)
CVV:            123
اسم البطاقة:    أي اسم

البطاقات الأخرى:
❌ 4000 0000 0000 0002 - بطاقة مرفوضة
⚠️  4000 0025 0000 3155 - تحتاج تحقق إضافي
✅ 5555 5555 5555 4444 - Mastercard
```

### اختبر العملية:

1. افتح التطبيق
2. اذهب إلى الدفع
3. أدخل بيانات البطاقة
4. اضغط "دفع"
5. تحقق من النجاح
6. افتح Stripe Dashboard → Payments

---

## 🌐 الخطوة 7: الإنتاج

### عند الجاهزية للإنتاج:

```
1. اطلب live API keys من Stripe
2. استبدل Test Keys بـ Live Keys
3. احدّث .env.local
4. اختبر على الموقع الحي
5. راقب المدفوعات
```

### تحديث المفاتيح:

```env
# .env.local
VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXXXXXXXXXXXXX
VITE_STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXXXXX
```

---

## 🔔 Webhooks (اختياري لكن مهم)

### لتتبع أحداث الدفع:

```javascript
// Webhook Handler
import Stripe from 'stripe';

export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        // تحديث قاعدة البيانات
        console.log('Payment succeeded:', event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        // إرسال بريد للمستخدم
        console.log('Payment failed:', event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}
```

---

## 📊 الخطوة 8: المراقبة

### في Stripe Dashboard:

- ✅ شاهد المدفوعات في الوقت الفعلي
- ✅ تتبع الإحصائيات
- ✅ إدارة الاسترداد
- ✅ قراءة الفشل

### في Supabase:

```sql
-- شاهد جميع المدفوعات
SELECT * FROM payments ORDER BY created_at DESC;

-- إحصائيات المدفوعات
SELECT 
  DATE_TRUNC('day', created_at) as day,
  SUM(amount) as total,
  COUNT(*) as count
FROM payments
GROUP BY DATE_TRUNC('day', created_at);
```

---

## 🔒 الأمان

### نقاط أمان مهمة:

```
✅ لا تخزن بيانات البطاقة أبداً
✅ استخدم HTTPS فقط في الإنتاج
✅ احم المفاتيح السرية
✅ استخدم Payment Intents
✅ تحقق من Webhooks
✅ تطبيق 3D Secure
✅ مراقبة الغش
```

---

## ❓ الأسئلة الشائعة

### سؤال: ماذا لو فشل الدفع؟

```
الجواب:
- رسالة خطأ واضحة
- حفظ محاولة الدفع
- إعادة محاولة بسهولة
- دعم العملاء
```

### سؤال: كيف أستعيد الأموال؟

```
الجواب:
1. افتح Stripe Dashboard
2. اذهب إلى Payment
3. اضغط "Refund"
4. حدد المبلغ
5. أكّد
```

### سؤال: كيف أعرف الأرباح؟

```
الجواب:
1. في Stripe Dashboard
2. انظر إلى الأرصدة
3. انتظر التسويات (عادة 2-3 أيام)
4. انقل إلى حسابك البنكي
```

---

## 📚 مراجع إضافية

- [وثائق Stripe الرسمية](https://stripe.com/docs)
- [React Elements](https://stripe.com/docs/stripe-js/react)
- [Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Testing](https://stripe.com/docs/testing)

---

## ✅ قائمة التحقق

- [ ] حساب Stripe مفعل
- [ ] API Keys مُنسوخة
- [ ] مكتبات Stripe مثبتة
- [ ] `.env.local` محدث
- [ ] `StripePaymentForm.tsx` معدل
- [ ] Backend endpoints جاهزة
- [ ] اختبار مع بيانات اختبار
- [ ] Webhooks مُعده
- [ ] اختبار الإنتاج
- [ ] مراقبة مفعلة

---

**هذا يختم دليل تفعيل Stripe! 💳**

للأسئلة: راجع [وثائق Stripe](https://stripe.com/docs)
