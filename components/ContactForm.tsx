import React, { useState } from 'react';
import { TextInput } from './TextInput';
import { addContactMessage } from '../services/supabaseClient';

interface Props {
  onSubmit?: (data: { name: string; email: string; message: string }) => void;
}

export const ContactForm: React.FC<Props> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: { [k: string]: string } = {};
    if (name.trim().length < 2) e.name = 'اكتب اسم صحيح.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'ايميل غير صالح.';
    if (message.trim().length < 6) e.message = 'الرسالة قصيرة جداً.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Save to Supabase
      const { error } = await addContactMessage({ name, email, message });
      if (error) throw error;

      // Reset form
      setName(''); setEmail(''); setMessage(''); setErrors({});
      alert('تم الإرسال بنجاح');
      onSubmit?.({ name, email, message });
    } catch (err) {
      console.error(err);
      alert('فشل الإرسال. حاول لاحقاً');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-right">
      <TextInput label="الاسم" name="name" value={name} onChange={setName} placeholder="اسمك الكامل" error={errors.name} />
      <TextInput label="الإيميل" name="email" value={email} onChange={setEmail} type="email" placeholder="name@example.com" error={errors.email} />
      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-bold mb-1 text-right">الرسالة</label>
        <textarea id="message" name="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="اكتب رسالتك..." className="w-full p-3 rounded-lg border border-slate-200 min-h-[120px] resize-vertical" />
        {errors.message && <div className="mt-1 text-xs text-rose-600 text-right">{errors.message}</div>}
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className="btn-responsive bg-emerald-600 text-white rounded-2xl disabled:opacity-60">
          {submitting ? 'جارٍ الإرسال...' : 'أرسل'}
        </button>
      </div>
    </form>
  );
};
