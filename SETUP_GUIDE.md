# تعليمات تطبيق الميزات المتقدمة

## الخطوة 1: تطبيق Schema قاعدة البيانات

### المتطلبات:
- ✅ حساب Supabase نشط
- ✅ Project متصل بـ Quranify
- ✅ صلاحيات Admin على قاعدة البيانات

### الخطوات:

#### 1.1 افتح Supabase Dashboard
```
https://app.supabase.com
```

#### 1.2 انتقل إلى SQL Editor
```
Supabase Dashboard → SQL Editor → New Query
```

#### 1.3 انسخ محتوى advanced-features.sql

الملف موجود في:
```
database/advanced-features.sql
```

انسخ كل محتوى الملف (60+ سطر)

#### 1.4 الصق الكود في SQL Editor

```sql
-- Tables for Advanced Features
-- 1. Reviews (التقييمات)
-- 2. Chat Messages (الرسائل)
-- 3. Lesson Bookings (حجوزات الدروس)
-- 4. Payments (المدفوعات)
```

#### 1.5 انقر على زر "Run" الأخضر

```
SQL Editor → [Code] → Run Button (أعلى يمين)
```

#### 1.6 تحقق من النجاح

يجب أن ترى رسالة:
```
✅ Query executed successfully
```

#### 1.7 التحقق من الجداول الجديدة

انتقل إلى:
```
Supabase Dashboard → Table Editor
```

يجب أن تظهر 4 جداول جديدة:
- ✅ reviews
- ✅ chat_messages
- ✅ lesson_bookings
- ✅ payments

---

## الخطوة 2: تفعيل Row Level Security (RLS)

### تحقق من أن RLS مفعل:

```
Table → RLS is ON ✅
```

إذا كان OFF:
```
1. اضغط على الجدول
2. الزر العلوي: "Enable RLS"
3. اضغط Enable
```

### الـ Policies المطلوبة:

كل جدول له 3-4 policies:

#### للـ reviews:
```sql
-- SELECT: Anyone can read
SELECT ✅

-- INSERT: Only authenticated users
INSERT ✅

-- UPDATE: Only author can update
UPDATE ✅

-- DELETE: Only admin can delete
DELETE ✅
```

#### للـ chat_messages:
```sql
-- SELECT: Only sender/receiver can read
SELECT ✅

-- INSERT: Only authenticated users
INSERT ✅

-- UPDATE: Only author can mark as read
UPDATE ✅

-- DELETE: Only author can delete
DELETE ✅
```

#### للـ lesson_bookings:
```sql
-- SELECT: Only teacher/student can read
SELECT ✅

-- INSERT: Only authenticated students
INSERT ✅

-- UPDATE: Teacher can confirm/cancel
UPDATE ✅

-- DELETE: Admin only
DELETE ✅
```

#### للـ payments:
```sql
-- SELECT: Only student can read own
SELECT ✅

-- INSERT: Only authenticated students
INSERT ✅

-- UPDATE: Student can cancel pending
UPDATE ✅

-- DELETE: Admin only
DELETE ✅
```

---

## الخطوة 3: التحقق من الاتصال

### فتح التطبيق:

```
http://localhost:3001
```

### اختبر كل ميزة:

#### التقييمات:
```
1. استكشف المعلمين
2. اضغط على اسم معلم
3. يجب أن يفتح modal بالتقييمات
4. أضف تقييم جديد ✅
```

#### المحادثات:
```
1. المحادثات (في الـ sidebar)
2. اختر معلم
3. اكتب رسالة
4. اضغط إرسال ✅
```

#### حجز الدروس:
```
1. حجز الدروس (في الـ sidebar)
2. اضغط "حجز درس"
3. اختر معلم وأوقات
4. اضغط "حجز الآن" ✅
```

#### الدفع:
```
1. الدفع (في الـ sidebar)
2. رقم البطاقة: 4242 4242 4242 4242
3. التاريخ: 12/25
4. CVV: 123
5. اضغط "دفع" ✅
```

---

## الخطوة 4: اختبار قاعدة البيانات

### فتح Supabase Debug Panel

الزر في أسفل يسار الشاشة:
```
[🐛] Debug Panel
```

