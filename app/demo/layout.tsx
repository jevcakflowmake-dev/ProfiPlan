import Link from 'next/link'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-bold text-primary">
            Profiplán <span className="text-muted font-normal text-sm">/ ukázka</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-warning font-medium">
              READ-ONLY UKÁZKA
            </span>
            <Link href="/register" className="text-accent font-medium hover:underline">
              Vyzkoušet naživo →
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
