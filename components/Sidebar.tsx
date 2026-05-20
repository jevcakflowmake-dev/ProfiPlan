'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const NAV = [
  { href: '/dashboard', label: 'Přehled', icon: '◐' },
  { href: '/clients', label: 'Klienti', icon: '◯' },
  { href: '/plans/new', label: 'Nový plán', icon: '＋' },
]

export default function Sidebar({ advisorName }: { advisorName: string }) {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-primary text-white">
      <div className="px-6 py-6">
        <div className="font-display text-2xl font-bold">Profiplán</div>
        <div className="text-xs text-white/60 mt-0.5">B2B finanční nástroj</div>
      </div>
      <nav className="flex-1 px-3">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition mb-1',
                active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
              )}
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-white/10 text-xs">
        <div className="font-medium">{advisorName}</div>
        <form action="/api/auth/signout" method="post">
          <button type="submit" className="text-white/60 hover:text-white mt-1 underline">
            Odhlásit
          </button>
        </form>
      </div>
    </aside>
  )
}