### يجب أن يظهر:
```
✅ 3 Teachers
✅ 4 Students
✅ 4 Courses
```

### إضافة بيانات اختبار:

```sql
-- أضف تقييم اختباري
INSERT INTO reviews (teacher_id, student_id, rating, comment)
VALUES (
  'teacher-id-here',
  'student-id-here',
  5,
  'معلم ممتاز جداً'
);

-- أضف رسالة اختبار
INSERT INTO chat_messages (sender_id, receiver_id, message)
VALUES (
  'student-id-here',
  'teacher-id-here',
  'مرحباً، كيف حالك؟'
);

-- أضف حجز اختباري
INSERT INTO lesson_bookings (teacher_id, student_id, scheduled_time, duration_minutes)
VALUES (
  'teacher-id-here',
  'student-id-here',
  NOW() + INTERVAL '1 day',
  60
);
```

---

## الخطوة 5: إعدادات البيئة (اختياري)

### إذا أردت إضافة Stripe الحقيقي:

#### 1. أنشئ حساب Stripe:
```
https://stripe.com
```

#### 2. احصل على المفاتيح:
```
Dashboard → API Keys
- Publishable Key: pk_test_...
- Secret Key: sk_test_...
```

#### 3. أضف إلى `.env.local`:
```
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxx
VITE_STRIPE_SECRET_KEY=sk_test_xxxxxxxx
```

#### 4. ثبت مكتبات Stripe:
```bash
npm install @stripe/react-stripe-js @stripe/stripe-js
```

#### 5. حدث `StripePaymentForm.tsx`:
```tsx
// استيراد
import { loadStripe } from '@stripe/stripe-js';

// استخدام
const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
```

---

## استكشاف الأخطاء

### المشكلة: جداول لم تظهر بعد التشغيل

**الحل:**
1. تحديث الصفحة: `F5`
2. تحديث Supabase Dashboard
3. اتأكد من عدم وجود أخطاء في Console (`F12`)

### المشكلة: RLS Errors

**الحل:**
```
1. تأكد من أن المستخدم مسجل الدخول
2. تحقق من auth.uid() في الـ policies
3. اختبر الـ policy مع "SELECT" بسيط أولاً
```

### المشكلة: لا تظهر البيانات

**الحل:**
```
1. تحقق من RLS is ON
2. تحقق من الـ SELECT policy
3. جرب بدون RLS أولاً (Testing فقط!)
4. تحقق من الـ user_id في الجدول
```

### المشكلة: Real-time لا يعمل

**الحل:**
```
1. تحقق من أن Realtime مفعل في Supabase
2. تأكد من أن الـ policy تسمح بـ SELECT
3. أعد تحديث الصفحة
4. افتح Browser Console (`F12`)
```

---

## الخطوات التالية

### بعد التطبيق الناجح:

- [ ] اختبر كل ميزة
- [ ] تحقق من البيانات في Supabase
- [ ] اختبر Policies مع مستخدمين مختلفين
- [ ] أضف بيانات حقيقية
- [ ] اختبر الأمان (حاول إساءة الاستخدام)
- [ ] الإنتاج! 🚀

### للإنتاج:

1. **تفعيل Stripe الحقيقي**
   - استخدم Production Keys بدلاً من Test

2. **إرسال البريد الإلكتروني**
   - أضف SendGrid أو Gmail

3. **النسخ الاحتياطي**
   - فعّل Auto Backup في Supabase

4. **المراقبة**
   - استخدم Google Analytics

5. **الأمان**
   - فعّل HTTPS
   - استخدم WAF (Web Application Firewall)
   - قم بـ Security Audit

---

## الملفات المتعلقة

```
📁 database/
  └── advanced-features.sql        (Schema الجديد)
     
📁 components/
  ├── RatingReview.tsx            (التقييمات)
  ├── ChatBox.tsx                 (المحادثات)
  ├── CalendarScheduler.tsx       (جدول الدروس)
  └── StripePaymentForm.tsx       (الدفع)

📄 ADVANCED_FEATURES.md            (التوثيق الرئيسي)
📄 SETUP_GUIDE.md                  (هذا الملف)
```

---

**تم إنشاؤه**: 2024
**الإصدار**: 2.0.0
**الحالة**: ✅ جاهز
