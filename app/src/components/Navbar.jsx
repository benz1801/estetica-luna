import { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const links = [
  { href: '#servizi', label: 'Servizi' },
  { href: '#chi-sono', label: 'Chi Sono' },
  { href: '#contatti', label: 'Contatti' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-50/80 backdrop-blur-md shadow-ring'
          : 'bg-transparent'
      }`}
    >
      <div className="container-luxe flex h-20 items-center justify-between">
        <a href="#top" className="group flex items-center gap-3" aria-label="Estetica Luna home">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-botanical-900 text-cream-50">
            <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M26 4c-9 0-16 4-19 11-2 5-1 11 3 13 1-7 4-12 9-15-4 4-6 9-7 14 6 1 12-1 15-6 3-5 3-13-1-17Z"
              />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl text-ink-900">Estetica Luna</span>
            <span className="block text-[10px] uppercase tracking-widest2 text-ink-500">
              Santuario di bellezza
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Navigazione principale">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm text-ink-800 transition-colors hover:text-sage-700"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-sage-700 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a href="#contatti" className="btn-primary !py-2.5 !px-5 text-xs">
            Prenota <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-full border border-ink-900/10 bg-cream-50/70 text-ink-900 backdrop-blur md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden border-t border-ink-900/5 bg-cream-50/95 backdrop-blur transition-[max-height,opacity] duration-500 ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container-luxe flex flex-col gap-1 py-6" aria-label="Navigazione mobile">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-base text-ink-800 transition-colors hover:bg-sage-50"
            >
              <span className="font-display text-lg">{l.label}</span>
              <ArrowUpRight className="h-4 w-4 text-ink-500" />
            </a>
          ))}
          <a
            href="#contatti"
            onClick={() => setOpen(false)}
            className="btn-primary mt-3 justify-center"
          >
            Prenota un appuntamento
          </a>
        </nav>
      </div>
    </header>
  );
}
