'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';

export function AuthHeader({ badge = 'Akses Aman' }: { badge?: string }) {
  return (
    <header className="bg-[#F9F7F2] border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif text-[#8D4F38] tracking-tight">
          Esscentia
        </Link>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
          <Lock size={14} strokeWidth={1.5} />
          {badge}
        </div>
      </div>
    </header>
  );
}

export function AuthFooter() {
  return (
    <footer className="bg-[#E8E6E1] text-[#4A3728] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-center text-xs text-stone-500 tracking-wide">
          © 2026 Esscentia. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export function AuthUnderlineField({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-transparent border-0 border-b border-stone-300 py-2.5 text-[#4A3728] text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#8D4F38] transition-colors"
      />
    </div>
  );
}

export function AuthImagePanel({
  image,
  quote,
}: {
  image: string;
  quote?: string;
}) {
  return (
    <div className="hidden lg:flex relative bg-stone-900 overflow-hidden min-h-full">
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#4A3728]/80 via-transparent to-transparent" />
      {quote && (
        <blockquote className="relative z-10 mt-auto p-12 text-[#F9F7F2]">
          <p className="font-serif text-2xl leading-relaxed italic mb-4">{quote}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-300">Esscentia</p>
        </blockquote>
      )}
    </div>
  );
}
