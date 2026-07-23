export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-coral-500">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-ink/70">{description}</p>}
      <span className="mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-coral-500 to-amber-400" />
    </div>
  );
}
