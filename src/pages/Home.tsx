import SitePage from '../components/SitePage'
import { useContent } from '../hooks/useContent'

export default function Home() {
  const { data, loading } = useContent()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-soft text-accent">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent/60">Loading</p>
      </div>
    )
  }

  return <SitePage content={data} />
}
