import { ExternalLink, PenLine } from 'lucide-react';
import { GOOGLE_REVIEWS_URL, GOOGLE_WRITE_REVIEW_URL } from '../constants';
import Reveal from './motion/Reveal';

/** Google's multicolour "G" mark, drawn inline so no outside image is loaded. */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

/**
 * Call to action that sends guests to the restaurant's Google listing to
 * leave or read reviews. It shows no rating or review text from Google:
 * those live on Google and are only linked to here.
 */
export default function GoogleReviews() {
  return (
    <section aria-labelledby="google-reviews-title" className="relative bg-espresso px-4 pb-24 text-cream md:px-8 md:pb-32">
      <Reveal className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-cream/10 bg-gradient-to-br from-[#2b1d15] to-[#1d130d] p-6 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.8)] sm:p-8 md:p-10">
          <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(66,133,244,0.18),transparent_65%)]" />
          <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:gap-8 md:text-left">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white shadow-lg shadow-black/30 md:h-20 md:w-20">
              <GoogleG className="h-9 w-9 md:h-11 md:w-11" />
            </span>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Review us on Google</p>
              <h3 id="google-reviews-title" className="mt-2 font-display text-2xl font-semibold leading-tight md:text-3xl">
                Loved your pizza? Tell others on Google
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/65 md:text-base">
                Your feedback takes a minute and helps more people find Pahadi Pizza in Kaladhungi.
              </p>
            </div>
          </div>
          <div className="relative mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start md:pl-28">
            <a
              href={GOOGLE_WRITE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1f1f1f] shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-[#f1f3f4]"
            >
              <PenLine className="h-4 w-4 text-[#1a73e8]" aria-hidden />
              Write a Google review
            </a>
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-cream/25 px-6 py-3 text-sm font-bold text-cream transition hover:-translate-y-0.5 hover:border-gold hover:text-gold-light"
            >
              See all Google reviews
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
