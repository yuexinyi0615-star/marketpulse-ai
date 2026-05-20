type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-teal-700">{eyebrow}</p>
      <h2 className="text-2xl font-extrabold tracking-normal text-ink md:text-3xl">{title}</h2>
      {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p> : null}
    </div>
  );
}
