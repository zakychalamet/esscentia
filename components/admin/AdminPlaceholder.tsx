interface AdminPlaceholderProps {
  title: string;
  description?: string;
}

export function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">{title}</h1>
      <p className="text-slate-500 text-sm mt-2 leading-relaxed">
        {description ??
          'Modul ini akan terhubung dengan pipeline data dan engine analitik Esscentia.'}
      </p>
      <div className="mt-8 p-6 bg-white border border-slate-200/80 rounded-xl shadow-sm">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Status</p>
        <p className="text-sm text-slate-600">Coming soon — antarmuka sedang disiapkan.</p>
      </div>
    </div>
  );
}
