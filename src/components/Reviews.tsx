import { Star } from 'lucide-react';
import { REVIEWS } from '../data';
import { Review } from '../types';
import Reveal from './motion/Reveal';

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="w-[300px] shrink-0 rounded-[1.75rem] border border-cream/10 bg-[#251912] p-7 transition duration-500 hover:-translate-y-1 hover:border-gold/30 hover:bg-cream/[0.09] md:w-[360px]">
      <div className="mb-5 flex gap-1" role="img" aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} aria-hidden className={`h-4 w-4 ${i < review.rating ? 'fill-gold text-gold' : 'text-cream/20'}`} />
        ))}
      </div>
      <blockquote className="font-display text-lg italic leading-relaxed text-cream/90">&ldquo;{review.comment}&rdquo;</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-cream/10 pt-5">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-tomato to-gold font-bold text-white" aria-hidden>
          {review.author.charAt(0)}
        </span>
        <span>
          <span className="block font-bold text-cream">{review.author}</span>
          <span className="block text-xs text-cream/60">{review.date}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  const half = Math.ceil(REVIEWS.length / 2);
  const rows = [REVIEWS.slice(0, half), REVIEWS.slice(half)];

  return (
    <section id="reviews" className="grain relative overflow-hidden bg-espresso py-24 text-cream md:py-32">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,54,31,0.16),transparent_60%)]" />
      <Reveal className="relative z-[2] mx-auto mb-14 max-w-2xl px-4 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-gold">Testimonials</p>
        <h2 className="font-display text-4xl font-semibold leading-[1.05] md:text-6xl">
          What Our <span className="italic text-gold-light">Patrons</span> Say
        </h2>
      </Reveal>

      <div className="relative z-[2] space-y-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="group overflow-hidden motion-reduce:overflow-x-auto">
            <div
              className="flex w-max gap-6 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
              style={{ animationDuration: r === 0 ? '70s' : '80s', animationDirection: r === 0 ? 'normal' : 'reverse' }}
            >
              {[...row, ...row].map((review, i) => (
                <div key={`${review.id}-${i}`} aria-hidden={i >= row.length} className="flex">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
