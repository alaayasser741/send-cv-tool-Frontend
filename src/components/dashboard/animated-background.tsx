export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-[-12rem] top-[-10rem] size-80 rounded-full bg-[radial-gradient(circle,_rgba(14,165,233,0.24),_transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle,_rgba(245,158,11,0.18),_transparent_68%)]" />
      <div className="absolute right-[-8rem] top-[8rem] size-72 rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.22),_transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,_rgba(59,130,246,0.18),_transparent_70%)]" />
      <div className="grid-mask absolute inset-0 opacity-55 dark:opacity-35" />
    </div>
  );
}
