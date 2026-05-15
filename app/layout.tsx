import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Profiplán — finanční plány pro poradce',
  description: 'B2B nástroj pro tvorbu profesionálních finančních plánů.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
