import Link from 'next/link'

export default function ExportPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <Link href={`/plans/${params.id}/review`} className="text-sm text-muted hover:text-ink">
          ← Zpět na doublecheck
        </Link>
        <h1 className="font-display text-2xl font-semibold text-ink mt-2">PDF export</h1>
        <p className="text-sm text-muted mt-1">Stáhni si profesionální PDF verzi plánu pro klienta.</p>
      </header>

      <div className="card p-6">
        <a
          href={`/api/generate-pdf?planId=${params.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          📄 Stáhnout PDF
        </a>
        <p className="text-xs text-muted mt-3">
          PDF se otevře v novém okně. V prohlížeči použij „Uložit jako…".
        </p>
      </div>
    </div>
  )
}
