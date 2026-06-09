export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-chip text-chip-text inline-block rounded-md px-2 py-0.5 font-mono text-[11px]">
      {children}
    </span>
  );
}
