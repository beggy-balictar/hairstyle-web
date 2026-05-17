interface SectionHeaderProps {
  title: string;
  description: string;
}

export function SectionHeader({ title, description }: Readonly<SectionHeaderProps>) {
  return (
    <div className="space-y-2 border-b border-slate-200/80 pb-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <p className="max-w-3xl text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}