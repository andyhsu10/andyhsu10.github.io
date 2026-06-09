export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-md bg-chip px-2 py-0.5 font-mono text-[11px] text-chip-text">
      {children}
    </span>
  );
}
