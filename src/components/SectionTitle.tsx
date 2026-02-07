type Props = {
  title: string
  subtitle?: string
  kicker?: string
}

export default function SectionTitle({ title, subtitle, kicker }: Props) {
  return (
    <div className="max-w-2xl">
      {kicker ? (
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark">
          {kicker}
        </p>
      ) : null}
      <h2 className="mt-2 text-3xl font-semibold text-accent md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-base text-accent/70">{subtitle}</p> : null}
    </div>
  )
}
