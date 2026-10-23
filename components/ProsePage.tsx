export default function ProsePage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 sm:pt-14">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{title}</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-800">{children}</div>
    </article>
  );
}
