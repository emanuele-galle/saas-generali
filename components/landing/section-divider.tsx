export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div
        className="h-px w-32 sm:w-48"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--theme-color, #c21d17), var(--generali-gold, #D4A537), var(--theme-color, #c21d17), transparent)",
        }}
      />
    </div>
  );
}
