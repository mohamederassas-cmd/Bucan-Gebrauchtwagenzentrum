/** Dunkles Kopfband für Unterseiten – dieselbe Bühne wie der Hero, nur kompakt. */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative bg-graphite-950 text-ivory-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_80%_20%,rgba(194,160,87,0.14),transparent_65%)]" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-12 sm:pb-16">
        {eyebrow && <p className="eyebrow eyebrow-dark eyebrow-left">{eyebrow}</p>}
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.02]">{title}</h1>
        {subtitle && <p className="mt-4 text-ivory-50/65 text-base sm:text-lg max-w-2xl">{subtitle}</p>}
        {children}
      </div>
      <div className="hairline" aria-hidden="true" />
    </div>
  );
}
