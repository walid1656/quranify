import React from 'react';

interface Props {
  label?: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (v: string) => void;
  error?: string | null;
}

export const TextInput: React.FC<Props> = ({ label, name, value, placeholder, type = 'text', onChange, error }) => {
  return (
    <div className="mb-4">
      {label && <label htmlFor={name} className="block text-sm font-bold mb-1 text-right">{label}</label>}
      <input id={name} name={name} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-200 outline-none`} />
      {error && <div className="mt-1 text-xs text-rose-600 text-right">{error}</div>}
    </div>
  );
};
