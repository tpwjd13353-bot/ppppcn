export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/30 py-24 md:py-32">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute left-0 top-0 h-full w-1 bg-primary/80" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="font-body-en text-xs uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </div>
        <h1 className="mt-6 font-heading text-5xl font-black leading-[1] tracking-tight md:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
