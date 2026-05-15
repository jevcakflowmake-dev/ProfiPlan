export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-light p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-display text-3xl font-bold text-white">Profiplán</div>
          <div className="text-white/70 text-sm mt-1">Finanční plány pro profesionální poradce</div>
        </div>
        <div className="card p-8">{children}</div>
      </div>
    </div>
  )
}
