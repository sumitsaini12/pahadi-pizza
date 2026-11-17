import { MapPin, Phone, Clock, Navigation, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { ADDRESS, PHONE_PRIMARY, PHONE_SECONDARY, OPENING_HOURS, INSTAGRAM_URL, YOUTUBE_URL } from '../constants';
import { MAP_EMBED_URL, MAP_TITLE, WHATSAPP_URL } from '../content';
import { DIRECTIONS_URL } from '../lib/links';
import Reveal from './motion/Reveal';
import LazyMap from './LazyMap';

const tel = (n: string) => `tel:${n.replace(/\s/g, '')}`;

export default function Contact() {
  return (
    <section id="location" className="cv-auto relative overflow-hidden bg-cream py-16 md:py-32">
      <div aria-hidden className="absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(63,107,58,0.18),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:gap-12 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-tomato">Find Us</p>
            <h2 className="font-display text-[2.15rem] font-semibold leading-[1.05] text-ink md:text-6xl">
              Our <span className="italic text-basil">Location</span>
            </h2>
          </Reveal>

          {/* Phones: the three things people come here for, one tap each. */}
          <div className="mt-6 grid grid-cols-3 gap-2 md:hidden">
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-2xl bg-espresso text-base font-bold text-cream transition active:scale-[0.97] active:bg-bark"
            >
              <Navigation className="h-5 w-5 text-gold" aria-hidden />
              Directions
            </a>
            <a
              href={tel(PHONE_PRIMARY)}
              aria-label={`Call ${PHONE_PRIMARY}`}
              className="flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-2xl bg-tomato text-base font-bold text-white transition active:scale-[0.97] active:bg-tomato-dark"
            >
              <Phone className="h-5 w-5" aria-hidden />
              Call
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-2xl bg-whatsapp text-base font-bold text-white transition active:scale-[0.97] active:brightness-90"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              WhatsApp
            </a>
          </div>

          <div className="mt-6 space-y-3 md:mt-10 md:space-y-4">
            <Reveal delay={0.05}>
              <div className="flex gap-4 rounded-3xl border border-bark/10 bg-white/70 p-4 md:gap-5 md:p-6">
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
              <div className="flex gap-4 rounded-3xl border border-bark/10 bg-white/70 p-4 md:gap-5 md:p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-basil text-white">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">Call for Delivery</h3>
                  <p className="mt-1 flex flex-col text-muted">
                    <a href={tel(PHONE_PRIMARY)} className="flex min-h-11 items-center font-semibold transition hover:text-tomato active:text-tomato">{PHONE_PRIMARY}</a>
                    <a href={tel(PHONE_SECONDARY)} className="flex min-h-11 items-center font-semibold transition hover:text-tomato active:text-tomato">{PHONE_SECONDARY}</a>
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="flex gap-4 rounded-3xl border border-bark/10 bg-white/70 p-4 md:gap-5 md:p-6">
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

          <Reveal delay={0.2} className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-8">
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
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#ff0000] px-7 py-4 font-bold text-white shadow-lg shadow-[#ff0000]/20 transition hover:-translate-y-0.5"
            >
              <Youtube className="h-5 w-5" aria-hidden />
              Watch on YouTube
            </a>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center justify-center gap-3 md:inline-flex rounded-full bg-espresso px-7 py-4 font-bold text-cream transition hover:-translate-y-0.5 hover:bg-bark"
            >
              <Navigation className="h-5 w-5" aria-hidden />
              Get Directions
            </a>
          </Reveal>
        </div>

        <Reveal y={50} className="relative min-h-[280px] md:min-h-[420px] lg:min-h-full">
          <div aria-hidden className="absolute -inset-3 rotate-[1.5deg] rounded-[2.75rem] bg-gradient-to-br from-gold/40 via-tomato/20 to-basil/30" />
          <div className="relative h-[280px] overflow-hidden rounded-[2rem] border-4 border-cream md:h-[420px] md:rounded-[2.5rem] shadow-[0_40px_80px_-30px_rgba(42,28,19,0.6)] lg:h-full">
            <LazyMap src={MAP_EMBED_URL} title={MAP_TITLE} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
