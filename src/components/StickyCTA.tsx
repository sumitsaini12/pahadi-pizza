'use client';

import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { TEL_PRIMARY, WHATSAPP_URL } from '../content';

/** Thumb-reach Call / WhatsApp bar for phones. */
export default function StickyCTA() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-cream/10 bg-espresso/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden"
    >
      <div className="mx-auto flex max-w-md gap-3">
        <a
          href={TEL_PRIMARY}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-tomato py-3.5 font-bold text-white shadow-lg shadow-tomato/30"
        >
          <Phone className="h-5 w-5" aria-hidden />
          Call
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-whatsapp py-3.5 font-bold text-white shadow-lg shadow-black/30"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          Order
        </a>
      </div>
    </motion.div>
  );
}
