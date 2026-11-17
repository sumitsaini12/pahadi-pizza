const WORDS = [
  'Hand-stretched',
  'Wood-style baked',
  'Fresh from the hills',
  'Pizza',
  'Momo',
  'Pasta',
  'Burgers',
  'Shakes & Lassi',
  'Kaladhungi, Uttarakhand',
];

/** A slow, endless ribbon of what we make, between the hero and the story. */
export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="relative -mt-px overflow-hidden bg-cream py-6" aria-hidden>
      <div className="-rotate-1 bg-tomato py-4 shadow-[0_20px_40px_-25px_rgba(165,42,21,0.9)]">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {row.map((w, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-2xl italic text-cream md:text-3xl">
              {w}
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold-light" fill="currentColor">
                <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2L12 16.6 5.7 21l2.3-7.2-6-4.6h7.6z" />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
