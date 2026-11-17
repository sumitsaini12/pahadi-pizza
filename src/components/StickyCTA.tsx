import { Phone, MessageCircle, Navigation, Pizza } from 'lucide-react';
import { PHONE_PRIMARY } from '../constants';
import { TEL_PRIMARY, WHATSAPP_URL } from '../content';
import { DIRECTIONS_URL } from '../lib/links';

const base =
  'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[13px] font-bold leading-none transition active:scale-95';

/**
 * Phones: the four main actions, one tap from anywhere, in thumb reach.
 * Clears the home indicator via the safe-area inset; the footer reserves
 * the same space at its bottom so no content sits under the bar.
 */
export default function StickyCTA() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-cream/10 bg-espresso/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] pt-2 shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md md:hidden"
    >
      <div className="mx-auto flex max-w-md gap-1.5">
        <a href={TEL_PRIMARY} aria-label={`Call ${PHONE_PRIMARY}`} className={`${base} bg-tomato text-white active:bg-tomato-dark`}>
          <Phone className="h-5 w-5" aria-hidden />
          <span className="mt-1">Call</span>
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} bg-whatsapp text-white active:brightness-90`}
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          <span className="mt-1">WhatsApp</span>
        </a>
        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} text-cream active:bg-cream/10`}
        >
          <Navigation className="h-5 w-5 text-gold" aria-hidden />
          <span className="mt-1">Directions</span>
        </a>
        <a href="#menu" className={`${base} text-cream active:bg-cream/10`}>
          <Pizza className="h-5 w-5 text-gold" aria-hidden />
          <span className="mt-1">Menu</span>
        </a>
      </div>
    </nav>
  );
}
