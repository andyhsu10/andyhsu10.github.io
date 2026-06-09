export function Section({
  id,
  label,
  children,
}: {
  id?: string;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-3xl scroll-mt-20 px-6 py-12">
      {label && (
        <h2 className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-subtle">
          {label}
        </h2>
      )}
      {children}
    </section>
  );
}
