'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { setPlanStatus } from '../actions'

export default function ReviewActions({
  planId,
  allVerified,
  status,
}: {
  planId: string
  allVerified: boolean
  status: 'draft' | 'review' | 'complete'
}) {
  const router = useRouter()

  async function complete() {
    const res = await setPlanStatus(planId, 'complete')
    if (res.error) toast.error(res.error)
    else {
      toast.success('Plán označen jako dokončený')
      router.refresh()
    }
  }

  return (
    <div className="card p-6 space-y-4">
      <h2 className="font-display text-lg font-semibold text-ink">Export</h2>
      <p className="text-sm text-muted">
        Po doublechecku můžeš plán prezentovat klientovi nebo exportovat do PDF.
      </p>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/plans/${planId}/presentation`}
          className={allVerified ? 'btn-primary' : 'btn-secondary pointer-events-none opacity-50'}
        >
          🎞 Animovaná prezentace
        </Link>
        <Link
          href={`/plans/${planId}/export`}
          className={allVerified ? 'btn-secondary' : 'btn-secondary pointer-events-none opacity-50'}
        >
          📄 Exportovat PDF
        </Link>
        {allVerified && status !== 'complete' && (
          <button onClick={complete} className="btn-ghost text-success ml-auto">
            Označit jako dokončený
          </button>
        )}
      </div>
    </div>
  )
}
