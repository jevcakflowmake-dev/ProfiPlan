'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Účet vytvořen. Můžeš se přihlásit.')
    router.replace('/login')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="font-display text-xl font-semibold text-ink">Registrace</h1>

      <div>
        <label className="label">Jméno a příjmení</label>
        <input
          required
          className="input"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div>
        <label className="label">E-mail</label>
        <input
          type="email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div>
        <label className="label">Heslo</label>
        <input
          type="password"
          required
          minLength={8}
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <p className="text-xs text-muted mt-1">Minimálně 8 znaků.</p>
      </div>

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Vytvářím účet…' : 'Vytvořit účet'}
      </button>

      <p className="text-center text-sm text-muted">
        Už máš účet?{' '}
        <Link href="/login" className="text-accent font-medium">
          Přihlas se
        </Link>
      </p>
    </form>
  )
}
