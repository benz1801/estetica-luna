import { Instagram, Facebook, Send } from 'lucide-react';

const socials = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/_estetica.luna/' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Send, label: 'Telegram', href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative mt-12 border-t border-ink-900/5 bg-botanical-900 text-cream-100">
      <div className="container-luxe grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-cream-50/10 text-cream-50">
              <img src={`${import.meta.env.BASE_URL}luna.svg`} alt="Logo Estetica Luna" className="h-8 w-8 rotate-45 object-contain" />
            </span>
            <span className="font-display text-xl text-cream-50">Estetica Luna</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-100/70">
            Un piccolo santuario di bellezza in quel di Ponticino. Trattamenti su misura,
            cosmetici biologici e gesti che ritmano la settimana.
          </p>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest2 text-bronze-400">
            Esplora
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li><a href="#servizi" className="text-cream-100/85 hover:text-cream-50">Servizi</a></li>
            <li><a href="#chi-sono" className="text-cream-100/85 hover:text-cream-50">Chi Sono</a></li>
            <li><a href="#contatti" className="text-cream-100/85 hover:text-cream-50">Contatti</a></li>
            <li><a href="#" className="text-cream-100/85 hover:text-cream-50">Gift Card</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest2 text-bronze-400">
            Seguici
          </h3>
          <ul className="mt-5 flex gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-cream-50/15 text-cream-100 transition-all duration-300 hover:border-bronze-400 hover:text-bronze-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-cream-100/70">
            Via Nazionale 206 · 52019 Ponticino
            <br />
            3458889593 · ciao@esteticaluna.it
          </p>
        </div>
      </div>

      <div className="border-t border-cream-50/10">
        <div className="container-luxe flex flex-col items-center justify-between gap-3 py-6 text-xs text-cream-100/55 sm:flex-row">
          <p>© {new Date().getFullYear()} Estetica Luna · P.IVA 0123456789 · Tutti i diritti riservati.</p>
          <p className="flex gap-5">
            <a href="#" className="hover:text-cream-50">Privacy</a>
            <a href="#" className="hover:text-cream-50">Cookie</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
