import Link from 'next/link'

const MODULES = [
  { icon: '🛡', title: 'Zajištění příjmu', desc: 'Dva paralelní návrhy pojištění pro porovnání před klientem.' },
  { icon: '🏖', title: 'Zajištění na penzi', desc: 'Penzijní spoření, předpokládaná renta a věk odchodu.' },
  { icon: '🏠', title: 'Hypotéka & příprava', desc: 'Banky, sazby, LTV, splátkové kalendáře.' },
  { icon: '👶', title: 'Děti', desc: 'Investice pro děti + pojištění do dospělosti.' },
  { icon: '📈', title: 'Investice volných prostředků', desc: 'Investiční horizont, zhodnocení, cílová částka.' },
  { icon: '🎯', title: 'Spoření na přání', desc: 'Cílené spoření na konkrétní účel s časovým plánem.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary-light text-white">
      {/* Top bar */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="font-display text-xl font-bold">Profiplán</div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/80 hover:text-white">
            Přihlásit se
          </Link>
          <Link
            href="/register"
            className="text-sm bg-white text-primary px-4 py-1.5 rounded-lg font-medium hover:bg-white/90"
          >
            Zaregistrovat poradce
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 mb-6">
            <span className="w-8 h-px bg-white/40" />
            B2B nástroj pro finanční poradce
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">
            Finanční plán klienta
            <br />
            <span className="text-white/70">připravený za 10 minut.</span>
          </h1>
          <p className="text-lg text-white/80 mt-6 max-w-2xl leading-relaxed">
            Nahraj PDF modelace z pojišťoven, banky a investičních platforem. AI vytáhne klíčové
            parametry, ty zkontroluješ, a klientovi předáš animovanou prezentaci i tištěné PDF se
            shrnutím všech 9 oblastí jeho finančního života.
          </p>
          <div className="flex flex-wrap gap-3 mt-10">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition"
            >
              ▶ Spustit ukázku
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 ring-1 ring-white/40 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Vyzkoušet jako poradce →
            </Link>
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section className="bg-white text-ink py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
              Co plán pokrývá
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
              Devět modulů, jeden přehledný plán.
            </h2>
            <p className="text-muted mt-4">
              Každá oblast má vlastní šablonu polí, kterou AI vyplní z nahrané modelace. Poradce
              pouze ověří hodnoty a v jednom kliknutí spustí prezentaci pro klienta.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((m) => (
              <div
                key={m.title}
                className="card p-6 hover:border-accent transition"
              >
                <div className="text-3xl mb-3">{m.icon}</div>
                <h3 className="font-display text-lg font-semibold text-ink">{m.title}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-bg text-ink py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
              Pracovní postup
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
              Od modelace po prezentaci ve čtyřech krocích.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: '1', title: 'Založ klienta', desc: 'Jméno, věk, vyber moduly plánu.' },
              { n: '2', title: 'Nahraj PDF', desc: 'Drag & drop modelace z pojišťovny / banky.' },
              { n: '3', title: 'AI vytáhne data', desc: 'Claude Sonnet 4 extrahuje parametry.' },
              { n: '4', title: 'Doublecheck a prezentace', desc: 'Ověř hodnoty a klikni na prezentaci.' },
            ].map((step) => (
              <div key={step.n} className="card p-6">
                <div className="font-display text-4xl font-bold text-accent/30">{step.n}</div>
                <h3 className="font-display font-semibold text-ink mt-2">{step.title}</h3>
                <p className="text-sm text-muted mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Připraveno k ukázce.
          </h2>
          <p className="text-white/70 mt-4 text-lg">
            Spusť ukázkový plán bez registrace a podívej se, jak Profiplán vypadá v reálném použití.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition"
            >
              ▶ Spustit ukázku
            </Link>
            <Link
              href="/demo/presentation"
              className="inline-flex items-center gap-2 ring-1 ring-white/40 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              🎞 Animovaná prezentace
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-white/50 text-sm py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} Profiplán</div>
          <div className="flex gap-6">
            <Link href="/demo" className="hover:text-white">
              Ukázka
            </Link>
            <Link href="/login" className="hover:text-white">
              Přihlášení
            </Link>
            <Link href="/register" className="hover:text-white">
              Registrace
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
