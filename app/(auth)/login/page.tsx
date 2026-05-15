import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Načítám…</div>}>
      <LoginForm />
    </Suspense>
  )
}
