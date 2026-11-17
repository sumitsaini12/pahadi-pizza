import { MapPin, Phone, Clock, Navigation, Instagram } from 'lucide-react';
import { ADDRESS, PHONE_PRIMARY, PHONE_SECONDARY, OPENING_HOURS, INSTAGRAM_URL } from '../constants';
import { MAP_EMBED_URL, MAP_TITLE } from '../content';
import Reveal from './motion/Reveal';

const tel = (n: string) => `tel:${n.replace(/\s/g, '')}`;

export default function Contact() {
  return (
    <section id="location" className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div aria-hidden className="absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(63,107,58,0.18),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-tomato">Find Us</p>
            <h2 className="font-display text-4xl font-semibold leading-[1.05] text-ink md:text-6xl">
              Our <span className="italic text-basil">Location</span>
            </h2>
          </Reveal>

          <div className="mt-10 space-y-4">
            <Reveal delay={0.05}>
              <div className="flex gap-5 rounded-3xl border border-bark/10 bg-white/70 p-5 md:p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-tomato text-white">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">Address</h3>
                  <p className="mt-1 leading-relaxed text-muted">{ADDRESS}</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex gap-5 rounded-3xl border border-bark/10 bg-white/70 p-5 md:p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-basil text-white">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">Call for Delivery</h3>
                  <p className="mt-1 flex flex-col leading-relaxed text-muted">
                    <a href={tel(PHONE_PRIMARY)} className="font-semibold transition hover:text-tomato">{PHONE_PRIMARY}</a>
                    <a href={tel(PHONE_SECONDARY)} className="font-semibold transition hover:text-tomato">{PHONE_SECONDARY}</a>
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="flex gap-5 rounded-3xl border border-bark/10 bg-white/70 p-5 md:p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold text-espresso">
                  <Clock className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">Opening Hours</h3>
                  <p className="mt-1 leading-relaxed text-muted">{OPENING_HOURS}</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#7b2fbf] via-[#c13584] to-[#e1306c] px-7 py-4 font-bold text-white shadow-lg shadow-[#c13584]/25 transition hover:-translate-y-0.5"
            >
              <Instagram className="h-5 w-5" aria-hidden />
              Follow on Instagram
            </a>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(ADDRESS)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-espresso px-7 py-4 font-bold text-cream transition hover:-translate-y-0.5 hover:bg-bark"
            >
              <Navigation className="h-5 w-5" aria-hidden />
              Get Directions
            </a>
          </Reveal>
        </div>

        <Reveal y={50} className="relative min-h-[420px] lg:min-h-full">
          <div aria-hidden className="absolute -inset-3 rotate-[1.5deg] rounded-[2.75rem] bg-gradient-to-br from-gold/40 via-tomato/20 to-basil/30" />
          <div className="relative h-[420px] overflow-hidden rounded-[2.5rem] border-4 border-cream shadow-[0_40px_80px_-30px_rgba(42,28,19,0.6)] lg:h-full">
            <iframe
              src={MAP_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={MAP_TITLE}
              className="h-full w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
